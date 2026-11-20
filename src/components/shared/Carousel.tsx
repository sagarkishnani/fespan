import { Children, isValidElement, useEffect, useState, type FocusEvent, type ReactNode } from "react";
import { useSlider } from "../../hooks/useSlider";

const DESKTOP_QUERY = "(min-width: 1024px)";

interface CarouselProps {
  children: ReactNode;
  label: string;
  slideClassName: string;
  gridClassName: string;
}

function useIsDesktop(): boolean {
  const [desktop, setDesktop] = useState(true);
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return desktop;
}

export default function Carousel({ children, label, slideClassName, gridClassName }: CarouselProps) {
  const desktop = useIsDesktop();
  const slider = useSlider({ loop: false, align: "start", active: !desktop });
  const slides = Children.toArray(children);

  const showFocusedSlide = (event: FocusEvent<HTMLDivElement>) => {
    if (desktop) return;
    // Al enfocar una tarjeta oculta, el navegador mueve scrollLeft y lo desincroniza del transform de Embla.
    event.currentTarget.scrollLeft = 0;
    const slide = (event.target as HTMLElement).closest<HTMLElement>("[data-carousel-slide]");
    if (!slide) return;
    const lastSnap = Math.max(slider.scrollSnaps.length - 1, 0);
    slider.goTo(Math.min(Number(slide.dataset.carouselSlide), lastSnap));
  };

  return (
    <div
      ref={slider.viewportRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onFocus={showFocusedSlide}
      className="-mx-4 overflow-hidden px-4 md:-mx-6 md:px-6 lg:mx-0 lg:overflow-visible lg:px-0"
    >
      <div className={`flex gap-3 lg:grid ${gridClassName}`}>
        {slides.map((slide, index) => (
          <div
            key={isValidElement(slide) && slide.key !== null ? slide.key : index}
            data-carousel-slide={index}
            className={`shrink-0 ${slideClassName} lg:w-auto`}
          >
            {slide}
          </div>
        ))}
      </div>
    </div>
  );
}
