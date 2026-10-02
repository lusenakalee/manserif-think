import { defineField, defineType } from "sanity";

export const textMaskType = defineType({
  name: "textMask",
  title: "Text Mask Video",
  type: "document",
  fields: [
    defineField({
      name: "video",
      title: "Mask Video",
      type: "file",
      options: { accept: "video/mp4" },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { prepare: () => ({ title: "Text Mask Video" }) },
});