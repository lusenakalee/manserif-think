// ─── Subcategory ──────────────────────────────────────────────────────────────

export interface CategorySubcategory {
  _id: string;
  title: string;
  slug: string;
  description?: string | null;
}

// ─── Detail payloads per content type ────────────────────────────────────────

export interface ArtDetail {
  _type: 'art';
  description?: string | null;
  price?: number | null;
  material?: string | null;
  dimensions?: string | null;
  stock?: number | null;
}

export interface ExhibitDetail {
  _type: 'exhibit';
  subtitle?: string | null;
  exhibitDescription?: string | null;
  startDateTime?: string | null;
  endDateTime?: string | null;
  venueName?: string | null;
  venueCity?: string | null;
  venueCountry?: string | null;
  venueMapsUrl?: string | null;
}

export interface ProjectDetail {
  _type: 'project';
  subtitle?: string | null;
  description?: string | null;
  location?: string | null;
  note?: string | null;
}

export type ItemDetail = ArtDetail | ExhibitDetail | ProjectDetail;

// ─── Normalized collage item (AbstractArtCollage + ArtworkLightbox) ───────────

export interface CollageItem {
  id: string;
  _type: 'art' | 'exhibit' | 'project';
  slug: string;
  title: string;
  image: string;
  lqip?: string | null;
  hotspot?: { x?: number | null; y?: number | null } | null;
  aspect: 'landscape' | 'portrait' | 'square' | 'panoramic';
  colSpan: string;
  offsetClass: string;
  subcategorySlug?: string | null;
  detail: ItemDetail;
}

// ─── Raw Sanity shapes (before normalization) ─────────────────────────────────

export interface SanityHeroImage {
  url: string | null;
  lqip?: string | null;
  alt?: string | null;
  hotspot?: { x?: number | null; y?: number | null } | null;
}

export interface SanityArtItem {
  _type: 'art';
  _id: string;
  title: string | null;        // mapped from name in GROQ
  slug: string | null;
  heroImage: SanityHeroImage | null;
  subcategorySlug?: string | null;
  stock?: number | null;
  featured?: boolean | null;
  description?: string | null;
  material?: string | null;
  dimensions?: string | null;
  price?: number | null;
}

export interface SanityExhibitItem {
  _type: 'exhibit';
  _id: string;
  title: string | null;
  slug: string | null;
  heroImage: SanityHeroImage | null;
  subtitle?: string | null;
  subcategorySlug?: string | null;
  startDateTime?: string | null;
  endDateTime?: string | null;
  exhibitDescription?: string | null;
  venueName?: string | null;
  venueCity?: string | null;
  venueCountry?: string | null;
  venueMapsUrl?: string | null;
}

export interface SanityProjectItem {
  _type: 'project';
  _id: string;
  title: string | null;
  slug: string | null;
  heroImage: SanityHeroImage | null;
  subtitle?: string | null;
  subcategorySlug?: string | null;
  description?: string | null;
  location?: string | null;
  note?: string | null;
}

// ─── Full GROQ payload ────────────────────────────────────────────────────────

export interface CategoryPagePayload {
  _id: string;
  title: string;
  slug: string;
  description?: string | null;
  contentTypes: string[];
  image: {
    url?: string | null;
    lqip?: string | null;
    alt?: string | null;
    hotspot?: { x?: number | null; y?: number | null } | null;
  } | null;
  subcategories: CategorySubcategory[];
  art: SanityArtItem[];
  exhibits: SanityExhibitItem[];
  projects: SanityProjectItem[];
}
