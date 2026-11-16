import { useEffect, useState } from "react";
import { useTina, tinaField } from "tinacms/dist/react";
import { tField } from "../../utils/i18n";
import { mediaUrl } from "../../utils/mediaUrl";
import { t } from "../../i18n/ui";
import { CloseIcon } from "../shared/icons";
import type { TinaSectionProps } from "../../lib/tinaProps";

function playMutedBackground(element: HTMLVideoElement | null) {
  if (!element) return;
  element.muted = true;
  element.play().catch(() => {});
}

function VideoModal({ src, closeLabel, onClose }: { src: string; closeLabel: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" onClick={onClose} className="fixed inset-0 z-[100] flex animate-fade-up items-center justify-center bg-[rgba(14,35,39,.9)] p-4 md:p-12">
      <div onClick={(event) => event.stopPropagation()} className="relative aspect-video w-full max-w-[1100px] overflow-hidden rounded-2xl bg-black shadow-[0_40px_100px_rgba(0,0,0,.4)]">
        <video src={src} controls autoPlay playsInline className="block h-full w-full bg-black object-contain" />
      </div>
      <button type="button" onClick={onClose} aria-label={closeLabel} className="absolute right-4 top-4 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30 md:right-7 md:top-7">
        <CloseIcon />
      </button>
    </div>
  );
}

export default function HomeVideo({ query, variables, data: initialData, locale }: TinaSectionProps) {
  const { data } = useTina({ query, variables, data: initialData });
  const video = data?.home?.video;
  const [open, setOpen] = useState(false);
  if (!video?.video) return <div hidden />;
  const src = mediaUrl(video.video);

  return (
    <section className="container-xl pt-20 lg:pt-[120px]">
      <div data-reveal className="relative h-[460px] overflow-hidden rounded-4xl bg-content lg:h-[560px] lg:rounded-5xl">
        <video
          ref={playMutedBackground}
          src={src}
          poster={mediaUrl(video.poster) || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,35,39,.85)_0%,rgba(14,35,39,.55)_50%,rgba(14,35,39,.15)_100%)]" />
        <div className="relative flex h-full flex-col justify-end p-8 lg:p-[72px]">
          <h2 className="max-w-[640px] text-heading-xl text-white" data-tina-field={tinaField(video, "title")}>
            {tField(video, "title", locale)}
          </h2>
          <div className="mt-10">
            <button type="button" onClick={() => setOpen(true)} className="btn-light" data-tina-field={tinaField(video, "buttonLabel")}>
              {tField(video, "buttonLabel", locale) || t("video.watch", locale)}
            </button>
          </div>
        </div>
      </div>
      {open && <VideoModal src={src} closeLabel={t("video.close", locale)} onClose={() => setOpen(false)} />}
    </section>
  );
}
