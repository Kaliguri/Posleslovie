"use client";

import { useState } from "react";

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
