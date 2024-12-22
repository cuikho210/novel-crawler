export const HOST = "https://metruyenchu.vn";

export function makeChapterListUrl(slug: string) {
  return `https://api.metruyenchu.vn/api/book/get-chapter-list-version-2/${slug}/13`;
}

export function makeChapterContentUrl(bookSlug: string, chapSlug: string) {
  return `https://metruyenchu.vn/${bookSlug}/${chapSlug}`;
}
