export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  alt: string;
  heroImage: string;
  location?: string;
  note?: string;
}

export const projects: Project[] = [
  {
    slug: 'charcoal-on-paper',
    title: 'Charcoal on Paper',
    subtitle: 'Couture by Galliano Inspiration',
    heroImage: '/images/charcoal.webp',
    alt: 'Charcoal portrait inspired by Maison Margiela SS24 Couture',
    location: 'Editorial Study',
    description: `For a school assignment, we were tasked to illustrate an editorial image of our choice. I chose the @maisonmargiela SS24 Couture by Galliano, for its obvious visual intensity.\n\nThis is my 2nd complete Portrait using Charcoal, and I loved the outcome. 10+ hours of layering, it turns out I love the medium. The other 2 complete looks are in watercolour and graphite.\n\nI enjoyed making this and wanted to share it with everyone. I have more portraits I've created that I'll be sharing here. 👨🏾‍🎨\n\nLet me know, Would you love to see more process images or complete sketches mostly?`,
    images: [
      '/images/charcoal2.webp',
      '/images/charcoal3.webp',
      '/images/charcoal4.webp',
      '/images/charcoal5.webp',
      '/images/charcoal6.webp',
      '/images/charcoal7.webp',
      '/images/charcoal8.webp',
      '/images/charcoal9.webp',
      '/images/charcoal10.webp',
      '/images/charcoal11.webp',
    ],
  },
  {
    slug: 'he-is-not-here',
    title: 'He Is Not Here',
    subtitle: 'THE PEOPLES GENERAL',
    heroImage: '/images/general1.webp',
    alt: 'He Is Not Here — The Peoples General',
    location: 'Mixed Media',
    description: `What would it look like if Christ were to be crucified today? This art piece is an attempt to represent that moment. We have the Sunday newspaper that is still reminiscent of Christ, "THE PEOPLE'S GENERAL" on the front cover, as would any noble figure be remembered, few hopeful of His resurrection. But there is a cutout, with the last pages of Death and Announcement having been torn out.\n\nThis is what The Church's response would have been at the news of His resurrection — all that spoke of His finality is ripped out, as He is no longer to be found amongst the dead, but is risen.`,
    images: [
      '/images/general1.webp',
      '/images/general2.webp',
      '/images/general3.webp',
      '/images/general4.webp',
      '/images/general5.webp',
    ],
  },
  {
    slug: 'forgive',
    title: 'Father Forgive Them',
    subtitle: 'Crucifixion of The Lamb',
    heroImage: '/images/forgive1.webp',
    alt: 'Father Forgive Them — Crucifixion of The Lamb',
    location: 'Limited Edition Print — A4',
    note: 'ONLY 10 PIECES OF THIS ARTWORK ARE MADE AND ARE STILL BEING SOLD.',
    description: `This art piece is a representation of the Crucifixion of The Lamb, that is, Christ.\n\nThere He is, humble faced, with 3 Nails piercing through Him, set on an evening sunset as described in The Scriptures. The nails are engraved — KING | OF THE | JEWS — as Pontius Pilate would have it.\n\nFrame in A4.`,
    images: [
      '/images/forgive1.webp',
      '/images/forgive2.webp',
      '/images/forgive3.webp',
      '/images/forgive4.webp',
      '/images/forgive5.webp',
    ],
  },
  {
    slug: 'the-12',
    title: "Weren't There 12 with You?",
    subtitle: 'The Ten Lepers',
    heroImage: '/images/poetic.webp',
    alt: "Weren't There 12 with You — The Ten Lepers",
    location: 'Conceptual Installation',
    description: `This artwork takes its title as a poetic echo of Christ's words about the ten lepers; "Were not ten cleansed? Where are the other nine?" Now, imagined from Caiaphas' mouth: "Weren't there 12 with you? And now you stand alone."\n\nThe piece shows the Shepherd struck, the sheep scattered. Twelve human-shaped cutouts represent the disciples. One bears a red "X", Judas — the betrayer. In the bottom left, a half-hidden figure watches from afar, Peter, who followed but did not stand. And in the top right, a mirror behind a cutout reveals the final figure: You.\n\nThis piece reflects the human heart's frailty, our inability to stand by Christ in our own strength.\n\n"Prone to wander, Lord, I feel it, prone to leave the God I love, Here's my heart Lord, take and seal it, seal it for the courts above." says one famous hymn.\n\nThis is the summary — that it is not our grip on Him, but His unwavering grip on us.`,
    images: [
      '/images/poetic2.webp',
      '/images/poetic3.webp',
      '/images/poetic4.webp',
      '/images/poetic5.webp',
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}