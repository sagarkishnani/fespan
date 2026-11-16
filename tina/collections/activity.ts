import type { Collection } from "tinacms";
import { text, longText } from "./shared";

export const ACTIVITY_KINDS = [
  { value: "congreso", label: "Congreso" },
  { value: "formacion", label: "Formación" },
];

export const activityCollection: Collection = {
  name: "activity",
  label: "Actividades",
  path: "src/content/activities",
  format: "json",
  ui: {
    filename: {
      readonly: false,
      slugify: (values) =>
        `${values?.title || ""}`
          .toLowerCase()
          .normalize("NFD")
          .replace(/[̀-ͯ]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
    },
  },
  fields: [
    { name: "title", label: "Título", type: "string", required: true, isTitle: true },
    ...text("title", "Título").slice(1),
    { name: "kind", label: "Tipo", type: "string", options: ACTIVITY_KINDS, required: true },
    ...text("badge", "Etiqueta (ej. Próximo congreso)"),
    ...text("dateLabel", "Fecha (como se muestra)"),
    ...text("place", "Lugar o modalidad"),
    ...longText("summary", "Resumen"),
    { name: "image", label: "Imagen", type: "image" },
    {
      name: "imagePosition",
      label: "Encuadre de la imagen",
      type: "string",
      options: ["center", "top", "bottom", "left center", "right center", "center 30%"],
    },
    {
      type: "object",
      name: "facts",
      label: "Datos",
      list: true,
      ui: { itemProps: (item) => ({ label: item?.label || "Dato" }) },
      fields: [...text("label", "Etiqueta"), ...longText("value", "Valor")],
    },
    { name: "registerUrl", label: "URL de inscripción", type: "string" },
    { name: "abstractUrl", label: "URL para enviar resumen (vacío lo oculta)", type: "string" },
    { name: "showOnHome", label: "Mostrar en inicio", type: "boolean" },
    { name: "order", label: "Orden", type: "number" },
  ],
};
