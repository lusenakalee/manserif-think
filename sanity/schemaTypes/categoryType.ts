import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

type LandingDoc = { showOnLanding?: boolean } | undefined;

/**
 * The document types that can be assigned to a category.
 * Add or remove entries here if you introduce new schema types later.
 */
export const CATEGORY_CONTENT_TYPES = [
  { title: "Art Works",        value: "art"       },
  { title: "Exhibits",         value: "exhibit"   },
  { title: "Projects",         value: "project"   },
] as const;

export type CategoryContentType = (typeof CATEGORY_CONTENT_TYPES)[number]["value"];

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "Shown as the tile heading on the landing grid.",
      validation: (rule) => [
        rule.required().error("Category title is required"),
      ],
    }),
    defineField({
      name: "slug",
      type: "slug",
      description:
        "Used for the category page URL. Clicking the tile opens this category's page.",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => [
        rule.required().error("Slug is required for URL generation"),
      ],
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Short description of this category, shown on the category page.",
    }),

    // ── Content Types ─────────────────────────────────────────────────────────
    defineField({
      name: "contentTypes",
      title: "Content Types",
      type: "array",
      description:
        "Choose which document types belong to this category. Documents of the selected types that reference this category will appear on the category page.",
      of: [{ type: "string" }],
      options: {
        list: [...CATEGORY_CONTENT_TYPES],
        layout: "grid",
      },
      validation: (rule) =>
        rule.unique().error("Each content type can only be selected once"),
    }),

    defineField({
      name: "image",
      type: "image",
      options: {
        hotspot: true,
      },
      description:
        "Used as the full-bleed tile background on the landing grid. Use a landscape image, at least 2000px wide. Set the hotspot to control the crop.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe the image for accessibility",
        }),
      ],
      validation: (rule) =>
        rule.custom((value, context) => {
          const doc = context.document as LandingDoc;
          if (doc?.showOnLanding && !value?.asset) {
            return "An image is required when shown on the landing grid";
          }
          return true;
        }),
    }),

    // ── Landing grid ──────────────────────────────────────────────────────────
    defineField({
      name: "showOnLanding",
      title: "Show on landing grid",
      type: "boolean",
      description: "Turn on to display this category as a tile on the landing page.",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Grid order",
      type: "number",
      description: "Lower numbers appear first. Tiles without a number go last.",
      hidden: ({ document }) => !document?.showOnLanding,
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: "customLink",
      title: "Custom link (optional)",
      type: "string",
      description:
        'Leave empty to open this category\'s page. Only fill in to send the tile somewhere else, e.g. "/pieces" or "https://example.com".',
      hidden: ({ document }) => !document?.showOnLanding,
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true;
          if (!value.startsWith("/") && !/^https?:\/\//.test(value)) {
            return 'Link must start with "/" or "https://"';
          }
          return true;
        }),
    }),
  ],
  orderings: [
    {
      title: "Grid order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      showOnLanding: "showOnLanding",
      order: "order",
      contentTypes: "contentTypes",
    },
    prepare: ({ title, media, showOnLanding, order, contentTypes }) => {
      const typeLabels = (contentTypes as string[] | undefined)
        ?.map(
          (v) =>
            CATEGORY_CONTENT_TYPES.find((t) => t.value === v)?.title ?? v
        )
        .join(", ");

      return {
        title,
        subtitle: [
          typeLabels,
          showOnLanding
            ? `Landing grid${order != null ? ` · #${order}` : ""}`
            : null,
        ]
          .filter(Boolean)
          .join(" · "),
        media,
      };
    },
  },
});