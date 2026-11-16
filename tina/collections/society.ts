import type { Collection } from "tinacms";
import { text } from "./shared";

export const SOCIETY_COUNTRIES = [
  { value: "ar", label: "Argentina" },
  { value: "bo", label: "Bolivia" },
  { value: "br", label: "Brasil" },
  { value: "cl", label: "Chile" },
];

export const societyCollection: Collection = {
  name: "society",
  label: "Sociedades miembro",
  path: "src/content/societies",
  format: "json",
  fields: [
    { name: "name", label: "Nombre", type: "string", required: true, isTitle: true },
    ...text("name", "Nombre").slice(1),
    {
      name: "countryCode",
      label: "País",
      description: "Define la silueta que se resalta en el mapa.",
      type: "string",
      options: SOCIETY_COUNTRIES,
      required: true,
    },
    ...text("city", "Ciudad, país"),
    { name: "url", label: "Sitio web", type: "string" },
    { name: "order", label: "Orden", type: "number" },
  ],
};
