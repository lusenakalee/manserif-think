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
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      group: "image",
      description: "Full-screen background image. Landscape, at least 2400px wide.",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
      validation: (Rule) => Rule.required(),
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
    select: { media: "heroImage" },
    prepare: ({ media }) => ({ title: "Landing Hero", media }),
  },
});