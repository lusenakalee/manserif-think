import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

type LandingDoc = { showOnLanding?: boolean } | undefined;

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
    },
    prepare: ({ title, media, showOnLanding, order }) => ({
      title,
      subtitle: showOnLanding
        ? `On landing grid${order != null ? ` · #${order}` : ""}`
        : "",
      media,
    }),
  },
});