import { defineField, defineType } from "sanity";

export const landingHeroType = defineType({
  name: "landingHero",
  title: "Landing Hero",
  type: "document",
  groups: [
    { name: "images", title: "Intro Images", default: true },
    { name: "text", title: "Headline" },
    { name: "contact", title: "Contact" },
  ],
  fields: [
    defineField({
      name: "introImages",
      title: "Intro Images",
      type: "array",
      group: "images",
      description:
        "Exactly 5. Order matters: 1-2 exit left, 4-5 exit right, the 3rd (middle) expands to fill the hero.",
      of: [
        defineField({
          name: "introImage",
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required().length(5),
    }),
    defineField({
      name: "headlinePrefix",
      title: "Headline (before highlight)",
      type: "string",
      group: "text",
      description: 'e.g. "Multidisciplinary"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headlineHighlight",
      title: "Headline highlighted word",
      type: "string",
      group: "text",
      description: 'Rendered white-on-black, e.g. "artist"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headlineSuffix",
      title: "Headline (after highlight)",
      type: "string",
      group: "text",
      description: 'e.g. "sharing evolving work, products, and journey."',
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
  preview: { prepare: () => ({ title: "Landing Hero" }) },
});