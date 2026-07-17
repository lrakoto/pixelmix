// Single source of truth for the print catalog.
// Adding a new print = add an entry here. Both the Gallery and the
// dynamic /prints/[slug] page pull from this list.
//
// When real images land in /public/prints/, the `image` field is just
// the path under /public, e.g. "/prints/sakura-night.jpg".

export interface Print {
  slug: string;
  title: string;
  artist: string;
  price: number;            // USD
  size: string;             // e.g. "A2 (16.5 x 23.4 in)"
  paper: string;            // e.g. "Hahnemühle Photo Rag 308gsm"
  edition: string;          // e.g. "Open edition" or "Limited, 50"
  image: string;            // path under /public
  description: string;
  featured?: boolean;       // shown on the home page
}

// Placeholder prints so the gallery has something to react to.
// Real images will replace these once the uploads/ folder is in.
export const prints: Print[] = [
  {
    slug: 'neon-tokyo',
    title: 'Neon Tokyo',
    artist: 'Pixelmix Studio',
    price: 38,
    size: 'A2 (16.5 x 23.4 in)',
    paper: 'Hahnemühle Photo Rag 308gsm',
    edition: 'Open edition',
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1200&q=80&auto=format&fit=crop',
    description: 'Rain-slick streets, vending-machine light. A study in the quiet moments between the noise.',
    featured: true,
  },
  {
    slug: 'sakura-night',
    title: 'Sakura Night',
    artist: 'Pixelmix Studio',
    price: 38,
    size: 'A2 (16.5 x 23.4 in)',
    paper: 'Hahnemühle Photo Rag 308gsm',
    edition: 'Open edition',
    image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1200&q=80&auto=format&fit=crop',
    description: 'Petals under streetlight. A short story told in two colors.',
  },
  {
    slug: 'skyline-drift',
    title: 'Skyline Drift',
    artist: 'Pixelmix Studio',
    price: 42,
    size: 'A1 (23.4 x 33.1 in)',
    paper: 'Hahnemühle Photo Rag 308gsm',
    edition: 'Limited, 50',
    image: 'https://images.unsplash.com/photo-1493514789931-586cb221d7a7?w=1200&q=80&auto=format&fit=crop',
    description: 'A city that never quite sleeps, but sometimes slows down enough to breathe.',
    featured: true,
  },
  {
    slug: 'forest-shrine',
    title: 'Forest Shrine',
    artist: 'Pixelmix Studio',
    price: 36,
    size: 'A2 (16.5 x 23.4 in)',
    paper: 'Hahnemühle Photo Rag 308gsm',
    edition: 'Open edition',
    image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=1200&q=80&auto=format&fit=crop',
    description: 'Torii gates, cedar, mist. The path is the point.',
  },
  {
    slug: 'rooftop-sunset',
    title: 'Rooftop Sunset',
    artist: 'Pixelmix Studio',
    price: 38,
    size: 'A2 (16.5 x 23.4 in)',
    paper: 'Hahnemühle Photo Rag 308gsm',
    edition: 'Open edition',
    image: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=1200&q=80&auto=format&fit=crop',
    description: 'The half-hour where everything goes gold before it goes dark.',
  },
  {
    slug: 'studio-portrait-01',
    title: 'Studio Portrait 01',
    artist: 'Pixelmix Studio',
    price: 44,
    size: 'A2 (16.5 x 23.4 in)',
    paper: 'Hahnemühle Photo Rag 308gsm',
    edition: 'Limited, 25',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80&auto=format&fit=crop',
    description: 'Quiet intensity. Soft light, harder expression.',
  },
];

export function getPrint(slug: string): Print | undefined {
  return prints.find((p) => p.slug === slug);
}

export function featured(): Print[] {
  return prints.filter((p) => p.featured);
}
