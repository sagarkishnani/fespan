import type { Collection } from "tinacms";
import { text, longText, linkObject, singleDocument } from "./shared";

const navLinkFields = [...text("label", "Texto"), { name: "url", label: "URL", type: "string" as const }];

export const globalCollection: Collection = {
  name: "global",
  label: "Global (nav / footer / SEO)",
  path: "src/content/global",
  format: "json",
  ui: singleDocument,
  fields: [
    {
      type: "object",
      name: "nav",
      label: "Navegación",
      fields: [
        { name: "logo", label: "Logo", type: "image" },
        { name: "logoAlt", label: "Texto alternativo del logo", type: "string" },
        {
          type: "object",
          name: "links",
          label: "Enlaces",
          list: true,
          ui: { itemProps: (item) => ({ label: item?.label || "Enlace" }) },
          fields: navLinkFields,
        },
        linkObject("cta", "Botón principal"),
        { name: "loginUrl", label: "URL de 'Ingresar' (vacío lo oculta)", type: "string" },
      ],
    },
    {
      type: "object",
      name: "ctaBand",
      label: "Banda de llamada a la acción (antes del footer)",
      fields: [...text("title", "Título"), linkObject("button", "Botón")],
    },
    {
      type: "object",
      name: "footer",
      label: "Footer",
      fields: [
        {
          type: "object",
          name: "columns",
          label: "Columnas",
          list: true,
          ui: { itemProps: (item) => ({ label: item?.title || "Columna" }) },
          fields: [
            ...text("title", "Título"),
            {
              type: "object",
              name: "links",
              label: "Enlaces",
              list: true,
              ui: { itemProps: (item) => ({ label: item?.label || "Enlace" }) },
              fields: navLinkFields,
            },
          ],
        },
        ...text("helpTitle", "Título de ayuda"),
        ...longText("helpText", "Texto de ayuda"),
        { name: "phone", label: "Teléfono", type: "string" },
        { name: "email", label: "Correo", type: "string" },
        {
          type: "object",
          name: "social",
          label: "Redes sociales",
          list: true,
          ui: { itemProps: (item) => ({ label: item?.network || "Red" }) },
          fields: [
            {
              name: "network",
              label: "Red",
              type: "string",
              options: ["facebook", "instagram", "linkedin", "x", "youtube", "tiktok", "whatsapp"],
            },
            { name: "url", label: "URL", type: "string" },
          ],
        },
        ...text("legal", "Línea legal"),
      ],
    },
    {
      type: "object",
      name: "seo",
      label: "SEO por defecto",
      fields: [
        ...text("title", "Título por defecto"),
        ...longText("description", "Descripción por defecto"),
        { name: "ogImage", label: "Imagen para compartir (1200×630)", type: "image" },
      ],
    },
    {
      type: "object",
      name: "codeInjection",
      label: "Código inyectado (analytics, píxeles)",
      description: "HTML crudo. Se inserta tal cual; un error aquí puede romper el sitio.",
      fields: [
        { name: "head", label: "Antes de </head>", type: "string", ui: { component: "textarea" } },
        { name: "bodyEnd", label: "Antes de </body>", type: "string", ui: { component: "textarea" } },
      ],
    },
  ],
};
