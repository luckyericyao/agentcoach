export const recipeShareImageSize = { width: 1200, height: 630 };

export function recipeShareImagePath(slug: string) {
  return `/recipes/share-image/${encodeURIComponent(slug)}`;
}
