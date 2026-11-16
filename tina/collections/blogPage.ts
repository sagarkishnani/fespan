import type { Collection } from "tinacms";
import { text, seoObject, singleDocument } from "./shared";

export const blogPageCollection: Collection = {
  name: "blogPage",
  label: "Página: Blog",
  path: "src/content/blog-page",
  format: "json",
  ui: singleDocument,
  fields: [...text("title", "Título"), seoObject()],
};
