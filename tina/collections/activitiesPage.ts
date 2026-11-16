import type { Collection } from "tinacms";
import { text, longText, seoObject, singleDocument } from "./shared";

export const activitiesPageCollection: Collection = {
  name: "activitiesPage",
  label: "Página: Actividades",
  path: "src/content/activities-page",
  format: "json",
  ui: singleDocument,
  fields: [
    {
      type: "object",
      name: "hero",
      label: "Cabecera",
      fields: [...text("eyebrow", "Antetítulo"), ...text("title", "Título"), ...longText("subtitle", "Texto")],
    },
    ...text("congressesTitle", "Título de congresos"),
    {
      type: "object",
      name: "training",
      label: "Formación",
      fields: [...text("eyebrow", "Antetítulo"), ...text("title", "Título"), ...text("listTitle", "Título del listado")],
    },
    seoObject(),
  ],
};
