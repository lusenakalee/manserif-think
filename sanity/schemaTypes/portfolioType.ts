import { defineField, defineType } from "sanity";

export const portfolioType = defineType({
  name: "portfolio",
  title: "Portfolio Page",
  type: "document",
  groups: [
    { name: "header", title: "Header", default: true },
    { name: "about", title: "About" },
  ],
  fields: [
    defineField({
      name: "headerImage",
      title: "Header Background Image",
      type: "image",
      group: "header",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headerFirstText",
      title: "Header Text (first)",
      type: "string",
      group: "header",
      description: 'Scrolling marquee text, e.g. "Warren Kamau -"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headerSecondText",
      title: "Header Text (second)",
      type: "string",
      group: "header",
      description: 'Scrolling marquee text, e.g. "Manserif.Think -"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "aboutHeading",
      title: "About Heading",
      type: "string",
      group: "about",
      initialValue: "About",
    }),
    defineField({
      name: "aboutParagraphs",
      title: "About Paragraphs",
      type: "array",
      group: "about",
      of: [{ type: "text", rows: 4 }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Portfolio Page" }),
  },
});