import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const subcategoryType = defineType({
  name: "subcategory",
  title: "Subcategory",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "Name of this subcategory, e.g. School Art.",
      validation: (rule) => rule.required().error("Subcategory title is required"),
    }),
    defineField({
      name: "slug",
      type: "slug",
      description: "Used for filtering and URL generation.",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required().error("Slug is required"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description: "Optional short description of this subcategory.",
    }),

    // ── Parent ────────────────────────────────────────────────────────────────
    defineField({
      name: "parentCategory",
      title: "Parent Category",
      type: "reference",
      to: [{ type: "category" }],
      description:
        "The category this subcategory belongs to. Only documents whose category matches this parent can be assigned here.",
      validation: (rule) => rule.required().error("A parent category is required"),
    }),

    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first within the parent category.",
      validation: (rule) => rule.integer().min(0),
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Title A–Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      parent: "parentCategory.title",
      order: "order",
    },
    prepare({ title, parent, order }) {
      return {
        title,
        subtitle: [
          parent ? `↳ ${parent}` : null,
          order != null ? `#${order}` : null,
        ]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
});
