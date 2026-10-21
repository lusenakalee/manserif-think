import { Artwork, ExhibitionInfo } from '@/types/exhibition';

export const EXHIBITION_INFO: ExhibitionInfo = {
  title: 'Le Divin à Travers Mes Yeux',
  subtitle: 'La Galerie, Paris · In collaboration with the DIASONAMA Foundation',
  museum: 'La Galerie Paris',
  location: '12 Rue de Turenne, 75004 Paris, France',
  dates: '29 May 2026',
  curator: 'Manserif.Think & DIASONAMA Foundation',
  shortDescription:
    'An exploration into the intersection between faith, contemporary art, and personal interpretation. Featuring conceptual paintings, prints, collages, and sculptures that recontextualize Biblical narratives using both abstract and realistic visual language to bridge ancient truths with modern perspectives.',
  fullCuratorialEssay: {
    paragraphs: [
      '“Le Divin à Travers Mes Yeux” (The Divine Through My Eyes) marks a defining solo presentation in Paris by Manserif.Think (Warren Kamau), organized at La Galerie in close collaboration with the DIASONAMA Foundation. The exhibition serves as an intimate yet monumental gateway into the artist’s multidisciplinary body of work—interlacing conceptual paintings, sculptural timber installations, graphic prints, and short-form cinematic studies dedicated to communicating the Good News of Jesus Christ.',
      'Rather than treating theological narratives as remote historic relics or rigid ecclesiastical icons, Manserif.Think recontextualizes Biblical texts through the tactile vocabulary of contemporary minimalism and mixed media. By merging distressed raw linen, expressive impasto, hand-forged iron bolts, and bold typographic inquiry, the works collapse temporal distance—translating ancient covenants into the urgent present.',
      'A hallmark of the exhibition is its participatory dimension. Visitors are invited to move beyond passive observation and engage with confronting conceptual questions installed alongside each piece: questions examining the reality of Christ’s sacrifice, the weight of judgment and grace, and the authentic meaning of faith in a fragmented contemporary society.',
      'From the raw contemplation bench before the central icon to the suspended double-sided frames and the provocative inquiries of “Which Jesus Do You Want?”, the exhibition creates an expansive arena for reflection, dialogue, and personal encounter with the divine.'
    ],
    quote:
      'Art is not merely an aesthetic gesture; it is an altar of remembrance and an instrument to proclaim the eternal truth of Christ through contemporary eyes.',
    quoteAttribution: 'Manserif.Think (Warren Kamau), Paris Exhibition Notes, 2026',
    themes: [
      {
        title: '01. Scriptural Recontextualization',
        description:
          'Bridging millennia-old Biblical accounts with contemporary graphic precision, optical grid transformations, and raw organic materials.'
      },
      {
        title: '02. Participatory Inquiry',
        description:
          'Direct theological and existential questions confronting the viewer to examine what they truly believe about Christ and the gospel.'
      },
      {
        title: '03. The Sacred & The Raw',
        description:
          'Using unrefined Belgian linen, suspended double-sided framing, and raw charcoal to make the physical weight of sacrifice tangible.'
      }
    ]
  }
};

export const ARTWORKS: Artwork[] = [
  {
    id: 'contemplation-bench',
    figureNumber: 'Fig. 01',
    title: 'CONTEMPLATION BENCH (THE ICON)',
    year: '2026',
    medium: 'Archival pigment print with optical geometric overlay in black wooden frame, gallery installation',
    dimensions: '110 x 85 cm (framed), gallery installation span',
    location: 'North Gallery, La Galerie Paris',
    roomCategory: 'iconography',
    image:
      'https://cdn.sanity.io/images/4npjzbhf/production/c6c430663011a96213d3a2039748357cc782fe95-1080x720.jpg?rect=0,56,1080,608&w=1600&h=900',
    aspect: 'panoramic',
    curatorialDescription:
      'Four visitors seated upon the gallery bench in silent contemplation before the central icon of Christ. The artwork reinterprets traditional Byzantine and Renaissance iconography through optical geometric pixelation, exploring how modern perception filters ancient spiritual authority.',
    dialogueNote:
      '“How do we behold the sacred today?” The intentional distance between the viewer on the bench and the wall becomes an arena of quiet personal reflection and theological examination.',
    colSpan: 'col-span-12 lg:col-span-7',
    offsetClass: 'lg:translate-y-0'
  },
  {
    id: 'artist-dialogues',
    figureNumber: 'Fig. 02',
    title: 'DIALOGUES ON FAITH (ARTIST & VISITORS)',
    year: '2026',
    medium: 'Exhibition activation and curatorial exchange',
    dimensions: 'Live gallery forum, dimensions variable',
    location: 'Main Pavilion, La Galerie Paris',
    roomCategory: 'dialogue',
    image:
      'https://cdn.sanity.io/images/4npjzbhf/production/e702de2670125a4ac12a5af14da4fb13c409dde4-1080x720.jpg?rect=0,56,1080,608&w=1600&h=900',
    aspect: 'landscape',
    curatorialDescription:
      'Artist Manserif.Think (Warren Kamau) actively engaging attendees in candid discussion before the icon work, unpacking questions of Christ’s sacrifice, cultural distortions of faith, and authentic redemption.',
    dialogueNote:
      'The exhibition was curated not as an austere monument, but as a living forum where visitors respond to direct prompt questions regarding Christ’s identity.',
    colSpan: 'col-span-12 md:col-span-6 lg:col-span-5',
    offsetClass: 'lg:translate-y-8'
  },
  {
    id: 'inspection-inquiry',
    figureNumber: 'Fig. 03',
    title: 'INSPECTION & INQUIRY',
    year: '2026',
    medium: 'Archival framed print and curatorial inquiry text',
    dimensions: '110 x 85 cm',
    location: 'East Wing, La Galerie Paris',
    roomCategory: 'iconography',
    image:
      'https://cdn.sanity.io/images/4npjzbhf/production/a44d6f16c9803e5718c50f45a8875e0e9bd23406-1080x720.jpg?rect=0,56,1080,608&w=1600&h=900',
    aspect: 'portrait',
    curatorialDescription:
      'Gallery visitors studying the delicate surface layers and adjacent curatorial prompt card of the Christ icon. The piece challenges observers to look beneath popularized, decorative portrayals to encounter the Biblical Christ.',
    dialogueNote:
      'When the traditional halo and robe are broken down into chromatic grid modules, the viewer is compelled to look past rote familiarity into the reality of the Gospel.',
    colSpan: 'col-span-12 md:col-span-6 lg:col-span-5',
    offsetClass: 'lg:-translate-y-4'
  },
  {
    id: 'suspended-threshold',
    figureNumber: 'Fig. 04',
    title: 'THE SUSPENDED THRESHOLD',
    year: '2026',
    medium: 'Suspended double-sided framed assemblage on wire rigging, gallery installation',
    dimensions: 'Double-sided floating frame, 70 x 95 cm',
    location: 'Central Atrium, La Galerie Paris',
    roomCategory: 'installations',
    image:
      'https://cdn.sanity.io/images/4npjzbhf/production/cab64de6842f3ea1e5e6a252a3ec3e63bc1263a9-1080x720.jpg?rect=0,56,1080,608&w=1600&h=900',
    aspect: 'panoramic',
    curatorialDescription:
      'An assemblage framed work suspended in mid-air from the industrial gallery ceiling, allowing visitors to walk completely around it and observe both face and reverse structural backing.',
    dialogueNote:
      'Challenging two-dimensional viewing: faith is treated as a spatial presence that one must walk around and enter into, rather than an image hanging safely on a distant wall.',
    colSpan: 'col-span-12 lg:col-span-7',
    offsetClass: 'lg:translate-y-4'
  },
  {
    id: 'portrait-with-icon',
    figureNumber: 'Fig. 05',
    title: 'PORTRAIT WITH ICON (WARREN KAMAU)',
    year: '2026',
    medium: 'Artist study in conversation with sacred icon',
    dimensions: 'Exhibition installation view',
    location: 'North Gallery, La Galerie Paris',
    roomCategory: 'dialogue',
    image:
      'https://cdn.sanity.io/images/4npjzbhf/production/d2b92cc13cde8d23d825b7c84435cf252e93d3db-1080x720.jpg?rect=0,56,1080,608&w=1600&h=900',
    aspect: 'square',
    curatorialDescription:
      'Artist Manserif.Think standing in profile beside his signature work Le Divin à Travers Mes Yeux, presenting the convergence of personal testimony and public artistic proclamation.',
    dialogueNote:
      '“Art is an altar of remembrance and an instrument to proclaim the eternal truth of Christ through contemporary eyes.”',
    colSpan: 'col-span-12 md:col-span-6 lg:col-span-6',
    offsetClass: 'lg:-translate-y-6'
  },
  {
    id: 'studies-saint-john',
    figureNumber: 'Fig. 06',
    title: 'STUDIES FOR SAINT JOHN & THE SACRED HEART',
    year: '2026',
    medium: 'Three comparative silkscreen prints on heavy archival cotton rag',
    dimensions: 'Three panels, 45 x 32 cm each',
    location: 'Drawing & Print Cabinet',
    roomCategory: 'studies',
    image:
      'https://cdn.sanity.io/images/4npjzbhf/production/6c3c311af4ae5d71d5a4c8ff55e0b3e1cfd302b8-1080x720.jpg?rect=0,56,1080,608&w=1600&h=900',
    aspect: 'landscape',
    curatorialDescription:
      'Three studies displayed in progressive dialogue: Saint John the Baptist proclaiming “Repent for the Kingdom of Heaven is at Hand”, the devotional figure of Christ, and the optical geometric transformation stripping away sentimentalism.',
    dialogueNote:
      'Demonstrates the developmental trajectory from prophetic warning (John) to divine compassion (Christ) to contemporary optical deconstruction.',
    colSpan: 'col-span-12 md:col-span-6 lg:col-span-6',
    offsetClass: 'lg:translate-y-6'
  },
  {
    id: 'lamb-of-god',
    figureNumber: 'Fig. 07',
    title: 'THE LAMB OF GOD (AGNUS DEI)',
    year: '2026',
    medium: 'Suspended ink and charcoal drawing in double-sided floating exhibition frame',
    dimensions: '60 x 85 cm, suspended installation',
    location: 'Sanctuary Pavilion, La Galerie Paris',
    roomCategory: 'installations',
    image:
      'https://cdn.sanity.io/images/4npjzbhf/production/00c771d79023e82ad5c1c6a33c9b46f5811f271e-1080x720.jpg?rect=0,56,1080,608&w=1600&h=900',
    aspect: 'panoramic',
    curatorialDescription:
      'Manserif.Think gesturing with open hands as he unpacks the suspended charcoal and ink drawing of the solitary Lamb—referencing John 1:29: “Behold, the Lamb of God, who takes away the sin of the world!”',
    dialogueNote:
      'The fragile line of the lamb suspended in open space contrasts with the industrial gallery surroundings, evoking the voluntary meekness and cosmic weight of the ultimate sacrifice.',
    colSpan: 'col-span-12 lg:col-span-8',
    offsetClass: 'lg:-translate-y-4'
  }
];

export const NAV_LINKS = [
  { label: 'Exhibition', href: '#exhibition-header', active: true },
  { label: 'Artworks', href: '#artworks-collage', active: false },
  { label: 'Curatorial Essay', href: '#curatorial-essay', active: false },
  { label: 'Discourse', href: '#museum-dialogue', active: false },
  { label: 'Visitor Info', href: '#visitor-info', active: false }
];
