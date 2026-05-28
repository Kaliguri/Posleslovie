"use client";

import { useState } from "react";

import { usePrefersReducedMedia } from "@/shared/hooks/use-prefers-reduced-media";
import { assetPath } from "@/shared/lib/asset-path";
import { DesignButton } from "@/shared/ui/DesignButton";

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
  const reduceMedia = usePrefersReducedMedia();
  const showVideo = backgroundMediaType === "video" && Boolean(backgroundVideo) && !reduceMedia;
  const [isVideoReady, setIsVideoReady] = useState(!showVideo);

  return (
    <section className="relative min-h-[560px] overflow-hidden bg-brand-navy sm:min-h-[720px] lg:min-h-[1080px]">
      <img
        src={backgroundImage}
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full scale-[1.06] object-cover object-[52%_center] sm:scale-[1.04] sm:object-center"
      />
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
      {withOverlay ? <div className="absolute inset-0 bg-black/55 sm:bg-black/25" /> : null}
      <div className="relative mx-auto flex max-w-[1720px] justify-center px-5 pb-14 pt-28 text-center sm:px-5 sm:pt-48 lg:justify-start lg:px-[100px] lg:pt-[331px] lg:text-left">
        <div className="max-w-[1000px] lg:max-w-[1000px]">
          <h1 className="text-display font-normal text-white [font-family:var(--font-educational)]">
            {heading === "Послесловие к вашему дню" ? (
              <>
                Послесловие к
                <br />
                вашему дню
              </>
            ) : (
              heading
            )}
          </h1>
          <p className="text-body-lg mx-auto mt-4 max-w-[320px] font-medium leading-[1.5] text-[#dfdfdf] sm:mt-6 sm:max-w-[560px] lg:mx-0 lg:max-w-[860px]">
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
              className="btn-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <img
                src={assetPath("/images/icons/how-we-make-play.png")}
                alt=""
                aria-hidden="true"
                className="h-12 w-12 shrink-0 transition-transform duration-200 group-hover:scale-110 sm:h-14 sm:w-14 lg:h-16 lg:w-16"
              />
              <span className="w-[220px] text-[16px] font-normal leading-snug sm:w-[250px] sm:text-[18px] lg:w-[285px] lg:text-[24px]">
                Как мы делаем бомбочки для ванн?
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
