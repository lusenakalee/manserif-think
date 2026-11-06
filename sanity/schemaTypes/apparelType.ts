import { BasketIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { MATERIALS_SANITY_LIST, COLORS_SANITY_LIST } from "@/lib/constants/filters";

// ── Apparel-specific constants ────────────────────────────────────────────────

export const APPAREL_TYPES = [
  { title: "Clothing",     value: "clothing"  },
  { title: "Footwear",     value: "footwear"  },
  { title: "Belt",         value: "belt"      },
  { title: "Headwear",     value: "headwear"  },
  { title: "Bag",          value: "bag"       },
  { title: "Accessory",    value: "accessory" },
] as const;

export const GENDER_OPTIONS = [
  { title: "Unisex",       value: "unisex" },
  { title: "Men",          value: "men"    },
  { title: "Women",        value: "women"  },
  { title: "Youth / Kids", value: "youth"  },
] as const;

/**
 * Clothing / general apparel sizes (XS-4XL).
 * Footwear sizes are a free-text tags field so the studio stays clean
 * for accessories that don't use letter sizing.
 */
export const CLOTHING_SIZES = [
  { title: "XS",       value: "XS"       },
  { title: "S",        value: "S"        },
  { title: "M",        value: "M"        },
  { title: "L",        value: "L"        },
  { title: "XL",       value: "XL"       },
  { title: "2XL",      value: "2XL"      },
  { title: "3XL",      value: "3XL"      },
  { title: "4XL",      value: "4XL"      },
  { title: "One Size", value: "one-size" },
] as const;

// ─────────────────────────────────────────────────────────────────────────────

export const apparelType = defineType({
  name: "apparel",
  title: "Apparel",
  type: "document",
  icon: BasketIcon,
  groups: [
    { name: "details",   title: "Details",         default: true },
    { name: "variants",  title: "Sizes & Colours"               },
    { name: "media",     title: "Media"                         },
    { name: "inventory", title: "Inventory"                     },
  ],
  fields: [
    // ── Identity ──────────────────────────────────────────────────────────────

    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "details",
      description: 'The item name as it appears in the store (e.g. "Kinetic Bomber Jacket").',
      validation: (Rule) => Rule.required().error("Apparel name is required"),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "details",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error("Slug is required for URL generation"),
    }),
    defineField({
      name: "apparelKind",
      title: "Apparel Type",
      type: "string",
      group: "details",
      description: "The broad type of item -- used to surface the right size fields.",
      options: {
        list: [...APPAREL_TYPES],
        layout: "radio",
      },
      validation: (Rule) => Rule.required().error("Apparel type is required"),
    }),
    defineField({
      name: "gender",
      title: "Gender",
      type: "string",
      group: "details",
      options: {
        list: [...GENDER_OPTIONS],
        layout: "radio",
      },
      initialValue: "unisex",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      group: "details",
      rows: 4,
      description: "Product description shown on the detail page.",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      group: "details",
      description: "Price in GBP (e.g. 149.99).",
      validation: (Rule) => [
        Rule.required().error("Price is required"),
        Rule.positive().error("Price must be a positive number"),
      ],
    }),

    // ── Classification ────────────────────────────────────────────────────────

    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      group: "details",
      validation: (Rule) => Rule.required().error("Category is required"),
    }),
    defineField({
      name: "subcategory",
      title: "Subcategory",
      type: "reference",
      to: [{ type: "subcategory" }],
      group: "details",
      description:
        "Optional. Select a category first -- only subcategories belonging to that category will appear.",
      options: {
        filter: ({ document }) => {
          const categoryRef = (
            document as { category?: { _ref?: string } }
          )?.category?._ref;
          if (!categoryRef) return { filter: "false" };
          return {
            filter: "parentCategory._ref == $categoryRef",
            params: { categoryRef },
          };
        },
        disableNew: true,
      },
    }),

    // ── Material & Features ───────────────────────────────────────────────────

    defineField({
      name: "material",
      title: "Primary Material",
      type: "string",
      group: "details",
      description: "Main fabric or material (e.g. Cotton, Leather, Nylon).",
      options: {
        list: MATERIALS_SANITY_LIST,
        layout: "radio",
      },
    }),
    defineField({
      name: "materialDetail",
      title: "Material Detail",
      type: "string",
      group: "details",
      description:
        'Optional extra material info (e.g. "100% organic cotton", "full-grain leather").',
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      group: "details",
      description:
        'Key selling points as tags (e.g. "Water-resistant", "YKK zippers", "Unlined").',
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "careInstructions",
      title: "Care Instructions",
      type: "string",
      group: "details",
      description: 'e.g. "Machine wash cold, tumble dry low".',
    }),

    // ── Sizes & Colours ───────────────────────────────────────────────────────

    defineField({
      name: "availableSizes",
      title: "Available Sizes (Clothing / Accessories)",
      type: "array",
      group: "variants",
      description:
        "Select all sizes this item is offered in. Leave empty for footwear -- use Shoe Sizes instead.",
      of: [{ type: "string" }],
      options: {
        list: [...CLOTHING_SIZES],
        layout: "grid",
      },
      hidden: ({ document }) =>
        (document as { apparelKind?: string })?.apparelKind === "footwear",
    }),
    defineField({
      name: "shoeSizes",
      title: "Available Shoe Sizes",
      type: "array",
      group: "variants",
      description:
        'Enter each size as a tag (e.g. "UK 8", "EU 42"). Only shown for Footwear.',
      of: [{ type: "string" }],
      options: { layout: "tags" },
      hidden: ({ document }) =>
        (document as { apparelKind?: string })?.apparelKind !== "footwear",
    }),
    defineField({
      name: "availableColors",
      title: "Available Colours",
      type: "array",
      group: "variants",
      description: "All colourways this item comes in. Each entry is a named colour swatch.",
      of: [
        {
          type: "object",
          name: "colorOption",
          title: "Colour",
          fields: [
            defineField({
              name: "colorName",
              title: "Colour Name",
              type: "string",
              description: 'e.g. "Obsidian Black", "Rust".',
              validation: (Rule) => Rule.required().error("Colour name is required"),
            }),
            defineField({
              name: "colorValue",
              title: "Standard Colour",
              type: "string",
              description: "Pick the closest standard colour for filtering.",
              options: {
                list: COLORS_SANITY_LIST,
                layout: "radio",
              },
            }),
            defineField({
              name: "hex",
              title: "Hex Code",
              type: "string",
              description: 'Optional -- exact hex for swatch rendering (e.g. "#1A1A1A").',
              validation: (Rule) =>
                Rule.custom((val: string | undefined) => {
                  if (!val) return true;
                  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val)) return true;
                  return 'Must be a valid hex code (e.g. "#1A1A1A")';
                }),
            }),
            defineField({
              name: "images",
              title: "Images for this colour",
              type: "array",
              description:
                "Images specific to this colourway. Leave empty to fall back to the main product images.",
              of: [
                {
                  type: "image",
                  options: { hotspot: true },
                  fields: [
                    defineField({
                      name: "alt",
                      title: "Alt text",
                      type: "string",
                    }),
                  ],
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: "colorName",
              subtitle: "colorValue",
              media: "images.0",
            },
          },
        },
      ],
    }),

    // ── Media ─────────────────────────────────────────────────────────────────

    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      group: "media",
      description:
        "Main product images. The first image is used as the thumbnail in listings.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).error("At least one image is required"),
    }),

    // ── Inventory ─────────────────────────────────────────────────────────────

    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      group: "inventory",
      initialValue: 0,
      description: "Total units in stock across all sizes and colours.",
      validation: (Rule) => [
        Rule.min(0).error("Stock cannot be negative"),
        Rule.integer().error("Stock must be a whole number"),
      ],
    }),
    defineField({
      name: "sku",
      title: "SKU",
      type: "string",
      group: "inventory",
      description: "Optional internal stock-keeping unit identifier.",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "inventory",
      initialValue: false,
      description: "Show on the homepage and in promotional sections.",
    }),
    defineField({
      name: "limitedEdition",
      title: "Limited Edition",
      type: "boolean",
      group: "inventory",
      initialValue: false,
      description: "Flag this item as a limited-edition release.",
    }),
  ],

  // ── Ordering ───────────────────────────────────────────────────────────────

  orderings: [
    {
      title: "Name A-Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
    {
      title: "Price: Low to High",
      name: "priceAsc",
      by: [{ field: "price", direction: "asc" }],
    },
    {
      title: "Price: High to Low",
      name: "priceDesc",
      by: [{ field: "price", direction: "desc" }],
    },
  ],

  // ── Preview ────────────────────────────────────────────────────────────────

  preview: {
    select: {
      title: "name",
      subtitle: "category.title",
      apparelKind: "apparelKind",
      media: "images.0",
      price: "price",
    },
    prepare({ title, subtitle, apparelKind, media, price }) {
      const typeLabel = apparelKind
        ? APPAREL_TYPES.find((t) => t.value === apparelKind)?.title ?? apparelKind
        : null;
      return {
        title,
        subtitle: [subtitle, typeLabel, `\u00a3${price ?? 0}`]
          .filter(Boolean)
          .join(" \u2022 "),
        media,
      };
    },
  },
});