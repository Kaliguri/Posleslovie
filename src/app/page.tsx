import Link from "next/link";

const heroImage =
  "https://www.figma.com/api/mcp/asset/9638ad4e-233f-464d-bbee-5c797e6bb1a5";
const marbleTexture =
  "https://www.figma.com/api/mcp/asset/97a999fb-a48b-4bc3-afaa-0f5e7be70cc4";
const productionImage =
  "https://www.figma.com/api/mcp/asset/af82c115-065d-46df-9be9-3307ad7191b5";
const lavenderImage =
  "https://www.figma.com/api/mcp/asset/c070c1cf-5205-43eb-8156-ce9da004e5d6";
const aboutImage =
  "https://www.figma.com/api/mcp/asset/751476ed-ea68-4051-9a4c-caeab929fad9";
const reviewsBaseImage =
  "https://www.figma.com/api/mcp/asset/99ae3c5c-9848-404f-babe-063eb02dde6c";
const reviewBathImage =
  "https://www.figma.com/api/mcp/asset/dfbf0690-701a-48ba-b075-2d38551f1b5b";
const reviewBoxImage =
  "https://www.figma.com/api/mcp/asset/1abfe60e-e57e-4ae5-b0a3-72f9a003dcb0";
const reviewGiftImage =
  "https://www.figma.com/api/mcp/asset/1086082f-ee3a-411f-ac88-3bee2497c54c";
const ctaTexture =
  "https://www.figma.com/api/mcp/asset/68c3bc33-9dfb-466e-a676-bc7f5b71fd4a";
const ctaTextureOverlay =
  "https://www.figma.com/api/mcp/asset/4748acfa-26e0-4bd7-b5a1-ca20d1e67792";
const featherVector =
  "https://www.figma.com/api/mcp/asset/0394767b-6e1a-484c-bd99-d28d74be0559";
const paperVector =
  "https://www.figma.com/api/mcp/asset/f867c11c-c462-4556-8a9a-11dea9bdde15";
const natureIcon =
  "https://www.figma.com/api/mcp/asset/473d9535-103d-46e3-a91d-eb8bfe893661";
const giftIcon =
  "https://www.figma.com/api/mcp/asset/4c435d38-c9ab-4925-84c6-6587c248ad9c";
const successIcon =
  "https://www.figma.com/api/mcp/asset/d6b68078-7d3c-4793-817a-506abbfe6528";

const processSections = [
  {
    eyebrow: "Продукция",
    title: "Как мы делаем бомбочки для ванн?",
    description:
      "Каждая бомбочка сделана в ручную. В составе исключительно натуральные ингредиенты, прошедшие сертификацию в лаборатории. Мы не экономим на вас, главное принести реальную пользу",
    image: productionImage,
    alt: "Бомбочки ручной работы",
    reverse: false,
  },
  {
    eyebrow: "Натуральные масла",
    title: "Собираем лаванду вручную",
    description:
      "Наши партнеры собирают лаванду и изготавливают масло в ручную. Букет из 50 сортов лаванды в каждой бомбочке.",
    image: lavenderImage,
    alt: "Поле лаванды",
    reverse: true,
  },
  {
    eyebrow: "Продукция",
    title: "Упаковываем с любовью",
    description:
      "Мы нанесем ваш логотип на упаковку, вы выберите цвет сургучной печати. Мы возьмем на себя все технические моменты, чтобы вы получили готовый брендированный бокс, соответствующий эстетике и духу вашей компании",
    image: productionImage,
    alt: "Подарочная упаковка",
    reverse: false,
    cta: true,
  },
] as const;

const moodCards = [
  {
    title: "Природа в чистом\nвиде",
    description:
      "Никакой агрессивной химии. Ручная сборка, натуральные масла и компоненты, которые мы тщательно отбираем сами.",
    icon: natureIcon,
  },
  {
    title: "Сюрприз в каждом\nзаказе",
    description:
      "Наши художники и писатели запечатали внутри культурный опыт и волшебство момента",
    icon: giftIcon,
  },
  {
    title: "Дизайн по вашим\nправилам",
    description:
      "От цвета упаковки до теплых пожеланий на вкладыше. Мы полностью адаптируем внешний вид упаковки под эстетику вашего бренда",
    icon: successIcon,
  },
] as const;

const reasons = [
  {
    title: "Чистый состав",
    description: "Только органические масла и настоящие сухоцветы",
    icon: natureIcon,
  },
  {
    title: "Гарантия качества",
    description: "Ручная сборка и контроль каждой партии",
    icon: successIcon,
  },
  {
    title: "Креативный подарок",
    description: "Приятный сюрприз и культурный опыт в каждом наборе",
    icon: giftIcon,
  },
] as const;

const reviews = [
  {
    name: "Алиса Ч.",
    image: reviewBathImage,
    text: "«Потрясающая бомбочка! Я очень привередлива к запахам и не люблю химозные отдушки, но тут аромат настоящей лаванды, как будто стоишь в поле. Растворяется мягко, кожу не сушит, сухоцветы смотрятся невероятно красиво. И самое главное — ванну после нее отмывать не нужно!»",
  },
  {
    name: "Алиса Ч.",
    image: reviewBathImage,
    text: "«Потрясающая бомбочка! Я очень привередлива к запахам и не люблю химозные отдушки, но тут аромат настоящей лаванды, как будто стоишь в поле. Растворяется мягко, кожу не сушит, сухоцветы смотрятся невероятно красиво. И самое главное — ванну после нее отмывать не нужно!»",
  },
  {
    name: "Владимир К.",
    image: reviewBoxImage,
    text: "«Искали эстетичные комплименты для наших подарочных боксов, заказали партию с нашим логотипом на упаковке. Качество превзошло ожидания. Выглядит очень премиально, легкий аромат чувствуется даже через коробку. Отличный продукт, который делает распаковку наших товаров особенной»",
  },
  {
    name: "Анна. С",
    image: reviewGiftImage,
    text: "«Брала набор себе, чтобы просто отдохнуть от суеты. Очень эстетичный вид, сразу чувствуется ручная работа и внимание к деталям. После тяжелого рабочего дня — идеальный способ, чтобы отключить телефон, расслабиться и устроить себе спа прямо дома»",
  },
] as const;

export default function Home() {
  return (
    <div className="bg-white text-[#0f172a]">
      <HeroSection />

      <section id="bombs" className="bg-white px-4 py-14 sm:px-6 lg:px-20 lg:py-20">
        <div className="mx-auto max-w-[1280px] rounded-[48px] bg-[#f8f8f8] px-5 py-12 sm:px-10 lg:rounded-[100px] lg:px-20 lg:py-20">
          <SectionHeading title="Дарите настроение и заботу тем, кто вам важен и дорог" centered />
          <div className="mt-14 grid gap-10 lg:grid-cols-3 lg:gap-16">
            {moodCards.map((card) => (
              <FeatureCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      <div className="relative">
        {processSections.map((section) => (
          <ProcessSection key={section.title} {...section} />
        ))}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[4%] top-[40%] hidden aspect-[198/224] w-[14vw] max-w-[200px] bg-contain bg-center bg-no-repeat lg:block"
          style={{ backgroundImage: `url(${paperVector})` }}
        />
      </div>

      <WhyUsSection />
      <AboutSection />
      <ReviewsSection />
      <CtaSection />
    </div>
  );
}

type ProcessSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  reverse?: boolean;
  cta?: boolean;
};

function ProcessSection({
  eyebrow,
  title,
  description,
  image,
  alt,
  reverse = false,
  cta = false,
}: ProcessSectionProps) {
  return (
    <section
      className={`${reverse ? "bg-[#f8f8f8]" : "bg-white"} px-4 py-12 sm:px-6 lg:px-20 lg:py-20`}
    >
      <div
        className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[42px] bg-[#f8f8f8] lg:rounded-[70px]"
      >
        <div
          className={`pointer-events-none absolute inset-0 hidden lg:grid ${
            reverse ? "grid-cols-[1fr_323px]" : "grid-cols-[323px_1fr]"
          }`}
        >
          <div
            className={`bg-cover bg-center ${reverse ? "order-2" : ""}`}
            style={{ backgroundImage: `url(${marbleTexture})` }}
          />
          <div className={reverse ? "bg-[#f7fafe]" : "bg-[#f8f8f8]"} />
        </div>

        <div className="relative grid items-center gap-10 p-5 sm:p-8 lg:min-h-[665px] lg:grid-cols-2 lg:gap-16 lg:p-12">
          <div className={`${reverse ? "lg:order-2 lg:justify-self-end" : ""}`}>
            <div className="relative">
              <div
                aria-label={alt}
                role="img"
                className="aspect-square rounded-[32px] bg-cover bg-center shadow-sm lg:h-[525px] lg:w-[525px] lg:rounded-[50px]"
                style={{ backgroundImage: `url(${image})` }}
              />
              <div className={`mt-4 flex gap-4 ${reverse ? "justify-end" : ""}`}>
                <RoundArrow direction="left" />
                <RoundArrow direction="right" />
              </div>
            </div>
          </div>

          <div className={`${reverse ? "lg:order-1" : ""}`}>
            <div className="max-w-[552px]">
              <SectionKicker>{eyebrow}</SectionKicker>
              <h2 className="mt-2 text-3xl font-extrabold leading-[1.1] text-[#0f172a] sm:text-4xl lg:text-5xl">
                {title}
              </h2>
              <GoldRule />
              <p className="mt-5 text-base leading-8 text-[#0f172a] sm:text-lg lg:text-xl lg:leading-[1.8]">
                {description}
              </p>
              {cta ? (
                <div className="mt-10">
                  <PrimaryOutlineLink href="/checkout">Сделать заказ</PrimaryOutlineLink>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[760px] overflow-hidden rounded-b-[72px] bg-[#102038] lg:rounded-b-[150px]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.08)_100%)]" />
      <div className="relative mx-auto max-w-[1280px] px-4 pb-20 pt-56 sm:px-6 lg:px-0 lg:pb-24 lg:pt-[366px]">
        <div className="max-w-[640px]">
          <h1 className="text-5xl leading-none text-white sm:text-6xl lg:text-[64px]">
            Послесловие к вашему дню
          </h1>
          <p className="mt-6 text-lg font-light leading-[1.6] text-[#dfdfdf] sm:text-xl">
            Энергия природы в каждой бомбочке для ванны
            <br />
            Внимание и забота к каждой минуте наедине с собой
          </p>
          <div className="mt-12">
            <PrimaryOutlineLink href="/checkout">Оформить заказ</PrimaryOutlineLink>
          </div>
        </div>
      </div>
    </section>
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
      className={`mt-5 h-px w-[260px] max-w-full bg-[#e8c880] ${
        centered ? "mx-auto" : ""
      }`}
    />
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: Readonly<{ title: string; description: string; icon: string }>) {
  return (
    <article className="text-center">
      <div
        aria-hidden="true"
        className="mx-auto h-16 w-16 bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${icon})` }}
      />
      <h3 className="mt-4 whitespace-pre-line text-2xl font-bold leading-[1.1]">
        {title}
      </h3>
      <p className="mt-4 text-base leading-8 lg:text-xl lg:leading-[1.8]">{description}</p>
    </article>
  );
}

function WhyUsSection() {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center px-4 py-16 text-white sm:px-6 lg:px-20 lg:py-20"
      style={{ backgroundImage: `url(${ctaTexture})` }}
    >
      <div className="absolute inset-0 bg-[#102038]/35" />
      <div className="relative mx-auto max-w-[1280px]">
        <SectionHeading kicker="Преимущества" title="Почему выбирают нас?" centered light />
        <div className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-24">
          {reasons.map((reason) => (
            <article key={reason.title} className="text-center">
              <div
                aria-hidden="true"
                className="mx-auto h-16 w-16 bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${reason.icon})` }}
              />
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
    <section id="about" className="bg-white px-4 py-12 sm:px-6 lg:px-20 lg:py-20">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[42px] bg-[#f8f8f8] lg:rounded-[70px]">
        <div className="pointer-events-none absolute inset-0 hidden grid-cols-[1fr_323px] lg:grid">
          <div />
          <div
            className="bg-cover bg-center"
            style={{ backgroundImage: `url(${marbleTexture})` }}
          />
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
                бесконечно целеустремленных и искренне увлеченных процессом создания
                подарков.
              </p>
              <p>
                Мы прилагаем максимум усилий, чтобы создать продукцию на уровень выше
                конкурентов. Именно поэтому с нами сотрудничают лидеры рынка в своих нишах.
              </p>
            </div>
          </div>
          <div
            aria-label="Бомбочки Послесловие"
            role="img"
            className="aspect-square rounded-[32px] bg-cover bg-center lg:h-[525px] lg:w-[525px] lg:rounded-[50px]"
            style={{ backgroundImage: `url(${aboutImage})` }}
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -bottom-8 hidden aspect-[296/245] w-[296px] bg-contain bg-center bg-no-repeat opacity-90 xl:block"
          style={{ backgroundImage: `url(${featherVector})` }}
        />
      </div>
    </section>
  );
}

function ReviewsSection() {
  return (
    <section id="reviews" className="overflow-hidden bg-white px-4 py-16 sm:px-6 lg:px-20 lg:py-20">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeading kicker="Отзывы" title="Нам доверяют" centered />
        <div className="mt-14 flex gap-8 overflow-x-auto pb-4 lg:gap-12">
          {reviews.map((review, index) => (
            <article
              key={`${review.name}-${index}`}
              className="flex min-h-[600px] w-[320px] shrink-0 flex-col justify-between rounded-[15px] bg-[#f8f8f8] p-6 sm:w-[395px] sm:p-8"
            >
              <div>
                <div
                  className="h-[220px] rounded-[20px] bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${review.image}), url(${reviewsBaseImage})`,
                  }}
                />
                <div className="mt-5 text-2xl tracking-[0.1em] text-[#e8c880]">★★★★★</div>
                <p className="mt-4 text-base leading-[1.6] sm:text-lg">{review.text}</p>
              </div>
              <p className="mt-8 font-medium">{review.name}</p>
            </article>
          ))}
        </div>
        <div className="mt-2 flex gap-4">
          <RoundArrow direction="left" />
          <RoundArrow direction="right" />
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section
      className="relative overflow-hidden bg-[#102038] bg-cover bg-center px-4 py-20 text-center text-white sm:px-6 lg:px-20 lg:py-24"
      style={{
        backgroundImage: `linear-gradient(0deg, rgba(14,17,50,0.3), rgba(14,17,50,0.3)), url(${ctaTextureOverlay}), url(${ctaTexture})`,
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
          <PrimaryOutlineLink href="/checkout">Оформить заказ</PrimaryOutlineLink>
        </div>
      </div>
    </section>
  );
}

function PrimaryOutlineLink({
  href,
  children,
}: Readonly<{ href: string; children: React.ReactNode }>) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-4 rounded-full border-2 border-[#e8c880] px-6 py-3 text-lg font-bold tracking-[0.03em] text-[#e8c880] transition hover:bg-[#e8c880] hover:text-slate-950 sm:text-2xl"
    >
      {children}
      <ArrowRightIcon />
    </Link>
  );
}

function RoundArrow({ direction }: Readonly<{ direction: "left" | "right" }>) {
  return (
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#e8c880] text-[#e8c880] shadow-sm">
      <span className={direction === "left" ? "rotate-180" : ""}>
        <ArrowRightIcon small />
      </span>
    </span>
  );
}

function ArrowRightIcon({ small = false }: Readonly<{ small?: boolean }>) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={small ? "h-4 w-4" : "h-5 w-5"}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}
