"use client";

import { useEffect, useState } from "react";

import { useCheckoutState } from "@/features/checkout/model/hooks";
import { HomeModal, type ModalType } from "@/features/checkout/ui/CheckoutModal";
import { useScrollReveal } from "@/features/scroll-reveal/model/use-scroll-reveal";
import { useBodyLock } from "@/shared/hooks/use-body-lock";
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

  useBodyLock(Boolean(modal) || isHeroVideoOpen);
  useScrollReveal(scrollAnimationsEnabled);

  return (
    <div className="bg-[#f8f8f8] text-[#0f172a]">
      <HomeStructuredData primaryCheckoutProduct={primaryCheckoutProduct} />
      <HeroSection
        onOrder={() => setModal("checkout")}
        onOpenHowWeMakeVideo={() => setIsHeroVideoOpen(true)}
        heading={heroContent.heading}
        leadLine1={heroContent.leadLine1}
        leadLine2={heroContent.leadLine2}
        ctaLabel={heroContent.ctaLabel}
        backgroundMediaType={heroContent.backgroundMediaType}
        backgroundImage={heroContent.backgroundImage}
        backgroundImageMobile={heroContent.backgroundImageMobile}
        backgroundImageTablet={heroContent.backgroundImageTablet}
        backgroundVideo={heroContent.backgroundVideo}
        withOverlay={globalOverlaysEnabled}
      />
      <FeatureCardsSection
        sectionTitle={featureCardsSection.sectionTitle}
        cards={featureCardsSection.cards}
      />

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

      <WhyUsSection
        kicker={whyUsContent.kicker}
        title={whyUsContent.title}
        backgroundImage={whyUsContent.backgroundImage}
        useBackgroundOverlay={globalOverlaysEnabled}
        reasons={whyUsContent.reasons}
      />
      <ReviewsSection
        kicker={reviewsContent.kicker}
        title={reviewsContent.title}
        reviews={reviewsContent.items}
        starRowImage={decorativeImages.stars}
        withOverlay={globalOverlaysEnabled}
      />
      <AboutSection
        kicker={aboutContent.kicker}
        title={aboutContent.title}
        paragraphs={aboutContent.paragraphs}
        image={aboutContent.image}
      />

      <FaqSection kicker={faqContent.kicker} title={faqContent.title} items={faqContent.items} />

      <CtaSection
        onOrder={() => setModal("checkout")}
        heading={ctaContent.heading}
        text={ctaContent.text}
        buttonLabel={ctaContent.buttonLabel}
        backgroundImage={ctaContent.backgroundImage}
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
        src={decorativeImages.heroVideo}
        title="Как мы делаем бомбочки для ванн?"
        withOverlay={globalOverlaysEnabled}
        onClose={() => setIsHeroVideoOpen(false)}
      />
    </div>
  );
}
