import type { Collection } from "tinacms";
import { seoObject, heroObject, singleDocument } from "./shared";

export const knowledgePageCollection: Collection = {
  name: "knowledgePage",
  label: "Página: Conocimiento",
  path: "src/content/knowledge-page",
  format: "json",
  ui: singleDocument,
  fields: [heroObject(), seoObject()],
};
