import type { Collection } from "tinacms";
import { localized } from "./localized";
import { text } from "./shared";

export const legalCollection: Collection = {
  name: "legal",
  label: "Páginas legales",
  path: "src/content/legal",
  format: "mdx",
  fields: [
    { name: "title", label: "Título", type: "string", required: true, isTitle: true },
    ...text("title", "Título").slice(1),
    { name: "updated", label: "Última actualización", type: "datetime" },
    ...localized({ name: "body", label: "Contenido", type: "rich-text", isBody: true }),
  ],
};
