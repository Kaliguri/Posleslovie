"use client";

import { useEffect, useState } from "react";

import { useCheckoutState } from "@/features/checkout/model/hooks";
import { HomeModal, type ModalType } from "@/features/checkout/ui/CheckoutModal";
import { useScrollReveal } from "@/features/scroll-reveal/model/use-scroll-reveal";
import { useBodyLock } from "@/shared/hooks/use-body-lock";
import { subscribeOpenModal } from "@/shared/lib/modal-bus";
import {
  AboutSection,
  CtaSection,
  FaqSection,
  FeatureCardsSection,
  HeroSection,
  HeroVideoModal,
  ProcessSection,
  ReviewsSection,
  ScrollTopButton,
  WhyUsSection,
} from "@/widgets/home-sections";
import {
  aboutContent,
  ctaContent,
  decorativeImages,
  faqContent,
  featureCardsSection,
  globalOverlaysEnabled,
  heroContent,
  primaryCheckoutProduct,
  processSections,
  reviewsContent,
  scrollAnimationsEnabled,
  whyUsContent,
} from "@/widgets/home-sections/model/mapHomeContent";
import { HomeStructuredData } from "@/widgets/home-sections/ui/HomeStructuredData";

export default function Home() {
  const [modal, setModal] = useState<ModalType>(null);
  const [isHeroVideoOpen, setIsHeroVideoOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { checkoutState, updateQuantity, updateField } = useCheckoutState();

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  useEffect(() => subscribeOpenModal(setModal), []);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 720);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useBodyLock(Boolean(modal) || isHeroVideoOpen);
  useScrollReveal(scrollAnimationsEnabled);

  return (
    <div className="bg-[#f8f8f8] text-[#0f172a]">
      <HomeStructuredData
        primaryCheckoutProduct={primaryCheckoutProduct}
        faqItems={faqContent.items}
      />
      <HeroSection
        {...heroContent}
        onOrder={() => setModal("checkout")}
        onOpenHowWeMakeVideo={() => setIsHeroVideoOpen(true)}
        withOverlay={globalOverlaysEnabled}
      />
      <FeatureCardsSection {...featureCardsSection} />

      <div className="space-y-3 lg:space-y-0">
        {processSections.map((section, index) => (
          <ProcessSection
            key={section.title}
            {...section}
            index={index}
            onOrder={() => setModal("checkout")}
            crystalImage={decorativeImages.crystal}
            peroImage={decorativeImages.pero}
          />
        ))}
      </div>

      <WhyUsSection {...whyUsContent} useBackgroundOverlay={globalOverlaysEnabled} />
      <ReviewsSection
        kicker={reviewsContent.kicker}
        title={reviewsContent.title}
        reviews={reviewsContent.items}
        starRowImage={decorativeImages.stars}
        withOverlay={globalOverlaysEnabled}
      />
      <AboutSection {...aboutContent} />

      <FaqSection {...faqContent} />

      <CtaSection {...ctaContent} onOrder={() => setModal("checkout")} />

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
        src={decorativeImages.heroVideo}
        title="Как мы делаем бомбочки для ванн?"
        withOverlay={globalOverlaysEnabled}
        onClose={() => setIsHeroVideoOpen(false)}
      />
    </div>
  );
}
