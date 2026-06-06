"use client";

import { useRef } from "react";

import { ArrowIcon } from "@/shared/ui/ArrowIcon";
import { DesignButton } from "@/shared/ui/DesignButton";
import { GoldRule } from "@/shared/ui/GoldRule";
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
      className="relative bg-[#f8f8f8] px-3 py-3 sm:px-5 sm:py-6 lg:px-[100px] lg:py-[56px]"
    >
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[28px] bg-white shadow-none sm:rounded-[42px] lg:rounded-[70px]">
        <div
          className={`pointer-events-none absolute inset-0 hidden lg:grid ${
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

        <div className="relative grid items-center gap-6 p-3 sm:gap-10 sm:p-8 lg:grid-cols-[525px_552px] lg:items-start lg:gap-16 lg:p-12">
          <div className={reverse ? "lg:order-1" : "lg:order-2"}>
            <div className="max-w-[552px]">
              <SectionKicker>{eyebrow}</SectionKicker>
              <h2 className="text-h2 mt-2 font-extrabold lg:text-[40px] xl:text-5xl">{title}</h2>
              <GoldRule />
              <p className="mt-4 text-[15px] leading-7 [font-family:var(--font-inter)] sm:text-base sm:leading-8 lg:text-lg lg:leading-[1.8] xl:text-xl">
                {description}
              </p>
              {button ? (
                <div className="mt-8 lg:mt-16">
                  {buttonHref ? (
                    <a
                      href={buttonHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-base sm:px-6 lg:text-xl xl:text-2xl"
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

          <ProductGallery reverse={reverse} slides={slides} />
        </div>
      </div>
    </section>
  );
}

function ProductGallery({
  reverse,
  slides,
}: Readonly<{
  reverse: boolean;
  slides: readonly GallerySlide[];
}>) {
  const { orderedItems, offset, isTransitioning, transitionDuration, move } =
    useInfiniteCarousel(slides);

  return (
    <div
      className={`${reverse ? "lg:order-2 lg:justify-self-end" : "lg:order-1"}`}
      aria-label="Галерея"
    >
      <div className="relative">
        <TapeImageCarousel
          slides={orderedItems}
          offset={offset}
          isTransitioning={isTransitioning}
          transitionDuration={transitionDuration}
          onSwipe={(direction) => move(direction === "left" ? 1 : -1)}
        />
        <div
          className={`mt-4 flex justify-center gap-4 ${reverse ? "lg:justify-end" : "lg:justify-start"}`}
        >
          <ArrowButton direction="left" onClick={() => move(-1)} />
          <ArrowButton direction="right" onClick={() => move(1)} />
        </div>
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
      className="mx-auto aspect-square w-full max-w-[525px] overflow-hidden rounded-[24px] bg-[#f8f8f8] sm:rounded-[32px] lg:h-[525px] lg:w-[525px] lg:rounded-[50px]"
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
    // eslint-disable-next-line @next/next/no-img-element -- decorative, position-driven sizing; next/image fill does not fit
    <img
      src={image}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none hidden object-contain lg:block ${className}`}
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
