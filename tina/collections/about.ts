import type { Collection, TinaField } from "tinacms";
import { text, longText, linkObject, seoObject, heroObject, singleDocument } from "./shared";

function teamObject(name: string, label: string, extra: TinaField[] = []): TinaField {
  return {
    type: "object",
    name,
    label,
    fields: [
      ...extra,
      ...text("title", "Título"),
      {
        type: "object",
        name: "members",
        label: "Integrantes",
        list: true,
        ui: { itemProps: (item) => ({ label: item?.role || "Integrante" }) },
        fields: [
          ...text("role", "Cargo"),
          { name: "name", label: "Nombre y país", type: "string" },
          { name: "photo", label: "Foto", type: "image" },
          { name: "linkedin", label: "URL de LinkedIn", type: "string" },
        ],
      },
    ],
  };
}

export const aboutCollection: Collection = {
  name: "about",
  label: "Página: Nosotros",
  path: "src/content/about",
  format: "json",
  ui: singleDocument,
  fields: [
    heroObject([
      { name: "image", label: "Imagen", type: "image" },
      ...text("imageAlt", "Texto alternativo de la imagen"),
      ...text("buttonLabel", "Texto del botón"),
    ]),
    {
      type: "object",
      name: "intro",
      label: "Introducción",
      fields: [
        ...text("title", "Título"),
        ...longText("body", "Texto (separa párrafos con una línea en blanco)"),
        linkObject("button", "Botón"),
        { name: "image", label: "Imagen", type: "image" },
      ],
    },
    {
      type: "object",
      name: "values",
      label: "Misión, visión y valores",
      fields: [
        ...text("title", "Título"),
        linkObject("button", "Botón"),
        {
          type: "object",
          name: "items",
          label: "Tarjetas",
          list: true,
          ui: { itemProps: (item) => ({ label: item?.title || "Tarjeta" }) },
          fields: [
            { name: "icon", label: "Ícono", type: "image" },
            ...text("title", "Título"),
            ...longText("text", "Texto"),
            linkObject("link", "Enlace"),
          ],
        },
      ],
    },
    teamObject("board", "Junta directiva", text("eyebrow", "Antetítulo")),
    teamObject("committees", "Comités"),
    {
      type: "object",
      name: "documents",
      label: "Documentos oficiales",
      fields: [
        ...text("eyebrow", "Antetítulo"),
        ...text("title", "Título"),
        {
          type: "object",
          name: "items",
          label: "Documentos",
          list: true,
          ui: { itemProps: (item) => ({ label: item?.title || "Documento" }) },
          fields: [...text("title", "Título"), { name: "file", label: "Archivo PDF", type: "image" }],
        },
      ],
    },
    {
      type: "object",
      name: "allies",
      label: "Alianzas",
      fields: [
        ...text("title", "Título"),
        ...longText("text", "Texto"),
        {
          type: "object",
          name: "items",
          label: "Organizaciones",
          list: true,
          ui: { itemProps: (item) => ({ label: item?.name || "Organización" }) },
          fields: [
            { name: "name", label: "Nombre", type: "string" },
            { name: "logo", label: "Logo", type: "image" },
            { name: "url", label: "Sitio web", type: "string" },
          ],
        },
      ],
    },
    seoObject(),
  ],
};
