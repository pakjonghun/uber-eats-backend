export const getSlug = (name: string) =>
  name.trim().toLowerCase().replace(/\s/g, '-');
