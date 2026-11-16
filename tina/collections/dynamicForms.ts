import type { Collection } from "tinacms";
import { translations } from "./localized";

export const dynamicFormsCollection: Collection = {
  name: "dynamicForms",
  label: "Formularios Dinámicos",
  path: "src/content/dynamic-forms",
  format: "json",
  ui: {
    router: ({ document }) => {
      const slug = document._sys.filename;
      const routes: Record<string, string> = {
        contacto: "/contacto",
      };
      return routes[slug] || `/${slug}`;
    },
  },
  fields: [
    {
      name: "formId",
      label: "ID del formulario",
      type: "string",
      required: true,
      description:
        "Identificador único. Debe coincidir con formType en 'Configuración de formularios' para el envío de correos.",
    },
    {
      name: "formTitle",
      label: "Título del formulario",
      type: "string",
    },
    ...translations({ name: "formTitle", label: "Título del formulario", type: "string" }),
    {
      name: "badge",
      label: "Badge (opcional)",
      type: "string",
      description:
        "Texto pequeño encima del título. Solo aplica en estilo Estándar.",
    },
    {
      name: "description",
      label: "Descripción",
      type: "string",
      ui: { component: "textarea" },
    },
    ...translations({ name: "description", label: "Descripción", type: "string", ui: { component: "textarea" } }),

    {
      name: "submitButtonText",
      label: "Texto botón enviar",
      type: "string",
    },
    ...translations({ name: "submitButtonText", label: "Texto botón enviar", type: "string" }),
    {
      name: "successTitle",
      label: "Título de éxito",
      type: "string",
      description:
        "Título que se muestra después de enviar exitosamente.",
    },
    ...translations({ name: "successTitle", label: "Título de éxito", type: "string" }),
    {
      name: "successMessage",
      label: "Mensaje de éxito",
      type: "string",
      ui: { component: "textarea" },
    },
    ...translations({ name: "successMessage", label: "Mensaje de éxito", type: "string", ui: { component: "textarea" } }),
    {
      name: "errorMessage",
      label: "Mensaje de error (servidor)",
      type: "string",
      description: "Se muestra cuando falla el envío al servidor.",
    },
    ...translations({ name: "errorMessage", label: "Mensaje de error", type: "string" }),
    {
      name: "validationMessage",
      label: "Mensaje de validación",
      type: "string",
      description:
        "Se muestra cuando el usuario intenta enviar con campos inválidos. Ej: 'Por favor completa los campos marcados en rojo'.",
    },
    ...translations({ name: "validationMessage", label: "Mensaje de validación", type: "string" }),
    {
      name: "showCorrelativo",
      label: "Mostrar N° correlativo",
      type: "boolean",
      description:
        "Mostrar número de correlativo en la pantalla de éxito (si el servidor lo retorna).",
    },

    {
      name: "privacyText",
      label: "Texto de privacidad",
      type: "string",
    },
    {
      name: "privacyUrl",
      label: "URL Política de Privacidad",
      type: "string",
    },
    {
      name: "dataUrl",
      label: "URL Tratamiento de Datos",
      type: "string",
    },

    {
      name: "fields",
      label: "Campos del formulario",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => {
          const type = item?.fieldType || "campo";
          const label = item?.label || item?.name || "";
          const icons: Record<string, string> = {
            section_header: "📌",
            divider: "──",
            note: "📝",
            text: "Aa",
            email: "✉",
            tel: "📞",
            ruc: "🆔",
            number: "#",
            textarea: "¶",
            select: "▼",
            radio: "◉",
            radioGroup: "◉◉",
            checkbox: "☑",
            checkboxGroup: "☑☑",
            upload: "📎",
            currency: "S/",
            date: "📅",
            hidden: "👁‍🗨",
          };
          const icon = icons[type] || "•";
          return { label: `${icon} ${type} — ${label}` };
        },
      },
      fields: [
        {
          name: "fieldType",
          label: "Tipo de campo",
          type: "string",
          required: true,
          options: [
            {
              value: "section_header",
              label: "📌 Encabezado de sección",
            },
            { value: "divider", label: "── Separador" },
            { value: "note", label: "📝 Nota / Texto" },
            { value: "text", label: "Texto" },
            { value: "email", label: "Email" },
            { value: "tel", label: "Teléfono (9 díg., empieza en 9)" },
            { value: "ruc", label: "RUC (11 dígitos)" },
            { value: "number", label: "Número" },
            { value: "textarea", label: "Área de texto" },
            { value: "select", label: "Desplegable" },
            { value: "radio", label: "Radio (inline)" },
            {
              value: "radioGroup",
              label: "Radio (cards con descripción)",
            },
            { value: "checkbox", label: "Casilla de verificación" },
            { value: "checkboxGroup", label: "Grupo de casillas" },
            { value: "upload", label: "Subir archivo" },
            { value: "currency", label: "Moneda (S/)" },
            { value: "date", label: "Fecha (día/mes/año)" },
            { value: "hidden", label: "Campo oculto" },
          ],
        },
        {
          name: "name",
          label: "Nombre interno",
          type: "string",
          description:
            "Identificador único del campo. Se usa como key en el JSON enviado. Sin espacios ni tildes. Ej: nombreCompleto, tipoDoc, adjuntos.",
        },
        {
          name: "label",
          label: "Etiqueta visible",
          type: "string",
          description: "Para section_header es el título de la sección.",
        },
        ...translations({ name: "label", label: "Etiqueta visible", type: "string" }),
        {
          name: "placeholder",
          label: "Placeholder",
          type: "string",
        },
        ...translations({ name: "placeholder", label: "Placeholder", type: "string" }),
        {
          name: "required",
          label: "Obligatorio",
          type: "boolean",
        },
        {
          name: "width",
          label: "Ancho",
          type: "string",
          options: [
            { value: "full", label: "Completo (100%)" },
            { value: "half", label: "Mitad (50%) — 2 por fila" },
            { value: "third", label: "Tercio (33%) — 3 por fila" },
          ],
          description: "En mobile siempre se muestra al 100%.",
        },
        {
          name: "order",
          label: "Orden (desktop)",
          type: "number",
          description:
            "Orden de aparición en desktop. Menor = más arriba.",
        },
        {
          name: "orderMobile",
          label: "Orden (mobile)",
          type: "number",
          description:
            "Orden en mobile. Si se deja vacío, usa el orden de desktop.",
        },

        {
          name: "sectionNumber",
          label: "Número de sección",
          type: "number",
          description:
            "Solo para section_header. Número que se muestra en el círculo.",
        },
        {
          name: "noteContent",
          label: "Contenido de nota",
          type: "string",
          ui: { component: "textarea" },
          description: "Solo para note. El texto del párrafo.",
        },
        ...translations({ name: "noteContent", label: "Contenido de nota", type: "string", ui: { component: "textarea" } }),
        {
          name: "rows",
          label: "Filas",
          type: "number",
          description: "Solo para textarea. Default: 4.",
        },

        {
          name: "validation",
          label: "Validación",
          type: "object",
          fields: [
            {
              name: "minLength",
              label: "Largo mínimo",
              type: "number",
            },
            {
              name: "maxLength",
              label: "Largo máximo",
              type: "number",
            },
            {
              name: "pattern",
              label: "Patrón (regex)",
              type: "string",
              description:
                "Expresión regular. Ej: ^\\d{11}$ para RUC de 11 dígitos, ^\\d{8}$ para DNI.",
            },
            {
              name: "patternMessage",
              label: "Mensaje del patrón",
              type: "string",
              description:
                "Mensaje cuando el valor no cumple el patrón. Ej: 'El RUC debe tener 11 dígitos'.",
            },
            ...translations({ name: "patternMessage", label: "Mensaje del patrón", type: "string" }),
          ],
        },
        {
          name: "errorMessage",
          label: "Mensaje de error personalizado",
          type: "string",
          description:
            "Si se deja vacío, se genera un mensaje automático según la validación que falle.",
        },
        ...translations({ name: "errorMessage", label: "Mensaje de error personalizado", type: "string" }),
        {
          name: "helpText",
          label: "Texto de ayuda",
          type: "string",
          description:
            "Texto pequeño debajo del campo. Para upload aparece como instrucción de archivos.",
        },
        ...translations({ name: "helpText", label: "Texto de ayuda", type: "string" }),
        {
          name: "defaultValue",
          label: "Valor por defecto",
          type: "string",
        },

        {
          name: "options",
          label: "Opciones",
          type: "object",
          list: true,
          description: "Para select, radio, radioGroup y checkboxGroup.",
          ui: {
            itemProps: (item) => ({ label: item?.label || "Opción" }),
          },
          fields: [
            { name: "value", label: "Valor", type: "string" },
            { name: "label", label: "Etiqueta", type: "string" },
            ...translations({ name: "label", label: "Etiqueta", type: "string" }),
            {
              name: "group",
              label: "Grupo / Categoría",
              type: "string",
              description:
                "Solo para select: agrupa las opciones bajo un encabezado (optgroup). Ej: la categoría del servicio.",
            },
            ...translations({ name: "group", label: "Grupo / Categoría", type: "string" }),
            {
              name: "description",
              label: "Descripción",
              type: "string",
              description:
                "Solo para radioGroup (aparece debajo del título en la tarjeta).",
            },
            ...translations({ name: "description", label: "Descripción", type: "string" }),
          ],
        },

        {
          name: "accept",
          label: "Tipos de archivo",
          type: "string",
          description: "Solo para upload. Ej: .pdf,.jpg,.png,.doc,.docx",
        },
        {
          name: "maxFileSize",
          label: "Tamaño máximo (MB)",
          type: "number",
          description: "Solo para upload.",
        },
        {
          name: "multiple",
          label: "Múltiples archivos",
          type: "boolean",
          description: "Solo para upload. Default: true.",
        },
        {
          name: "linkText",
          label: "Texto del enlace",
          type: "string",
          description:
            "Solo para checkbox. Parte del label que se convierte en enlace. Ej: 'Política de Privacidad'.",
        },
        ...translations({ name: "linkText", label: "Texto del enlace", type: "string" }),
        {
          name: "linkUrl",
          label: "URL del enlace",
          type: "string",
          description:
            "Solo para checkbox. URL a la que apunta el enlace.",
        },

        {
          name: "conditionalField",
          label: "Campo condicional",
          type: "object",
          description:
            "Solo mostrar este campo si otro campo tiene un valor específico.",
          fields: [
            {
              name: "dependsOn",
              label: "Depende del campo (nombre interno)",
              type: "string",
              description: "El 'name' del campo del cual depende.",
            },
            {
              name: "showWhen",
              label: "Mostrar cuando el valor es",
              type: "string",
              description:
                "Valor exacto. Para checkbox usa 'true' o 'false'.",
            },
          ],
        },
      ],
    },
  ],
};
