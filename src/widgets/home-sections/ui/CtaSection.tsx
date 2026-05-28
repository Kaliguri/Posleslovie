"use client";

import { DesignButton } from "@/shared/ui/DesignButton";

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
      className="relative overflow-hidden bg-[#c1aeff] bg-cover bg-center px-4 py-10 text-center text-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] sm:px-5 sm:py-14 lg:px-[100px] lg:py-14"
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
