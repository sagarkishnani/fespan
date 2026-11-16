import type { CSSProperties } from "react";
import type { Locale } from "../i18n/config";

export interface TinaSectionProps {
  query: string;
  variables: object;
  data: any;
  locale: Locale;
}

export function revealDelay(ms: number): CSSProperties {
  return { "--reveal-delay": `${ms}ms` } as CSSProperties;
}
