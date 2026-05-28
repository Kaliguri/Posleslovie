"use client";

import { useEffect, useState } from "react";

import { assetPath } from "@/shared/lib/asset-path";
import { useInfiniteCarousel } from "@/widgets/shared/use-infinite-carousel";

type GallerySlide = { image: string; alt: string };

export function HeroSection({
  onOrder,
  onOpenHowWeMakeVideo,
  heading,
  leadLine1,
  leadLine2,
  ctaLabel,
  backgroundMediaType,
  backgroundImage,
  backgroundVideo,
  withOverlay,
}: Readonly<{
  onOrder: () => void;
  onOpenHowWeMakeVideo: () => void;
  heading: string;
  leadLine1: string;
  leadLine2: string;
  ctaLabel: string;
  backgroundMediaType: "image" | "video";
  backgroundImage: string;
  backgroundVideo: string;
  withOverlay: boolean;
}>) {
  const [isVideoReady, setIsVideoReady] = useState(backgroundMediaType !== "video");

  return (
    <section className="relative min-h-[560px] overflow-hidden bg-[#102038] sm:min-h-[720px] lg:min-h-[1080px]">
      <img
        src={backgroundImage}
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full scale-[1.06] object-cover object-[52%_center] sm:scale-[1.04] sm:object-center"
      />
      {backgroundMediaType === "video" && backgroundVideo ? (
        <video
          className={`absolute inset-0 h-full w-full scale-[1.04] object-cover object-center transition-opacity duration-500 ${
            isVideoReady ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={backgroundImage}
          aria-hidden="true"
          onLoadedData={() => setIsVideoReady(true)}
          onCanPlay={() => setIsVideoReady(true)}
        >
          <source src={backgroundVideo} type="video/webm" />
        </video>
      ) : null}
      {withOverlay ? <div className="absolute inset-0 bg-black/55 sm:bg-black/25" /> : null}
      <div className="absolute left-1/2 top-[265px] hidden h-[572px] w-[64.3vw] max-w-[1234px] -translate-x-1/2 rounded-[385px] bg-black/[0.01] backdrop-blur-[5px] lg:block" />
      <div className="relative mx-auto flex max-w-[1720px] justify-center px-5 pb-14 pt-28 text-center sm:px-5 sm:pt-48 lg:justify-start lg:px-[100px] lg:pt-[331px] lg:text-left">
        <div className="max-w-[1234px] origin-top scale-[0.96] transform-gpu lg:origin-top-left lg:max-w-[860px] lg:scale-[0.97]">
          <h1 className="text-[34px] font-normal leading-[0.97] text-white [font-family:var(--font-educational)] min-[390px]:text-[40px] sm:text-7xl lg:text-[126px]">
            <span className="whitespace-nowrap">Послесловие&nbsp;к</span>
            <br />
            {heading}
          </h1>
          <p className="mx-auto mt-4 max-w-[320px] text-[14px] font-medium leading-[1.5] text-[#dfdfdf] sm:mt-6 sm:max-w-[560px] sm:text-xl lg:mx-0 lg:max-w-[860px] lg:text-[25px]">
            <span className="block">{leadLine1}</span>
            <span className="block">{leadLine2}</span>
          </p>
          <div className="mt-8 flex flex-col items-center gap-12 sm:mt-16 sm:flex-row sm:justify-center lg:items-start lg:justify-start">
            <DesignButton size="xl" variant="filled" onClick={onOrder}>
              {ctaLabel}
            </DesignButton>
            <button
              type="button"
              onClick={onOpenHowWeMakeVideo}
              className="group inline-flex items-center gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c880] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <img
                src={assetPath("/images/icons/how-we-make-play.png")}
                alt=""
                aria-hidden="true"
                className="h-12 w-12 shrink-0 transition-transform duration-200 group-hover:scale-110 sm:h-14 sm:w-14 lg:h-16 lg:w-16"
              />
              <span className="w-[220px] text-[16px] font-normal leading-none text-white sm:w-[250px] sm:text-[18px] lg:w-[285px] lg:text-[24px]">
                Как мы делаем бомбочки для ванн?
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HeroVideoModal({
  open,
  src,
  title,
  withOverlay,
  onClose,
}: Readonly<{
  open: boolean;
  src: string;
  title: string;
  withOverlay: boolean;
  onClose: () => void;
}>) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-3 py-3 sm:px-6 sm:py-6 ${
        withOverlay ? "bg-black/60 backdrop-blur-sm" : "bg-black/40"
      }`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-[1400px] overflow-hidden rounded-[22px] bg-[#0b1321] shadow-2xl sm:rounded-[36px] lg:rounded-[50px]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/70 text-white transition hover:border-white hover:bg-white/10 sm:right-5 sm:top-5 sm:h-12 sm:w-12"
        >
          <CrossIcon />
        </button>
        <div className="grid">
          <div className="flex items-center gap-3 px-5 pb-4 pt-5 text-white sm:px-8 sm:pb-6 sm:pt-7">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <PlayIcon color="white" />
            </span>
            <p className="text-sm font-bold sm:text-base">{title}</p>
          </div>
          <div className="h-[62vh] w-full bg-black sm:h-[68vh] lg:h-[75vh]">
            <video src={src} controls autoPlay className="h-full w-full object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayIcon({ color = "currentColor" }: Readonly<{ color?: string }>) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M9 18V6l12 6-12 6Z" fill={color} />
    </svg>
  );
}

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
      className="relative bg-[#f8f8f8] px-3 py-6 sm:px-5 sm:py-12 lg:px-[100px] lg:py-[100px]"
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

        <div className="relative grid items-center gap-6 p-3 sm:gap-10 sm:p-8 lg:min-h-[665px] lg:grid-cols-[525px_552px] lg:items-start lg:gap-16 lg:p-12">
          <ProductGallery reverse={reverse} slides={slides} />

          <div className={reverse ? "lg:order-1" : ""}>
            <div className="max-w-[552px]">
              <SectionKicker>{eyebrow}</SectionKicker>
              <h2 className="mt-2 text-[26px] font-extrabold leading-[1.12] sm:text-4xl lg:text-[40px] xl:text-5xl">
                {title}
              </h2>
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
                      className="inline-flex items-center justify-center gap-4 rounded-full border-2 border-[#e8c880] px-5 py-3 text-base font-bold tracking-[0.5px] text-[#e8c880] transition hover:bg-[#e8c880] hover:text-[#0f172a] sm:px-6 lg:text-xl xl:text-2xl"
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
    <div className={`${reverse ? "lg:order-2 lg:justify-self-end" : ""}`}>
      <div className="relative">
        <TapeImageCarousel
          slides={orderedItems}
          offset={offset}
          isTransitioning={isTransitioning}
          transitionDuration={transitionDuration}
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
}: Readonly<{
  slides: GallerySlide[];
  offset: number;
  isTransitioning: boolean;
  transitionDuration: number;
}>) {
  return (
    <div className="mx-auto aspect-square w-full max-w-[525px] overflow-hidden rounded-[24px] bg-[#f8f8f8] sm:rounded-[32px] lg:h-[525px] lg:w-[525px] lg:rounded-[50px]">
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

export function WhyUsSection({
  kicker,
  title,
  backgroundImage,
  useBackgroundOverlay,
  reasons,
}: Readonly<{
  kicker: string;
  title: string;
  backgroundImage: string;
  useBackgroundOverlay: boolean;
  reasons: { title: string; description: string; icon: string }[];
}>) {
  return (
    <section
      data-scroll-pop
      className="relative overflow-hidden bg-cover bg-center px-4 py-12 text-white sm:px-5 sm:py-16 lg:px-[235px] lg:py-20"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {useBackgroundOverlay ? (
        <div className="absolute inset-0 bg-black/35 sm:bg-white/10" />
      ) : null}
      <div className="relative mx-auto max-w-[1456px]">
        <SectionHeading kicker={kicker} title={title} centered light typewriter />
        <div className="mt-8 grid gap-7 sm:mt-12 lg:grid-cols-3 lg:gap-24">
          {reasons.map((reason) => (
            <article key={reason.title} className="text-center">
              <IconImage src={reason.icon} />
              <h3 className="mt-4 text-xl font-bold leading-[1.1] sm:text-2xl">{reason.title}</h3>
              <p className="mx-auto mt-2 max-w-[280px] text-[15px] leading-[1.6] [font-family:var(--font-inter)] sm:text-lg lg:text-xl">
                {reason.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutSection({
  kicker,
  title,
  paragraphs,
  image,
}: Readonly<{
  kicker: string;
  title: string;
  paragraphs: string[];
  image: string;
}>) {
  return (
    <section
      id="about"
      data-scroll-pop
      className="bg-[#f8f8f8] px-3 py-6 sm:px-5 sm:py-12 lg:px-[100px] lg:py-[100px]"
    >
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[28px] bg-white sm:rounded-[42px] lg:rounded-[70px]">
        <div className="pointer-events-none absolute inset-0 hidden grid-cols-[1fr_323px] lg:grid">
          <div />
          <div className="bg-white mix-blend-lighten" />
        </div>
        <div className="relative grid items-center gap-6 p-3 sm:gap-10 sm:p-8 lg:min-h-[665px] lg:grid-cols-2 lg:items-start lg:gap-16 lg:p-12">
          <div className="max-w-[552px]">
            <SectionKicker>{kicker}</SectionKicker>
            <h2 className="mt-2 text-[26px] font-extrabold leading-[1.12] sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            <GoldRule />
            <div className="mt-4 space-y-3 text-[15px] leading-7 [font-family:var(--font-inter)] sm:mt-5 sm:space-y-6 sm:text-base sm:leading-8 lg:text-xl lg:leading-[1.8]">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
          <ZoomImage
            image={image}
            label="Бомбочки Послесловие"
            className="mx-auto aspect-square w-full max-w-[525px] rounded-[24px] sm:rounded-[32px] lg:h-[525px] lg:w-[525px] lg:rounded-[50px]"
          />
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection({
  kicker,
  title,
  reviews,
  starRowImage,
}: Readonly<{
  kicker: string;
  title: string;
  reviews: { name: string; image: string; text: string }[];
  starRowImage: string;
}>) {
  const { orderedItems, offset, isTransitioning, transitionDuration, move } =
    useInfiniteCarousel(reviews);

  return (
    <section
      id="reviews"
      data-scroll-pop
      className="overflow-hidden bg-[#f8f8f8] px-3 py-12 sm:px-5 sm:py-16 lg:px-[100px] lg:py-20"
    >
      <div className="mx-auto max-w-[1280px]">
        <SectionHeading kicker={kicker} title={title} centered />
        <div className="mt-8 overflow-hidden [--carousel-gap:1rem] [--carousel-step:calc(100%_+_var(--carousel-gap))] sm:mt-14 sm:[--carousel-gap:2rem] lg:[--carousel-gap:3rem] lg:[--carousel-step:calc((100%_-_var(--carousel-gap)*2)/3_+_var(--carousel-gap))]">
          <div
            className={`flex gap-[var(--carousel-gap)] ${isTransitioning ? "transition-transform ease-out" : ""}`}
            style={{
              transform:
                offset === 0 ? "translateX(0)" : "translateX(calc(-1 * var(--carousel-step)))",
              transitionDuration: isTransitioning ? `${transitionDuration}ms` : undefined,
            }}
          >
            {orderedItems.map((review) => (
              <article
                key={review.name}
                className="group flex min-h-[470px] w-full shrink-0 basis-full flex-col justify-between rounded-[18px] bg-white p-4 transition duration-300 hover:-translate-y-2 hover:shadow-[0_18px_50px_rgba(15,23,42,0.14)] sm:min-h-[560px] sm:p-8 lg:min-h-[600px] lg:basis-[calc((100%_-_var(--carousel-gap)*2)/3)]"
              >
                <div>
                  <ZoomImage
                    image={review.image}
                    label=""
                    className="h-[170px] rounded-[20px] sm:h-[220px]"
                    zoom={false}
                  />
                  <div
                    aria-label="5 звезд"
                    className="mt-5 h-[21px] w-[131px] bg-contain bg-left bg-no-repeat"
                    style={{ backgroundImage: `url(${starRowImage})` }}
                  />
                  <p className="mt-4 text-sm leading-[1.55] [font-family:var(--font-inter)] sm:text-base lg:text-lg">
                    {review.text}
                  </p>
                </div>
                <p className="mt-8 font-medium">{review.name}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-8 flex justify-center gap-4 sm:justify-start">
          <ArrowButton direction="left" onClick={() => move(-1)} />
          <ArrowButton direction="right" onClick={() => move(1)} />
        </div>
      </div>
    </section>
  );
}

export function CtaSection({
  onOrder,
  heading,
  text,
  buttonLabel,
  backgroundImage,
}: Readonly<{
  onOrder: () => void;
  heading: string;
  text: string;
  buttonLabel: string;
  backgroundImage: string;
}>) {
  return (
    <section
      data-scroll-pop
      className="relative overflow-hidden bg-[#c1aeff] bg-cover bg-center px-4 py-14 text-center text-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] sm:px-5 sm:py-20 lg:px-[100px] lg:py-20"
      style={{
        backgroundImage: `linear-gradient(0deg, rgba(14,17,50,0.3), rgba(14,17,50,0.3)), url(${backgroundImage})`,
      }}
    >
      <div className="relative mx-auto flex max-w-[1200px] flex-col items-center">
        <h2 className="max-w-[760px] text-[26px] font-extrabold leading-[1.12] sm:text-4xl lg:text-5xl">
          {heading}
        </h2>
        <p className="mt-4 max-w-[540px] text-base font-light leading-[1.55] sm:text-2xl">{text}</p>
        <div className="mt-8">
          <DesignButton size="xl" onClick={onOrder}>
            {buttonLabel}
          </DesignButton>
        </div>
      </div>
    </section>
  );
}

export function FeatureCardsSection({
  sectionTitle,
  cards,
}: Readonly<{
  sectionTitle: string;
  cards: { title: string; description: string; icon: string }[];
}>) {
  return (
    <section
      id="bombs"
      data-scroll-pop
      className="px-3 py-10 sm:px-5 sm:py-16 lg:px-[100px] lg:py-[100px]"
    >
      <div className="mx-auto max-w-[1280px] rounded-[28px] bg-white px-4 py-10 sm:rounded-[48px] sm:px-6 sm:py-14 lg:min-h-[750px] lg:rounded-[100px] lg:px-20 lg:py-20">
        <div className="mx-auto max-w-[780px] text-center">
          <h2 className="text-[26px] font-extrabold leading-[1.12] sm:text-4xl lg:text-5xl">{sectionTitle}</h2>
          <GoldRule centered />
        </div>
        <div className="mt-8 grid gap-6 sm:mt-14 lg:grid-cols-3 lg:gap-16">
          {cards.map((card) => (
            <article
              key={card.title}
              className="group rounded-[18px] px-3 py-3 text-center transition duration-300 hover:-translate-y-2 hover:bg-[#f8f8f8] hover:shadow-[0_4px_9px_rgba(0,0,0,0.15)] sm:rounded-[10px] sm:px-4 sm:py-3"
            >
              <div
                aria-hidden="true"
                className="mx-auto h-14 w-14 bg-contain bg-center bg-no-repeat sm:h-16 sm:w-16"
                style={{ backgroundImage: `url(${card.icon})` }}
              />
              <h3 className="mt-3 text-xl font-bold leading-[1.1] sm:mt-4 sm:text-2xl">{card.title}</h3>
              <p className="mt-2 text-[15px] leading-7 [font-family:var(--font-inter)] sm:mt-4 sm:text-base sm:leading-8 lg:text-xl lg:leading-[1.8]">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DecorativeObject({ image, className }: Readonly<{ image: string; className: string }>) {
  return (
    <img
      src={image}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none hidden object-contain lg:block ${className}`}
    />
  );
}

function SectionHeading({
  kicker,
  title,
  centered = false,
  light = false,
  typewriter = false,
}: Readonly<{
  kicker?: string;
  title: string;
  centered?: boolean;
  light?: boolean;
  typewriter?: boolean;
}>) {
  return (
    <div className={`${centered ? "mx-auto text-center" : ""} max-w-[780px]`}>
      {kicker ? <SectionKicker>{kicker}</SectionKicker> : null}
      <h2
        data-typewriter={typewriter ? true : undefined}
        className={`text-[26px] font-extrabold leading-[1.12] sm:text-4xl lg:text-5xl ${
          light ? "text-white" : "text-[#0f172a]"
        }`}
      >
        {title}
      </h2>
      <GoldRule centered={centered} />
    </div>
  );
}

function SectionKicker({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <p className="text-xs font-bold uppercase tracking-[2px] text-[#e8c880] sm:text-base sm:tracking-[3px] lg:text-lg xl:text-xl">
      {children}
    </p>
  );
}

function GoldRule({ centered = false }: Readonly<{ centered?: boolean }>) {
  return (
    <div
      aria-hidden="true"
      className={`mt-4 flex w-full max-w-[700px] items-center sm:mt-6 ${centered ? "mx-auto" : ""}`}
    >
      <span className="h-2 w-2 shrink-0 rotate-45 bg-[#e8c880]" />
      <span className="h-px flex-1 bg-[#e8c880]" />
      <span className="h-2 w-2 shrink-0 rotate-45 bg-[#e8c880]" />
    </div>
  );
}

function IconImage({ src, light = false }: Readonly<{ src: string; light?: boolean }>) {
  return (
    <div
      aria-hidden="true"
      className={`mx-auto h-14 w-14 bg-contain bg-center bg-no-repeat sm:h-16 sm:w-16 ${light ? "brightness-0 invert" : ""}`}
      style={{ backgroundImage: `url(${src})` }}
    />
  );
}

function ZoomImage({
  image,
  label,
  className,
  zoom = true,
}: Readonly<{ image: string; label: string; className: string; zoom?: boolean }>) {
  return (
    <div
      aria-label={label || undefined}
      role={label ? "img" : undefined}
      className={`overflow-hidden bg-[#f8f8f8] ${zoom ? "zoom-frame" : ""} ${className}`}
    >
      <div
        className={`h-full w-full bg-cover bg-center ${zoom ? "zoom-media" : ""}`}
        style={{ backgroundImage: `url(${image})` }}
      />
    </div>
  );
}

function DesignButton({
  children,
  onClick,
  size = "md",
  variant = "outline",
}: Readonly<{
  children: React.ReactNode;
  onClick: () => void;
  size?: "md" | "xl";
  variant?: "outline" | "filled";
}>) {
  const isFilled = variant === "filled";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-4 rounded-full border-2 border-[#e8c880] font-bold tracking-[0.5px] transition ${
        isFilled
          ? "bg-[#e8c880] text-[#0f172a] hover:bg-[#ffecbf]"
          : "text-[#e8c880] hover:bg-[#e8c880] hover:text-[#0f172a]"
      } ${
        size === "xl"
          ? "px-5 py-3.5 text-lg sm:px-7 sm:py-4 sm:text-2xl lg:text-[26.7px]"
          : "px-5 py-3 text-base sm:px-6 lg:text-xl xl:text-2xl"
      }`}
    >
      {children}
      <ArrowIcon />
    </button>
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

export function ScrollTopButton({ visible }: Readonly<{ visible: boolean }>) {
  return (
    <button
      type="button"
      aria-label="Наверх"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#e8c880] text-[#0f172a] shadow-lg transition sm:bottom-6 sm:right-6 sm:h-[60px] sm:w-[60px] ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <span className="-rotate-90">
        <ArrowIcon size={30} />
      </span>
    </button>
  );
}

function ArrowIcon({ size = 24 }: Readonly<{ size?: number }>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
