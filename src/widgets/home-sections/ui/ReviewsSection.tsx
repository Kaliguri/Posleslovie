"use client";

import { ArrowIcon } from "@/shared/ui/ArrowIcon";
import { useInfiniteCarousel } from "@/widgets/shared/use-infinite-carousel";

import { SectionHeading, ZoomImage } from "./SharedSectionUi";

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
