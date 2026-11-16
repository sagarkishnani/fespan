import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function CalendarIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <rect x="1.5" y="2.5" width="13" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.5 6.5h13M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg width="18" height="20" viewBox="0 0 12 14" fill="none" aria-hidden="true" {...props}>
      <path d="M6 13S10.8 8.6 10.8 5.6A4.8 4.8 0 0 0 1.2 5.6C1.2 8.6 6 13 6 13Z" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="6" cy="5.6" r="1.7" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export function SolidPinIcon(props: IconProps) {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true" {...props}>
      <path d="M6 13.5S11 8.6 11 5.5A5 5 0 0 0 1 5.5C1 8.6 6 13.5 6 13.5Z" fill="currentColor" />
      <circle cx="6" cy="5.5" r="1.8" className="fill-white" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="m14 14 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" {...props}>
      <path d="m3 5 4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M4 12H20M13 19L20 12L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 4v11M7 10.5 12 15.5 17 10.5M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg width="17" height="17" viewBox="10 10 20 20" aria-hidden="true" {...props}>
      <path d="M28.0259 28.2815L28.0302 28.2807V21.924C28.0302 18.8142 27.3621 16.4187 23.7342 16.4187C21.9901 16.4187 20.8197 17.3778 20.3419 18.287H20.2914V16.709H16.8516V28.2807H20.4334V22.5509C20.4334 21.0422 20.7188 19.5834 22.5832 19.5834C24.4203 19.5834 24.4477 21.3051 24.4477 22.6476V28.2815H28.0259Z" fill="currentColor" />
      <path d="M11.0186 16.7095H14.6047V28.2812H11.0186V16.7095Z" fill="currentColor" />
      <circle cx="12.81" cy="13.04" r="2.08" fill="currentColor" />
    </svg>
  );
}

export function XLogoIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path d="M1 1h4l10 14h-4zM15 1 9.6 7M1 15l5.4-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg width="10" height="18" viewBox="0 0 10 18" aria-hidden="true" {...props}>
      <path d="M6.5 18V10h2.7l.4-3.1H6.5V4.9c0-.9.3-1.5 1.6-1.5H9.7V.6C9.4.6 8.4.5 7.3.5 4.9.5 3.3 1.9 3.3 4.6v2.3H.6V10h2.7v8h3.2Z" fill="currentColor" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" {...props}>
      <rect x="1.5" y="1.5" width="15" height="15" rx="4.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9" cy="9" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="13.3" cy="4.7" r="1" fill="currentColor" />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <rect x="5" y="5" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M11 3V2.5A1.5 1.5 0 0 0 9.5 1h-7A1.5 1.5 0 0 0 1 2.5v7A1.5 1.5 0 0 0 2.5 11H3" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path d="M2 2l12 12M14 2 2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" {...props}>
      <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
