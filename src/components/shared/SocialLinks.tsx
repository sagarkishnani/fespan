import type { ComponentType, SVGProps } from "react";
import { FaLinkedinIn, FaXTwitter, FaYoutube, FaTiktok, FaWhatsapp } from "react-icons/fa6";
import { FacebookIcon, InstagramIcon } from "./icons";

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

const SOCIAL_ICONS: Record<string, IconComponent> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: FaLinkedinIn as IconComponent,
  x: FaXTwitter as IconComponent,
  youtube: FaYoutube as IconComponent,
  tiktok: FaTiktok as IconComponent,
  whatsapp: FaWhatsapp as IconComponent,
};

export default function SocialLinks({ items }: { items: Array<{ network?: string | null; url?: string | null }> }) {
  const valid = items.filter((item) => item?.url && item.network && SOCIAL_ICONS[item.network]);
  return (
    <>
      {valid.map((item) => {
        const Icon = SOCIAL_ICONS[item.network!];
        return (
          <a
            key={item.url!}
            href={item.url!}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.network!}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-line text-content-muted transition-colors hover:bg-surface-mint hover:text-brand-primary"
          >
            <Icon size={16} />
          </a>
        );
      })}
    </>
  );
}
