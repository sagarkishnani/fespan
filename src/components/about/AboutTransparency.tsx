import { useTina, tinaField } from "tinacms/dist/react";
import { tField } from "../../utils/i18n";
import { mediaUrl } from "../../utils/mediaUrl";
import { t } from "../../i18n/ui";
import { DownloadIcon } from "../shared/icons";
import { revealDelay, type TinaSectionProps } from "../../lib/tinaProps";

function AllyTile({ ally }: { ally: any }) {
  const content = ally.logo ? (
    <img src={mediaUrl(ally.logo)} alt={ally.name || ""} loading="lazy" className="max-h-12 max-w-[120px] object-contain md:max-h-16 md:max-w-[180px]" />
  ) : (
    <span>{ally.name}</span>
  );
  const className = `flex h-20 w-40 shrink-0 items-center justify-center rounded-xl bg-surface md:h-[120px] md:w-[260px] md:rounded-[20px] text-body-sm tracking-[0.06em] text-content-muted ${
    ally.logo ? "border border-line" : "border-[1.5px] border-dashed border-line-strong"
  }`;
  return ally.url ? (
    <a href={ally.url} target="_blank" rel="noopener noreferrer" className={className}>{content}</a>
  ) : (
    <div className={className}>{content}</div>
  );
}

export default function AboutTransparency({ query, variables, data: initialData, locale }: TinaSectionProps) {
  const { data } = useTina({ query, variables, data: initialData });
  const documents = data?.about?.documents;
  const allies = data?.about?.allies;
  const docItems = (documents?.items || []).filter(Boolean);
  const allyItems = (allies?.items || []).filter(Boolean);

  return (
    <section className="section overflow-hidden bg-surface-raised max-md:py-16">
      <div className="container-xl">
        {documents && (
          <>
            <p data-reveal className="eyebrow" data-tina-field={tinaField(documents, "eyebrow")}>{tField(documents, "eyebrow", locale)}</p>
            <h2 data-reveal style={revealDelay(100)} className="mb-12 text-heading-xl" data-tina-field={tinaField(documents, "title")}>
              {tField(documents, "title", locale)}
            </h2>
            <div className="border-t border-line">
              {docItems.map((doc: any, i: number) => (
                <div key={i} data-reveal className="flex flex-col gap-3 border-b border-line py-5 sm:flex-row md:py-7 sm:items-center sm:justify-between sm:gap-6">
                  <span className="text-subtitle-sm" data-tina-field={tinaField(doc, "title")}>{tField(doc, "title", locale)}</span>
                  {doc.file && (
                    <a href={mediaUrl(doc.file)} download className="flex shrink-0 items-center gap-2.5 text-body-base max-md:min-h-11 font-medium text-brand-primary hover:text-brand-primary-dark" data-tina-field={tinaField(doc, "file")}>
                      <DownloadIcon />
                      {t("common.downloadPdf", locale)}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        {allies && (
          <>
            <h3 data-reveal className="mt-14 text-heading-sm md:mt-24" data-tina-field={tinaField(allies, "title")}>{tField(allies, "title", locale)}</h3>
            <p data-reveal className="mb-9 mt-3 text-body-lg text-content-muted" data-tina-field={tinaField(allies, "text")}>{tField(allies, "text", locale)}</p>
          </>
        )}
      </div>
      {allyItems.length > 0 && (
        <div data-reveal className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-marquee gap-3 md:gap-6 hover:[animation-play-state:paused]">
            {[...allyItems, ...allyItems].map((ally: any, i: number) => (
              <AllyTile key={i} ally={ally} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
