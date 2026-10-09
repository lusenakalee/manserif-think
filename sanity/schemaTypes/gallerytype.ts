import { ImagesIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const galleryType = defineType({
  name: "galleryScroll",
  title: "Gallery Scroll",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "headingLine1",
      title: "Heading line 1",
      type: "string",
      initialValue: "Parallax",
    }),
    defineField({
      name: "headingLine2",
      title: "Heading line 2",
      type: "string",
      initialValue: "Scroll",
    }),
    defineField({
      name: "subtext",
      title: "Animated subtext",
      type: "string",
      description: "Each letter floats up at a different speed as you scroll.",
      initialValue: "Manserif.Think",
    }),
    defineField({
      name: "pieces",
      title: "Art pieces",
      type: "array",
      description:
        "Pick as many pieces as you like. They are scattered in a random-looking layout that scrolls with a parallax effect. The first image of each piece is used.",
      of: [
        {
          type: "reference",
          to: [{ type: "art" }],
          options: { disableNew: true },
        },
      ],
      validation: (rule) => [
        rule.required().min(1).error("Select at least 1 art piece"),
        rule.unique().error("Each piece can only be added once"),
      ],
    }),
    defineField({
      name: "layoutSeed",
      title: "Layout seed",
      type: "number",
      description:
        "Don't like the arrangement? Change this number to shuffle the layout. The same number always gives the same layout.",
      initialValue: 1,
      validation: (rule) => rule.integer().min(1).max(9999),
    }),
  ],
  preview: {
    select: {
      title: "headingLine1",
      subtitle: "headingLine2",
      media: "pieces.0.images.0",
    },
    prepare: ({ title, subtitle, media }) => ({
      title: "Gallery Scroll",
      subtitle: [title, subtitle].filter(Boolean).join(" "),
      media,
    }),
  },
});