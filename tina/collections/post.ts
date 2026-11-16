import type { Collection, Template } from "tinacms";
import { localized } from "./localized";
import { text, longText } from "./shared";

export const BLOG_CATEGORIES = ["Training", "Tecnología", "Novedades"];

export const RICH_TEXT_TEMPLATES: Template[] = [
  {
    name: "Callout",
    label: "Recuadro destacado",
    fields: [
      { name: "title", label: "Título", type: "string" },
      { name: "text", label: "Texto", type: "string", ui: { component: "textarea" } },
    ],
  },
  {
    name: "Figure",
    label: "Imagen con pie",
    fields: [
      { name: "src", label: "Imagen", type: "image" },
      { name: "alt", label: "Texto alternativo", type: "string" },
      { name: "caption", label: "Pie de imagen", type: "string" },
      { name: "creditUrl", label: "URL del crédito", type: "string" },
    ],
  },
  {
    name: "Quote",
    label: "Cita",
    fields: [
      { name: "text", label: "Cita", type: "string", ui: { component: "textarea" } },
      { name: "author", label: "Autor", type: "string" },
    ],
  },
];

export const postCollection: Collection = {
  name: "post",
  label: "Blog",
  path: "src/content/blog",
  format: "mdx",
  fields: [
    { name: "title", label: "Título", type: "string", required: true, isTitle: true },
    ...text("title", "Título").slice(1),
    ...longText("excerpt", "Descripción corta"),
    { name: "category", label: "Categoría", type: "string", options: BLOG_CATEGORIES },
    { name: "coverImage", label: "Imagen de portada", type: "image" },
    { name: "coverAlt", label: "Texto alternativo de la portada", type: "string" },
    { name: "date", label: "Fecha", type: "datetime" },
    {
      type: "object",
      name: "author",
      label: "Autor",
      fields: [
        { name: "name", label: "Nombre", type: "string" },
        ...text("role", "Cargo"),
        { name: "photo", label: "Foto", type: "image" },
      ],
    },
    ...localized({ name: "tags", label: "Etiquetas", type: "string", list: true }),
    { name: "featured", label: "Destacado en el blog", type: "boolean" },
    ...localized({ name: "body", label: "Contenido", type: "rich-text", isBody: true, templates: RICH_TEXT_TEMPLATES }),
  ],
};
