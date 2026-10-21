export interface Artwork {
  id: string;
  figureNumber: string;
  title: string;
  year: string;
  medium: string;
  dimensions: string;
  location: string;
  roomCategory: 'iconography' | 'dialogue' | 'installations' | 'studies';
  image: string;
  aspect: 'landscape' | 'portrait' | 'square' | 'panoramic';
  curatorialDescription: string;
  dialogueNote: string;
  colSpan?: string;
  offsetClass?: string;
}

export interface ExhibitionInfo {
  title: string;
  subtitle: string;
  museum: string;
  location: string;
  dates: string;
  curator: string;
  shortDescription: string;
  fullCuratorialEssay: {
    paragraphs: string[];
    quote: string;
    quoteAttribution: string;
    themes: {
      title: string;
      description: string;
    }[];
  };
}
