"use client";

import { IconImage, SectionHeading } from "./SharedSectionUi";

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
      className="relative my-6 overflow-hidden bg-cover bg-center px-4 py-8 text-white sm:my-8 sm:px-5 sm:py-11 lg:my-12 lg:px-[235px] lg:py-14"
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
