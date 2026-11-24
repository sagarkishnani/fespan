import americaMap from "../../data/america-map.json";
import { COUNTRY_PINS } from "../../data/countryPins";
import { SolidPinIcon } from "../shared/icons";
import type { SocietyModel } from "./MembersDirectory";

const VIEW_X = 100;
const VIEW_Y = 20;
const VIEW_WIDTH = 280;
const VIEW_HEIGHT = 430;
const TOOLTIP_WIDTH = "min(300px, 70vw)";
const TOOLTIP_ANCHOR = "36px";
const COUNTRY_PATHS = Object.entries(americaMap as Record<string, { d: string }>).map(([code, value]) => ({ code, d: value.d }));

interface Props {
  societies: SocietyModel[];
  visibleCodes: Set<string>;
  highlighted: string | null;
  showTooltip: boolean;
  onHover: (code: string | null) => void;
  onCountryClick: (code: string) => void;
  mapImage: string;
  mapAlt: string;
}

function percent(value: number, origin: number, size: number) {
  return `${((value - origin) / size) * 100}%`;
}

function MapTooltip({ society }: { society: SocietyModel }) {
  const pin = COUNTRY_PINS[society.countryCode];
  if (!pin) return null;
  return (
    <div
      className="pointer-events-none absolute -translate-x-[calc(100%-36px)] -translate-y-[calc(100%+22px)]"
      style={{ width: TOOLTIP_WIDTH, left: `clamp(${TOOLTIP_WIDTH} - ${TOOLTIP_ANCHOR}, ${percent(pin.x, VIEW_X, VIEW_WIDTH)}, 100% - ${TOOLTIP_ANCHOR})`, top: percent(pin.y, VIEW_Y, VIEW_HEIGHT) }}
    >
      <div className="animate-fade-up rounded-[18px] bg-surface px-5 py-4 shadow-[0_18px_40px_rgba(15,46,42,.16)] [text-wrap:balance]">
        <div className="text-[12px] font-medium uppercase tracking-[0.1em] text-brand-primary">{society.country}</div>
        <div className="mt-1 text-body-base font-medium">{society.name}</div>
        <div className="mt-1.5 flex items-center gap-1.5 text-caption-md text-content-muted">
          <SolidPinIcon className="text-brand-primary" />
          {society.city}
        </div>
      </div>
    </div>
  );
}

export default function MembersMap({ societies, visibleCodes, highlighted, showTooltip, onHover, onCountryClick, mapImage, mapAlt }: Props) {
  const bySociety = new Map(societies.map((society) => [society.countryCode, society]));
  const active = highlighted ? bySociety.get(highlighted) : undefined;
  const pin = active ? COUNTRY_PINS[active.countryCode] : undefined;

  return (
    <div className="relative mx-auto aspect-[520/799] w-full max-w-[520px]">
      <img src={mapImage} alt={mapAlt} className="pointer-events-none absolute inset-0 block h-full w-full" />
      <svg viewBox={`${VIEW_X} ${VIEW_Y} ${VIEW_WIDTH} ${VIEW_HEIGHT}`} className="absolute inset-0 block h-full w-full overflow-visible">
        {COUNTRY_PATHS.map((country) => (
          <path
            key={country.code}
            d={country.d}
            strokeWidth={0.35}
            strokeLinejoin="round"
            className={`cursor-pointer stroke-white transition-[fill] duration-300 ${
              highlighted === country.code
                ? "fill-brand-primary"
                : visibleCodes.has(country.code)
                ? "fill-brand-primary-light"
                : "fill-brand-primary-pale"
            }`}
            onMouseEnter={() => onHover(country.code)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onCountryClick(country.code)}
          />
        ))}
        {pin && (
          <g key={highlighted} transform={`translate(${pin.x} ${pin.y})`} className="pointer-events-none">
            <circle r={4} fill="rgba(14,35,39,.35)" className="origin-center animate-pulse-ring [transform-box:fill-box]" />
            <g className="animate-drop">
              <circle r={2.6} strokeWidth={1} className="fill-content stroke-white" />
            </g>
          </g>
        )}
      </svg>
      {showTooltip && active && <MapTooltip society={active} />}
    </div>
  );
}
