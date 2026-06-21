"use client";

import { useState } from "react";

import { usePrefersReducedMedia } from "@/shared/hooks/use-prefers-reduced-media";
import { DesignButton } from "@/shared/ui/DesignButton";

function HeroPlayIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" fill="white" />
      <path d="M27 21v22l18-11-18-11Z" fill="currentColor" />
    </svg>
  );
}

function HeroVideoButton({
  onClick,
  isStaticHeroImage,
  layout,
}: Readonly<{
  onClick: () => void;
  isStaticHeroImage: boolean;
  layout: "mobile" | "desktop";
}>) {
  const isMobile = layout === "mobile";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
        isMobile ? "gap-3" : "gap-4"
      } ${isStaticHeroImage ? "text-brand-navy" : "text-white"}`}
    >
      <HeroPlayIcon
        className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${
          isMobile ? "h-11 w-11" : "h-14 w-14 lg:h-16 lg:w-16"
        }`}
      />
      <span
        className={`text-left font-normal [font-family:var(--font-roboto)] ${
          isMobile ? "text-base leading-none" : "max-w-[285px] text-xl leading-none lg:text-2xl"
        }`}
      >
        Как мы делаем
        <br />
        бомбочки для ванн?
      </span>
    </button>
  );
}

function HeroHeading({
  heading,
  isStaticHeroImage,
  layout,
  className = "",
}: Readonly<{
  heading: string;
  isStaticHeroImage: boolean;
  layout: "mobile" | "desktop";
  className?: string;
}>) {
  return (
    <h1
      className={`font-normal [font-family:var(--font-educational)] ${
        isStaticHeroImage ? "hero-heading-stroke text-brand-navy" : "text-white"
      } ${className}`}
    >
      {heading === "Послесловие к вашему дню" ? (
        layout === "mobile" ? (
          <>
            Послесловие
            <br />к вашему дню
          </>
        ) : (
          <>
            Послесловие к
            <br />
            вашему дню
          </>
        )
      ) : (
        heading
      )}
    </h1>
  );
}

export function HeroSection({
  onOrder,
  onOpenHowWeMakeVideo,
  heading,
  leadLine1,
  leadLine2,
  ctaLabel,
  backgroundMediaType,
  backgroundImage,
  backgroundImageMobile,
  backgroundImageTablet,
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
  backgroundImageMobile?: string;
  backgroundImageTablet?: string;
  backgroundVideo: string;
  withOverlay: boolean;
}>) {
  const reduceMedia = usePrefersReducedMedia();
  const showVideo = backgroundMediaType === "video" && Boolean(backgroundVideo) && !reduceMedia;
  const isStaticHeroImage = !showVideo;
  const mobileBackground = backgroundImageMobile || backgroundImage;
  const tabletBackground = backgroundImageTablet || backgroundImage;
  const [isVideoReady, setIsVideoReady] = useState(!showVideo);

  return (
    <section
      id="hero"
      className={`relative min-h-[100dvh] overflow-hidden md:min-h-[100dvh] lg:min-h-[1080px] ${
        isStaticHeroImage ? "bg-white" : "bg-brand-navy"
      }`}
    >
      {isStaticHeroImage ? (
        <>
          <img
            src={mobileBackground}
            alt=""
            aria-hidden="true"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center md:hidden"
          />
          <img
            src={tabletBackground}
            alt=""
            aria-hidden="true"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 hidden h-full w-full object-cover object-center md:block lg:hidden"
          />
          <img
            src={backgroundImage}
            alt=""
            aria-hidden="true"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 hidden h-full w-full object-cover object-left lg:block"
          />
        </>
      ) : (
        <img
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full scale-[1.06] object-cover object-[52%_center] sm:scale-[1.04] sm:object-center"
        />
      )}
      {showVideo ? (
        <video
          className={`absolute inset-0 h-full w-full scale-[1.04] object-cover object-center transition-opacity duration-500 ${
            isVideoReady ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={backgroundImage}
          aria-hidden="true"
          onLoadedData={() => setIsVideoReady(true)}
          onCanPlay={() => setIsVideoReady(true)}
        >
          <source src={backgroundVideo} type="video/webm" />
        </video>
      ) : null}
      {withOverlay && showVideo ? (
        <div className="absolute inset-0 bg-black/55 sm:bg-black/25" />
      ) : null}

      {/* Mobile layout */}
      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1720px] flex-col px-5 pb-8 pt-[calc(76px+40px)] md:hidden">
        <HeroHeading
          heading={heading}
          isStaticHeroImage={isStaticHeroImage}
          layout="mobile"
          className="mx-auto text-center text-[46px] leading-[0.97]"
        />

        <div className="relative mt-8 min-h-[clamp(20rem,46vh,26rem)] flex-1">
          <p
            className={`absolute left-0 top-[4%] max-w-[160px] text-left text-sm font-extralight leading-[0.9] [font-family:var(--font-roboto)] ${
              isStaticHeroImage ? "text-brand-navy" : "text-[#dfdfdf]"
            }`}
          >
            {leadLine1}
          </p>
          <p
            className={`absolute -right-1 top-[calc(66%+2.5rem)] max-w-[118px] text-left text-sm font-extralight leading-[0.9] [font-family:var(--font-roboto)] ${
              isStaticHeroImage ? "text-white" : "text-[#dfdfdf]"
            }`}
          >
            {leadLine2 === "Внимание и забота к каждой минуте наедине с собой" ? (
              <>
                Внимание и забота
                <br />
                к каждой минуте
                <br />
                наедине с собой
              </>
            ) : (
              leadLine2
            )}
          </p>
        </div>

        <div className="mt-auto w-full px-5 pt-2">
          <HeroVideoButton
            onClick={onOpenHowWeMakeVideo}
            isStaticHeroImage={isStaticHeroImage}
            layout="mobile"
          />
          <DesignButton
            size="md"
            variant="filled"
            onClick={onOrder}
            className="mt-4 w-full justify-center gap-3 px-6 py-2.5 text-base"
          >
            {ctaLabel}
          </DesignButton>
        </div>
      </div>

      {/* Tablet + desktop layout */}
      <div className="relative mx-auto hidden min-h-[100dvh] max-w-[1720px] flex-col px-10 pb-14 pt-[calc(76px+5rem)] text-left md:flex lg:min-h-[1080px] lg:px-[100px] lg:pt-[331px]">
        <div className="max-w-[min(100%,28rem)] lg:max-w-[1000px]">
          <HeroHeading
            heading={heading}
            isStaticHeroImage={isStaticHeroImage}
            layout="desktop"
            className="text-display"
          />
          <p
            className={`text-body-lg mt-4 max-w-[860px] font-medium leading-[1.5] [font-family:var(--font-roboto)] lg:mt-6 ${
              isStaticHeroImage ? "text-brand-navy" : "text-[#dfdfdf]"
            }`}
          >
            <span className="block">{leadLine1}</span>
            <span className="block">{leadLine2}</span>
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6 lg:mt-16 lg:gap-10">
            <DesignButton size="xl" variant="filled" onClick={onOrder}>
              {ctaLabel}
            </DesignButton>
            <HeroVideoButton
              onClick={onOpenHowWeMakeVideo}
              isStaticHeroImage={isStaticHeroImage}
              layout="desktop"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
