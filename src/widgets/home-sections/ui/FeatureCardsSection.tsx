"use client";

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
      className="px-3 pb-6 pt-12 sm:px-5 sm:pb-9 sm:pt-[72px] lg:px-10 lg:pb-10 lg:pt-20 xl:px-[100px] xl:pb-[56px] xl:pt-[112px]"
    >
      <div className="mx-auto max-w-[1280px] rounded-[28px] bg-white px-4 py-6 sm:rounded-[48px] sm:px-6 sm:py-8 lg:px-10 lg:py-10 xl:rounded-[100px] xl:px-20 xl:py-12">
        <div className="mx-auto max-w-[780px] text-center">
          <h2 className="text-h2 font-extrabold">{sectionTitle}</h2>
        </div>
        <div className="mt-8 grid gap-6 sm:mt-14 md:grid-cols-3 lg:gap-8 xl:gap-16">
          {cards.map((card) => (
            <article
              key={card.title}
              data-reveal-child
              className="group rounded-[18px] px-3 py-3 text-center transition duration-300 hover:-translate-y-2 hover:bg-[#f8f8f8] sm:rounded-[10px] sm:px-4 sm:py-3"
            >
              <div
                aria-hidden="true"
                className="mx-auto h-14 w-14 bg-contain bg-center bg-no-repeat sm:h-16 sm:w-16"
                style={{ backgroundImage: `url(${card.icon})` }}
              />
              <h3 className="mt-3 text-xl font-bold leading-[1.1] sm:mt-4 md:text-lg lg:text-xl xl:text-2xl">
                {card.title}
              </h3>
              <p className="mt-2 text-[15px] leading-7 [font-family:var(--font-inter)] sm:mt-4 sm:text-base sm:leading-8 md:text-sm md:leading-7 lg:text-base lg:leading-8 xl:text-xl xl:leading-[1.8]">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
