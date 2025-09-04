export const toSlug = (name: string): string =>
  name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const fromSlug = (slug: string): string =>
  slug
    .split('-')
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : ''))
    .join(' ');


