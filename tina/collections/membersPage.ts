import type { Collection } from "tinacms";
import { seoObject, heroObject, singleDocument } from "./shared";

export const membersPageCollection: Collection = {
  name: "membersPage",
  label: "Página: Miembros",
  path: "src/content/members-page",
  format: "json",
  ui: singleDocument,
  fields: [heroObject(), seoObject()],
};
