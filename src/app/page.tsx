import Link from "next/link";

const marbleTexture =
  "https://www.figma.com/api/mcp/asset/74e436ca-b595-4d82-9993-c59a3c088f67";
const heroImage =
  "https://www.figma.com/api/mcp/asset/f35d9b7a-f397-4b9e-9392-f3926ab61654";
const productionImage =
  "https://www.figma.com/api/mcp/asset/8877b0ca-c224-4ad3-97ea-312f508e9b5c";
const lavenderImage =
  "https://www.figma.com/api/mcp/asset/5e4ec99b-ad49-4a1b-aaf9-602d33dd6c1a";
const packagingImage =
  "https://www.figma.com/api/mcp/asset/49e36fc3-6f20-4066-ae44-2ab5b98a10e0";
const ctaTexture =
  "https://www.figma.com/api/mcp/asset/2b22d627-c4f0-4870-b082-74eaac26bf4a";

const processSections = [
  {
    eyebrow: "Продукция",
    title: "Как мы делаем бомбочки?",
    description:
      "Каждая бомбочка — это кусочек спокойствия, созданный вручную. Мы помогаем брендам радовать своих клиентов идеальными комплиментами к заказам, повышая лояльность, а каждому человеку — просто находить время для самого себя.",
    image: productionImage,
    alt: "Бомбочки ручной работы",
    reverse: false,
    surfaceClassName: "bg-[#f8f8f8]",
  },
  {
    eyebrow: "Натуральные масла",
    title: "Собираем лаванду вручную",
    description:
      "Мы лично отбираем и отсеиваем соцветия лаванды. В ваших бомбочках — только чистые органические ингредиенты, которые безопасны для кожи и оставляют после себя успокаивающий аромат.",
    image: lavenderImage,
    alt: "Поле лаванды",
    reverse: true,
    surfaceClassName: "bg-white",
    showPlay: true,
  },
  {
    eyebrow: "Упаковка и брендирование",
    title: "Упаковываем с любовью",
    description:
      "Мы можем нанести ваш логотип на упаковку или сделать брендированную печать на подложке коробки. Мы берем на себя все технические моменты, чтобы вы получили готовый брендированный продукт, вызывающий доверие.",
    image: packagingImage,
    alt: "Подарочная упаковка",
    reverse: false,
    surfaceClassName: "bg-[#f8f8f8]",
  },
] as const;

const reasons = [
  {
    title: "Чистый состав",
    description: "Только органические масла и настоящие сухоцветы",
    icon: <LeafIcon />,
  },
  {
    title: "Гарантия качества",
    description: "Ручная сборка и контроль каждой партии",
    icon: <BadgeIcon />,
  },
  {
    title: "Креативный подарок",
    description: "Приятный сюрприз в эстетичной обертке",
    icon: <GiftIcon />,
  },
] as const;

export default function Home() {
  return (
    <div className="bg-[#eff5fd] text-slate-900">
      <section className="relative overflow-hidden rounded-b-[56px] bg-[#102038] px-4 pb-12 pt-28 sm:px-6 lg:rounded-b-[120px] lg:px-8 lg:pb-20 lg:pt-36">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{ backgroundImage: `url(${marbleTexture})` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(122deg,rgba(7,15,29,0.92)_22%,rgba(17,31,58,0.5)_72%,rgba(17,31,58,0.18)_100%)]" />
        <div
          className="absolute -right-12 top-20 hidden h-[560px] w-[760px] rounded-[72px] bg-cover bg-center opacity-95 lg:block"
          style={{ backgroundImage: `url(${heroImage})` }}
        />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-[#e8c880] sm:text-base">
              Производство бомбочек для селлеров и брендов
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-medium leading-none text-white sm:text-5xl lg:text-[4rem]">
              Там, где форма переходит в энергию
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
              Натуральные бомбочки ручной работы, где каждая деталь выполнена с
              любовью.
            </p>
            <div className="mt-8">
              <PrimaryOutlineLink href="/checkout">Оформить заказ</PrimaryOutlineLink>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-20">
        <div className="space-y-8 lg:space-y-10">
          {processSections.map((section) => (
            <ProcessSection key={section.title} {...section} />
          ))}
        </div>
      </div>

      <section className="bg-[#577f98] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-extrabold text-white sm:text-4xl lg:text-[3.5rem]">
            Почему мы?
          </h2>

          <div className="mt-8 rounded-[36px] bg-white px-6 py-8 shadow-sm sm:px-8 lg:mt-12 lg:rounded-[70px] lg:px-12 lg:py-14">
            <div className="grid gap-10 lg:grid-cols-3 lg:gap-14">
              {reasons.map((reason) => (
                <div key={reason.title} className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center text-slate-900">
                    {reason.icon}
                  </div>
                  <h3 className="mt-4 text-2xl font-bold leading-tight text-slate-900">
                    {reason.title}
                  </h3>
                  <p className="mt-3 text-base leading-8 text-slate-700">
                    {reason.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] px-6 py-14 text-center text-white sm:px-10 lg:rounded-[70px] lg:px-16 lg:py-20"
          style={{ backgroundImage: `url(${ctaTexture})`, backgroundSize: "cover" }}
        >
          <div className="absolute inset-0 bg-[rgba(12,24,43,0.4)]" />
          <div className="relative mx-auto max-w-3xl">
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              Создадим атмосферу вашего бренда вместе
            </h2>
            <p className="mt-4 text-base leading-7 text-white/85 sm:text-xl">
              Натуральные бомбочки как идеальный комплимент к заказу.
            </p>
            <div className="mt-8 flex justify-center">
              <PrimarySolidLink href="/checkout">Оформить заказ</PrimarySolidLink>
            </div>
          </div>
        </div>
      </section>
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
  showPlay?: boolean;
  surfaceClassName?: string;
};

function ProcessSection({
  eyebrow,
  title,
  description,
  image,
  alt,
  reverse = false,
  showPlay = false,
  surfaceClassName = "bg-white",
}: ProcessSectionProps) {
  return (
    <section className={surfaceClassName}>
      <div className="overflow-hidden rounded-[36px] px-5 py-5 shadow-sm sm:px-6 lg:rounded-[70px] lg:px-12 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div className={reverse ? "lg:order-2" : ""}>
            <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-[500px]">
              <div
                className={`absolute inset-y-0 ${reverse ? "right-0 rounded-r-[40px]" : "left-0 rounded-l-[40px]"} w-14 bg-cover bg-center lg:w-24`}
                style={{ backgroundImage: `url(${marbleTexture})` }}
              />
              <div
                aria-label={alt}
                role="img"
                className={`absolute inset-y-4 overflow-hidden rounded-[28px] bg-cover bg-center shadow-sm sm:inset-y-6 lg:rounded-[50px] ${reverse ? "left-0 right-6 lg:right-10" : "left-6 right-0 lg:left-10"}`}
                style={{ backgroundImage: `url(${image})` }}
              >
                {showPlay ? (
                  <div className="flex h-full items-center justify-center bg-black/10">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900/80 text-white shadow-lg">
                      <PlayIcon />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {!reverse ? (
              <div className="mt-4 flex gap-3 lg:mt-6">
                <RoundArrow direction="left" />
                <RoundArrow direction="right" />
              </div>
            ) : null}
          </div>

          <div className={`flex items-center ${reverse ? "lg:order-1" : ""}`}>
            <div className="max-w-xl">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#e8c880] sm:text-base">
                {eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {title}
              </h2>
              <div className="mt-6 h-px w-40 bg-[#d9d6d1]" />
              <p className="mt-6 text-base leading-8 text-slate-700 sm:text-lg">
                {description}
              </p>
            </div>
          </div>
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
      className="inline-flex items-center gap-3 rounded-full border-2 border-[#e8c880] px-6 py-3 text-lg font-bold tracking-[0.02em] text-[#e8c880] transition hover:bg-[#e8c880] hover:text-slate-950"
    >
      {children}
      <ArrowRightIcon />
    </Link>
  );
}

function PrimarySolidLink({
  href,
  children,
}: Readonly<{ href: string; children: React.ReactNode }>) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-lg font-bold tracking-[0.02em] text-slate-900 transition hover:bg-slate-100"
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

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 fill-current">
      <path d="M8 6.5v11l9-5.5-9-5.5Z" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="h-12 w-12"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
    >
      <path d="M16 40c14 0 24-10 24-24 8 2 16 10 16 22 0 14-12 26-26 26-10 0-18-8-18-18 0-6 2-10 4-12Z" />
      <path d="M22 44c6-8 12-14 22-20" />
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="h-12 w-12"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
    >
      <path d="M32 8 13 16v16c0 12 8 22 19 24 11-2 19-12 19-24V16L32 8Z" />
      <path d="m24 31 6 6 11-13" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="h-12 w-12"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
    >
      <path d="M10 24h44v12H10z" />
      <path d="M14 36h36v18H14z" />
      <path d="M32 24v30" />
      <path d="M32 24h-9c-5 0-8-3-8-7s3-7 8-7c7 0 9 8 9 14Z" />
      <path d="M32 24h9c5 0 8-3 8-7s-3-7-8-7c-7 0-9 8-9 14Z" />
    </svg>
  );
}
