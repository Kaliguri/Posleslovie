"use client";

import { useRef } from "react";

import { ArrowIcon } from "@/shared/ui/ArrowIcon";
import { DesignButton } from "@/shared/ui/DesignButton";
import { SectionKicker } from "@/shared/ui/SectionKicker";
import { useInfiniteCarousel } from "@/widgets/shared/use-infinite-carousel";

type GallerySlide = { image: string; alt: string };

export function ProcessSection({
  eyebrow,
  title,
  description,
  reverse,
  slides,
  button,
  buttonHref,
  onOrder,
  index,
  crystalImage,
  peroImage,
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  reverse: boolean;
  slides: GallerySlide[];
  button?: string;
  buttonHref?: string;
  onOrder: () => void;
  index: number;
  crystalImage: string;
  peroImage: string;
}>) {
  return (
    <section
      data-scroll-pop
      className="relative bg-[#f8f8f8] px-3 py-3 sm:px-5 sm:py-6 lg:px-10 lg:py-10 xl:px-[100px] xl:py-[56px]"
    >
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[28px] bg-white shadow-none sm:rounded-[42px] xl:rounded-[70px]">
        <div
          className={`pointer-events-none absolute inset-0 hidden xl:grid ${
            reverse ? "grid-cols-[1fr_323px]" : "grid-cols-[323px_1fr]"
          }`}
        >
          <div className={`bg-white mix-blend-lighten ${reverse ? "order-2" : ""}`} />
          <div className="bg-white" />
        </div>
        {index === 0 ? (
          <DecorativeObject
            image={crystalImage}
            className="absolute bottom-[64px] right-[55px] z-10 h-[225px] w-[199px] opacity-90"
          />
        ) : null}
        {index === 2 ? (
          <DecorativeObject
            image={peroImage}
            className="absolute bottom-[80px] right-[60px] z-10 h-[152px] w-[266px] opacity-75"
          />
        ) : null}

        <div className="relative grid items-start gap-6 p-3 sm:gap-10 sm:p-8 md:min-h-[500px] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10 lg:p-10 xl:min-h-0 xl:grid-cols-[525px_552px] xl:gap-16 xl:p-12">
          <div data-reveal-child className={reverse ? "md:order-1" : "md:order-2"}>
            <div className="max-w-[552px] md:w-full">
              <SectionKicker>{eyebrow}</SectionKicker>
              <h2 className="text-h2 mt-2 font-extrabold lg:text-[40px] xl:text-5xl">{title}</h2>
              <p className="mt-4 text-[15px] leading-7 [font-family:var(--font-inter)] sm:text-base sm:leading-8 lg:text-lg lg:leading-[1.8] xl:text-xl">
                {description}
              </p>
              {button ? (
                <div className="mt-6 sm:mt-8 md:mt-7 xl:mt-16">
                  {buttonHref ? (
                    <a
                      href={buttonHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-base sm:px-6 lg:text-base xl:text-2xl"
                    >
                      {button}
                      <ArrowIcon />
                    </a>
                  ) : (
                    <DesignButton onClick={onOrder}>{button}</DesignButton>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <ProductGallery reverse={reverse} slides={slides} enableCarousel={index !== 2} />
        </div>
      </div>
    </section>
  );
}

function ProductGallery({
  reverse,
  slides,
  enableCarousel,
}: Readonly<{
  reverse: boolean;
  slides: readonly GallerySlide[];
  enableCarousel: boolean;
}>) {
  const { orderedItems, offset, isTransitioning, transitionDuration, move } =
    useInfiniteCarousel(slides);
  const primarySlide = slides[0];

  return (
    <div
      data-reveal-child
      className={`md:w-full ${reverse ? "md:order-2 xl:justify-self-end" : "md:order-1"}`}
      aria-label="Галерея"
    >
      <div className="relative w-full">
        {enableCarousel ? (
          <>
            <TapeImageCarousel
              slides={orderedItems}
              offset={offset}
              isTransitioning={isTransitioning}
              transitionDuration={transitionDuration}
              onSwipe={(direction) => move(direction === "left" ? 1 : -1)}
            />
            <div
              className={`mt-4 flex justify-center gap-4 ${
                reverse ? "md:justify-end" : "md:justify-start"
              }`}
            >
              <ArrowButton direction="left" onClick={() => move(-1)} />
              <ArrowButton direction="right" onClick={() => move(1)} />
            </div>
          </>
        ) : (
          <TapeImageCarousel
            slides={primarySlide ? [primarySlide] : []}
            offset={0}
            isTransitioning={false}
            transitionDuration={0}
          />
        )}
      </div>
    </div>
  );
}

function TapeImageCarousel({
  slides,
  offset,
  isTransitioning,
  transitionDuration,
  onSwipe,
}: Readonly<{
  slides: GallerySlide[];
  offset: number;
  isTransitioning: boolean;
  transitionDuration: number;
  onSwipe?: (direction: "left" | "right") => void;
}>) {
  const touchRef = useRef<{
    x: number;
    y: number;
    active: boolean;
  } | null>(null);

  return (
    <div
      className="mx-auto aspect-square w-full max-w-[525px] overflow-hidden rounded-[24px] bg-[#f8f8f8] sm:rounded-[32px] xl:h-[525px] xl:w-[525px] xl:rounded-[50px]"
      onTouchStart={(event) => {
        const touch = event.touches[0];
        if (!touch) return;
        touchRef.current = { x: touch.clientX, y: touch.clientY, active: true };
      }}
      onTouchEnd={(event) => {
        const touch = event.changedTouches[0];
        const start = touchRef.current;
        touchRef.current = null;
        if (!onSwipe || !touch || !start?.active) return;

        const dx = touch.clientX - start.x;
        const dy = touch.clientY - start.y;
        if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;

        onSwipe(dx < 0 ? "left" : "right");
      }}
    >
      <div
        className={`flex h-full ${isTransitioning ? "transition-transform ease-out" : ""}`}
        style={{
          transform: `translateX(${offset * 100}%)`,
          transitionDuration: isTransitioning ? `${transitionDuration}ms` : undefined,
        }}
      >
        {slides.map((slide) => (
          <div key={slide.image} className="zoom-frame h-full w-full shrink-0 overflow-hidden">
            <div
              aria-label={slide.alt}
              role="img"
              className="zoom-media h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function DecorativeObject({ image, className }: Readonly<{ image: string; className: string }>) {
  return (
    <img
      src={image}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none hidden object-contain xl:block ${className}`}
    />
  );
}

function ArrowButton({
  direction,
  onClick,
}: Readonly<{ direction: "left" | "right"; onClick: () => void }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Предыдущий слайд" : "Следующий слайд"}
      className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#e8c880] text-[#e8c880] transition hover:bg-[#e8c880] hover:text-[#0f172a] sm:h-12 sm:w-12"
    >
      <span className={direction === "left" ? "rotate-180" : ""}>
        <ArrowIcon />
      </span>
    </button>
  );
}
