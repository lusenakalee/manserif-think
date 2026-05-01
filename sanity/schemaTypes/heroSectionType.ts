import { PackageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const heroSectionType = defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "document",
  icon: PackageIcon,
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "media", title: "Media" },
    { name: "preloader", title: "Preloader" },
  ],
  fields: [
    // ─── Details ─────────────────────────────────────────────────────────────

    defineField({
      name: "name",
      title: "Site Name",
      type: "string",
      group: "details",
      description: 'Displayed as the bold headline (e.g. "ManSerif.Think")',
      validation: (rule) => rule.required().error("Site name is required"),
    }),

    defineField({
      name: "slug",
      type: "slug",
      group: "details",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) =>
        rule.required().error("Slug is required for URL generation"),
    }),

    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "details",
      description:
        'Small all-caps label above the headline (e.g. "Art | Garments | Photographs | Sculptures")',
      validation: (rule) => rule.required().error("Tagline is required"),
    }),

    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      group: "details",
      description:
        'Coloured second line of the headline (e.g. "Design with Intent.")',
      validation: (rule) => rule.required().error("Subtitle is required"),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      group: "details",
      rows: 3,
      description:
        'Short body copy shown beneath the headline (e.g. "Multidisciplinary artist sharing evolving work…")',
      validation: (rule) => rule.required().error("Description is required"),
    }),

    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      group: "details",
      description:
        'Email address displayed at the bottom-left of the hero (e.g. "warrenkamau.art@outlook.com")',
      validation: (rule) =>
        rule
          .required()
          .email()
          .error("A valid contact email is required"),
    }),

    // ─── Media ───────────────────────────────────────────────────────────────

    defineField({
      name: "figureSvg",
      title: "Figure SVG",
      type: "image",
      group: "media",
      description:
        "Bottom-right decorative figure (upload the SVG as an image asset)",
      options: { hotspot: false },
    }),

    // ─── Preloader ───────────────────────────────────────────────────────────

    defineField({
      name: "preloaderImages",
      title: "Preloader Images",
      type: "array",
      group: "preloader",
      description:
        "Images cycled through during the page preloader animation. Add at least 3; 12 recommended.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              description: "Leave blank — preloader images are decorative only",
            }),
          ],
        },
      ],
      validation: (rule) =>
        rule.min(3).error("At least 3 preloader images are required"),
    }),
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "tagline",
      media: "preloaderImages.0",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ?? "",
        media,
      };
    },
  },
});