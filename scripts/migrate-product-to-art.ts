/**
 * Migrate Sanity documents: _type "product" -> "art"
 *
 * What it does
 *  1. Copies every product (published + drafts) into a new "art" document.
 *     IDs get an "art-" prefix, because an ID can't be reused while the old
 *     document still exists.
 *  2. Updates every exhibit (published + drafts): renames
 *     featuredProducts -> featuredArt and points each reference at the new
 *     art document IDs.
 *  3. (Only with --delete) deletes the old product documents.
 *
 * Usage (from your project root, where sanity.cli.ts lives)
 *  Back up first:   npx sanity dataset export production ./backup.tar.gz
 *  Dry run:         npx sanity exec scripts/migrate-product-to-art.ts --with-user-token
 *  Create + patch:  npx sanity exec scripts/migrate-product-to-art.ts --with-user-token -- --commit
 *  Then delete old: npx sanity exec scripts/migrate-product-to-art.ts --with-user-token -- --commit --delete
 *
 * Run it in the order above. Check Studio after the second step before deleting.
 * The script is safe to re-run: it uses createOrReplace and skips patches that
 * are already applied.
 */

import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2024-01-01" }).withConfig({
  useCdn: false,
  perspective: "raw", // include drafts.* documents
});

const COMMIT = process.argv.includes("--commit");
const DELETE_OLD = process.argv.includes("--delete");

const PREFIX = "art-";

const isDraft = (id: string) => id.startsWith("drafts.");
const baseId = (id: string) => id.replace(/^drafts\./, "");

/** product-123 -> art-product-123, drafts.product-123 -> drafts.art-product-123 */
function newId(oldId: string): string {
  const base = `${PREFIX}${baseId(oldId)}`;
  return isDraft(oldId) ? `drafts.${base}` : base;
}

/** Map an old product ID (published or draft form) to the new published art ID. */
const newRefId = (oldRef: string) => `${PREFIX}${baseId(oldRef)}`;

type AnyDoc = Record<string, any> & { _id: string; _type: string };

async function main() {
  console.log(
    COMMIT
      ? DELETE_OLD
        ? "MODE: commit + delete old products"
        : "MODE: commit (create art + patch exhibits)"
      : "MODE: dry run (no changes will be written)"
  );

  // ── 0. Find other documents that reference products (besides exhibits) ──────
  const otherRefs: { _id: string; _type: string }[] = await client.fetch(
    `*[_type != "product" && _type != "exhibit" && references(*[_type == "product"]._id)]{ _id, _type }`
  );
  if (otherRefs.length) {
    console.warn(
      `\n⚠️  ${otherRefs.length} other document(s) reference products and are NOT migrated by this script:`
    );
    otherRefs.forEach((d) => console.warn(`   - ${d._type} ${d._id}`));
    console.warn("   Update these by hand (or extend this script) before using --delete.\n");
  }

  // ── 1. Create art documents from products ───────────────────────────────────
  const products: AnyDoc[] = await client.fetch(`*[_type == "product"]`);
  console.log(`Found ${products.length} product document(s).`);

  if (products.length) {
    const tx = client.transaction();
    for (const product of products) {
      const { _rev, _updatedAt, ...rest } = product;
      tx.createOrReplace({
        ...rest,
        _id: newId(product._id),
        _type: "art",
      });
      console.log(`  create ${newId(product._id)}  (from ${product._id})`);
    }
    if (COMMIT) {
      await tx.commit();
      console.log("✔ Art documents created.");
    }
  }

  // ── 2. Patch exhibits: featuredProducts -> featuredArt ──────────────────────
  const exhibits: AnyDoc[] = await client.fetch(
    `*[_type == "exhibit" && defined(featuredProducts)]{ _id, featuredProducts }`
  );
  console.log(`\nFound ${exhibits.length} exhibit(s) with featuredProducts.`);

  if (exhibits.length) {
    const tx = client.transaction();
    for (const exhibit of exhibits) {
      const featuredArt = (exhibit.featuredProducts as any[]).map((item) => ({
        ...item,
        _ref: newRefId(item._ref),
      }));
      tx.patch(exhibit._id, (p) =>
        p.set({ featuredArt }).unset(["featuredProducts"])
      );
      console.log(`  patch ${exhibit._id}  (${featuredArt.length} reference(s))`);
    }
    if (COMMIT) {
      await tx.commit();
      console.log("✔ Exhibits updated.");
    }
  }

  // ── 3. Delete old products (opt-in) ─────────────────────────────────────────
  if (DELETE_OLD) {
    if (!COMMIT) {
      console.log("\n--delete is ignored without --commit.");
    } else if (products.length) {
      const tx = client.transaction();
      products.forEach((p) => tx.delete(p._id));
      await tx.commit();
      console.log(`✔ Deleted ${products.length} old product document(s).`);
    }
  } else if (COMMIT) {
    console.log(
      "\nOld product documents were kept. Re-run with --commit --delete once you've checked Studio."
    );
  }

  if (!COMMIT) console.log("\nDry run complete. Add `-- --commit` to apply.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});