import type { Collection } from "tinacms";
import { text } from "./shared";

export const KNOWLEDGE_KINDS = [
  { value: "guia", label: "Guía" },
  { value: "investigacion", label: "Investigación" },
];

export const KNOWLEDGE_AREAS = [
  "Nutrición clínica",
  "Salud pública",
  "Pediatría",
  "Nutrición deportiva",
  "Seguridad alimentaria",
];

export const knowledgeDocCollection: Collection = {
  name: "knowledgeDoc",
  label: "Conocimiento (guías e investigaciones)",
  path: "src/content/knowledge",
  format: "json",
  fields: [
    { name: "title", label: "Título", type: "string", required: true, isTitle: true },
    ...text("title", "Título").slice(1),
    { name: "kind", label: "Tipo", type: "string", options: KNOWLEDGE_KINDS, required: true },
    { name: "area", label: "Área", type: "string", options: KNOWLEDGE_AREAS, required: true },
    { name: "published", label: "Fecha de publicación", type: "string" },
    { name: "revision", label: "Fecha de revisión", type: "string" },
    { name: "authors", label: "Autores / grupo de trabajo", type: "string" },
    ...text("conflicts", "Conflictos de interés"),
    { name: "languages", label: "Idiomas disponibles", type: "string", list: true, options: ["ES", "PT", "EN"] },
    { name: "file", label: "Archivo PDF", type: "image" },
  ],
};
