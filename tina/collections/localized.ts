import type { TinaField } from "tinacms";
import { TRANSLATED_LOCALES } from "../../src/i18n/config";

type LocalizableField = TinaField & { name: string; label?: string | boolean };

export function translations(field: LocalizableField): TinaField[] {
  return TRANSLATED_LOCALES.map((code) => ({
    ...field,
    name: `${field.name}_${code}`,
    label: `${field.label || field.name} (${code.toUpperCase()})`,
    required: false,
    isTitle: false,
    isBody: false,
  })) as TinaField[];
}

export function localized(field: LocalizableField): TinaField[] {
  return [field, ...translations(field)];
}
