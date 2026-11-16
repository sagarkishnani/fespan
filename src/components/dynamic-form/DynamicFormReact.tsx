import { useState, useEffect, useRef } from "react";
import { useTina, tinaField } from "tinacms/dist/react";
import {
  FormFileUpload,
  FormRadioGroup,
  FormCurrency,
  FormInlineRadio,
  FormCheckboxGroup,
  FormDateTriplet,
} from "../shared/FormControls";
import { tField } from "../../utils/i18n";
import type { Locale } from "../../i18n/config";
import {
  NUMERIC_FIELD_RULES,
  isNumericField,
  sanitizeNumeric,
  isNumericValid,
  type NumericFieldType,
} from "../../utils/numericFields";

const TURNSTILE_SITE_KEY: string =
  import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || "";
const TURNSTILE_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let turnstileScriptPromise: Promise<void> | null = null;
function loadTurnstile(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as any).turnstile) return Promise.resolve();
  if (turnstileScriptPromise) return turnstileScriptPromise;
  turnstileScriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = TURNSTILE_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("turnstile script failed to load"));
    document.head.appendChild(s);
  });
  return turnstileScriptPromise;
}

const FORM_UI = {
  es: {
    sending: "Enviando...",
    submit: "Enviar",
    selectPlaceholder: "Selecciona una opción",
    required: "Este campo es obligatorio",
    invalidEmail: "Ingresa un correo válido",
    invalidFormat: "Formato inválido",
    minChars: (n: number) => `Mínimo ${n} caracteres`,
    successTitle: "¡Formulario enviado!",
    contactSuccess: "¡Gracias! Tu mensaje ha sido enviado.",
    genericError: "Ocurrió un error al enviar.",
    connError: "No se pudo conectar con el servidor.",
    captchaMissing: "Verificación de seguridad no disponible. Contacta al administrador.",
    sendAnother: "Enviar otro mensaje",
  },
  en: {
    sending: "Sending...",
    submit: "Send",
    selectPlaceholder: "Select an option",
    required: "This field is required",
    invalidEmail: "Enter a valid email",
    invalidFormat: "Invalid format",
    minChars: (n: number) => `Minimum ${n} characters`,
    successTitle: "Form submitted!",
    contactSuccess: "Thank you! Your message has been sent.",
    genericError: "An error occurred while sending.",
    connError: "Could not connect to the server.",
    captchaMissing: "Security verification unavailable. Please contact the administrator.",
    sendAnother: "Send another message",
  },
  pt: {
    sending: "Enviando...",
    submit: "Enviar",
    selectPlaceholder: "Selecione uma opção",
    required: "Este campo é obrigatório",
    invalidEmail: "Digite um e-mail válido",
    invalidFormat: "Formato inválido",
    minChars: (n: number) => `Mínimo de ${n} caracteres`,
    successTitle: "Formulário enviado!",
    contactSuccess: "Obrigado! Sua mensagem foi enviada.",
    genericError: "Ocorreu um erro ao enviar.",
    connError: "Não foi possível conectar ao servidor.",
    captchaMissing: "Verificação de segurança indisponível. Entre em contato com o administrador.",
    sendAnother: "Enviar outra mensagem",
  },
} as const;

interface FieldOption {
  value: string;
  label: string;
  label_en?: string;
  group?: string;
  group_en?: string;
  description?: string;
  description_en?: string;
}

interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
  patternMessage_en?: string;
}

interface ConditionalField {
  dependsOn: string;
  showWhen: string;
}

// tinaField() demands Tina's metadata in its signature; useTina() only adds it at runtime.
interface TinaEditable {
  _content_source?: { queryId: string; path: (string | number)[] };
}

interface FormField extends TinaEditable {
  fieldType: string;
  name?: string;
  label?: string;
  label_en?: string;
  placeholder?: string;
  placeholder_en?: string;
  required?: boolean;
  width?: "full" | "half" | "third";
  order?: number;
  orderMobile?: number;
  sectionNumber?: number;
  noteContent?: string;
  noteContent_en?: string;
  validation?: FieldValidation;
  errorMessage?: string;
  errorMessage_en?: string;
  helpText?: string;
  helpText_en?: string;
  defaultValue?: string;
  options?: FieldOption[];
  accept?: string;
  maxFileSize?: number;
  multiple?: boolean;
  rows?: number;
  conditionalField?: ConditionalField;
  linkText?: string;
  linkText_en?: string;
  linkUrl?: string;
}

interface FormConfig extends TinaEditable {
  formId: string;
  formTitle?: string;
  formTitle_en?: string;
  badge?: string;
  description?: string;
  description_en?: string;
  submitButtonText?: string;
  submitButtonText_en?: string;
  successTitle?: string;
  successTitle_en?: string;
  successMessage?: string;
  successMessage_en?: string;
  errorMessage?: string;
  errorMessage_en?: string;
  validationMessage?: string;
  validationMessage_en?: string;
  showCorrelativo?: boolean;
  privacyText?: string;
  privacyUrl?: string;
  dataUrl?: string;
  fields?: FormField[];
}

const STRUCTURAL_TYPES = ["section_header", "divider", "note"];

function isStructural(type: string): boolean {
  return STRUCTURAL_TYPES.includes(type);
}

function getDefaultValue(field: FormField): any {
  if (field.defaultValue !== undefined && field.defaultValue !== "") return field.defaultValue;
  switch (field.fieldType) {
    case "checkbox":
      return false;
    case "checkboxGroup":
      return [];
    case "upload":
      return [];
    case "date":
      return { day: "", month: "", year: "" };
    default:
      return "";
  }
}

const c = {
  label: "block text-body-sm text-content-soft mb-2.5",
  input:
    "w-full min-h-14 border rounded-xl px-[18px] py-3.5 text-body-md text-content placeholder:text-content-muted focus:outline-none transition-colors bg-surface",
  ok: "border-line focus:border-brand-primary",
  err: "border-red-400 focus:border-red-400 focus:ring-red-400/20",
};
const contactErrorCls = "text-caption-sm text-red-500 mt-1";

function ContactInput({
  label, placeholder, type = "text", value, onChange, required, maxLength, error, inputMode,
}: {
  label: string; placeholder?: string; type?: string; value: string;
  onChange: (v: string) => void; required?: boolean; maxLength?: number; error?: string;
  inputMode?: "numeric" | "text";
}) {
  return (
    <div>
      {label && (
        <label className={c.label}>
          {label} {required && <span className="text-brand-primary">*</span>}
        </label>
      )}
      <input
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(maxLength ? e.target.value.slice(0, maxLength) : e.target.value)}
        maxLength={maxLength}
        className={`${c.input} ${error ? c.err : c.ok}`}
      />
      {error && <p className={contactErrorCls}>{error}</p>}
    </div>
  );
}

function renderSelectOptions(options: FieldOption[]) {
  const hasGroups = options.some((o) => o.group);
  if (!hasGroups) {
    return options.map((opt, i) => (
      <option key={i} value={opt.value} className="text-greyscale-darkest">
        {opt.label}
      </option>
    ));
  }
  const order: string[] = [];
  const buckets = new Map<string, FieldOption[]>();
  for (const opt of options) {
    const key = opt.group || "";
    if (!buckets.has(key)) {
      buckets.set(key, []);
      order.push(key);
    }
    buckets.get(key)!.push(opt);
  }
  return order.map((key, gi) => {
    const groupOpts = buckets.get(key)!;
    const children = groupOpts.map((opt, i) => (
      <option key={i} value={opt.value} className="text-greyscale-darkest">
        {opt.label}
      </option>
    ));
    return key ? (
      <optgroup key={gi} label={key} className="text-greyscale-darkest">
        {children}
      </optgroup>
    ) : (
      children
    );
  });
}

function ContactSelect({
  label, placeholder, options, value, onChange, required, error,
}: {
  label: string; placeholder?: string; options: FieldOption[]; value: string;
  onChange: (v: string) => void; required?: boolean; error?: string;
}) {
  const arrowColor = "%236B7280";
  return (
    <div>
      {label && (
        <label className={c.label}>
          {label} {required && <span className="text-brand-primary">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${c.input} appearance-none ${error ? c.err : c.ok}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='${arrowColor}' d='M2.5 4.5L6 8l3.5-3.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 16px center",
          backgroundSize: "12px",
        }}
      >
        <option value="" disabled>
          {placeholder || "Selecciona una opción"}
        </option>
        {renderSelectOptions(options)}
      </select>
      {error && <p className={contactErrorCls}>{error}</p>}
    </div>
  );
}

function ContactTextarea({
  label, placeholder, value, onChange, rows = 4, required, maxLength, error,
}: {
  label: string; placeholder?: string; value: string; onChange: (v: string) => void;
  rows?: number; required?: boolean; maxLength?: number; error?: string;
}) {
  return (
    <div>
      {label && (
        <label className={c.label}>
          {label} {required && <span className="text-brand-primary">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(maxLength ? e.target.value.slice(0, maxLength) : e.target.value)}
        rows={rows}
        maxLength={maxLength}
        className={`${c.input} resize-none ${error ? c.err : c.ok}`}
      />
      <div className="flex justify-between mt-1">
        {error ? <p className={contactErrorCls}>{error}</p> : <span />}
        {maxLength && (
          <span className="text-caption-sm text-greyscale-medium">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

function ContactCheckbox({
  checked, onChange, children, error,
}: {
  checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode; error?: string;
}) {
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 w-4 h-4 shrink-0 basis-4 accent-brand-primary rounded border-greyscale-light"
        />
        <span className="text-caption-sm leading-relaxed text-greyscale-dark">{children}</span>
      </label>
      {error && <p className="text-caption-sm text-red-500 mt-1 ml-7">{error}</p>}
    </div>
  );
}

function ContactSubmitButton({
  text, onClick, disabled,
}: {
  text: string; onClick: () => void; disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-14 items-center justify-center rounded-full px-8 text-body-base font-medium text-white transition-colors lg:text-[18px] ${
        disabled ? "cursor-not-allowed bg-brand-primary/60" : "bg-brand-primary hover:bg-brand-primary-dark"
      }`}
    >
      {text}
    </button>
  );
}

function CheckboxLabel({
  label,
  linkText,
  linkUrl,
}: {
  label: string;
  linkText?: string;
  linkUrl?: string;
}) {
  if (!linkText || !linkUrl) return <>{label}</>;

  const parts = label.split(linkText);

  return (
    <>
      {parts[0]}
      <a
        href={linkUrl}
        className="text-brand-primary underline hover:text-brand-primary-dark"
        target="_blank"
        rel="noopener noreferrer"
      >
        {linkText}
      </a>
      {parts[1] || ""}
    </>
  );
}

interface DynamicFormProps {
  query: string;
  variables: { relativePath: string };
  data: any;
  hideHeader?: boolean;
  prefill?: Record<string, string>;
  locale?: Locale;
}

export default function DynamicFormReact({ query, variables, data: initialData, hideHeader = false, prefill, locale = "es" }: DynamicFormProps) {
  const { data } = useTina({ query, variables, data: initialData });
  const formConfig: FormConfig = data?.dynamicForms || initialData?.dynamicForms;
  // Never return null from an island: Astro logs a bogus "Invalid hook call".
  if (!formConfig) return <div hidden />;

  const ui = FORM_UI[locale];
  const L = (obj: any, key: string): string => tField(obj, key, locale);
  const locOptions = (opts?: FieldOption[]): FieldOption[] =>
    (opts || []).map((o) => ({
      ...o,
      label: L(o, "label") || o.label,
      description: L(o, "description") || o.description,
      group: L(o, "group") || o.group,
    }));

  const fields: FormField[] = (formConfig.fields || []).filter(Boolean);

  const [values, setValues] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    for (const f of fields) {
      if (f.name && !isStructural(f.fieldType)) {
        const prefilled = prefill?.[f.name];
        init[f.name] =
          prefilled !== undefined && prefilled !== ""
            ? prefilled
            : getDefaultValue(f);
      }
    }
    return init;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const [captchaToken, setCaptchaToken] = useState("");
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const captchaConfigured = !!TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!captchaConfigured) return;
    let cancelled = false;
    loadTurnstile()
      .then(() => {
        if (cancelled || !captchaRef.current || widgetIdRef.current) return;
        const ts = (window as any).turnstile;
        if (!ts) return;
        widgetIdRef.current = ts.render(captchaRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          appearance: "interaction-only",
          callback: (token: string) => setCaptchaToken(token),
          "error-callback": () => setCaptchaToken(""),
          "expired-callback": () => setCaptchaToken(""),
        });
      })
      .catch(() => {
        // Blocked script leaves the token empty; the backend rejects it (fail-closed).
      });
    return () => {
      cancelled = true;
      const ts = (window as any).turnstile;
      if (ts && widgetIdRef.current) {
        try { ts.remove(widgetIdRef.current); } catch {}
        widgetIdRef.current = null;
      }
    };
  }, []);

  const resetCaptcha = () => {
    const ts = (window as any).turnstile;
    if (ts && widgetIdRef.current) {
      try { ts.reset(widgetIdRef.current); } catch {}
    }
    setCaptchaToken("");
  };

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      for (const f of fields) {
        if (f.name && params.has(f.name)) {
          const paramVal = params.get(f.name);
          if (paramVal) setValues((prev) => ({ ...prev, [f.name!]: paramVal }));
        }
      }
    } catch {}
  }, []);

  const updateField = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (touched) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const isFieldVisible = (field: FormField): boolean => {
    if (!field.conditionalField?.dependsOn) return true;
    const depVal = values[field.conditionalField.dependsOn];
    if (field.conditionalField.showWhen === "true") return !!depVal;
    if (field.conditionalField.showWhen === "false") return !depVal;
    return String(depVal) === field.conditionalField.showWhen;
  };

  const validateForm = (): Record<string, string> => {
    const errs: Record<string, string> = {};

    for (const field of fields) {
      if (!field.name || isStructural(field.fieldType)) continue;
      if (!isFieldVisible(field)) continue;

      const val = values[field.name];

      if (field.required) {
        let isEmpty = false;
        if (field.fieldType === "checkbox") isEmpty = !val;
        else if (field.fieldType === "upload") isEmpty = !val || val.length === 0;
        else if (field.fieldType === "checkboxGroup") isEmpty = !val || val.length === 0;
        else if (field.fieldType === "date") isEmpty = !val?.day || !val?.month || !val?.year;
        else isEmpty = val === undefined || val === null || val === "" || (typeof val === "string" && !val.trim());

        if (isEmpty) {
          errs[field.name] = L(field, "errorMessage") || ui.required;
          continue;
        }
      }

      // Code rules override the CMS pattern/minLength for numeric types.
      if (isNumericField(field.fieldType)) {
        if (val && typeof val === "string" && val.trim() && !isNumericValid(val, field.fieldType)) {
          errs[field.name] = L(field, "errorMessage") || NUMERIC_FIELD_RULES[field.fieldType].message;
        }
        continue;
      }

      if (field.fieldType === "email" && val && typeof val === "string" && val.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) {
          errs[field.name] = L(field, "errorMessage") || ui.invalidEmail;
        }
      }

      if (field.validation?.pattern && val && typeof val === "string") {
        try {
          if (!new RegExp(field.validation.pattern).test(val)) {
            errs[field.name] =
              tField(field.validation, "patternMessage", locale) || L(field, "errorMessage") || ui.invalidFormat;
          }
        } catch {
          // An invalid regex typed in the CMS must not block the submission.
        }
      }

      if (
        field.validation?.minLength &&
        val &&
        typeof val === "string" &&
        val.length < field.validation.minLength
      ) {
        if (!errs[field.name]) {
          errs[field.name] =
            L(field, "errorMessage") || ui.minChars(field.validation.minLength);
        }
      }
    }

    return errs;
  };

  const handleSubmit = async () => {
    setTouched(true);
    setSendError("");

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSendError(L(formConfig, "validationMessage") || "");
      return;
    }

    if (!captchaConfigured) {
      setSendError(ui.captchaMissing);
      return;
    }

    setSending(true);
    try {
      const { submitForm } = await import("../../utils/submitForm");

      const textData: Record<string, string> = {};
      const fileData: Record<string, File[]> = {};

      for (const field of fields) {
        if (!field.name || isStructural(field.fieldType)) continue;
        if (!isFieldVisible(field)) continue;

        const val = values[field.name];

        if (field.fieldType === "upload") {
          if (val && val.length > 0) fileData[field.name] = val;
        } else if (field.fieldType === "checkbox") {
          textData[field.name] = String(!!val);
        } else if (field.fieldType === "checkboxGroup") {
          textData[field.name] = (val || []).join(", ");
        } else if (field.fieldType === "date") {
          textData[field.name] = val ? `${val.day}/${val.month}/${val.year}` : "";
        } else if (
          (field.fieldType === "select" ||
            field.fieldType === "radio" ||
            field.fieldType === "radioGroup") &&
          field.options
        ) {
          const opt = field.options.find((o) => o.value === val);
          textData[field.name] = opt?.label || String(val || "");
        } else {
          textData[field.name] = String(val || "");
        }
      }

      const result = await submitForm({
        formType: formConfig.formId,
        data: textData,
        files: Object.keys(fileData).length > 0 ? fileData : undefined,
        honeypot,
        captchaToken,
      });

      if (result.success) {
        setSubmitted(true);
      } else {
        setSendError(
          result.error || L(formConfig, "errorMessage") || ui.genericError
        );
      }
    } catch {
      setSendError(
        L(formConfig, "errorMessage") || ui.connError
      );
    } finally {
      setSending(false);
      // Turnstile tokens are single-use.
      resetCaptcha();
    }
  };

  function startOver() {
    setValues(() => {
      const fresh: Record<string, any> = {};
      for (const f of fields) {
        if (f.name && !isStructural(f.fieldType)) fresh[f.name] = getDefaultValue(f);
      }
      return fresh;
    });
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <div className="flex animate-fade-up flex-col items-start gap-4 rounded-2xl bg-surface p-8 lg:p-12">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <path d="M5 13.5l5.5 5.5L21 7.5" className="stroke-white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="mt-2 text-heading-sm" data-tina-field={tinaField(formConfig, "successTitle")}>
          {L(formConfig, "successTitle") || ui.successTitle}
        </h3>
        <p className="text-body-base leading-relaxed text-content-muted" data-tina-field={tinaField(formConfig, "successMessage")}>
          {L(formConfig, "successMessage") || ui.contactSuccess}
        </p>
        <button
          type="button"
          onClick={startOver}
          className="mt-2 h-[50px] rounded-full border border-brand-primary px-6 text-body-md font-medium text-brand-primary transition-colors hover:bg-brand-primary hover:text-white"
        >
          {ui.sendAnother}
        </button>
      </div>
    );
  }

  const sortedFields = [...fields].sort((a, b) => {
    const orderA = isMobile ? (a.orderMobile ?? a.order ?? 0) : (a.order ?? 0);
    const orderB = isMobile ? (b.orderMobile ?? b.order ?? 0) : (b.order ?? 0);
    return orderA - orderB;
  });

  function renderField(field: FormField) {
    const val = field.name ? values[field.name] : undefined;
    const err = field.name && touched ? errors[field.name] : undefined;
    const maxLen = field.validation?.maxLength;

    if (field.fieldType === "section_header") {
      return (
        <div data-tina-field={tinaField(field, "label")}>
          <h3 className="text-body-md font-medium mt-4 mb-2 text-greyscale-darkest">
            {L(field, "label")}
          </h3>
        </div>
      );
    }

    if (field.fieldType === "divider") {
      return <div className="border-t border-greyscale-light" />;
    }

    if (field.fieldType === "note") {
      return (
        <div data-tina-field={tinaField(field, "noteContent")}>
          <p className="text-caption-sm text-greyscale-medium leading-relaxed">
            {L(field, "noteContent")}
          </p>
        </div>
      );
    }

    if (field.fieldType === "hidden") return null;

    const name = field.name!;
    const label = L(field, "label");
    const placeholder = L(field, "placeholder");
    const required = !!field.required;
    const fieldOptions = locOptions(field.options);
    const selectPlaceholder = placeholder || ui.selectPlaceholder;

    const numType: NumericFieldType | null = isNumericField(field.fieldType) ? field.fieldType : null;
    const numMaxLen = numType ? NUMERIC_FIELD_RULES[numType].length : maxLen;
    const numInputMode: "numeric" | undefined = numType ? "numeric" : undefined;
    const numOnChange = (v: string) =>
      updateField(name, numType ? sanitizeNumeric(v, numType) : maxLen ? v.slice(0, maxLen) : v);

    if (field.fieldType === "text" || field.fieldType === "tel" || field.fieldType === "number" || field.fieldType === "ruc") {
      return (
        <ContactInput
          label={label}
          placeholder={placeholder}
          type={numType ? "tel" : field.fieldType === "number" ? "number" : "text"}
          inputMode={numInputMode}
          value={val || ""}
          onChange={numOnChange}
          required={required}
          maxLength={numMaxLen}
          error={err}
        />
      );
    }

    if (field.fieldType === "email") {
      return (
        <ContactInput
          label={label}
          placeholder={placeholder}
          type="email"
          value={val || ""}
          onChange={(v) => updateField(name, v)}
          required={required}
          error={err}
        />
      );
    }

    if (field.fieldType === "select") {
      return (
        <ContactSelect
          label={label}
          placeholder={selectPlaceholder}
          options={fieldOptions}
          value={val || ""}
          onChange={(v) => updateField(name, v)}
          required={required}
          error={err}
        />
      );
    }

    if (field.fieldType === "textarea") {
      return (
        <ContactTextarea
          label={label}
          placeholder={placeholder}
          value={val || ""}
          onChange={(v) => updateField(name, v)}
          rows={field.rows || 4}
          required={required}
          maxLength={maxLen}
          error={err}
        />
      );
    }

    if (field.fieldType === "checkbox") {
      return (
        <ContactCheckbox
          checked={!!val}
          onChange={(v) => updateField(name, v)}
          error={err}
        >
          <span data-tina-field={tinaField(field, "label")}>
            <CheckboxLabel
              label={label}
              linkText={L(field, "linkText")}
              linkUrl={field.linkUrl}
            />
          </span>
        </ContactCheckbox>
      );
    }

    if (field.fieldType === "checkboxGroup") {
      return (
        <FormCheckboxGroup
          label={label}
          options={fieldOptions}
          value={val || []}
          onChange={(v) => updateField(name, v)}
          required={required}
          error={err}
        />
      );
    }

    if (field.fieldType === "radio") {
      return (
        <FormInlineRadio
          label={label}
          options={fieldOptions}
          value={val || ""}
          onChange={(v) => updateField(name, v)}
          required={required}
          error={err}
        />
      );
    }

    if (field.fieldType === "radioGroup") {
      return (
        <FormRadioGroup
          label={label}
          options={fieldOptions.map((o) => ({
            value: o.value,
            title: o.label,
            description: o.description,
          }))}
          value={val || ""}
          onChange={(v) => updateField(name, v)}
          required={required}
          error={err}
        />
      );
    }

    if (field.fieldType === "upload") {
      return (
        <FormFileUpload
          label={label}
          files={val || []}
          onChange={(v) => updateField(name, v)}
          accept={field.accept}
          multiple={field.multiple !== false}
          required={required}
          error={err}
          helpText={L(field, "helpText")}
        />
      );
    }

    if (field.fieldType === "currency") {
      return (
        <FormCurrency
          label={label}
          value={val || ""}
          onChange={(v) => updateField(name, v)}
          required={required}
          error={err}
          placeholder={placeholder}
        />
      );
    }

    if (field.fieldType === "date") {
      return (
        <FormDateTriplet
          label={label}
          value={val || { day: "", month: "", year: "" }}
          onChange={(v) => updateField(name, v)}
          required={required}
          error={err}
        />
      );
    }

    return null;
  }

  const widthClass = (w?: string) =>
    w === "third" ? "df-third" : w === "half" ? "df-half" : "df-full";

  const formId = formConfig.formId || "dynamic-form";

  return (
    <div>
      <style>{`
        .df-grid-${formId} {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 22px 20px;
        }
        .df-grid-${formId} .df-full  { grid-column: span 6; }
        .df-grid-${formId} .df-half  { grid-column: span 3; }
        .df-grid-${formId} .df-third { grid-column: span 2; }
        @media (max-width: 768px) {
          .df-grid-${formId} .df-half,
          .df-grid-${formId} .df-third { grid-column: span 6; }
          .df-grid-${formId} { gap: 14px; }
        }
      `}</style>

      {!hideHeader && L(formConfig, "formTitle") && (
        <div className="mb-8">
          <h2 className="text-heading-sm text-content" data-tina-field={tinaField(formConfig, "formTitle")}>
            {L(formConfig, "formTitle")}
          </h2>
        </div>
      )}

      <div className={`df-grid-${formId}`}>
        {sortedFields.map((field, idx) => {
          if (!isFieldVisible(field)) return null;

          const w = isStructural(field.fieldType) ? "full" : (field.width || "full");
          const orderVal = isMobile
            ? (field.orderMobile ?? field.order ?? 0)
            : (field.order ?? 0);

          const isSection = field.fieldType === "section_header";
          const isDivider = field.fieldType === "divider";
          const needsTopSpacing = (isSection || isDivider) && idx > 0;

          return (
            <div
              key={field.name || `struct-${idx}`}
              className={widthClass(w)}
              style={{
                order: orderVal || undefined,
                paddingTop: needsTopSpacing ? "32px" : undefined,
              }}
            >
              {renderField(field)}
              {L(field, "helpText") && !["upload", "note"].includes(field.fieldType) && (
                <p className="text-caption-sm text-greyscale-medium mt-1">
                  {L(field, "helpText")}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
        <input type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      {/* interaction-only: 0px until Turnstile challenges a bot; display:none would stop it rendering. */}
      <div ref={captchaRef} style={{ marginTop: "16px" }} />

      <div style={{ marginTop: "24px" }}>
        <ContactSubmitButton
          text={sending ? ui.sending : (L(formConfig, "submitButtonText") || ui.submit)}
          onClick={handleSubmit}
          disabled={sending}
        />
      </div>

      {sendError && (
        <p className="text-caption-sm text-red-500 text-center mt-2">
          {sendError}
        </p>
      )}
    </div>
  );
}