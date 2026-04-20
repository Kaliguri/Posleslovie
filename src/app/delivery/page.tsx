import { siteConfig } from "@/shared/config/site";
import { ButtonLink } from "@/shared/ui/button-link";
import { SectionHeading } from "@/shared/ui/section-heading";

const deliverySteps = [
  {
    title: "Подтверждение заказа",
    description:
      "После оформления менеджер связывается с клиентом, подтверждает состав набора, адрес и удобный интервал доставки.",
  },
  {
    title: "Сборка и упаковка",
    description:
      "Каждый заказ упаковывается вручную. При необходимости можно добавить брендирование или открытку.",
  },
  {
    title: "Отправка и вручение",
    description:
      "По Москве работает курьерская доставка, по России — отгрузка через транспортные компании и курьерские службы.",
  },
];

export const metadata = {
  title: "Доставка",
};

export default function DeliveryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <SectionHeading
            eyebrow="Доставка"
            title="Понятные условия от заказа до вручения"
            description="Страница отвечает на самые частые вопросы клиента: когда привезут, как считается доставка, какие способы оплаты доступны и что делать с крупными или корпоративными заказами."
          />
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/checkout">Оформить заказ</ButtonLink>
            <ButtonLink href="/distributors" variant="secondary">
              Корпоративный запрос
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-stone-950 p-8 text-stone-50">
          <p className="text-sm uppercase tracking-[0.3em] text-stone-400">Кратко</p>
          <div className="mt-6 grid gap-4">
            {siteConfig.deliveryFeatures.map((item) => (
              <div key={item} className="rounded-2xl bg-white/5 p-4 text-sm leading-7 text-stone-300">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-3">
        {deliverySteps.map((step, index) => (
          <article
            key={step.title}
            className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm shadow-stone-950/5"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
              Шаг {index + 1}
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-stone-950">{step.title}</h2>
            <p className="mt-4 text-sm leading-7 text-stone-600">{step.description}</p>
          </article>
        ))}
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-2">
        <article className="rounded-[2rem] border border-stone-200 bg-white p-8">
          <h2 className="text-2xl font-semibold text-stone-950">Оплата</h2>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-stone-600">
            <li>Онлайн-оплата через ЮKassa: СБП и банковские карты.</li>
            <li>Оплата при получении доступна для согласованных заказов.</li>
            <li>Для оптовых клиентов условия оплаты можно вынести в отдельный B2B-сценарий.</li>
          </ul>
        </article>
        <article className="rounded-[2rem] border border-stone-200 bg-white p-8">
          <h2 className="text-2xl font-semibold text-stone-950">Сроки</h2>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-stone-600">
            <li>Москва: стандартная доставка на следующий день.</li>
            <li>Срочные заказы обсуждаются отдельно при наличии свободного окна.</li>
            <li>Россия: срок зависит от города и выбранного перевозчика.</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
