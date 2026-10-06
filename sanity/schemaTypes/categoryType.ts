import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => [
        rule.required().error("Category title is required"),
      ],
    }),
    defineField({
      name: "slug",
      type: "slug",
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
        "Category image. Used as the full-bleed tile background on the landing grid, so use a landscape image, at least 2000px wide.",
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
          const doc = context.document as { showOnLanding?: boolean } | undefined;
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
      description:
        "Turn on to display this category as a tile in the landing page grid.",
      initialValue: false,
    }),
    defineField({
      name: "href",
      title: "Tile link",
      type: "string",
      description:
        'Where the tile goes when clicked, e.g. "/pieces" or "/communion".',
      hidden: ({ document }) => !document?.showOnLanding,
      validation: (rule) =>
        rule.custom((value, context) => {
          const doc = context.document as { showOnLanding?: boolean } | undefined;
          if (!doc?.showOnLanding) return true;
          if (!value) return "A link is required when shown on the landing grid";
          if (!value.startsWith("/") && !/^https?:\/\//.test(value)) {
            return 'Link must start with "/" or "https://"';
          }
          return true;
        }),
    }),
    defineField({
      name: "order",
      title: "Grid order",
      type: "number",
      description: "Lower numbers appear first in the grid.",
      hidden: ({ document }) => !document?.showOnLanding,
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