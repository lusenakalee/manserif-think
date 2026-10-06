import { defineField, defineType } from "sanity";

export const landingHeroType = defineType({
  name: "landingHero",
  title: "Landing Hero",
  type: "document",
  groups: [
    { name: "image", title: "Background Image", default: true },
    { name: "text", title: "Headline" },
    { name: "contact", title: "Contact" },
  ],
  fields: [
    defineField({
      name: "heroImages",
      title: "Hero Background Images",
      type: "array",
      group: "image",
      description:
        "Full-screen background images that fade in and out. Landscape, at least 2400px wide. They play after the default local image (/images/communion.jpg). Drag to reorder.",
      options: { layout: "grid" },
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "headlinePrefix",
      title: "Headline (before highlight)",
      type: "string",
      group: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headlineHighlight",
      title: "Headline highlighted word",
      type: "string",
      group: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headlineSuffix",
      title: "Headline (after highlight)",
      type: "string",
      group: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contactLabel",
      title: "Contact label",
      type: "string",
      group: "contact",
      initialValue: "Say Hello",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
      group: "contact",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
      group: "contact",
    }),
  ],
  preview: {
    select: { media: "heroImages.0" },
    prepare: ({ media }) => ({ title: "Landing Hero", media }),
  },
});