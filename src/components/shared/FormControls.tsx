export const fieldClasses = {
  label: "block text-body-sm text-content-soft mb-2.5",
  input:
    "w-full min-h-[52px] border rounded-[14px] md:min-h-14 md:rounded-xl px-[18px] py-3 md:py-3.5 text-body-md text-content placeholder:text-content-muted focus:outline-none transition-colors bg-surface",
  ok: "border-line focus:border-brand-primary",
  err: "border-semantics-error focus:border-semantics-error",
  error: "text-caption-sm text-semantics-error mt-1",
  help: "text-caption-sm text-content-muted mt-1",
};

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  if (!label) return null;
  return (
    <p className={fieldClasses.label}>
      {label} {required && <span className="text-brand-primary">*</span>}
    </p>
  );
}

function FieldError({ error }: { error?: string }) {
  return error ? <p className={fieldClasses.error}>{error}</p> : null;
}

function inputClass(error?: string, extra = "") {
  return `${fieldClasses.input} ${error ? fieldClasses.err : fieldClasses.ok} ${extra}`;
}

interface FileUploadProps {
  label: string;
  helpText?: string;
  files: File[];
  onChange: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  required?: boolean;
  error?: string;
}

export function FormFileUpload({
  label, helpText, files, onChange, multiple = true, accept, required, error,
}: FileUploadProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    onChange(multiple ? [...files, ...newFiles] : newFiles);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <FieldLabel label={label} required={required} />
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex h-control-sm cursor-pointer items-center gap-2 rounded-full border border-brand-primary px-5 text-body-sm font-medium text-brand-primary transition-colors hover:bg-brand-primary hover:text-white">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Elegir archivos
          <input type="file" multiple={multiple} accept={accept} onChange={handleChange} className="hidden" />
        </label>
        <span className="text-caption-sm text-content-muted">
          {files.length === 0 ? "Sin archivos seleccionados" : `${files.length} archivo(s)`}
        </span>
      </div>

      {files.length > 0 && (
        <div className="mt-2 flex flex-col gap-1">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between rounded-md bg-surface-sunken px-3 py-1.5 text-caption-sm text-content">
              <span>{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                aria-label={`Quitar ${file.name}`}
                className="px-1 text-body-md font-bold text-semantics-error"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {helpText && <p className={fieldClasses.help}>{helpText}</p>}
      <FieldError error={error} />
    </div>
  );
}

interface RadioOption {
  value: string;
  title: string;
  description?: string;
}

interface RadioGroupProps {
  label: string;
  options: RadioOption[];
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  error?: string;
}

export function FormRadioGroup({
  label, options, value, onChange, required, error,
}: RadioGroupProps) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <div className="flex flex-col gap-3">
        {options.map((opt, i) => {
          const isSelected = value === opt.value;
          return (
            <label
              key={i}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-5 py-4 transition-colors ${
                isSelected ? "border-brand-primary bg-surface-mint" : "border-line bg-surface hover:border-line-strong"
              }`}
            >
              <input
                type="radio"
                checked={isSelected}
                onChange={() => onChange(opt.value)}
                className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-brand-primary"
              />
              <div>
                <div className="text-body-sm font-medium text-content">{opt.title}</div>
                {opt.description && (
                  <p className="mt-1 text-caption-sm leading-relaxed text-content-muted">{opt.description}</p>
                )}
              </div>
            </label>
          );
        })}
      </div>
      <FieldError error={error} />
    </div>
  );
}

interface CurrencyProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
}

export function FormCurrency({
  label, value, onChange, required, error, placeholder = "0.00",
}: CurrencyProps) {
  const handleChange = (raw: string) => {
    const cleaned = raw.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    onChange(cleaned);
  };

  return (
    <div>
      <FieldLabel label={label} required={required} />
      <div className="relative">
        <span className="pointer-events-none absolute left-[18px] top-1/2 -translate-y-1/2 text-body-md font-medium text-content-soft">
          S/
        </span>
        <input
          type="text"
          inputMode="decimal"
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className={inputClass(error, "pl-12")}
        />
      </div>
      <FieldError error={error} />
    </div>
  );
}

interface InlineRadioProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  error?: string;
}

export function FormInlineRadio({
  label, options, value, onChange, required, error,
}: InlineRadioProps) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <div className="flex flex-wrap gap-6">
        {options.map((opt, i) => (
          <label key={i} className="flex cursor-pointer items-center gap-2 text-body-sm text-content">
            <input
              type="radio"
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="h-[18px] w-[18px] accent-brand-primary"
            />
            {opt.label}
          </label>
        ))}
      </div>
      <FieldError error={error} />
    </div>
  );
}

interface CheckboxGroupProps {
  label: string;
  options: { value: string; label: string }[];
  value: string[];
  onChange: (val: string[]) => void;
  required?: boolean;
  error?: string;
}

export function FormCheckboxGroup({
  label, options, value, onChange, required, error,
}: CheckboxGroupProps) {
  const toggle = (optValue: string) => {
    onChange(value.includes(optValue) ? value.filter((v) => v !== optValue) : [...value, optValue]);
  };

  return (
    <div>
      <FieldLabel label={label} required={required} />
      <div className="flex flex-col gap-2.5">
        {options.map((opt, i) => (
          <label key={i} className="flex cursor-pointer items-center gap-2.5 text-body-sm text-content">
            <input
              type="checkbox"
              checked={value.includes(opt.value)}
              onChange={() => toggle(opt.value)}
              className="h-4 w-4 shrink-0 accent-brand-primary"
            />
            {opt.label}
          </label>
        ))}
      </div>
      <FieldError error={error} />
    </div>
  );
}

interface DateTripletValue {
  day: string;
  month: string;
  year: string;
}

interface DateTripletProps {
  label: string;
  value: DateTripletValue;
  onChange: (val: DateTripletValue) => void;
  required?: boolean;
  error?: string;
}

const DATE_PARTS = [
  { key: "day", placeholder: "Día", length: 2 },
  { key: "month", placeholder: "Mes", length: 2 },
  { key: "year", placeholder: "Año", length: 4 },
] as const;

export function FormDateTriplet({
  label, value, onChange, required, error,
}: DateTripletProps) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <div className="grid grid-cols-3 gap-3">
        {DATE_PARTS.map((part) => (
          <input
            key={part.key}
            type="text"
            inputMode="numeric"
            placeholder={part.placeholder}
            value={value[part.key]}
            onChange={(e) =>
              onChange({ ...value, [part.key]: e.target.value.replace(/\D/g, "").slice(0, part.length) })
            }
            className={inputClass(error, "text-center")}
          />
        ))}
      </div>
      <FieldError error={error} />
    </div>
  );
}
