import type { Collection } from "tinacms";
import { text, longText, seoObject, heroObject, singleDocument } from "./shared";

export const CONTACT_ICONS = [
  { value: "pin", label: "Ubicación" },
  { value: "phone", label: "Teléfono" },
  { value: "mail", label: "Correo" },
];

export const contactPageCollection: Collection = {
  name: "contactPage",
  label: "Página: Contacto",
  path: "src/content/contact-page",
  format: "json",
  ui: singleDocument,
  fields: [
    heroObject([{ name: "image", label: "Imagen", type: "image" }]),
    {
      type: "object",
      name: "channels",
      label: "Canales de atención",
      list: true,
      ui: { itemProps: (item) => ({ label: item?.title || "Canal" }) },
      fields: [
        { name: "icon", label: "Ícono", type: "string", options: CONTACT_ICONS },
        ...text("title", "Título"),
        ...longText("text", "Texto"),
      ],
    },
    { name: "mapEmbedUrl", label: "URL de Google Maps (embed)", type: "string" },
    seoObject(),
  ],
};
