import { defineConfig } from "tinacms";
import { globalCollection } from "./collections/global";
import { homeCollection } from "./collections/home";
import { aboutCollection } from "./collections/about";
import { activitiesPageCollection } from "./collections/activitiesPage";
import { activityCollection } from "./collections/activity";
import { knowledgePageCollection } from "./collections/knowledgePage";
import { knowledgeDocCollection } from "./collections/knowledgeDoc";
import { membersPageCollection } from "./collections/membersPage";
import { societyCollection } from "./collections/society";
import { contactPageCollection } from "./collections/contactPage";
import { blogPageCollection } from "./collections/blogPage";
import { postCollection } from "./collections/post";
import { legalCollection } from "./collections/legal";
import { formConfigCollection } from "./collections/formConfig";
import { dynamicFormsCollection } from "./collections/dynamicForms";
import { maintenanceCollection } from "./collections/maintenance";
import { cookieConsentCollection } from "./collections/cookieConsent";

export default defineConfig({
  // Baked into the generated client at build time; NOT read at runtime.
  branch: process.env.TINA_BRANCH || "staging",
  clientId: process.env.TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      globalCollection,
      homeCollection,
      aboutCollection,
      activitiesPageCollection,
      activityCollection,
      knowledgePageCollection,
      knowledgeDocCollection,
      membersPageCollection,
      societyCollection,
      contactPageCollection,
      blogPageCollection,
      postCollection,
      legalCollection,
      formConfigCollection,
      dynamicFormsCollection,
      maintenanceCollection,
      cookieConsentCollection,
    ],
  },
});
