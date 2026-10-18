// Unsplash-sourced photo pools (free license — see public/images/ATTRIBUTION.md).
// Curated demo images live on the demo records themselves (demoBackend resolves
// their `asset:` URLs); these pools give records without a stored photo a stable
// face or building, so the same person or property always looks the same.

const img = (path: string): string => `${import.meta.env.BASE_URL}images/${path}`;

const PORTRAITS = Array.from({ length: 10 }, (_, i) => img(`avatars/portrait-${String(i + 1).padStart(2, '0')}.jpg`));

const PROPERTY_POOL = [
  'properties/property-04.jpg',
  'properties/property-05.jpg',
  'properties/property-06.jpg',
  'properties/property-07.jpg',
  'properties/property-08.jpg',
].map(img);

const INTERIOR_POOL = [
  'interiors/interior-04.jpg',
  'interiors/interior-05.jpg',
  'interiors/interior-08.jpg',
  'interiors/interior-11.jpg',
].map(img);

const hash = (s: string): number =>
  [...s].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7);

// Hand-picked faces for the demo cast, so "Michael Brown" wears the same face
// on the tenants page and on the dashboard's rent rows.
const FACE_BY_NAME: Record<string, number> = {
  "James O'Connor": 3,
  'Thomas Müller': 6,
  'Priya Patel': 0,
  'David Kim': 7,
  'Jennifer Lopez': 8,
  'Fatima Al-Sayed': 5,
  'Robert Williams': 2,
  'Michael Brown': 4,
  'Ana Sofía Herrera': 9,
};

export const portraitFor = (name: string): string => {
  const pinned = FACE_BY_NAME[name];
  return PORTRAITS[pinned ?? hash(name || '?') % PORTRAITS.length];
};

export const propertyImageFor = (id: string): string =>
  PROPERTY_POOL[hash(id || '?') % PROPERTY_POOL.length];

export const unitImageFor = (id: string): string =>
  INTERIOR_POOL[hash(id || '?') % INTERIOR_POOL.length];
