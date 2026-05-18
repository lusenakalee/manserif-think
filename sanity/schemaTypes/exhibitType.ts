import { defineField, defineType } from 'sanity';

export const exhibitType = defineType({
  name: 'exhibit',
  title: 'Exhibit',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'exhibitDescription',
      title: 'Exhibit Description',
      type: 'text',
      rows: 6,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'artistDescription',
      title: 'Artist Description',
      type: 'text',
      rows: 6,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Exhibit Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
          ],
        },
      ],
    }),

    // ── Dates & Times ──────────────────────────────────────────────────────────
    defineField({
      name: 'startDateTime',
      title: 'Start Date & Time',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDateTime',
      title: 'End Date & Time',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15,
      },
      validation: (Rule) =>
        Rule.required().min(Rule.valueOfField('startDateTime')).error(
          'End date must be after the start date'
        ),
    }),

    // ── Location ───────────────────────────────────────────────────────────────
    defineField({
      name: 'exhibitLocation',
      title: 'Exhibit Location',
      type: 'object',
      fields: [
        defineField({
          name: 'venueName',
          title: 'Venue Name',
          type: 'string',
          description: 'e.g. "The Nairobi Gallery"',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'address',
          title: 'Street Address',
          type: 'string',
        }),
        defineField({
          name: 'city',
          title: 'City',
          type: 'string',
        }),
        defineField({
          name: 'country',
          title: 'Country',
          type: 'string',
        }),
        defineField({
          name: 'mapsUrl',
          title: 'Google Maps URL',
          type: 'url',
          description: 'Optional link to the venue on Google Maps.',
        }),
      ],
    }),

    // ── Featured Products ──────────────────────────────────────────────────────
    defineField({
      name: 'featuredProducts',
      title: 'Featured Products',
      type: 'array',
      description: 'Select the products that will be showcased in this exhibit.',
      of: [
        {
          type: 'reference',
          to: [{ type: 'product' }],
        },
      ],
      validation: (Rule) => Rule.unique().error('Each product can only be added once'),
    }),

    // ── Partners ───────────────────────────────────────────────────────────────
    defineField({
      name: 'partners',
      title: 'Exhibit Partners',
      type: 'array',
      description: 'Add partners one by one. They will appear in the exhibit listing.',
      of: [
        {
          type: 'object',
          name: 'partner',
          title: 'Partner',
          fields: [
            defineField({
              name: 'name',
              title: 'Partner Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'role',
              title: 'Role / Description',
              type: 'string',
              description: 'e.g. "Presenting Sponsor", "Media Partner"',
            }),
            defineField({
              name: 'logo',
              title: 'Partner Logo',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                }),
              ],
            }),
            defineField({
              name: 'website',
              title: 'Website URL',
              type: 'url',
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'role',
              media: 'logo',
            },
          },
        },
      ],
    }),

    // ── Meta ───────────────────────────────────────────────────────────────────
   
   
    defineField({
      name: 'isFeatured',
      title: 'Featured Exhibit',
      type: 'boolean',
      description: 'Pin this exhibit to the featured slot on the homepage.',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first. Used to control listing order.',
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Start Date (Newest First)',
      name: 'startDateDesc',
      by: [{ field: 'startDateTime', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'heroImage',
    },
  },
});