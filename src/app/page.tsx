"use client";

import { useEffect, useState } from "react";

import { useCheckoutState } from "@/features/checkout/model/hooks";
import { HomeModal, type ModalType } from "@/features/checkout/ui/CheckoutModal";
import { siteConfig } from "@/shared/config/site";
import { seoConfig, toAbsoluteUrl } from "@/shared/config/seo";
import { assetPath } from "@/shared/lib/asset-path";
import {
  AboutSection,
  CtaSection,
  HeroSection,
  HeroVideoModal,
  ProcessSection,
  ReviewsSection,
  ScrollTopButton,
  WhyUsSection,
} from "@/widgets/home-sections";
import homeAboutJson from "../../content/home-about.json";
import homeCtaJson from "../../content/home-cta.json";
import homeFeatureCardsJson from "../../content/home-feature-cards.json";
import homeHeroJson from "../../content/home-hero.json";
import homeProcessBombsJson from "../../content/home-process-bombs.json";
import homeProcessLavenderJson from "../../content/home-process-lavender.json";
import homeProcessPacksJson from "../../content/home-process-packs.json";
import homeReviewsJson from "../../content/home-reviews.json";
import homeWhyUsJson from "../../content/home-why-us.json";
import siteBehaviorJson from "../../content/site-behavior.json";
import siteProductsJson from "../../content/site-products.json";

const siteBehavior = siteBehaviorJson;
const globalOverlaysEnabled = Boolean(siteBehavior.enableGlobalOverlays);

const fallbackCheckoutProduct = {
  title: "Бомбочка для ванны",
  price: Number(process.env.NEXT_PUBLIC_PRODUCT_PRICE ?? "999"),
  image: assetPath("/images/photos/bombs-2.jpg"),
};

const checkoutProducts = siteProductsJson.items.map((item) => ({
  ...item,
  image: assetPath(item.image),
}));

const primaryCheckoutProduct = checkoutProducts[0] ?? fallbackCheckoutProduct;

const featureCards = homeFeatureCardsJson.cards.map((card) => ({
  ...card,
  icon: assetPath(card.icon),
}));

const processSections = [homeProcessBombsJson, homeProcessLavenderJson, homeProcessPacksJson].map(
  (section) => ({
    ...section,
    slides: section.slides.map((slide) => ({
      ...slide,
      image: assetPath(slide.image),
    })),
  }),
);

const reasons = homeWhyUsJson.reasons.map((reason) => ({
  ...reason,
  icon: assetPath(reason.icon),
}));

const reviews = homeReviewsJson.items.map((review) => ({
  ...review,
  image: assetPath(review.image),
}));

export default function Home() {
  const [modal, setModal] = useState<ModalType>(null);
  const [isHeroVideoOpen, setIsHeroVideoOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { checkoutState, updateQuantity, updateField } = useCheckoutState();
  const heroBackgroundMediaType = homeHeroJson.backgroundMediaType === "video" ? "video" : "image";
  const heroBackgroundVideo = homeHeroJson.backgroundVideo
    ? assetPath(homeHeroJson.backgroundVideo)
    : "";

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  useEffect(() => {
    const openModal = (event: Event) => {
      const modalType = (event as CustomEvent<Exclude<ModalType, null>>).detail;
      setModal(modalType);
    };

    window.addEventListener("posleslovie:open-modal", openModal);
    return () => window.removeEventListener("posleslovie:open-modal", openModal);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 720);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modal]);

  useEffect(() => {
    if (!isHeroVideoOpen) {
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isHeroVideoOpen]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (!siteBehavior.enableScrollAnimations) {
      const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-pop]"));
      for (const element of elements) {
        element.classList.add("is-visible");
      }
      return;
    }

    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-pop]"));
    if (elements.length === 0) {
      return;
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      for (const element of elements) {
        element.classList.add("is-visible");
      }
      return;
    }

    const typewriterQueue = new Set<HTMLElement>();
    let typewriterRaf = 0;
    const TYPEWRITER_CHARS_PER_SEC = 26;
    let lastTypewriterTs = 0;
    const runTypewriterStep = (ts = 0) => {
      typewriterRaf = 0;
      const dt = lastTypewriterTs ? Math.min(80, ts - lastTypewriterTs) : 16;
      lastTypewriterTs = ts;
      const charsThisFrame = Math.max(1, Math.floor((TYPEWRITER_CHARS_PER_SEC * dt) / 1000));

      for (const element of typewriterQueue) {
        if (element.dataset.twDone === "1") {
          typewriterQueue.delete(element);
          continue;
        }
        const fullText = element.dataset.twText ?? element.textContent ?? "";
        if (!element.dataset.twText) {
          element.dataset.twText = fullText;
          element.textContent = "";
          element.dataset.twIndex = "0";
        }
        const currentIndex = Number(element.dataset.twIndex ?? "0");
        if (!Number.isFinite(currentIndex)) {
          element.dataset.twIndex = "0";
        }
        const nextIndex = Math.min(fullText.length, currentIndex + charsThisFrame);
        element.textContent = fullText.slice(0, nextIndex);
        element.dataset.twIndex = String(nextIndex);
        if (nextIndex >= fullText.length) {
          element.dataset.twDone = "1";
          typewriterQueue.delete(element);
        }
      }
      if (typewriterQueue.size > 0) {
        typewriterRaf = window.requestAnimationFrame(runTypewriterStep);
      }
    };
    const enqueueTypewriter = (root: HTMLElement) => {
      const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-typewriter]"));
      for (const target of targets) {
        if (target.dataset.twDone === "1") continue;
        typewriterQueue.add(target);
      }
      if (!typewriterRaf && typewriterQueue.size > 0) {
        lastTypewriterTs = 0;
        typewriterRaf = window.requestAnimationFrame(runTypewriterStep);
      }
    };

    let lastScrollY = window.scrollY;
    let hasUserScrolled = false;
    const onScrollMark = () => {
      hasUserScrolled = true;
    };
    window.addEventListener("scroll", onScrollMark, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        const nextScrollY = window.scrollY;
        const isScrollingDown = nextScrollY > lastScrollY;
        lastScrollY = nextScrollY;

        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!hasUserScrolled || isScrollingDown) {
              entry.target.classList.add("is-visible");
              if (isScrollingDown) {
                enqueueTypewriter(entry.target as HTMLElement);
              }
              observer.unobserve(entry.target);
            }
          }
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -12% 0px",
      },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScrollMark);
      if (typewriterRaf) window.cancelAnimationFrame(typewriterRaf);
    };
  }, []);

  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: toAbsoluteUrl("/"),
    logo: toAbsoluteUrl("/images/photos/hero.jpg"),
    email: siteConfig.email,
    telephone: siteConfig.phone,
    sameAs: siteConfig.socials.map((social) => social.href),
  };

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seoConfig.title,
    url: toAbsoluteUrl("/"),
    description: seoConfig.description,
    inLanguage: "ru-RU",
  };

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: primaryCheckoutProduct.title,
    description: seoConfig.description,
    image: [toAbsoluteUrl(primaryCheckoutProduct.image)],
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "RUB",
      price: primaryCheckoutProduct.price,
      availability: "https://schema.org/InStock",
      url: toAbsoluteUrl("/"),
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    },
  };

  return (
    <div className="bg-[#f8f8f8] text-[#0f172a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData) }}
      />
      <HeroSection
        onOrder={() => setModal("checkout")}
        onOpenHowWeMakeVideo={() => setIsHeroVideoOpen(true)}
        heading={homeHeroJson.heading}
        leadLine1={homeHeroJson.leadLine1}
        leadLine2={homeHeroJson.leadLine2}
        ctaLabel={homeHeroJson.ctaLabel}
        backgroundMediaType={heroBackgroundMediaType}
        backgroundImage={assetPath(homeHeroJson.backgroundImage)}
        backgroundVideo={heroBackgroundVideo}
        withOverlay={globalOverlaysEnabled}
      />

      <section
        id="bombs"
        data-scroll-pop
        className="px-3 py-10 sm:px-5 sm:py-16 lg:px-[100px] lg:py-[100px]"
      >
        <div className="mx-auto max-w-[1280px] rounded-[28px] bg-white px-4 py-10 sm:rounded-[48px] sm:px-6 sm:py-14 lg:min-h-[750px] lg:rounded-[100px] lg:px-20 lg:py-20">
          <div className="mx-auto max-w-[780px] text-center">
            <h2 className="text-[26px] font-extrabold leading-[1.12] sm:text-4xl lg:text-5xl">
              {homeFeatureCardsJson.sectionTitle}
            </h2>
            <div className="mx-auto mt-4 flex w-full max-w-[700px] items-center sm:mt-6">
              <span className="h-2 w-2 shrink-0 rotate-45 bg-[#e8c880]" />
              <span className="h-px flex-1 bg-[#e8c880]" />
              <span className="h-2 w-2 shrink-0 rotate-45 bg-[#e8c880]" />
            </div>
          </div>
          <div className="mt-8 grid gap-6 sm:mt-14 lg:grid-cols-3 lg:gap-16">
            {featureCards.map((card) => (
              <article
                key={card.title}
                className="group rounded-[18px] px-3 py-3 text-center transition duration-300 hover:-translate-y-2 hover:bg-[#f8f8f8] hover:shadow-[0_4px_9px_rgba(0,0,0,0.15)] sm:rounded-[10px] sm:px-4 sm:py-3"
              >
                <div
                  aria-hidden="true"
                  className="mx-auto h-14 w-14 bg-contain bg-center bg-no-repeat sm:h-16 sm:w-16"
                  style={{ backgroundImage: `url(${card.icon})` }}
                />
                <h3 className="mt-3 text-xl font-bold leading-[1.1] sm:mt-4 sm:text-2xl">
                  {card.title}
                </h3>
                <p className="mt-2 text-[15px] leading-7 [font-family:var(--font-inter)] sm:mt-4 sm:text-base sm:leading-8 lg:text-xl lg:leading-[1.8]">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="space-y-6 lg:space-y-0">
        {processSections.map((section, index) => (
          <ProcessSection
            key={section.title}
            {...section}
            index={index}
            onOrder={() => setModal("checkout")}
            crystalImage={assetPath("/images/photos/crystal.png")}
            peroImage={assetPath("/images/photos/pero.png")}
          />
        ))}
      </div>

      <WhyUsSection
        kicker={homeWhyUsJson.kicker}
        title={homeWhyUsJson.title}
        backgroundImage={assetPath(homeWhyUsJson.backgroundImage)}
        useBackgroundOverlay={globalOverlaysEnabled}
        reasons={reasons}
      />
      <AboutSection
        kicker={homeAboutJson.kicker}
        title={homeAboutJson.title}
        paragraphs={homeAboutJson.paragraphs}
        image={assetPath(homeAboutJson.image)}
      />
      <ReviewsSection
        kicker={homeReviewsJson.kicker}
        title={homeReviewsJson.title}
        reviews={reviews}
        starRowImage={assetPath("/images/photos/stars.svg")}
      />
      <CtaSection
        onOrder={() => setModal("checkout")}
        heading={homeCtaJson.heading}
        text={homeCtaJson.text}
        buttonLabel={homeCtaJson.buttonLabel}
        backgroundImage={assetPath(homeCtaJson.backgroundImage)}
      />

      <ScrollTopButton visible={showScrollTop} />
      <HomeModal
        type={modal}
        checkoutProduct={primaryCheckoutProduct}
        checkoutState={checkoutState}
        onCheckoutFieldChange={updateField}
        onCheckoutQuantityChange={updateQuantity}
        withOverlay={globalOverlaysEnabled}
        onClose={() => setModal(null)}
      />
      <HeroVideoModal
        open={isHeroVideoOpen}
        src={assetPath("/videos/how-we-make-bath-bombs.mp4")}
        title="Как мы делаем бомбочки для ванн?"
        withOverlay={globalOverlaysEnabled}
        onClose={() => setIsHeroVideoOpen(false)}
      />
    </div>
  );
}
