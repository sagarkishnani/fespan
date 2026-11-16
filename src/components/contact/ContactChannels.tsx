import { useTina, tinaField } from "tinacms/dist/react";
import { tField } from "../../utils/i18n";
import type { TinaSectionProps } from "../../lib/tinaProps";

const CHANNEL_ICONS: Record<string, string> = {
  pin: "/images/iconos/ubicacion.svg",
  phone: "/images/iconos/telefono.svg",
  mail: "/images/iconos/correo.svg",
};

function channelHref(icon: string, text: string): string | undefined {
  if (icon === "phone") return `tel:${text.replace(/[^\d+]/g, "")}`;
  if (icon === "mail") return `mailto:${text.trim()}`;
  return undefined;
}

export default function ContactChannels({ query, variables, data: initialData, locale }: TinaSectionProps) {
  const { data } = useTina({ query, variables, data: initialData });
  const channels = (data?.contactPage?.channels || []).filter(Boolean);

  return (
    <div className="flex flex-col gap-4">
      {channels.map((channel: any, i: number) => {
        const text = tField(channel, "text", locale);
        const href = channelHref(channel.icon, text);
        return (
          <div key={i} data-reveal>
            <div className="flex items-start gap-[22px] rounded-3xl border border-line p-7 transition-[border-color,transform] duration-300 hover:translate-x-1 hover:border-brand-primary">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[18px] bg-surface-mint">
                {CHANNEL_ICONS[channel.icon] && <img src={CHANNEL_ICONS[channel.icon]} alt="" className="h-[26px] w-[26px]" loading="lazy" />}
              </span>
              <div className="min-w-0">
                <div className="text-subtitle-sm" data-tina-field={tinaField(channel, "title")}>{tField(channel, "title", locale)}</div>
                <div className="mt-2 whitespace-pre-line break-words text-body-base leading-relaxed text-content-muted" data-tina-field={tinaField(channel, "text")}>
                  {href ? <a href={href} className="hover:text-brand-primary">{text}</a> : text}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
