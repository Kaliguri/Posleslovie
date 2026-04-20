import { siteConfig } from "@/shared/config/site";
import { ButtonLink } from "@/shared/ui/button-link";
import { SectionHeading } from "@/shared/ui/section-heading";

const partnershipFormats = [
  "Ритейл и концепт-сторы",
  "Корпоративные подарки и HR-направление",
  "HoReCa, мероприятия и сезонные коллаборации",
];

export const metadata = {
  title: "Дистрибьютерам",
};

export default function DistributorsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <section className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
        <div>
          <SectionHeading
            eyebrow="Партнерам"
            title="Страница для дистрибьютеров, закупщиков и корпоративных клиентов"
            description="Раздел построен как отдельный B2B-вход в проект: он может развиться в закрытый кабинет, оптовый каталог или CRM-форму без переписывания всей витрины."
          />
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/checkout">Запросить первую поставку</ButtonLink>
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-sm font-medium text-stone-950 transition hover:border-stone-950"
            >
              Написать на почту
            </a>
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-gradient-to-br from-stone-950 via-stone-900 to-stone-800 p-8 text-stone-50">
          <p className="text-sm uppercase tracking-[0.3em] text-stone-400">Возможности</p>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-300">
            {siteConfig.distributorBenefits.map((benefit) => (
              <li key={benefit} className="rounded-2xl bg-white/5 p-4">
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-3">
        {partnershipFormats.map((format) => (
          <article
            key={format}
            className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm shadow-stone-950/5"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Формат</p>
            <h2 className="mt-4 text-2xl font-semibold text-stone-950">{format}</h2>
            <p className="mt-4 text-sm leading-7 text-stone-600">
              Под этот формат можно собрать индивидуальную матрицу продуктов, условия
              поставки и пакет материалов для продаж.
            </p>
          </article>
        ))}
      </section>

      <section className="mt-16 rounded-[2.5rem] border border-stone-200 bg-white p-8">
        <h2 className="text-3xl font-semibold text-stone-950">Как выглядит первая версия</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] bg-stone-50 p-6">
            <h3 className="text-lg font-semibold text-stone-950">Сейчас</h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Отдельная B2B-страница с преимуществами, контактами и возможностью быстро
              перейти к оформлению заказа или оставить запрос.
            </p>
          </div>
          <div className="rounded-[2rem] bg-stone-50 p-6">
            <h3 className="text-lg font-semibold text-stone-950">Позже</h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Кабинет партнера, прайс-листы, оптовые SKU, персональные условия и связка
              с CRM или ERP без смены фронтенд-архитектуры.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
