"use client";

import { useCallback, useEffect, useRef, useState, type InputHTMLAttributes } from "react";

import { legalDocuments, type LegalDocumentSlug } from "@/shared/config/legal-documents";
import { russianCities } from "@/shared/config/russian-cities";
import { siteConfig } from "@/shared/config/site";

type ModalType = "delivery" | "partners" | "contacts" | "checkout" | LegalDocumentSlug | null;
type CheckoutField = keyof CheckoutFormValues;
type CheckoutErrorField = CheckoutField | "quantity" | "consent";
type CheckoutErrors = Partial<Record<CheckoutErrorField, string>>;
type CheckoutLogoFile = {
  name: string;
  type: string;
  size: number;
  base64: string;
};

type CheckoutFormValues = {
  name: string;
  phone: string;
  email: string;
  company: string;
  inn: string;
  ogrn: string;
  contactMethod: string;
  contactHandle: string;
  city: string;
  comment: string;
  sealColor: string;
  artist: string;
};

type CheckoutState = {
  quantity: number;
  tab: "personal" | "company";
  formValues: CheckoutFormValues;
};

type AmoCRMCheckoutPayload = CheckoutState & {
  total: number;
  logoFile?: CheckoutLogoFile | null;
};

const assetPath = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
const checkoutStorageKey = "posleslovie:checkout-state";
const productPrice = 999;
const maxLogoFileSize = 3 * 1024 * 1024;
const normalizedRussianCities = new Map(
  russianCities.map((city) => [normalizeCitySearchValue(city), city]),
);
const initialCheckoutState: CheckoutState = {
  quantity: 3,
  tab: "personal",
  formValues: {
    name: "",
    phone: "+7 ",
    email: "",
    company: "",
    inn: "",
    ogrn: "",
    contactMethod: "tg",
    contactHandle: "",
    city: "",
    comment: "",
    sealColor: "red",
    artist: "",
  },
};

const amoCRMWorkerUrl = "https://posleslovie-amocrm.kailgurika.workers.dev/";

const assets = {
  hero: assetPath("/images/desktop-29/hero.jpg"),
  bombs1: assetPath("/images/desktop-29/bombs-1.jpg"),
  bombs2: assetPath("/images/desktop-29/bombs-2.jpg"),
  bombs3: assetPath("/images/desktop-29/bombs-3.jpg"),
  lavender1: assetPath("/images/desktop-29/product-2.svg"),
  lavender2: assetPath("/images/desktop-29/product-1.svg"),
  lavender3: assetPath("/images/desktop-29/product-3.svg"),
  packs1: assetPath("/images/desktop-29/packs-1.jpg"),
  packs2: assetPath("/images/desktop-29/packs-2.jpg"),
  packs3: assetPath("/images/desktop-29/packs-3.jpg"),
  review1: assetPath("/images/desktop-29/review-1.svg"),
  review2: assetPath("/images/desktop-29/review-2.svg"),
  review3: assetPath("/images/desktop-29/review-3.svg"),
  review4: assetPath("/images/desktop-29/review-4.svg"),
  cta: assetPath("/images/desktop-29/cta.jpg"),
  whyUs: assetPath("/images/desktop-29/why-us.jpg"),
  natureIcon: assetPath("/images/desktop-29/icon-nature.png"),
  giftIcon: assetPath("/images/desktop-29/icon-gift.png"),
  successIcon: assetPath("/images/desktop-29/icon-success.png"),
  starRow: assetPath("/images/desktop-29/stars.svg"),
  crystal: assetPath("/images/desktop-29/crystal.png"),
  pero: assetPath("/images/desktop-29/pero.png"),
};

const gallerySlides = {
  bombs: [
    { image: assets.bombs1, alt: "Мраморные бомбочки для ванны" },
    { image: assets.bombs2, alt: "Голубые бомбочки с лавандой" },
    { image: assets.bombs3, alt: "Бомбочка крупным планом" },
  ],
  lavender: [
    { image: assets.lavender1, alt: "Лавандовая бомбочка для ванны" },
    { image: assets.lavender2, alt: "Натуральные масла и сухоцветы" },
    { image: assets.lavender3, alt: "Временное изображение лавандового блока" },
  ],
  packs: [
    { image: assets.packs1, alt: "Подарочная упаковка Послесловие" },
    { image: assets.packs2, alt: "Брендированный набор бомбочек" },
    { image: assets.packs3, alt: "Упакованные наборы для подарков" },
  ],
} as const;

type GalleryKind = keyof typeof gallerySlides;
type GallerySlide = (typeof gallerySlides)[GalleryKind][number];

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
      "Каждая бомбочка сделана в ручную. В составе исключительно натуральные ингредиенты, прошедшие сертификацию в лаборатории. Мы не экономим на вас, главное принести реальную пользу",
    reverse: false,
    gallery: "bombs",
  },
  {
    eyebrow: "Натуральные масла",
    title: "Собираем лаванду вручную",
    description:
      "Наши партнеры собирают лаванду и изготавливают масло в ручную. Букет из 50 сортов лаванды в каждой бомбочке.",
    reverse: true,
    gallery: "lavender",
  },
  {
    eyebrow: "Продукция",
    title: "Упаковываем с любовью",
    description:
      "Мы нанесем ваш логотип на упаковку, вы выберите цвет сургучной печати. Мы возьмем на себя все технические моменты, чтобы вы получили готовый брендированный бокс, соответствующий эстетике и духу вашей компании",
    reverse: false,
    gallery: "packs",
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
const CAROUSEL_FAST_DURATION_MS = 250;

type CarouselDirection = 1 | -1;

function useInfiniteCarousel<T>(items: readonly T[]) {
  const [orderedItems, setOrderedItems] = useState<T[]>(() => [...items]);
  const [offset, setOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDuration, setTransitionDuration] = useState(CAROUSEL_DURATION_MS);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameRef = useRef<number | null>(null);
  const queuedMovesRef = useRef<CarouselDirection[]>([]);
  const isAnimatingRef = useRef(false);

  const clearPendingAnimation = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    queuedMovesRef.current = [];
    isAnimatingRef.current = false;
  }, []);

  function startNextMove() {
    if (isAnimatingRef.current) {
      return;
    }

    const direction = queuedMovesRef.current.shift();

    if (!direction) {
      return;
    }

    const duration =
      queuedMovesRef.current.length > 0 ? CAROUSEL_FAST_DURATION_MS : CAROUSEL_DURATION_MS;

    isAnimatingRef.current = true;
    setTransitionDuration(duration);

    if (direction === 1) {
      setIsTransitioning(true);
      setOffset(-1);

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        setIsTransitioning(false);
        setOrderedItems((current) =>
          current.length > 0 ? [...current.slice(1), current[0]] : current,
        );
        setOffset(0);
        isAnimatingRef.current = false;

        frameRef.current = window.requestAnimationFrame(() => {
          frameRef.current = null;
          startNextMove();
        });
      }, duration);
      return;
    }

    setIsTransitioning(false);
    setOrderedItems((current) =>
      current.length > 0 ? [current[current.length - 1], ...current.slice(0, -1)] : current,
    );
    setOffset(-1);

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        setIsTransitioning(true);
        setOffset(0);

        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          setIsTransitioning(false);
          isAnimatingRef.current = false;

          frameRef.current = window.requestAnimationFrame(() => {
            frameRef.current = null;
            startNextMove();
          });
        }, duration);
      });
    });
  }

  useEffect(() => () => clearPendingAnimation(), [clearPendingAnimation]);

  const move = (direction: CarouselDirection) => {
    queuedMovesRef.current.push(direction);
    startNextMove();
  };

  return { orderedItems, offset, isTransitioning, transitionDuration, move };
}

function parseCheckoutState(value: string | null): CheckoutState {
  if (!value) {
    return initialCheckoutState;
  }

  try {
    const parsed = JSON.parse(value) as Partial<CheckoutState>;
    const formValues = {
      ...initialCheckoutState.formValues,
      ...(parsed.formValues ?? {}),
    };

    return {
      quantity: Math.max(1, Number(parsed.quantity) || initialCheckoutState.quantity),
      tab: parsed.tab === "company" ? "company" : "personal",
      formValues: {
        ...formValues,
        phone: formatRussianPhoneInput(formValues.phone),
        contactMethod: formValues.contactMethod === "max" ? "max" : "tg",
      },
    };
  } catch {
    return initialCheckoutState;
  }
}

function getRussianPhoneDigits(value: string) {
  const digits = value.replace(/\D/g, "");
  const hasVisibleCountryCode = value.trim().startsWith("+7");

  if (hasVisibleCountryCode && digits.startsWith("7")) {
    return digits.slice(1, 11);
  }

  if (digits.length > 10 && /^[78]/.test(digits)) {
    return digits.slice(1, 11);
  }

  return digits.slice(0, 10);
}

function formatRussianPhoneInput(value: string) {
  const digits = getRussianPhoneDigits(value);
  const parts = ["+7"];

  if (digits.length > 0) {
    parts.push(` (${digits.slice(0, 3)}`);
  }

  if (digits.length >= 3) {
    parts[1] += ")";
  }

  if (digits.length > 3) {
    parts.push(` ${digits.slice(3, 6)}`);
  }

  if (digits.length > 6) {
    parts.push(`-${digits.slice(6, 8)}`);
  }

  if (digits.length > 8) {
    parts.push(`-${digits.slice(8, 10)}`);
  }

  return digits.length > 0 ? parts.join("") : "+7 ";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value.trim());
}

function isValidRussianPhone(value: string) {
  return getRussianPhoneDigits(value).length === 10;
}

function isValidTelegramHandle(value: string) {
  return /^@[a-zA-Z0-9_]{5,32}$/.test(value.trim());
}

function normalizeCitySearchValue(value: string) {
  return value.toLocaleLowerCase("ru").replaceAll("ё", "е").trim();
}

function getRussianCityName(value: string) {
  return normalizedRussianCities.get(normalizeCitySearchValue(value)) ?? null;
}

function readFileAsCheckoutLogo(file: File) {
  return new Promise<CheckoutLogoFile>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const base64 = result.includes(",") ? result.split(",")[1] : result;

      resolve({
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        base64,
      });
    };
    reader.onerror = () => reject(reader.error ?? new Error("Не удалось прочитать файл."));
    reader.readAsDataURL(file);
  });
}

function validateCheckout(values: CheckoutFormValues, tab: "personal" | "company", quantity: number) {
  const errors: CheckoutErrors = {};

  if (!Number.isFinite(quantity) || quantity < 1) {
    errors.quantity = "Укажите количество от 1 штуки.";
  }

  if (!values.name.trim()) {
    errors.name = "Укажите имя.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Укажите телефон.";
  } else if (!isValidRussianPhone(values.phone)) {
    errors.phone = "Введите российский номер в формате +7XXXXXXXXXX.";
  }

  if (!values.email.trim()) {
    errors.email = "Укажите email.";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Введите корректный email, например name@example.ru.";
  }

  if (tab === "company" && !values.company.trim()) {
    errors.company = "Укажите название компании.";
  }

  if (values.contactMethod === "tg" && !values.contactHandle.trim()) {
    errors.contactHandle = "Укажите ник в Telegram.";
  } else if (values.contactMethod === "tg" && !isValidTelegramHandle(values.contactHandle)) {
    errors.contactHandle = "Введите @ и 5-32 символа: латиница, цифры или _.";
  }

  if (tab === "personal" && !values.city.trim()) {
    errors.city = "Укажите город доставки.";
  } else if (tab === "personal" && !getRussianCityName(values.city)) {
    errors.city = "Выберите город из списка подсказок.";
  }

  return errors;
}

function getStep1Errors(errors: CheckoutErrors) {
  const step1Fields: CheckoutErrorField[] = [
    "name",
    "phone",
    "email",
    "company",
    "contactHandle",
    "city",
    "quantity",
  ];

  return step1Fields.reduce<CheckoutErrors>((acc, field) => {
    if (errors[field]) {
      acc[field] = errors[field];
    }

    return acc;
  }, {});
}

function hasErrors(errors: CheckoutErrors) {
  return Object.keys(errors).length > 0;
}

function prepareCheckoutPayload({
  tab,
  quantity,
  formValues,
  total,
  logoFile = null,
}: AmoCRMCheckoutPayload): AmoCRMCheckoutPayload {
  const trimmedValues = Object.fromEntries(
    Object.entries(formValues).map(([key, value]) => [key, value.trim()]),
  ) as CheckoutFormValues;

  return {
    tab,
    quantity,
    total,
    logoFile,
    formValues: {
      ...trimmedValues,
      company: tab === "company" ? trimmedValues.company : "",
      inn: tab === "company" ? trimmedValues.inn : "",
      ogrn: tab === "company" ? trimmedValues.ogrn : "",
      city: tab === "personal" ? getRussianCityName(trimmedValues.city) ?? trimmedValues.city : "",
      contactHandle: trimmedValues.contactMethod === "tg" ? trimmedValues.contactHandle : "",
    },
  };
}

async function submitCheckoutToAmoCRM(payload: AmoCRMCheckoutPayload) {
  const response = await fetch(amoCRMWorkerUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`AmoCRM worker rejected checkout request: ${response.status}`);
  }
}

function useCheckoutState() {
  const [checkoutState, setCheckoutState] = useState<CheckoutState>(initialCheckoutState);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setCheckoutState(parseCheckoutState(window.localStorage.getItem(checkoutStorageKey)));
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    window.localStorage.setItem(checkoutStorageKey, JSON.stringify(checkoutState));
  }, [checkoutState, isReady]);

  const updateQuantity = (quantity: number) => {
    setCheckoutState((current) => ({
      ...current,
      quantity: Math.max(1, Math.floor(quantity) || 1),
    }));
  };

  const updateField = (field: CheckoutField, value: string) => {
    setCheckoutState((current) => ({
      ...current,
      formValues: {
        ...current.formValues,
        [field]: value,
      },
    }));
  };

  const updateTab = (tab: "personal" | "company") => {
    setCheckoutState((current) => ({ ...current, tab }));
  };

  return { checkoutState, updateQuantity, updateField, updateTab };
}

export default function Home() {
  const [modal, setModal] = useState<ModalType>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { checkoutState, updateQuantity, updateField, updateTab } = useCheckoutState();

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
    <div className="bg-[#f8f8f8] text-[#0f172a]">
      <HeroSection onOrder={() => setModal("checkout")} />

      <section id="bombs" className="px-5 py-16 lg:px-[100px] lg:py-[100px]">
        <div className="mx-auto max-w-[1280px] rounded-[48px] bg-white px-6 py-14 lg:min-h-[750px] lg:rounded-[100px] lg:px-20 lg:py-20">
          <SectionHeading title="Дарите настроение и заботу тем, кто вам важен и дорог" centered />
          <div className="mt-14 grid gap-10 lg:grid-cols-3 lg:gap-16">
            {featureCards.map((card) => (
              <FeatureCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      <div className="space-y-8 lg:space-y-0">
        {processSections.map((section, index) => (
          <ProcessSection
            key={section.title}
            {...section}
            index={index}
            onOrder={() => setModal("checkout")}
          />
        ))}
      </div>

      <WhyUsSection />
      <AboutSection />
      <ReviewsSection />
      <CtaSection onOrder={() => setModal("checkout")} />

      <ScrollTopButton visible={showScrollTop} />
      <HomeModal
        type={modal}
        checkoutState={checkoutState}
        onCheckoutFieldChange={updateField}
        onCheckoutQuantityChange={updateQuantity}
        onCheckoutTabChange={updateTab}
        onClose={() => setModal(null)}
      />
    </div>
  );
}

function HeroSection({ onOrder }: Readonly<{ onOrder: () => void }>) {
  return (
    <section className="relative min-h-[760px] overflow-hidden bg-[#102038] lg:min-h-[1080px]">
      <div
        className="absolute inset-x-[-5vw] top-0 h-full scale-[1.01] bg-cover bg-center lg:inset-x-[-103px]"
        style={{ backgroundImage: `url(${assets.hero})` }}
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute left-1/2 top-[265px] hidden h-[572px] w-[64.3vw] max-w-[1234px] -translate-x-1/2 rounded-[385px] bg-black/[0.01] backdrop-blur-[5px] lg:block" />
      <div className="relative mx-auto flex max-w-[1720px] justify-center px-5 pb-20 pt-64 text-center lg:px-[100px] lg:pt-[355px]">
        <div className="max-w-[1234px]">
          <h1 className="text-6xl font-normal leading-none text-white [font-family:var(--font-educational)] sm:text-7xl lg:text-[126px]">
            Послесловие к вашему дню
          </h1>
          <p className="mt-7 text-xl font-medium leading-[1.6] text-[#dfdfdf] lg:text-[25px]">
            Энергия природы в каждой бомбочке для ванны
            <br />
            Внимание и забота к каждой минуте наедине с собой
          </p>
          <div className="mt-16">
            <DesignButton size="xl" variant="filled" onClick={onOrder}>
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
  gallery,
  button,
  onOrder,
  index,
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  reverse: boolean;
  gallery: GalleryKind;
  button?: string;
  onOrder: () => void;
  index: number;
}>) {
  return (
    <section className="relative bg-[#f8f8f8] px-5 py-12 lg:px-[100px] lg:py-[100px]">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[42px] bg-white shadow-[0_5px_5px_rgba(255,93,93,0.1)] lg:rounded-[70px]">
        <div
          className={`pointer-events-none absolute inset-0 hidden lg:grid ${
            reverse ? "grid-cols-[1fr_323px]" : "grid-cols-[323px_1fr]"
          }`}
        >
          <div className={`bg-white mix-blend-lighten ${reverse ? "order-2" : ""}`} />
          <div className="bg-white" />
        </div>
        {index === 0 ? (
          <DecorativeObject
            image={assets.crystal}
            className="absolute bottom-[64px] right-[55px] z-10 h-[225px] w-[199px] opacity-90"
          />
        ) : null}
        {index === 2 ? (
          <DecorativeObject
            image={assets.pero}
            className="absolute bottom-[80px] right-[60px] z-10 h-[152px] w-[266px] opacity-75"
          />
        ) : null}

        <div className="relative grid items-center gap-10 p-5 sm:p-8 lg:min-h-[665px] lg:grid-cols-[525px_552px] lg:items-start lg:gap-16 lg:p-12">
          <ProductGallery
            reverse={reverse}
            slides={gallerySlides[gallery]}
          />

          <div className={reverse ? "lg:order-1" : ""}>
            <div className="max-w-[552px]">
              <SectionKicker>{eyebrow}</SectionKicker>
              <h2 className="mt-2 text-3xl font-extrabold leading-[1.1] sm:text-4xl lg:text-[40px] xl:text-5xl">
                {title}
              </h2>
              <GoldRule />
              <p className="mt-4 text-base leading-8 [font-family:var(--font-inter)] lg:text-lg lg:leading-[1.8] xl:text-xl">
                {description}
              </p>
              {button ? (
                <div className="mt-10 lg:mt-16">
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
  slides,
}: Readonly<{
  reverse: boolean;
  slides: readonly GallerySlide[];
}>) {
  const { orderedItems, offset, isTransitioning, transitionDuration, move } =
    useInfiniteCarousel(slides);

  return (
    <div className={`${reverse ? "lg:order-2 lg:justify-self-end" : ""}`}>
      <div className="relative">
        <TapeImageCarousel
          slides={orderedItems}
          offset={offset}
          isTransitioning={isTransitioning}
          transitionDuration={transitionDuration}
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
  transitionDuration,
}: Readonly<{
  slides: GallerySlide[];
  offset: number;
  isTransitioning: boolean;
  transitionDuration: number;
}>) {
  return (
    <div className="aspect-square overflow-hidden rounded-[32px] bg-[#f8f8f8] lg:h-[525px] lg:w-[525px] lg:rounded-[50px]">
      <div
        className={`flex h-full ${isTransitioning ? "transition-transform ease-out" : ""}`}
        style={{
          transform: `translateX(${offset * 100}%)`,
          transitionDuration: isTransitioning ? `${transitionDuration}ms` : undefined,
        }}
      >
        {slides.map((slide) => (
          <div key={slide.image} className="zoom-frame h-full w-full shrink-0 overflow-hidden">
            <div
              aria-label={slide.alt}
              role="img"
              className="zoom-media h-full w-full bg-cover bg-center"
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
      className="relative overflow-hidden bg-cover bg-center px-5 py-16 text-white lg:px-[235px] lg:py-20"
      style={{ backgroundImage: `url(${assets.whyUs})` }}
    >
      <div className="absolute inset-0 bg-white/10" />
      <div className="relative mx-auto max-w-[1456px]">
        <SectionHeading kicker="Преимущества" title="Почему выбирают нас?" centered light />
        <div className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-24">
          {reasons.map((reason) => (
            <article key={reason.title} className="text-center">
              <IconImage src={reason.icon} />
              <h3 className="mt-4 text-2xl font-bold leading-[1.1]">{reason.title}</h3>
              <p className="mt-2 text-lg leading-[1.8] [font-family:var(--font-inter)] lg:text-xl">{reason.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="bg-[#f8f8f8] px-5 py-12 lg:px-[100px] lg:py-[100px]">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[42px] bg-white lg:rounded-[70px]">
        <div className="pointer-events-none absolute inset-0 hidden grid-cols-[1fr_323px] lg:grid">
          <div />
          <div className="bg-white mix-blend-lighten" />
        </div>
        <div className="relative grid items-center gap-10 p-5 sm:p-8 lg:min-h-[665px] lg:grid-cols-2 lg:gap-16 lg:p-12">
          <div className="max-w-[552px]">
            <SectionKicker>О нас</SectionKicker>
            <h2 className="mt-2 text-3xl font-extrabold leading-[1.1] sm:text-4xl lg:text-5xl">
              Кто мы такие?
            </h2>
            <GoldRule />
            <div className="mt-5 space-y-6 text-base leading-8 [font-family:var(--font-inter)] lg:text-xl lg:leading-[1.8]">
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
            image={assets.bombs1}
            label="Бомбочки Послесловие"
            className="aspect-square rounded-[32px] lg:h-[525px] lg:w-[525px] lg:rounded-[50px]"
          />
        </div>
      </div>
    </section>
  );
}

function ReviewsSection() {
  const { orderedItems, offset, isTransitioning, transitionDuration, move } =
    useInfiniteCarousel(reviews);

  return (
    <section id="reviews" className="overflow-hidden bg-[#f8f8f8] px-5 py-16 lg:px-[100px] lg:py-20">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeading kicker="Отзывы" title="Нам доверяют" centered />
        <div className="mt-14 overflow-hidden [--carousel-gap:2rem] [--carousel-step:calc(100%_+_var(--carousel-gap))] lg:[--carousel-gap:3rem] lg:[--carousel-step:calc((100%_-_var(--carousel-gap)*2)/3_+_var(--carousel-gap))]">
          <div
            className={`flex gap-[var(--carousel-gap)] ${isTransitioning ? "transition-transform ease-out" : ""}`}
            style={{
              transform: offset === 0 ? "translateX(0)" : "translateX(calc(-1 * var(--carousel-step)))",
              transitionDuration: isTransitioning ? `${transitionDuration}ms` : undefined,
            }}
          >
            {orderedItems.map((review) => (
              <article
                key={review.name}
                className="group flex min-h-[600px] w-full shrink-0 basis-full flex-col justify-between rounded-[15px] bg-white p-6 transition duration-300 hover:-translate-y-2 hover:shadow-[0_18px_50px_rgba(15,23,42,0.14)] sm:p-8 lg:basis-[calc((100%_-_var(--carousel-gap)*2)/3)]"
              >
                <div>
                  <ZoomImage image={review.image} label="" className="h-[220px] rounded-[20px]" zoom={false} />
                  <div
                    aria-label="5 звезд"
                    className="mt-5 h-[21px] w-[131px] bg-contain bg-left bg-no-repeat"
                    style={{ backgroundImage: `url(${assets.starRow})` }}
                  />
                  <p className="mt-4 text-base leading-[1.6] [font-family:var(--font-inter)] lg:text-lg">{review.text}</p>
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
      className="relative overflow-hidden bg-[#c1aeff] bg-cover bg-center px-5 py-20 text-center text-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] lg:px-[100px] lg:py-20"
      style={{ backgroundImage: `linear-gradient(0deg, rgba(14,17,50,0.3), rgba(14,17,50,0.3)), url(${assets.cta})` }}
    >
      <div className="relative mx-auto flex max-w-[1200px] flex-col items-center">
        <h2 className="max-w-[760px] text-3xl font-extrabold leading-[1.1] sm:text-4xl lg:text-5xl">
          Наши наборы - ваш идеальный комплимент!
        </h2>
        <p className="mt-5 max-w-[540px] text-lg font-light leading-[1.6] sm:text-2xl">
          Подарите минуты душевного равновесия и культурный опыт тем, кто вам важен
        </p>
        <div className="mt-8">
          <DesignButton size="xl" onClick={onOrder}>Оформить заказ</DesignButton>
        </div>
      </div>
    </section>
  );
}

function DecorativeObject({
  image,
  className,
}: Readonly<{ image: string; className: string }>) {
  return (
    <img
      src={image}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none hidden object-contain lg:block ${className}`}
    />
  );
}

function isLegalDocumentSlug(type: ModalType): type is LegalDocumentSlug {
  return Boolean(type && legalDocuments.some((document) => document.slug === type));
}

function getModalHeader(type: Exclude<ModalType, null>) {
  if (isLegalDocumentSlug(type)) {
    const document = legalDocuments.find((item) => item.slug === type);
    return {
      kicker: "Документы",
      title: document?.title ?? "Документ",
    };
  }

  const headers = {
    delivery: {
      kicker: "Оплата и доставка",
      title: "Условия оплаты и доставки",
    },
    partners: {
      kicker: "Партнерство",
      title: "Хотите стать нашим партнером?",
    },
    contacts: {
      kicker: "Контактные данные",
      title: "Свяжитесь с нами",
    },
    checkout: {
      kicker: "Оформление заказа",
      title: "Бомбочка для ванны",
    },
  } satisfies Record<Exclude<ModalType, LegalDocumentSlug | null>, { kicker: string; title: string }>;

  return headers[type];
}

function HomeModal({
  type,
  checkoutState,
  onCheckoutFieldChange,
  onCheckoutQuantityChange,
  onCheckoutTabChange,
  onClose,
}: Readonly<{
  type: ModalType;
  checkoutState: CheckoutState;
  onCheckoutFieldChange: (field: CheckoutField, value: string) => void;
  onCheckoutQuantityChange: (quantity: number) => void;
  onCheckoutTabChange: (tab: "personal" | "company") => void;
  onClose: () => void;
}>) {
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (type !== "checkout") {
      queueMicrotask(() => setCheckoutStep(1));
    }
  }, [type]);

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

  const header = getModalHeader(type);
  const isCheckout = type === "checkout";

  const handleCheckoutTabChange = (newTab: "personal" | "company") => {
    onCheckoutTabChange(newTab);
    setCheckoutStep(1);
  };

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
        className="relative flex max-h-[92vh] w-full max-w-[920px] flex-col overflow-hidden rounded-[36px] bg-white pb-8 shadow-2xl lg:rounded-[50px] lg:pb-12"
      >
        <div className="sticky top-0 z-20 bg-white px-6 pb-6 pt-8 shadow-[0_12px_30px_rgba(15,23,42,0.08)] lg:px-12 lg:pt-12">
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#e8c880] text-[#e8c880] transition hover:bg-[#e8c880] hover:text-[#0f172a]"
          >
            <CrossIcon />
          </button>
          <div className="max-w-[760px] pr-16">
            <SectionKicker>{header.kicker}</SectionKicker>
            <h2 className="mt-2 text-3xl font-extrabold leading-[1.1] lg:text-[40px]">
              {header.title}
            </h2>
            <GoldRule />
          </div>
          {isCheckout ? (
            <div className="mt-5 flex items-center justify-center gap-4">
              <button
                type="button"
                title="Back to step 1"
                onClick={() => { if (checkoutStep === 2) setCheckoutStep(1); }}
                disabled={checkoutStep === 1}
                className={`flex h-10 w-10 shrink-0 rotate-180 items-center justify-center rounded-full transition ${
                  checkoutStep === 2
                    ? "bg-[#e8c880] text-[#0f172a] hover:bg-[#ffecbf]"
                    : "cursor-default bg-[#d7d7d7] text-[#9a9b9c]"
                }`}
              >
                <ArrowIcon size={18} />
              </button>
              <div className="grid w-full max-w-[560px] grid-cols-2 overflow-hidden rounded-full bg-[#d7d7d7]">
                <button
                  type="button"
                  title="Order for personal use"
                  onClick={() => handleCheckoutTabChange("personal")}
                  className={`py-3 text-sm font-extrabold transition ${
                    checkoutState.tab === "personal"
                      ? "rounded-full bg-[#e8c880] text-[#0f172a]"
                      : "text-[#9a9b9c] hover:text-[#0f172a]"
                  }`}
                >
                  Для себя
                </button>
                <button
                  type="button"
                  title="Order for company"
                  onClick={() => handleCheckoutTabChange("company")}
                  className={`py-3 text-sm font-extrabold transition ${
                    checkoutState.tab === "company"
                      ? "rounded-full bg-[#e8c880] text-[#0f172a]"
                      : "text-[#9a9b9c] hover:text-[#0f172a]"
                  }`}
                >
                  Для компании
                </button>
              </div>
            </div>
          ) : null}
        </div>
        <div className="modal-scroll min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-8 lg:px-12 lg:pb-4">
          {type === "delivery" ? <DeliveryModal /> : null}
          {type === "partners" ? <PartnersModal /> : null}
          {type === "contacts" ? <ContactsModal /> : null}
          {isCheckout ? (
            <CheckoutModal
              checkoutState={checkoutState}
              step={checkoutStep}
              onStepChange={setCheckoutStep}
              onFieldChange={onCheckoutFieldChange}
              onQuantityChange={onCheckoutQuantityChange}
            />
          ) : null}
          {isLegalDocumentSlug(type) ? <LegalDocumentModal slug={type} /> : null}
        </div>
      </div>
    </div>
  );
}

function PartnersModal() {
  return (
    <div className="max-w-[760px]">
      <p className="max-w-[700px] text-base leading-[1.8] lg:text-lg">
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
      <div className="space-y-6 text-base leading-[1.75] text-[#0f172a]">
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
    <div className="max-w-[552px]">
      <dl className="grid gap-3 text-base">
        <ContactItem label="Телефон" value={siteConfig.phone} href={`tel:${siteConfig.phone.replace(/\D/g, "")}`} />
        <ContactItem label="Почта" value={siteConfig.email} href={`mailto:${siteConfig.email}`} />
        <ContactItem label="Адрес" value="г. Севастополь, ул. Бориса Михайлова 3А, кв. 44" />
        <div className="grid gap-3 sm:grid-cols-[234px_1fr]">
          <ContactItem label="ИНН" value="Будет указан после открытия ИП" compact />
          <ContactItem label="ОГРНИП" value="Будет указан после открытия ИП" compact />
        </div>
        <ContactItem label="ИП" value="Серебренникова Полина Кирилловна" />
      </dl>
    </div>
  );
}

function CheckoutModal({
  checkoutState,
  step,
  onStepChange,
  onFieldChange,
  onQuantityChange,
}: Readonly<{
  checkoutState: CheckoutState;
  step: 1 | 2;
  onStepChange: (step: 1 | 2) => void;
  onFieldChange: (field: CheckoutField, value: string) => void;
  onQuantityChange: (quantity: number) => void;
}>) {
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [isConsentAccepted, setIsConsentAccepted] = useState(false);
  const [logoFile, setLogoFile] = useState<CheckoutLogoFile | null>(null);
  const [logoFileError, setLogoFileError] = useState<string | null>(null);
  const { tab, quantity, formValues } = checkoutState;
  const total = quantity * productPrice;

  useEffect(() => {
    queueMicrotask(() => {
      setErrors({});
      setSubmitMessage(null);
    });
  }, [tab]);

  const handleFieldChange = (field: CheckoutField, value: string) => {
    onFieldChange(field, field === "phone" ? formatRussianPhoneInput(value) : value);
    setErrors((current) => {
      if (!current[field] && !(field === "contactMethod" && current.contactHandle)) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      if (field === "contactMethod") {
        delete next.contactHandle;
      }
      return next;
    });
  };

  const handleConsentChange = (isAccepted: boolean) => {
    setIsConsentAccepted(isAccepted);
    setErrors((current) => {
      if (!current.consent) {
        return current;
      }

      const next = { ...current };
      delete next.consent;
      return next;
    });
  };

  const handleLogoFileChange = async (file: File | null) => {
    setLogoFile(null);
    setLogoFileError(null);

    if (!file) {
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setLogoFileError("Загрузите файл в формате JPG или PNG.");
      return;
    }

    if (file.size > maxLogoFileSize) {
      setLogoFileError("Файл должен быть не больше 3 МБ.");
      return;
    }

    try {
      setLogoFile(await readFileAsCheckoutLogo(file));
    } catch {
      setLogoFileError("Не удалось прочитать файл. Попробуйте выбрать его ещё раз.");
    }
  };

  const handleQuantityChange = (nextQuantity: number) => {
    onQuantityChange(nextQuantity);
    setErrors((current) => {
      if (!current.quantity) {
        return current;
      }

      const next = { ...current };
      delete next.quantity;
      return next;
    });
  };

  const handleContinue = () => {
    const nextErrors = getStep1Errors(validateCheckout(formValues, tab, quantity));
    setErrors(nextErrors);
    setSubmitMessage(null);

    if (!hasErrors(nextErrors)) {
      onStepChange(2);
    }
  };

  const handleSubmit = async () => {
    const nextErrors = validateCheckout(formValues, tab, quantity);

    if (!isConsentAccepted) {
      nextErrors.consent = "Подтвердите согласие с условиями, чтобы оформить заказ.";
    }

    if (logoFileError) {
      setSubmitMessage(logoFileError);
      return;
    }

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      setSubmitMessage("Проверьте выделенные поля и исправьте ошибки.");

      if (hasErrors(getStep1Errors(nextErrors))) {
        onStepChange(1);
      }

      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("Отправляем заявку в AmoCRM...");

    try {
      await submitCheckoutToAmoCRM(prepareCheckoutPayload({ tab, quantity, formValues, total, logoFile }));
      setSubmitMessage("Ваша заявка отправлена в AmoCRM. Мы свяжемся с вами в ближайшее время.");
    } catch (error) {
      console.error(error);
      setSubmitMessage(
        "Не удалось отправить заявку в AmoCRM. Проверьте токен, CORS и доступы интеграции.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          {step === 1 ? (
            <CheckoutStep1Form
              tab={tab}
              values={formValues}
              errors={errors}
              onFieldChange={handleFieldChange}
              onContinue={handleContinue}
            />
          ) : (
            <CheckoutStep2Form
              tab={tab}
              values={formValues}
              errors={errors}
              onFieldChange={handleFieldChange}
              logoFile={logoFile}
              logoFileError={logoFileError}
              onLogoFileChange={handleLogoFileChange}
              isConsentAccepted={isConsentAccepted}
              onConsentChange={handleConsentChange}
              submitMessage={submitMessage}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          )}
        </div>

        <CheckoutOrderPanel
          quantity={quantity}
          total={total}
          error={errors.quantity}
          onQuantityChange={handleQuantityChange}
        />
      </div>
    </div>
  );
}

function CheckoutStep1Form({
  tab,
  values,
  errors,
  onFieldChange,
  onContinue,
}: Readonly<{
  tab: "personal" | "company";
  values: CheckoutFormValues;
  errors: CheckoutErrors;
  onFieldChange: (field: CheckoutField, value: string) => void;
  onContinue: () => void;
}>) {
  const hasStepErrors = hasErrors(getStep1Errors(errors));

  return (
    <div>
      <h3 className="text-2xl font-extrabold">Контактная информация</h3>
      <div className="mt-4 h-[3px] rounded-full bg-[#c5c5c5]" />
      <div className="mt-6 grid gap-3">
        {hasStepErrors ? (
          <FormErrorSummary message="Проверьте контактные данные и детали заказа." />
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField
            label="Имя"
            placeholder="Ваше имя"
            value={values.name}
            error={errors.name}
            required
            autoComplete="name"
            onChange={(v) => onFieldChange("name", v)}
          />
          <FormField
            label="Телефон"
            placeholder="+7 (000) 000-00-00"
            value={values.phone}
            error={errors.phone}
            required
            autoComplete="tel"
            inputMode="tel"
            onChange={(v) => onFieldChange("phone", v)}
          />
        </div>
        <FormField
          label="Email"
          placeholder="Ваш email"
          value={values.email}
          error={errors.email}
          required
          type="email"
          autoComplete="email"
          onChange={(v) => onFieldChange("email", v)}
        />
        {tab === "company" ? (
          <>
            <FormField
              label="Компания"
              placeholder="Название компании"
              value={values.company}
              error={errors.company}
              required
              autoComplete="organization"
              onChange={(v) => onFieldChange("company", v)}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                label="ИНН"
                placeholder="ИНН"
                value={values.inn}
                inputMode="numeric"
                onChange={(v) => onFieldChange("inn", v)}
              />
              <FormField
                label="ОГРН"
                placeholder="ОГРН"
                value={values.ogrn}
                inputMode="numeric"
                onChange={(v) => onFieldChange("ogrn", v)}
              />
            </div>
          </>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-transparent bg-[#f8f8f8] px-4 py-3">
            <p className="text-base font-bold text-[#0f172a]">Как с вами удобнее связаться?</p>
            <select
              title="Contact method"
              value={values.contactMethod}
              onChange={(e) => onFieldChange("contactMethod", e.target.value)}
              className="mt-2 w-full bg-transparent text-sm text-[#0f172a] outline-none"
            >
              <option value="tg">Telegram</option>
              <option value="max">MAX</option>
            </select>
          </div>
          <FormField
            label="Ник (TG)"
            placeholder="@username"
            value={values.contactHandle}
            error={errors.contactHandle}
            required={values.contactMethod === "tg"}
            onChange={(v) => onFieldChange("contactHandle", v)}
          />
        </div>
        {tab === "personal" ? (
          <CitySelectField
            label="Город доставки"
            placeholder="Москва"
            value={values.city}
            error={errors.city}
            required
            onChange={(v) => onFieldChange("city", v)}
          />
        ) : (
          <FormFieldTextarea
            label="Комментарий к заказу"
            placeholder="Комментарии, которые помогут нам лучше узнать о задаче"
            value={values.comment}
            onChange={(v) => onFieldChange("comment", v)}
          />
        )}
        <RequiredFieldsNote />
        <button
          type="button"
          title="Continue to step 2"
          onClick={onContinue}
          className="mt-4 flex w-full items-center justify-center gap-5 rounded-full bg-[#e8c880] px-6 py-4 text-xl font-bold text-[#0f172a] transition hover:bg-[#ffecbf]"
        >
          Продолжить оформление
          <ArrowIcon size={22} />
        </button>
      </div>
    </div>
  );
}

function CheckoutStep2Form({
  tab,
  values,
  errors,
  onFieldChange,
  logoFile,
  logoFileError,
  onLogoFileChange,
  isConsentAccepted,
  onConsentChange,
  submitMessage,
  isSubmitting,
  onSubmit,
}: Readonly<{
  tab: "personal" | "company";
  values: CheckoutFormValues;
  errors: CheckoutErrors;
  onFieldChange: (field: CheckoutField, value: string) => void;
  logoFile: CheckoutLogoFile | null;
  logoFileError: string | null;
  onLogoFileChange: (file: File | null) => void;
  isConsentAccepted: boolean;
  onConsentChange: (isAccepted: boolean) => void;
  submitMessage: string | null;
  isSubmitting: boolean;
  onSubmit: () => void;
}>) {
  const sealColors = [
    { id: "red", label: "Красный", color: "#b03020" },
    { id: "green", label: "Зелёный", color: "#2e7d32" },
    { id: "white", label: "Белый", color: "#e8e6e1" },
    { id: "blue", label: "Синий", color: "#1565c0" },
  ];

  const activeSeal = values.sealColor || "red";

  return (
    <div>
      <h3 className="text-2xl font-extrabold">Пожелания в подарок</h3>
      <div className="mt-4 h-[3px] rounded-full bg-[#c5c5c5]" />
      <div className="mt-6 grid gap-3">
        {hasErrors(errors) ? (
          <FormErrorSummary message="В заказе остались ошибки. Вернитесь к выделенным полям." />
        ) : null}
        <div className={`relative rounded border bg-[#f8f8f8] p-4 ${logoFileError ? "border-red-500" : "border-transparent"}`}>
          <p className="text-base font-bold text-[#0f172a]">Логотип</p>
          <p className="mt-1 text-xs text-[rgba(101,101,101,0.7)]">
            {logoFile ? `Выбран файл: ${logoFile.name}` : "Файлы формата .jpg .png не больше 3мб"}
          </p>
          {logoFileError ? <FieldErrorMessage message={logoFileError} /> : null}
          <label
            title="Upload logo file"
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              className="hidden"
              onChange={(event) => onLogoFileChange(event.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <div className="rounded bg-[#f8f8f8] p-4">
          <p className="text-base font-bold text-[#0f172a]">Выбор художника</p>
          <select
            title="Choose artist"
            value={values.artist}
            onChange={(e) => onFieldChange("artist", e.target.value)}
            className="mt-2 w-full bg-transparent text-sm text-[rgba(101,101,101,0.7)] outline-none"
          >
            <option value="">Художник 1</option>
            <option value="artist2">Художник 2</option>
            <option value="artist3">Художник 3</option>
          </select>
        </div>

        <div className="rounded bg-[#f8f8f8] p-4">
          <p className="text-base font-bold text-[#0f172a]">Цвет сургутной печати</p>
          <p className="mt-1 text-xs text-[rgba(101,101,101,0.7)]">Фото не является эталонным продуктом*</p>
          <div className="mt-3 flex gap-4">
            {sealColors.map((sc) => (
              <button
                key={sc.id}
                type="button"
                title={`Выбрать цвет: ${sc.label}`}
                onClick={() => onFieldChange("sealColor", sc.id)}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={`h-[80px] w-[80px] rounded transition ${
                    activeSeal === sc.id
                      ? "outline outline-[3px] outline-offset-2 outline-[#e8c880]"
                      : "opacity-60 hover:opacity-90"
                  }`}
                  style={{ backgroundColor: sc.color }}
                />
                <span className={`text-xs ${activeSeal === sc.id ? "font-bold text-[#0f172a]" : "text-[rgba(0,0,0,0.5)]"}`}>
                  {sc.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <FormFieldTextarea
          label="Комментарий к заказу"
          placeholder="Комментарии, которые помогут нам лучше узнать о задаче"
          value={values.comment}
          onChange={(v) => onFieldChange("comment", v)}
        />

        <label
          className={`mt-2 flex gap-3 rounded-2xl border p-4 text-sm leading-[1.4] ${
            errors.consent ? "border-red-500 bg-red-50" : "border-transparent"
          }`}
        >
          <input
            type="checkbox"
            checked={isConsentAccepted}
            onChange={(event) => onConsentChange(event.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            aria-required="true"
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#0f172a]"
          />
          <span>
            <span className="font-bold">
              Согласие с условиями
              <span className="ml-1 text-red-600" aria-label="обязательное поле">*</span>
            </span>
            <br />
            Нажимая на кнопку, вы соглашаетесь с обработкой{" "}
            <a
              href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/docs/personal-data-consent.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#e8c880]"
            >
              персональных данных
            </a>{" "}
            и ознакомлены с{" "}
            <a
              href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/docs/privacy.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#e8c880]"
            >
              политикой конфиденциальности
            </a>
            .
          </span>
        </label>
        {errors.consent ? <FieldErrorMessage message={errors.consent} /> : null}
        <RequiredFieldsNote />

        <button
          type="button"
          title="Submit order"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="mt-4 flex w-full items-center justify-center gap-5 rounded-full bg-[#e8c880] px-6 py-4 text-xl font-bold text-[#0f172a] transition hover:bg-[#ffecbf] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Отправляем..." : tab === "personal" ? "Оплатить" : "Оставить заявку"}
          <ArrowIcon size={22} />
        </button>

        {submitMessage ? (
          <div className="rounded-2xl border border-[#e8c880] bg-[#fff8e8] p-4 text-sm text-[#0f172a]">
            {submitMessage}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CheckoutOrderPanel({
  quantity,
  total,
  error,
  onQuantityChange,
}: Readonly<{
  quantity: number;
  total: number;
  error?: string;
  onQuantityChange: (q: number) => void;
}>) {
  return (
    <div>
      <h3 className="text-2xl font-extrabold">Детали заказа</h3>
      <div className="mt-4 h-[3px] rounded-full bg-[#c5c5c5]" />
      <div className="mt-6 flex items-center justify-between gap-6 rounded-2xl bg-[#f8f8f8] p-4">
        <ZoomImage
          image={assets.bombs2}
          label="Бомбочка для ванны"
          className="h-[108px] w-[108px] shrink-0 rounded-[10px]"
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold">Бомбочка для ванны</p>
          <div className="mt-4 flex items-center gap-3">
            <CounterButton
              onClick={() => onQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              -
            </CounterButton>
            <input
              type="number"
              min={1}
              value={quantity}
              title="Product quantity"
              aria-label="Количество бомбочек"
              aria-invalid={Boolean(error)}
              onChange={(event) => onQuantityChange(Number(event.target.value))}
              className={`h-10 w-16 rounded-full border bg-white text-center font-bold outline-none ${
                error ? "border-red-500" : "border-[#e8c880]"
              }`}
            />
            <CounterButton onClick={() => onQuantityChange(quantity + 1)}>+</CounterButton>
          </div>
          {error ? <FieldErrorMessage message={error} /> : null}
        </div>
        <p className="shrink-0 font-bold">{productPrice} ₽</p>
      </div>
      <div className="mt-6 h-[3px] rounded-full bg-[#c5c5c5]" />
      <div className="mt-6 space-y-4 text-xl">
        <p className="font-light">Количество: {quantity} шт.</p>
        <p className="font-light">Цена за 1 шт.: {productPrice} руб.</p>
        <p className="font-extrabold">Итоговая сумма: {total} руб.</p>
      </div>
    </div>
  );
}

function FormFieldTextarea({
  label,
  placeholder,
  value,
  error,
  onChange,
}: Readonly<{
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}>) {
  return (
    <div className={`rounded border bg-[#f8f8f8] px-4 py-3 ${error ? "border-red-500" : "border-transparent"}`}>
      <p className="text-base font-bold text-[#0f172a]">{label}</p>
      <textarea
        placeholder={placeholder}
        value={value}
        title={label}
        aria-invalid={Boolean(error)}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="mt-2 w-full resize-none bg-transparent text-sm text-[#0f172a] placeholder-[rgba(101,101,101,0.5)] outline-none"
      />
      {error ? <FieldErrorMessage message={error} /> : null}
    </div>
  );
}

function LegalDocumentModal({ slug }: Readonly<{ slug: LegalDocumentSlug }>) {
  const document = legalDocuments.find((item) => item.slug === slug);

  if (!document) {
    return null;
  }

  return (
    <article className="max-w-[760px]">
      <div className="space-y-4 text-sm leading-[1.7] text-[#0f172a] lg:text-base">
        {document.content.map((paragraph, index) => (
          <p key={`${document.slug}-${index}`}>{paragraph}</p>
        ))}
      </div>
    </article>
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
  error,
  required = false,
  type = "text",
  autoComplete,
  inputMode,
  list,
  onChange,
}: Readonly<{
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  required?: boolean;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  autoComplete?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  list?: string;
  onChange: (value: string) => void;
}>) {
  return (
    <label className={`grid min-h-16 gap-1 rounded border bg-[#f8f8f8] px-4 py-3 ${error ? "border-red-500" : "border-transparent"}`}>
      <span className="font-bold">
        {label}
        {required ? <span className="ml-1 text-red-600" aria-label="обязательное поле">*</span> : null}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        list={list}
        aria-invalid={Boolean(error)}
        aria-required={required}
        className="bg-transparent text-xs text-[#0f172a] outline-none placeholder:text-[#656565]/50"
      />
      {error ? <FieldErrorMessage message={error} /> : null}
    </label>
  );
}

function CitySelectField({
  label,
  placeholder,
  value,
  error,
  required = false,
  onChange,
}: Readonly<{
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  required?: boolean;
  onChange: (value: string) => void;
}>) {
  const [isFocused, setIsFocused] = useState(false);
  const query = normalizeCitySearchValue(value);
  const suggestions = query
    ? russianCities
        .filter((city) => normalizeCitySearchValue(city).startsWith(query))
        .slice(0, 8)
    : [];
  const showSuggestions = isFocused && query.length > 0 && suggestions.length > 0;

  const handleSelect = (city: string) => {
    onChange(city);
    setIsFocused(false);
  };

  return (
    <div className="relative">
      <label className={`grid min-h-16 gap-1 rounded border bg-[#f8f8f8] px-4 py-3 ${error ? "border-red-500" : "border-transparent"}`}>
        <span className="font-bold">
          {label}
          {required ? <span className="ml-1 text-red-600" aria-label="обязательное поле">*</span> : null}
        </span>
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            window.setTimeout(() => setIsFocused(false), 120);
          }}
          placeholder={placeholder}
          autoComplete="off"
          aria-autocomplete="list"
          aria-invalid={Boolean(error)}
          aria-required={required}
          className="bg-transparent text-xs text-[#0f172a] outline-none placeholder:text-[#656565]/50"
        />
        {error ? <FieldErrorMessage message={error} /> : null}
      </label>

      {showSuggestions ? (
        <div className="absolute bottom-[calc(100%+6px)] left-0 right-0 z-30 overflow-hidden rounded-2xl border border-[#e8c880] bg-white shadow-[0_-14px_40px_rgba(15,23,42,0.16)]">
          <div className="max-h-[190px] overflow-y-auto py-2">
            {suggestions.map((city) => (
              <button
                key={city}
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleSelect(city);
                }}
                className="block w-full px-4 py-3 text-left text-sm font-bold text-[#0f172a] transition hover:bg-[#fff4d8]"
              >
                {city}
              </button>
            ))}
          </div>
          <p className="border-t border-[#e8c880]/40 px-4 py-2 text-xs text-[#656565]">
            Выберите город из списка
          </p>
        </div>
      ) : null}
    </div>
  );
}

function RequiredFieldsNote() {
  return <p className="text-xs text-[#656565]"><span className="font-bold text-red-600">*</span> обязательные поля</p>;
}

function FormErrorSummary({ message }: Readonly<{ message: string }>) {
  return (
    <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-bold text-red-700">
      {message}
    </div>
  );
}

function FieldErrorMessage({ message }: Readonly<{ message: string }>) {
  return <span className="mt-1 text-xs font-bold text-red-600">{message}</span>;
}

function InfoBlock({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <section className="rounded-2xl bg-[#f8f8f8] p-5">
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2">{children}</p>
    </section>
  );
}

function ContactItem({
  label,
  value,
  href,
  compact = false,
}: Readonly<{ label: string; value: string; href?: string; compact?: boolean }>) {
  return (
    <div className={`bg-[#f8f8f8] px-4 py-3 ${compact ? "" : "min-h-16"}`}>
      <dt className="font-bold text-[#0f172a]">{label}</dt>
      <dd className="mt-2 text-xs font-bold text-black [font-family:var(--font-inter)]">
        {href ? (
          <a href={href} title="Open contact link" className="underline underline-offset-2">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
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
    <p className="text-sm font-bold uppercase tracking-[3px] text-[#e8c880] sm:text-base lg:text-lg xl:text-xl">
      {children}
    </p>
  );
}

function GoldRule({ centered = false }: Readonly<{ centered?: boolean }>) {
  return (
    <div
      aria-hidden="true"
      className={`mt-6 flex w-full max-w-[700px] items-center ${
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
    <article className="group rounded-[10px] px-4 py-3 text-center transition duration-300 hover:-translate-y-2 hover:bg-[#f8f8f8] hover:shadow-[0_4px_9px_rgba(0,0,0,0.15)]">
      <IconImage src={icon} />
      <h3 className="mt-4 text-2xl font-bold leading-[1.1]">{title}</h3>
      <p className="mt-4 text-base leading-8 [font-family:var(--font-inter)] lg:text-xl lg:leading-[1.8]">{description}</p>
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
      className={`overflow-hidden bg-[#f8f8f8] ${zoom ? "zoom-frame" : ""} ${className}`}
    >
      <div
        className={`h-full w-full bg-cover bg-center ${zoom ? "zoom-media" : ""}`}
        style={{ backgroundImage: `url(${image})` }}
      />
    </div>
  );
}

function DesignButton({
  children,
  onClick,
  size = "md",
  variant = "outline",
}: Readonly<{
  children: React.ReactNode;
  onClick: () => void;
  size?: "md" | "xl";
  variant?: "outline" | "filled";
}>) {
  const isFilled = variant === "filled";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-4 rounded-full border-2 border-[#e8c880] font-bold tracking-[0.5px] transition ${
        isFilled
          ? "bg-[#e8c880] text-[#0f172a] hover:bg-[#ffecbf]"
          : "text-[#e8c880] hover:bg-[#e8c880] hover:text-[#0f172a]"
      } ${
        size === "xl" ? "px-7 py-4 text-2xl lg:text-[26.7px]" : "px-6 py-3 text-base lg:text-xl xl:text-2xl"
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

function CounterButton({
  children,
  disabled = false,
  onClick,
}: Readonly<{ children: React.ReactNode; disabled?: boolean; onClick: () => void }>) {
  return (
    <button
      type="button"
      title={children === "+" ? "Increase product quantity" : "Decrease product quantity"}
      disabled={disabled}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0f172a]/50 font-bold transition hover:border-[#e8c880] hover:text-[#e8c880] disabled:cursor-not-allowed disabled:opacity-40"
    >
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
