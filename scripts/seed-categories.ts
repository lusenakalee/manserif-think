/**
 * Reset + seed Sanity "category" documents from the old hard-coded CategoryGrid.
 *
 * What it does
 *  1. Deletes existing category documents (published + drafts), EXCEPT any that
 *     other documents still reference (e.g. art/product -> category). Sanity
 *     won't allow deleting those, so they are skipped and listed for you.
 *  2. Uploads each tile's image to Sanity and creates 4 category documents
 *     with showOnLanding = true, a link and a grid order.
 *
 * Usage (from your project root)
 *  Back up first:  npx sanity dataset export production ./backup.tar.gz
 *  Dry run:        npx sanity exec scripts/seed-categories.ts --with-user-token
 *  Apply:          npx sanity exec scripts/seed-categories.ts --with-user-token -- --commit
 *
 * Re-running is safe: seeded documents have fixed IDs and are replaced.
 */

import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2024-01-01" }).withConfig({
  useCdn: false,
  perspective: "raw", // include drafts.* documents
});

const COMMIT = process.argv.includes("--commit");

// Copied from the old CATEGORIES constant in components/landing/CategoryGrid.tsx
const SEED = [
  {
    id: "art-exhibition",
    title: "ART EXHIBITION",
    href: "/art-exhibition",
    image:
      "https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=2000&q=85",
    alt: "Spatial light installation and immersive art exhibition in a gallery",
  },
  {
    id: "communion",
    title: "COMMUNION",
    href: "/communion",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=85",
    alt: "Monumental architectural timber and curved communal structure",
  },
  {
    id: "art-works",
    title: "ART WORKS",
    href: "/pieces",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2000&q=85",
    alt: "Luminous sculptural form exploring light, glass, and materiality",
  },
  {
    id: "portfolio",
    title: "PORTFOLIO", // typo "PORTOLIO" fixed
    href: "/portfolio",
    image:
      "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=2000&q=85",
    alt: "Large-scale outdoor architectural pavilion under open sky",
  },
];

const baseId = (id: string) => id.replace(/^drafts\./, "");

async function main() {
  console.log(
    COMMIT ? "MODE: commit" : "MODE: dry run (no changes will be written)"
  );

  // ── 1. Delete existing categories (unless still referenced) ─────────────────
  const existing: { _id: string; title?: string; refCount: number }[] =
    await client.fetch(
      `*[_type == "category"]{ _id, title, "refCount": count(*[references(^._id)]) }`
    );

  // A category is "in use" if the published OR draft version is referenced.
  const inUse = new Set(
    existing.filter((c) => c.refCount > 0).map((c) => baseId(c._id))
  );

  const toDelete = existing.filter((c) => !inUse.has(baseId(c._id)));
  const skipped = existing.filter((c) => inUse.has(baseId(c._id)));

  console.log(`\nFound ${existing.length} existing category document(s).`);

  if (skipped.length) {
    console.warn(
      `⚠️  Skipping ${skipped.length} document(s) still referenced by other documents:`
    );
    skipped.forEach((c) =>
      console.warn(`   - ${c._id}  "${c.title ?? ""}"`)
    );
    console.warn(
      "   They stay in the dataset but won't show in the landing grid (showOnLanding is not set).\n"
    );
  }

  toDelete.forEach((c) => console.log(`  delete ${c._id}  "${c.title ?? ""}"`));

  if (COMMIT && toDelete.length) {
    const tx = client.transaction();
    toDelete.forEach((c) => tx.delete(c._id));
    await tx.commit();
    console.log(`✔ Deleted ${toDelete.length} document(s).`);
  }

  // ── 2. Seed the grid categories ─────────────────────────────────────────────
  console.log(`\nSeeding ${SEED.length} categories…`);

  for (const [index, item] of SEED.entries()) {
    const docId = `category-${item.id}`;
    console.log(`  create ${docId}  → ${item.href}`);

    if (!COMMIT) continue;

    const res = await fetch(item.image);
    if (!res.ok) {
      throw new Error(`Could not download ${item.image} (${res.status})`);
    }
    const buffer = Buffer.from(await res.arrayBuffer());

    const asset = await client.assets.upload("image", buffer, {
      filename: `${item.id}.jpg`,
    });

    await client.createOrReplace({
      _id: docId,
      _type: "category",
      title: item.title,
      slug: { _type: "slug", current: item.id },
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: item.alt,
      },
      showOnLanding: true,
      href: item.href,
      order: index + 1,
    });
  }

  if (COMMIT) console.log("\n✔ Seeding complete.");
  else console.log("\nDry run complete. Add `-- --commit` to apply.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});