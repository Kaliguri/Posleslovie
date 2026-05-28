"use client";

import { useRef, useState } from "react";

import { ArrowIcon } from "@/shared/ui/ArrowIcon";
import { useInfiniteCarousel } from "@/widgets/shared/use-infinite-carousel";

import { SectionHeading, ZoomImage } from "./SharedSectionUi";
import { HeroVideoModal } from "./HeroVideoModal";

export function ReviewsSection({
  kicker,
  title,
  reviews,
  starRowImage,
  withOverlay,
}: Readonly<{
  kicker: string;
  title: string;
  reviews: {
    name: string;
    mediaType: "image" | "video";
    image: string;
    video: string;
    text: string;
  }[];
  starRowImage: string;
  withOverlay: boolean;
}>) {
  const { orderedItems, offset, isTransitioning, transitionDuration, move } =
    useInfiniteCarousel(reviews);

  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const [activeVideoReview, setActiveVideoReview] = useState<{
    name: string;
    src: string;
  } | null>(null);

  return (
    <section
      id="reviews"
      data-scroll-pop
      className="overflow-hidden bg-[#f8f8f8] px-3 py-8 sm:px-5 sm:py-11 lg:px-[100px] lg:py-14"
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
            onTouchStart={(event) => {
              const touch = event.touches[0];
              if (!touch) return;
              touchRef.current = { x: touch.clientX, y: touch.clientY };
            }}
            onTouchEnd={(event) => {
              const start = touchRef.current;
              touchRef.current = null;
              if (!start) return;
              const touch = event.changedTouches[0];
              if (!touch) return;

              const dx = touch.clientX - start.x;
              const dy = touch.clientY - start.y;
              if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;

              move(dx < 0 ? 1 : -1);
            }}
          >
            {orderedItems.map((review) => (
              <article
                key={review.name}
                className="group flex min-h-[470px] w-full shrink-0 basis-full flex-col justify-between rounded-[18px] bg-white p-4 transition duration-300 hover:-translate-y-2 hover:shadow-[0_18px_50px_rgba(15,23,42,0.14)] sm:min-h-[560px] sm:p-8 lg:min-h-[600px] lg:basis-[calc((100%_-_var(--carousel-gap)*2)/3)]"
              >
                <div>
                  <div className="relative">
                    <ZoomImage
                      image={review.image}
                      label=""
                      className="h-[170px] rounded-[20px] sm:h-[220px]"
                      zoom={false}
                    />
                    {review.mediaType === "video" && review.video ? (
                      <button
                        type="button"
                        onClick={() =>
                          setActiveVideoReview({ name: review.name, src: review.video })
                        }
                        aria-label={`Открыть видео отзыва: ${review.name}`}
                        className="group/review-video absolute inset-0 flex items-center justify-center rounded-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                      >
                        <span className="pointer-events-none flex h-14 w-14 items-center justify-center rounded-full bg-black/45 text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition group-hover/review-video:scale-110 sm:h-16 sm:w-16">
                          <PlayIcon />
                        </span>
                      </button>
                    ) : null}
                  </div>
                  <div
                    role="img"
                    aria-label="Оценка: 5 из 5 звёзд"
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
      <HeroVideoModal
        open={Boolean(activeVideoReview)}
        src={activeVideoReview?.src ?? ""}
        title={activeVideoReview ? `Видео-отзыв: ${activeVideoReview.name}` : ""}
        withOverlay={withOverlay}
        onClose={() => setActiveVideoReview(null)}
      />
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

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M9 18V6l12 6-12 6Z" fill="currentColor" />
    </svg>
  );
}
