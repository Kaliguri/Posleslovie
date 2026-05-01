"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ModalType = "delivery" | "partners" | "contacts" | "checkout" | null;

const assets = {
  hero:
    "https://www.figma.com/api/mcp/asset/2553a075-0201-4511-ad21-372b888270a6",
  marble:
    "https://www.figma.com/api/mcp/asset/ec603b7d-5aec-4ff1-8dee-44ea1f14efab",
  product1:
    "https://www.figma.com/api/mcp/asset/46c9a39c-9a9d-413b-a86b-4cf93a0e80b9",
  product2:
    "https://www.figma.com/api/mcp/asset/953707e5-2166-4be6-a291-b2ab54556ec2",
  product3:
    "https://www.figma.com/api/mcp/asset/b6e2d1e5-3292-4d0b-9d95-825b6b7f7ac1",
  review1:
    "https://www.figma.com/api/mcp/asset/c9c4a81f-e942-4010-a778-76e7da9fc679",
  review2:
    "https://www.figma.com/api/mcp/asset/d9e8effe-8b9b-4bab-87ad-4f1518c40bbd",
  review3:
    "https://www.figma.com/api/mcp/asset/d58fd6d3-b21d-4498-a035-ce4755790260",
  review4:
    "https://www.figma.com/api/mcp/asset/329e32e7-67ca-45f2-8f9e-1b763b75cb38",
  cta:
    "https://www.figma.com/api/mcp/asset/b82ac1b1-5749-45ed-a8a1-78e42696c8bf",
  ctaBase:
    "https://www.figma.com/api/mcp/asset/a89a1f8e-8e72-42ff-80db-0c38c0182a65",
  ctaOverlay:
    "https://www.figma.com/api/mcp/asset/8a443bec-949b-4ac2-8f56-5fc1d0047437",
  ctaBottom:
    "https://www.figma.com/api/mcp/asset/889da1ae-64fa-4280-bc33-cc31b4925d94",
  whyUs:
    "https://www.figma.com/api/mcp/asset/94992ccc-dce1-419e-91b8-0fb4deb12eff",
  natureIcon:
    "https://www.figma.com/api/mcp/asset/61e798c5-5d63-4425-8b44-9f0271397f1b",
  giftIcon:
    "https://www.figma.com/api/mcp/asset/20d43fbf-571d-429d-8e7c-23e45cb2cc2d",
  successIcon:
    "https://www.figma.com/api/mcp/asset/750d3044-8eba-4236-8c86-66a0542818e9",
  starRow:
    "https://www.figma.com/api/mcp/asset/54c2e623-e0a3-4f07-9537-aff0c63fd661",
};

const productSlides = [
  { image: assets.product1, alt: "Мраморные бомбочки для ванны" },
  { image: assets.product2, alt: "Голубые бомбочки с лавандой" },
  { image: assets.product3, alt: "Бомбочка крупным планом" },
] as const;

const featureCards = [
  {
    title: "Природа в чистом виде",
    description:
      "Никакой агрессивной химии. Ручная сборка, натуральные масла и компоненты, которые мы тщательно отбираем сами.",
    icon: assets.natureIcon,
  },
  {
    title: "Сюрприз в каждом заказе",
    description:
      "Наши художники и писатели запечатали внутри культурный опыт и волшебство момента",
    icon: assets.giftIcon,
  },
  {
    title: "Дизайн по вашим правилам",
    description:
      "От цвета упаковки до теплых пожеланий на вкладыше. Мы полностью адаптируем внешний вид упаковки под эстетику вашего бренда",
    icon: assets.successIcon,
  },
] as const;

const processSections = [
  {
    eyebrow: "Продукция",
    title: "Как мы делаем бомбочки для ванн?",
    description:
      "Каждая бомбочка — это кусочек спокойствия, созданный вручную. Мы помогаем брендам радовать своих клиентов идеальными комплиментами к заказам, повышая лояльность, а каждому человеку — просто находить время для самого себя.",
    reverse: false,
    button: "Сделать заказ",
  },
  {
    eyebrow: "Натуральные масла",
    title: "Собираем лаванду вручную",
    description:
      "Наши партнеры собирают лаванду и изготавливают масло в ручную. Букет из 50 сортов лаванды в каждой бомбочке.",
    reverse: true,
  },
  {
    eyebrow: "Продукция",
    title: "Упаковываем с любовью",
    description:
      "Мы нанесем ваш логотип на упаковку, вы выберите цвет сургучной печати. Мы возьмем на себя все технические моменты, чтобы вы получили готовый брендированный бокс, соответствующий эстетике и духу вашей компании",
    reverse: false,
    button: "Сделать заказ",
  },
] as const;

const reasons = [
  {
    title: "Чистый состав",
    description: "Только органические масла и настоящие сухоцветы",
    icon: assets.natureIcon,
  },
  {
    title: "Гарантия качества",
    description: "Ручная сборка и контроль каждой партии",
    icon: assets.successIcon,
  },
  {
    title: "Креативный подарок",
    description: "Приятный сюрприз и культурный опыт в каждом наборе",
    icon: assets.giftIcon,
  },
] as const;

const reviews = [
  {
    name: "Алиса Ч.",
    image: assets.review1,
    text: "«Потрясающая бомбочка! Я очень привередлива к запахам и не люблю химозные отдушки, но тут аромат настоящей лаванды, как будто стоишь в поле. Растворяется мягко, кожу не сушит, сухоцветы смотрятся невероятно красиво. И самое главное — ванну после нее отмывать не нужно!»",
  },
  {
    name: "Мария П.",
    image: assets.review2,
    text: "«Покупала набор в подарок. Все выглядит аккуратно и очень премиально: упаковка, аромат, сама идея маленького ритуала после долгого дня. Получательница была в восторге.»",
  },
  {
    name: "Владимир К.",
    image: assets.review3,
    text: "«Искали эстетичные комплименты для подарочных боксов, заказали партию с нашим логотипом на упаковке. Качество превзошло ожидания, продукт делает распаковку особенной.»",
  },
  {
    name: "Анна С.",
    image: assets.review4,
    text: "«Брала набор себе, чтобы отдохнуть от суеты. Очень эстетичный вид, чувствуется ручная работа и внимание к деталям. После тяжелого дня — идеальный способ расслабиться.»",
  },
] as const;

const CAROUSEL_DURATION_MS = 500;

function useInfiniteCarousel<T>(items: readonly T[]) {
  const [orderedItems, setOrderedItems] = useState<T[]>(() => [...items]);
  const [offset, setOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameRef = useRef<number | null>(null);

  const clearPendingAnimation = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  useEffect(() => clearPendingAnimation, [clearPendingAnimation]);

  const move = useCallback(
    (direction: 1 | -1) => {
      clearPendingAnimation();

      if (direction === 1) {
        setIsTransitioning(true);
        setOffset(-1);

        timeoutRef.current = setTimeout(() => {
          setIsTransitioning(false);
          setOrderedItems((current) => [...current.slice(1), current[0]]);
          setOffset(0);
        }, CAROUSEL_DURATION_MS);
        return;
      }

      setIsTransitioning(false);
      setOrderedItems((current) => [current[current.length - 1], ...current.slice(0, -1)]);
      setOffset(-1);

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = window.requestAnimationFrame(() => {
          setIsTransitioning(true);
          setOffset(0);

          timeoutRef.current = setTimeout(() => {
            setIsTransitioning(false);
          }, CAROUSEL_DURATION_MS);
        });
      });
    },
    [clearPendingAnimation],
  );

  return { orderedItems, offset, isTransitioning, move };
}

export default function Home() {
  const [modal, setModal] = useState<ModalType>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  return (
    <div className="bg-white text-[#0f172a]">
      <HeroSection onOrder={() => setModal("checkout")} />

      <section id="bombs" className="px-5 py-16 lg:px-[100px] lg:py-20">
        <div className="mx-auto max-w-[1280px] rounded-[48px] bg-[#f8f8f8] px-6 py-14 lg:rounded-[100px] lg:px-20 lg:py-20">
          <SectionHeading title="Дарите настроение и заботу тем, кто вам важен и дорог" centered />
          <div className="mt-14 grid gap-10 lg:grid-cols-3 lg:gap-16">
            {featureCards.map((card) => (
              <FeatureCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      <div className="space-y-8 lg:space-y-0">
        {processSections.map((section) => (
          <ProcessSection
            key={section.title}
            {...section}
            onOrder={() => setModal("checkout")}
          />
        ))}
      </div>

      <WhyUsSection />
      <AboutSection />
      <ReviewsSection />
      <CtaSection onOrder={() => setModal("checkout")} />

      <ScrollTopButton visible={showScrollTop} />
      <HomeModal type={modal} onClose={() => setModal(null)} />
    </div>
  );
}

function HeroSection({ onOrder }: Readonly<{ onOrder: () => void }>) {
  return (
    <section className="relative min-h-[720px] overflow-hidden rounded-b-[72px] bg-[#102038] lg:min-h-[1080px] lg:rounded-b-[150px]">
      <div
        className="absolute inset-0 scale-[1.02] bg-cover bg-center"
        style={{ backgroundImage: `url(${assets.hero})` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.34)_0%,rgba(0,0,0,0.04)_100%)]" />
      <div className="relative mx-auto max-w-[1720px] px-5 pb-20 pt-56 lg:px-[100px] lg:pt-[340px]">
        <div className="max-w-[790px]">
          <h1 className="text-5xl leading-none text-white sm:text-7xl lg:text-[97px]">
            Послесловие к вашему дню
          </h1>
          <p className="mt-8 text-xl font-light leading-[1.6] text-[#dfdfdf] lg:text-[30px]">
            Энергия природы в каждой бомбочке для ванны
            <br />
            Внимание и забота к каждой минуте наедине с собой
          </p>
          <div className="mt-14">
            <DesignButton size="xl" onClick={onOrder}>
              Оформить заказ
            </DesignButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection({
  eyebrow,
  title,
  description,
  reverse,
  button,
  onOrder,
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  reverse: boolean;
  button?: string;
  onOrder: () => void;
}>) {
  return (
    <section className={`${reverse ? "bg-[#f8f8f8]" : "bg-white"} px-5 py-12 lg:px-[100px] lg:py-20`}>
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[42px] bg-[#f8f8f8] lg:rounded-[70px]">
        <div
          className={`pointer-events-none absolute inset-0 hidden lg:grid ${
            reverse ? "grid-cols-[1fr_323px]" : "grid-cols-[323px_1fr]"
          }`}
        >
          <div
            className={`bg-cover bg-center ${reverse ? "order-2" : ""}`}
            style={{ backgroundImage: `url(${assets.marble})` }}
          />
          <div className={reverse ? "bg-[#f7fafe]" : "bg-[#f8f8f8]"} />
        </div>

        <div className="relative grid items-center gap-10 p-5 sm:p-8 lg:min-h-[665px] lg:grid-cols-2 lg:gap-16 lg:p-12">
          <ProductGallery
            reverse={reverse}
          />

          <div className={reverse ? "lg:order-1" : ""}>
            <div className="max-w-[552px]">
              <SectionKicker>{eyebrow}</SectionKicker>
              <h2 className="mt-2 text-3xl font-extrabold leading-[1.1] sm:text-4xl lg:text-5xl">
                {title}
              </h2>
              <GoldRule />
              <p className="mt-5 text-base leading-8 lg:text-xl lg:leading-[1.8]">
                {description}
              </p>
              {button ? (
                <div className="mt-10">
                  <DesignButton onClick={onOrder}>{button}</DesignButton>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductGallery({
  reverse,
}: Readonly<{
  reverse: boolean;
}>) {
  const { orderedItems, offset, isTransitioning, move } = useInfiniteCarousel(productSlides);

  return (
    <div className={`${reverse ? "lg:order-2 lg:justify-self-end" : ""}`}>
      <div className="relative">
        <TapeImageCarousel
          slides={orderedItems}
          offset={offset}
          isTransitioning={isTransitioning}
        />
        <div className={`mt-4 flex gap-4 ${reverse ? "justify-end" : ""}`}>
          <ArrowButton direction="left" onClick={() => move(-1)} />
          <ArrowButton direction="right" onClick={() => move(1)} />
        </div>
      </div>
    </div>
  );
}

function TapeImageCarousel({
  slides,
  offset,
  isTransitioning,
}: Readonly<{
  slides: (typeof productSlides)[number][];
  offset: number;
  isTransitioning: boolean;
}>) {
  return (
    <div className="aspect-square overflow-hidden rounded-[32px] bg-[#f8f8f8] lg:h-[525px] lg:w-[525px] lg:rounded-[50px]">
      <div
        className={`flex h-full ${isTransitioning ? "transition-transform duration-500 ease-out" : ""}`}
        style={{ transform: `translateX(${offset * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.image} className="h-full w-full shrink-0 overflow-hidden">
            <div
              aria-label={slide.alt}
              role="img"
              className="h-full w-full bg-cover bg-center transition duration-500 hover:scale-125"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function WhyUsSection() {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center px-5 py-16 text-white lg:px-[100px] lg:py-20"
      style={{ backgroundImage: `url(${assets.whyUs})` }}
    >
      <div className="absolute inset-0 bg-[#102038]/35" />
      <div className="relative mx-auto max-w-[1280px]">
        <SectionHeading kicker="Преимущества" title="Почему выбирают нас?" centered light />
        <div className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-24">
          {reasons.map((reason) => (
            <article key={reason.title} className="text-center">
              <IconImage src={reason.icon} light />
              <h3 className="mt-4 text-2xl font-bold leading-[1.1]">{reason.title}</h3>
              <p className="mt-2 text-lg leading-[1.8]">{reason.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="bg-white px-5 py-12 lg:px-[100px] lg:py-20">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[42px] bg-[#f8f8f8] lg:rounded-[70px]">
        <div className="pointer-events-none absolute inset-0 hidden grid-cols-[1fr_323px] lg:grid">
          <div />
          <div className="bg-cover bg-center" style={{ backgroundImage: `url(${assets.marble})` }} />
        </div>
        <div className="relative grid items-center gap-10 p-5 sm:p-8 lg:min-h-[665px] lg:grid-cols-2 lg:gap-16 lg:p-12">
          <div className="max-w-[552px]">
            <SectionKicker>О нас</SectionKicker>
            <h2 className="mt-2 text-3xl font-extrabold leading-[1.1] sm:text-4xl lg:text-5xl">
              Кто мы такие?
            </h2>
            <GoldRule />
            <div className="mt-5 space-y-6 text-base leading-8 lg:text-xl lg:leading-[1.8]">
              <p>
                Послесловие — это команда амбициозных, творческих и талантливых людей,
                бесконечно целеустремленных и искренне увлеченных процессом создания подарков.
              </p>
              <p>
                Мы прилагаем максимум усилий, чтобы создать продукцию на уровень выше конкурентов.
                Именно поэтому с нами сотрудничают лидеры рынка в своих нишах.
              </p>
            </div>
          </div>
          <ZoomImage
            image={assets.product1}
            label="Бомбочки Послесловие"
            className="aspect-square rounded-[32px] lg:h-[525px] lg:w-[525px] lg:rounded-[50px]"
          />
        </div>
      </div>
    </section>
  );
}

function ReviewsSection() {
  const { orderedItems, offset, isTransitioning, move } = useInfiniteCarousel(reviews);

  return (
    <section id="reviews" className="overflow-hidden bg-white px-5 py-16 lg:px-[100px] lg:py-20">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeading kicker="Отзывы" title="Нам доверяют" centered />
        <div className="mt-14 overflow-hidden [--carousel-gap:2rem] [--carousel-step:calc(100%_+_var(--carousel-gap))] lg:[--carousel-gap:3rem] lg:[--carousel-step:calc((100%_-_var(--carousel-gap)*2)/3_+_var(--carousel-gap))]">
          <div
            className={`flex gap-[var(--carousel-gap)] ${isTransitioning ? "transition-transform duration-500 ease-out" : ""}`}
            style={{
              transform: offset === 0 ? "translateX(0)" : "translateX(calc(-1 * var(--carousel-step)))",
            }}
          >
            {orderedItems.map((review) => (
              <article
                key={review.name}
                className="group flex min-h-[600px] w-full shrink-0 basis-full flex-col justify-between rounded-[15px] bg-[#f8f8f8] p-6 transition duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-[0_18px_50px_rgba(15,23,42,0.14)] sm:p-8 lg:basis-[calc((100%_-_var(--carousel-gap)*2)/3)]"
              >
                <div>
                  <ZoomImage image={review.image} label="" className="h-[220px] rounded-[20px]" zoom={false} />
                  <div
                    aria-label="5 звезд"
                    className="mt-5 h-[21px] w-[131px] bg-contain bg-left bg-no-repeat"
                    style={{ backgroundImage: `url(${assets.starRow})` }}
                  />
                  <p className="mt-4 text-base leading-[1.6] lg:text-lg">{review.text}</p>
                </div>
                <p className="mt-8 font-medium">{review.name}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-8 flex gap-4">
          <ArrowButton direction="left" onClick={() => move(-1)} />
          <ArrowButton direction="right" onClick={() => move(1)} />
        </div>
      </div>
    </section>
  );
}

function CtaSection({ onOrder }: Readonly<{ onOrder: () => void }>) {
  return (
    <section
      className="relative overflow-hidden bg-[#102038] bg-cover bg-center px-5 py-20 text-center text-white lg:px-[100px] lg:py-24"
      style={{
        backgroundImage: `linear-gradient(0deg, rgba(14,17,50,0.3), rgba(14,17,50,0.3)), url(${assets.ctaBottom}), url(${assets.ctaOverlay}), url(${assets.cta}), url(${assets.ctaBase})`,
      }}
    >
      <div className="relative mx-auto flex max-w-[1200px] flex-col items-center">
        <h2 className="max-w-[760px] text-3xl font-extrabold leading-[1.1] sm:text-4xl lg:text-5xl">
          Наши наборы - ваш идеальный комплимент!
        </h2>
        <p className="mt-5 max-w-[540px] text-lg font-light leading-[1.6] sm:text-2xl">
          Подарите минуты душевного равновесия и культурный опыт тем, кто вам важен
        </p>
        <div className="mt-8">
          <DesignButton onClick={onOrder}>Оформить заказ</DesignButton>
        </div>
      </div>
    </section>
  );
}

function HomeModal({
  type,
  onClose,
}: Readonly<{ type: ModalType; onClose: () => void }>) {
  useEffect(() => {
    if (!type) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, type]);

  if (!type) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative max-h-[92vh] w-full max-w-[920px] overflow-y-auto rounded-[36px] bg-white px-6 py-8 shadow-2xl lg:rounded-[50px] lg:px-12 lg:py-12"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#e8c880] text-[#e8c880] transition hover:bg-[#e8c880] hover:text-[#0f172a]"
        >
          <CrossIcon />
        </button>
        {type === "delivery" ? <DeliveryModal /> : null}
        {type === "partners" ? <PartnersModal /> : null}
        {type === "contacts" ? <ContactsModal /> : null}
        {type === "checkout" ? <CheckoutModal /> : null}
      </div>
    </div>
  );
}

function PartnersModal() {
  return (
    <div className="max-w-[760px]">
      <SectionKicker>Партнерство</SectionKicker>
      <h2 className="mt-2 max-w-[552px] text-4xl font-extrabold leading-[1.1] lg:text-[40px]">
        Хотите стать нашим партнером?
      </h2>
      <GoldRule />
      <p className="mt-5 max-w-[700px] text-base leading-[1.8] lg:text-lg">
        Предлагаем выгодные условия для региональных дистрибьюторов, розничных магазинов и
        селлеров. Расширьте свой ассортимент продуктом, который продает сам себя.
      </p>
      <p className="mt-8 max-w-[620px] text-xl font-bold leading-[1.8]">
        Оставьте заявку и мы свяжемся с вами, чтобы обсудить все детали
      </p>
      <GoldRule />
      <LeadForm submitLabel="Стать партнером" company />
    </div>
  );
}

function DeliveryModal() {
  return (
    <div className="max-w-[760px]">
      <SectionKicker>Оплата и доставка</SectionKicker>
      <h2 className="mt-2 text-4xl font-extrabold leading-[1.1] lg:text-[40px]">
        Условия оплаты и доставки
      </h2>
      <GoldRule />
      <div className="mt-7 space-y-6 text-base leading-[1.75] text-[#0f172a]">
        <InfoBlock title="1. Оплата">
          Доступны СБП, банковская карта и оплата при получении. Онлайн-оплата будет
          подключаться через отдельный backend, потому что GitHub Pages обслуживает только
          статические файлы.
        </InfoBlock>
        <InfoBlock title="2. Способы доставки">
          При оформлении заказа доступны курьерская доставка до двери, доставка в пункт выдачи и
          постамат через сервисы доставки. Стоимость зависит от адреса, веса и объёма заказа.
        </InfoBlock>
        <InfoBlock title="3. Сроки">
          После подтверждения заказа менеджер согласует удобный интервал и финальные детали
          упаковки.
        </InfoBlock>
      </div>
    </div>
  );
}

function ContactsModal() {
  return (
    <div className="max-w-[760px]">
      <SectionKicker>Контакты</SectionKicker>
      <h2 className="mt-2 text-4xl font-extrabold leading-[1.1] lg:text-[40px]">
        Связаться с нами
      </h2>
      <GoldRule />
      <dl className="mt-8 grid gap-4 text-base lg:grid-cols-2">
        <ContactItem label="Почта" value="example@posleslovie.ru" />
        <ContactItem label="Телефон" value="+7 (000) 000-00-00" />
        <ContactItem label="ИП" value="ИП Иванов Иван Иванович" />
        <ContactItem label="ИНН" value="000000000000" />
        <ContactItem label="ОГРН" value="000000000000000" />
        <ContactItem label="Адрес" value="г. Москва, ул. Примерная, д. 1" />
      </dl>
    </div>
  );
}

function CheckoutModal() {
  return (
    <div>
      <div className="text-center">
        <h2 className="text-4xl font-extrabold leading-[1.1] lg:text-5xl">Оформление заказа</h2>
        <GoldRule centered />
        <div className="mx-auto mt-8 grid max-w-[600px] grid-cols-2 rounded-full bg-[#d7d7d7] p-0">
          <span className="rounded-full bg-[#e8c880] px-8 py-4 text-sm font-extrabold">
            Для себя
          </span>
          <span className="px-8 py-4 text-sm font-extrabold text-[#9a9b9c]">Для компании</span>
        </div>
      </div>
      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div>
          <h3 className="text-2xl font-extrabold">Контактная информация</h3>
          <div className="mt-4 h-[3px] rounded-full bg-[#c5c5c5]" />
          <LeadForm submitLabel="Оставить заявку" requiredOnly />
        </div>
        <div>
          <h3 className="text-2xl font-extrabold">Детали заказа</h3>
          <div className="mt-4 h-[3px] rounded-full bg-[#c5c5c5]" />
          <div className="mt-6 flex items-center justify-between gap-6">
            <ZoomImage image={assets.product2} label="Бомбочка для ванны" className="h-[108px] w-[108px] rounded-[10px]" />
            <div className="flex-1">
              <p className="font-bold">Бомбочка для ванны</p>
              <div className="mt-4 flex items-center gap-4">
                <CounterButton>-</CounterButton>
                <span className="font-bold">5</span>
                <CounterButton>+</CounterButton>
              </div>
            </div>
            <p className="font-bold">9999Р</p>
          </div>
          <div className="mt-6 h-[3px] rounded-full bg-[#c5c5c5]" />
          <div className="mt-6 space-y-4 text-xl">
            <p className="font-light">Сумма: 1199 руб.</p>
            <p className="font-light">Скидка: 200 руб.</p>
            <p className="font-extrabold">Итоговая сумма: 999 руб.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadForm({
  submitLabel,
  company = false,
  requiredOnly = false,
}: Readonly<{ submitLabel: string; company?: boolean; requiredOnly?: boolean }>) {
  const [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    contactMethod: "",
  });
  const [debugMessage, setDebugMessage] = useState<string | null>(null);
  const updateField = (field: keyof typeof formValues, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  return (
    <form
      className="mt-6 grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        setDebugMessage(
          `Нажали "${submitLabel}". Имя: ${formValues.name || "не указано"}, телефон: ${
            formValues.phone || "не указан"
          }, email: ${formValues.email || "не указан"}.`,
        );
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField
          label={requiredOnly ? "Имя*" : "Имя"}
          placeholder="Ваше имя"
          value={formValues.name}
          onChange={(value) => updateField("name", value)}
        />
        <FormField
          label={requiredOnly ? "Телефон*" : "Телефон"}
          placeholder="+7 (000) 000-00-00"
          value={formValues.phone}
          onChange={(value) => updateField("phone", value)}
        />
      </div>
      <FormField
        label={requiredOnly ? "Email*" : "Email"}
        placeholder="Ваш email"
        value={formValues.email}
        onChange={(value) => updateField("email", value)}
      />
      {company || requiredOnly ? (
        <FormField
          label="Компания"
          placeholder="Название компании"
          value={formValues.company}
          onChange={(value) => updateField("company", value)}
        />
      ) : null}
      <FormField
        label="Как с вами удобнее связаться?"
        placeholder="Телеграм"
        value={formValues.contactMethod}
        onChange={(value) => updateField("contactMethod", value)}
      />
      {requiredOnly ? (
        <p className="text-xs font-light">( * - обязательные для заполнения )</p>
      ) : (
        <label className="mt-2 flex gap-3 text-base leading-[1.4]">
          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-[#0f172a]" />
          <span>
            Нажимая на кнопку, вы соглашаетесь с обработкой <u>персональных данных</u>.
            Ознакомлены с <u>политикой конфиденциальности</u>
          </span>
        </label>
      )}
      <button
        type="submit"
        className="mt-4 flex w-full items-center justify-center gap-5 rounded-full bg-[#e8c880] px-6 py-4 text-2xl font-bold text-[#0f172a] transition hover:bg-[#ffecbf]"
      >
        {submitLabel}
        <ArrowIcon />
      </button>
      {debugMessage ? (
        <div className="rounded-2xl border border-[#e8c880] bg-[#fff8e8] p-4 text-sm text-[#0f172a]">
          {debugMessage}
        </div>
      ) : null}
    </form>
  );
}

function FormField({
  label,
  placeholder,
  value,
  onChange,
}: Readonly<{
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}>) {
  return (
    <label className="grid min-h-16 gap-1 bg-[#f8f8f8] px-4 py-3">
      <span className="font-bold">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="bg-transparent text-xs text-[#0f172a] outline-none placeholder:text-[#656565]/50"
      />
    </label>
  );
}

function InfoBlock({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <section className="rounded-2xl bg-[#f8f8f8] p-5">
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2">{children}</p>
    </section>
  );
}

function ContactItem({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-2xl bg-[#f8f8f8] p-5">
      <dt className="font-bold text-[#e8c880]">{label}</dt>
      <dd className="mt-2">{value}</dd>
    </div>
  );
}

function SectionHeading({
  kicker,
  title,
  centered = false,
  light = false,
}: Readonly<{
  kicker?: string;
  title: string;
  centered?: boolean;
  light?: boolean;
}>) {
  return (
    <div className={`${centered ? "mx-auto text-center" : ""} max-w-[780px]`}>
      {kicker ? <SectionKicker>{kicker}</SectionKicker> : null}
      <h2
        className={`text-3xl font-extrabold leading-[1.1] sm:text-4xl lg:text-5xl ${
          light ? "text-white" : "text-[#0f172a]"
        }`}
      >
        {title}
      </h2>
      <GoldRule centered={centered} />
    </div>
  );
}

function SectionKicker({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#e8c880] sm:text-base lg:text-xl">
      {children}
    </p>
  );
}

function GoldRule({ centered = false }: Readonly<{ centered?: boolean }>) {
  return (
    <div
      aria-hidden="true"
      className={`mt-5 flex w-full max-w-[700px] items-center ${
        centered ? "mx-auto" : ""
      }`}
    >
      <span className="h-2 w-2 shrink-0 rotate-45 bg-[#e8c880]" />
      <span className="h-px flex-1 bg-[#e8c880]" />
      <span className="h-2 w-2 shrink-0 rotate-45 bg-[#e8c880]" />
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: Readonly<{ title: string; description: string; icon: string }>) {
  return (
    <article className="group rounded-[10px] p-4 text-center transition duration-300 hover:-translate-y-2 hover:bg-gradient-to-b hover:from-[#f4f4f4]/70 hover:to-[#e8c880]/70 hover:shadow-[0_4px_9px_rgba(0,0,0,0.15)]">
      <IconImage src={icon} />
      <h3 className="mt-4 text-2xl font-bold leading-[1.1]">{title}</h3>
      <div className="mx-auto mt-4 h-px w-[150px] scale-x-0 bg-[#e8c880] transition group-hover:scale-x-100" />
      <p className="mt-4 text-base leading-8 lg:text-xl lg:leading-[1.8]">{description}</p>
    </article>
  );
}

function IconImage({ src, light = false }: Readonly<{ src: string; light?: boolean }>) {
  return (
    <div
      aria-hidden="true"
      className={`mx-auto h-16 w-16 bg-contain bg-center bg-no-repeat ${light ? "brightness-0 invert" : ""}`}
      style={{ backgroundImage: `url(${src})` }}
    />
  );
}

function ZoomImage({
  image,
  label,
  className,
  zoom = true,
}: Readonly<{ image: string; label: string; className: string; zoom?: boolean }>) {
  return (
    <div
      aria-label={label || undefined}
      role={label ? "img" : undefined}
      className={`overflow-hidden bg-[#f8f8f8] ${zoom ? "group" : ""} ${className}`}
    >
      <div
        className={`h-full w-full bg-cover bg-center transition duration-500 ${
          zoom ? "group-hover:scale-125" : ""
        }`}
        style={{ backgroundImage: `url(${image})` }}
      />
    </div>
  );
}

function DesignButton({
  children,
  onClick,
  size = "md",
}: Readonly<{ children: React.ReactNode; onClick: () => void; size?: "md" | "xl" }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-4 rounded-full border-2 border-[#e8c880] font-bold tracking-[0.03em] text-[#e8c880] transition hover:bg-[#e8c880] hover:text-[#0f172a] ${
        size === "xl" ? "px-7 py-4 text-2xl lg:text-[30px]" : "px-6 py-3 text-base"
      }`}
    >
      {children}
      <ArrowIcon />
    </button>
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
      className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#e8c880] text-[#e8c880] transition hover:bg-[#e8c880] hover:text-[#0f172a]"
    >
      <span className={direction === "left" ? "rotate-180" : ""}>
        <ArrowIcon />
      </span>
    </button>
  );
}

function ScrollTopButton({ visible }: Readonly<{ visible: boolean }>) {
  return (
    <button
      type="button"
      aria-label="Наверх"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-40 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#e8c880] text-[#0f172a] shadow-lg transition ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <span className="-rotate-90">
        <ArrowIcon size={36} />
      </span>
    </button>
  );
}

function CounterButton({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <button type="button" className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#0f172a]/50">
      {children}
    </button>
  );
}

function ArrowIcon({ size = 24 }: Readonly<{ size?: number }>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
