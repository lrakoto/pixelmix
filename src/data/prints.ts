// Typed compatibility export. The CMS-backed JSON file is the single source
// of truth used by the site and TinaCMS.
import catalog from './prints.json';

export interface Print {
  slug: string;
  title: string;
  artist: string;
  price: number;
  size: string;
  paper: string;
  edition: string;
  images: string[];
  description: string;
  buyUrl: string | null;
  featured: boolean;
}

export const prints: Print[] = catalog.prints;
