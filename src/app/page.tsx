"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

import { useCheckoutState } from "@/features/checkout/model/hooks";
import { HomeModal, type ModalType } from "@/features/checkout/ui/CheckoutModal";
import { useScrollReveal } from "@/features/scroll-reveal/model/use-scroll-reveal";
import { useBodyLock } from "@/shared/hooks/use-body-lock";
import {
  globalOverlaysEnabled,
  primaryCheckoutProduct,
  scrollAnimationsEnabled,
} from "@/widgets/home-sections/model/mapHomeContent";
import { HomeStructuredData } from "@/widgets/home-sections/ui/HomeStructuredData";

const ritualNotes = [
  "черная смородина",
  "лаванда",
  "молочная пена",
  "морская соль",
  "какао-масло",
  "тихий пар",
] as const;

const scentCards = [
  {
    title: "Лаванда после грозы",
    text: "Мягкое раскрытие, холодный цветок, сливочная вода.",
    image: "/images/photos/product-1.svg",
  },
  {
    title: "Смородиновый шелк",
    text: "Темная ягода, чистый минерал, легкое свечение на коже.",
    image: "/images/photos/product-2.svg",
  },
  {
    title: "Соляная тишина",
    text: "Сухой воздух, морская грань, спокойный финал дня.",
    image: "/images/photos/product-3.svg",
  },
] as const;

const processMoments = [
  "формула замешивается малой партией",
  "цвет собирается по одному оттенку",
  "аромат проверяется в горячей воде",
  "упаковка готовится как подарок",
] as const;

const faqs = [
  {
    question: "Можно заказать набор в подарок?",
    answer: "Да. Соберем набор под повод, подпишем открытку и предложим спокойную упаковку без лишнего шума.",
  },
  {
    question: "Подойдет для корпоративного подарка?",
    answer: "Да. Для партнерских партий можно обсудить тираж, палитру, вложение и аккуратный брендированный элемент.",
  },
  {
    question: "Как быстро вы связываетесь после заявки?",
    answer: "Обычно в тот же день. Если нужно, можно выбрать удобное время звонка прямо в форме заказа.",
  },
] as const;

export default function Home() {
  const [modal, setModal] = useState<ModalType>(null);
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

  useBodyLock(Boolean(modal));
  useScrollReveal(scrollAnimationsEnabled);

  return (
    <div className="ritual-page min-h-screen overflow-hidden bg-[var(--ritual-ink)] text-[var(--ritual-porcelain)]">
      <HomeStructuredData primaryCheckoutProduct={primaryCheckoutProduct} />

      <HeroShowcase onOrder={() => setModal("checkout")} onPartner={() => setModal("partners")} />
      <ScentAtlas onOrder={() => setModal("checkout")} />
      <RitualSequence />
      <ProofSection onContacts={() => setModal("contacts")} />
      <FaqShowcase />
      <FinalCta onOrder={() => setModal("checkout")} />

      <HomeModal
        type={modal}
        checkoutProduct={primaryCheckoutProduct}
        checkoutState={checkoutState}
        onCheckoutFieldChange={updateField}
        onCheckoutQuantityChange={updateQuantity}
        onCheckoutTabChange={updateTab}
        withOverlay={globalOverlaysEnabled}
        onClose={() => setModal(null)}
      />
    </div>
  );
}

function HeroShowcase({
  onOrder,
  onPartner,
}: Readonly<{ onOrder: () => void; onPartner: () => void }>) {
  return (
    <section id="hero" className="relative min-h-[100dvh] overflow-hidden px-5 pb-10 pt-28 sm:px-8 lg:px-14 lg:pt-32">
      <div className="absolute inset-0">
        <img
          src="/images/photos/card4.png"
          alt=""
          aria-hidden="true"
          width={1600}
          height={1200}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="h-full w-full scale-105 object-cover object-[58%_center] opacity-65"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(193,174,255,0.38),transparent_28%),linear-gradient(90deg,rgba(8,10,18,0.96),rgba(8,10,18,0.72)_42%,rgba(8,10,18,0.3))]" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100dvh-9rem)] max-w-[1540px] items-end gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-[860px] pb-4" data-scroll-pop>
          <p className="mb-5 max-w-[330px] text-sm leading-[1.45] text-[var(--ritual-mist)] sm:text-base">
            Handmade bath objects for people who treat water as a private room.
          </p>
          <h1 className="ritual-hero-title text-balance text-[clamp(4.4rem,13vw,13.5rem)] font-black leading-[0.78] tracking-[-0.09em]">
            После
            <span className="block pl-[0.45em] text-[var(--ritual-lilac)]">словие</span>
          </h1>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <RitualButton onClick={onOrder}>Заказать ритуал</RitualButton>
            <button
              type="button"
              onClick={onPartner}
              className="min-h-12 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/85 transition-[background-color,border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ritual-lilac)]"
            >
              Партнерская партия
            </button>
          </div>
        </div>

        <div className="relative min-h-[420px] lg:min-h-[680px]" data-scroll-pop>
          <div className="ritual-orbit absolute left-1/2 top-1/2 h-[min(78vw,640px)] w-[min(78vw,640px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/12" />
          <div className="ritual-product absolute left-1/2 top-1/2 grid h-[min(58vw,420px)] w-[min(58vw,420px)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_24%,#ffffff,rgba(211,202,255,0.88)_22%,rgba(34,37,58,0.65)_62%,rgba(9,10,18,0.92))] shadow-[0_50px_160px_rgba(193,174,255,0.28)]">
            <img
              src="/images/photos/product-1.svg"
              alt="Подарочная бомбочка Послесловие"
              width={420}
              height={420}
              loading="eager"
              decoding="async"
              className="h-[70%] w-[70%] object-contain drop-shadow-[0_28px_70px_rgba(0,0,0,0.42)]"
            />
          </div>
          <SpecimenCard className="left-0 top-8" title="Партия" value="малый тираж" />
          <SpecimenCard className="bottom-12 right-0" title="Финиш" value="молочная вода" />
        </div>
      </div>
    </section>
  );
}

function ScentAtlas({ onOrder }: Readonly<{ onOrder: () => void }>) {
  return (
    <section id="bombs" className="relative px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
      <div className="mx-auto max-w-[1540px]">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div data-scroll-pop>
            <h2 className="max-w-[650px] text-balance text-[clamp(3rem,7vw,8.5rem)] font-black leading-[0.85] tracking-[-0.07em]">
              Ароматы как комнаты.
            </h2>
            <p className="mt-6 max-w-[520px] text-lg leading-[1.65] text-[var(--ritual-mist)]">
              Не “бомбочка с запахом”, а короткая сцена: вода, пар, цвет, касание, тишина.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3" data-scroll-pop>
            {scentCards.map((card, index) => (
              <article
                key={card.title}
                className="group min-h-[440px] overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.055] p-5 transition-[background-color,border-color,transform] duration-500 hover:-translate-y-2 hover:border-[var(--ritual-lilac)]/50 hover:bg-white/[0.09]"
              >
                <div className="relative flex h-56 items-center justify-center rounded-[1.65rem] bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.24),rgba(193,174,255,0.1)_42%,rgba(255,255,255,0.04))]">
                  <img
                    src={card.image}
                    alt={card.title}
                    width={240}
                    height={240}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-40 w-40 object-contain transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <h3 className="mt-7 text-2xl font-black leading-[1] tracking-[-0.04em]">{card.title}</h3>
                <p className="mt-4 text-sm leading-[1.7] text-[var(--ritual-mist)]">{card.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-[var(--ritual-lilac)] px-6 py-5 text-[var(--ritual-ink)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="max-w-[640px] text-xl font-black leading-[1.08] tracking-[-0.04em]">
            Выберите настроение, а не SKU. Остальное уточним в форме.
          </p>
          <RitualButton onClick={onOrder} tone="ink">
            Собрать набор
          </RitualButton>
        </div>
      </div>
    </section>
  );
}

function RitualSequence() {
  return (
    <section className="px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
      <div className="mx-auto grid max-w-[1540px] gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="relative min-h-[620px] overflow-hidden rounded-[3rem] border border-white/10 bg-[var(--ritual-smoke)]" data-scroll-pop>
          <img
            src="/images/photos/tablet.png"
            alt="Композиция Послесловие в темной витрине"
            width={1200}
            height={1200}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(8,10,18,0.84))]" />
          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
            <p className="max-w-[520px] text-4xl font-black leading-[0.9] tracking-[-0.06em] sm:text-6xl">
              Вещь должна выглядеть тихо до воды.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-10 rounded-[3rem] border border-white/10 bg-white/[0.045] p-7 sm:p-10" data-scroll-pop>
          <div>
            <h2 className="max-w-[680px] text-balance text-[clamp(2.8rem,6vw,7rem)] font-black leading-[0.86] tracking-[-0.07em]">
              Ручная работа без ярмарочного шума.
            </h2>
            <p className="mt-6 max-w-[560px] text-lg leading-[1.65] text-[var(--ritual-mist)]">
              Тот же продукт, но подан как предмет желания: точность, темп, свет, упаковка и пауза перед покупкой.
            </p>
          </div>

          <ol className="grid gap-3">
            {processMoments.map((item, index) => (
              <li
                key={item}
                className="grid grid-cols-[3.5rem_1fr] items-center rounded-3xl border border-white/10 bg-black/20 p-4"
              >
                <span className="tabular-nums text-sm text-[var(--ritual-lilac)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-lg font-semibold leading-[1.15]">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function ProofSection({ onContacts }: Readonly<{ onContacts: () => void }>) {
  return (
    <section id="reviews" className="px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
      <div className="mx-auto max-w-[1540px]">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[3rem] bg-[var(--ritual-porcelain)] p-7 text-[var(--ritual-ink)] sm:p-10 lg:p-14" data-scroll-pop>
            <h2 className="max-w-[880px] text-balance text-[clamp(3rem,7vw,8.5rem)] font-black leading-[0.82] tracking-[-0.08em]">
              Подарок, который не объясняют.
            </h2>
            <p className="mt-7 max-w-[620px] text-lg leading-[1.7] text-[#3b4050]">
              Его ставят на полку, трогают упаковку, открывают вечером. На сайте это должно чувствоваться сразу.
            </p>
          </div>

          <div className="grid gap-6">
            <QuoteCard>
              “Выглядит как вещь из хорошего отеля. Не хочется прятать в шкаф.”
            </QuoteCard>
            <QuoteCard>
              “Заказывали для клиентов. Впечатление дороже самого подарка.”
            </QuoteCard>
            <button
              type="button"
              onClick={onContacts}
              className="min-h-16 rounded-[2rem] border border-white/14 bg-white/[0.06] px-8 text-left text-2xl font-black tracking-[-0.04em] transition-[background-color,border-color,transform] duration-300 hover:-translate-y-1 hover:border-[var(--ritual-lilac)] hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ritual-lilac)]"
            >
              Связаться напрямую
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqShowcase() {
  return (
    <section id="about" className="px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
      <div className="mx-auto grid max-w-[1540px] gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div data-scroll-pop>
          <h2 className="text-balance text-[clamp(3rem,7vw,8rem)] font-black leading-[0.84] tracking-[-0.075em]">
            Перед ванной.
          </h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {ritualNotes.map((note) => (
              <span key={note} className="rounded-full border border-white/12 px-4 py-2 text-sm text-[var(--ritual-mist)]">
                {note}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-3" data-scroll-pop>
          {faqs.map((item) => (
            <details
              key={item.question}
              className="group rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 open:bg-white/[0.075]"
            >
              <summary className="cursor-pointer list-none text-2xl font-black leading-[1.05] tracking-[-0.04em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ritual-lilac)]">
                {item.question}
              </summary>
              <p className="mt-5 max-w-[720px] text-base leading-[1.75] text-[var(--ritual-mist)]">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta({ onOrder }: Readonly<{ onOrder: () => void }>) {
  return (
    <section className="px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
      <div
        className="relative mx-auto min-h-[620px] max-w-[1540px] overflow-hidden rounded-[3.5rem] bg-[var(--ritual-lilac)] p-7 text-[var(--ritual-ink)] sm:p-10 lg:p-14"
        data-scroll-pop
      >
        <img
          src="/images/photos/iphone-16-4.png"
          alt=""
          aria-hidden="true"
          width={900}
          height={1200}
          loading="lazy"
          decoding="async"
          className="absolute bottom-0 right-0 h-full w-full object-cover object-right opacity-35 mix-blend-multiply"
        />
        <div className="relative max-w-[880px]">
          <h2 className="text-balance text-[clamp(3.6rem,9vw,10.5rem)] font-black leading-[0.8] tracking-[-0.09em]">
            Сделаем вечер физическим.
          </h2>
          <p className="mt-7 max-w-[520px] text-xl leading-[1.45] text-[#242536]">
            Оставьте заявку. Мы уточним набор, упаковку и доставку без переписки в десять сообщений.
          </p>
          <div className="mt-9">
            <RitualButton onClick={onOrder} tone="ink">
              Оформить заказ
            </RitualButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function RitualButton({
  children,
  onClick,
  tone = "lilac",
}: Readonly<{ children: ReactNode; onClick: () => void; tone?: "lilac" | "ink" }>) {
  const isInk = tone === "ink";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex min-h-12 items-center justify-center rounded-full px-7 py-3 text-sm font-black transition-[background-color,color,transform,box-shadow] duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        isInk
          ? "bg-[var(--ritual-ink)] text-white shadow-[0_18px_50px_rgba(8,10,18,0.24)] focus-visible:ring-[var(--ritual-ink)] focus-visible:ring-offset-[var(--ritual-lilac)]"
          : "bg-[var(--ritual-lilac)] text-[var(--ritual-ink)] shadow-[0_18px_50px_rgba(193,174,255,0.26)] focus-visible:ring-[var(--ritual-lilac)] focus-visible:ring-offset-[var(--ritual-ink)]"
      }`}
    >
      <span>{children}</span>
      <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
        →
      </span>
    </button>
  );
}

function SpecimenCard({
  title,
  value,
  className,
}: Readonly<{ title: string; value: string; className: string }>) {
  return (
    <div
      className={`absolute hidden w-52 rounded-[1.75rem] border border-white/12 bg-white/[0.08] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl lg:block ${className}`}
      style={{ "--tw-backdrop-saturate": "saturate(1.6)" } as CSSProperties}
    >
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--ritual-lilac)]">{title}</p>
      <p className="mt-3 text-2xl font-black leading-[0.95] tracking-[-0.05em]">{value}</p>
    </div>
  );
}

function QuoteCard({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <figure className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-7">
      <blockquote className="text-2xl font-black leading-[1.05] tracking-[-0.045em] text-white">
        {children}
      </blockquote>
      <figcaption className="mt-5 text-sm text-[var(--ritual-mist)]">Клиент Posleslovie</figcaption>
    </figure>
  );
}
