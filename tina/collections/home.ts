import type { Collection } from "tinacms";
import { text, longText, linkObject, seoObject, heroObject, singleDocument } from "./shared";

export const homeCollection: Collection = {
  name: "home",
  label: "Página: Inicio",
  path: "src/content/home",
  format: "json",
  ui: singleDocument,
  fields: [
    heroObject([
      { name: "image", label: "Imagen de fondo", type: "image" },
      linkObject("primaryButton", "Botón principal"),
      linkObject("secondaryButton", "Botón secundario"),
    ]),
    {
      type: "object",
      name: "about",
      label: "Sobre nosotros",
      fields: [
        ...text("eyebrow", "Antetítulo"),
        ...text("title", "Título"),
        ...longText("body", "Texto (separa párrafos con una línea en blanco)"),
        {
          type: "object",
          name: "stats",
          label: "Cifras",
          list: true,
          ui: { itemProps: (item) => ({ label: item?.label || "Cifra" }) },
          fields: [
            { name: "value", label: "Número", type: "number" },
            { name: "suffix", label: "Sufijo", type: "string" },
            ...text("label", "Etiqueta"),
          ],
        },
        linkObject("button", "Botón"),
        { name: "image", label: "Imagen", type: "image" },
      ],
    },
    {
      type: "object",
      name: "activities",
      label: "Actividades destacadas",
      description: "Muestra las actividades marcadas como 'Mostrar en inicio'.",
      fields: [...text("eyebrow", "Antetítulo"), ...text("title", "Título"), linkObject("button", "Botón")],
    },
    {
      type: "object",
      name: "video",
      label: "Video",
      fields: [
        ...text("title", "Título"),
        ...text("buttonLabel", "Texto del botón"),
        { name: "video", label: "Video (mp4)", type: "image" },
        { name: "poster", label: "Imagen de portada del video", type: "image" },
      ],
    },
    {
      type: "object",
      name: "news",
      label: "Últimas publicaciones",
      fields: [
        ...text("title", "Título"),
        ...text("highlight", "Palabra resaltada"),
        linkObject("link", "Enlace al blog"),
      ],
    },
    {
      type: "object",
      name: "transparency",
      label: "Banda de transparencia",
      fields: [...text("title", "Título"), ...longText("text", "Texto"), linkObject("button", "Botón")],
    },
    seoObject(),
  ],
};
