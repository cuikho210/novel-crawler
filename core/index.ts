import { exportToEpub } from "../exporters/to-epub";
import { getBook } from "../crawlers/truyenfull";
import { resolve } from "path";

const book = await getBook({
  bookName: "Dưới Bóng Cây Sồi",
  author: "Kim Sooji",
  slug: "duoi-bong-cay-soi-kim-sooji",
});
const destPath = resolve(__dirname, `${book.slug}.epub`);

exportToEpub(
  {
    title: book.name,
    author: book.author,
    chapters: book.chapters,
  },
  destPath,
);
