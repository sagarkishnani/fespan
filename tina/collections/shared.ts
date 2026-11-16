import type { TinaField } from "tinacms";
import { localized } from "./localized";

export const singleDocument = { allowedActions: { create: false, delete: false } } as const;

export function text(name: string, label: string): TinaField[] {
  return localized({ name, label, type: "string" });
}

export function longText(name: string, label: string): TinaField[] {
  return localized({ name, label, type: "string", ui: { component: "textarea" } });
}

export function linkObject(name: string, label: string): TinaField {
  return {
    type: "object",
    name,
    label,
    fields: [...text("label", "Texto"), { name: "url", label: "URL", type: "string" }],
  };
}

export function seoObject(): TinaField {
  return {
    type: "object",
    name: "seo",
    label: "SEO",
    fields: [...text("title", "Título"), ...longText("description", "Descripción")],
  };
}

export function heroObject(extra: TinaField[] = []): TinaField {
  return {
    type: "object",
    name: "hero",
    label: "Cabecera",
    fields: [...text("title", "Título"), ...longText("subtitle", "Subtítulo"), ...extra],
  };
}
