import { products } from "@/entities/product/model/products";
import { ProductCard } from "@/entities/product/ui/product-card";
import { siteConfig } from "@/shared/config/site";
import { ButtonLink } from "@/shared/ui/button-link";
import { SectionHeading } from "@/shared/ui/section-heading";

export default function Home() {
  return (
    <div className="pb-20">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-24">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-stone-500">
            Подарки, гастрономия, события
          </p>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-stone-950 md:text-7xl">
            Сайт-визитка с каталогом, корзиной и базой для масштабирования.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">
            {siteConfig.name} помогает красиво собирать подарочные наборы, оформлять
            заказы онлайн и масштабировать проект от витрины до полноценного e-commerce.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/checkout">Оформить заказ</ButtonLink>
            <ButtonLink href="/distributors" variant="secondary">
              Для дистрибьютеров
            </ButtonLink>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[2.5rem] bg-stone-950 p-8 text-stone-50 shadow-2xl shadow-stone-950/10">
            <p className="text-sm uppercase tracking-[0.3em] text-stone-300">Формат</p>
            <p className="mt-4 text-3xl font-semibold">Визитка + каталог + checkout</p>
            <p className="mt-4 text-sm leading-7 text-stone-300">
              Легкая для запуска структура, в которую позже можно добавить CMS, личный
              кабинет, промокоды, интеграцию со складом и B2B-раздел.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[2rem] border border-stone-200 bg-white p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-stone-500">Оплата</p>
              <p className="mt-3 text-xl font-semibold text-stone-950">ЮKassa, СБП, карты</p>
            </div>
            <div className="rounded-[2rem] border border-stone-200 bg-white p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-stone-500">Доставка</p>
              <p className="mt-3 text-xl font-semibold text-stone-950">Москва и вся Россия</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Коллекция"
          title="Наборы, которые уже можно продавать через корзину"
          description="Первая версия сайта уже включает витрину товаров и корзину. Позже этот слой можно расширить до полноценного каталога с категориями и остатками."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="rounded-[2.5rem] border border-stone-200 bg-white p-8">
          <SectionHeading
            eyebrow="Доставка"
            title="Прозрачные условия и удобные сценарии получения"
            description="Отдельная страница с информацией о сроках, способах доставки и оплате помогает снять часть вопросов до оформления заказа."
          />
          <ul className="mt-8 space-y-4 text-sm leading-7 text-stone-600">
            {siteConfig.deliveryFeatures.map((feature) => (
              <li key={feature} className="rounded-2xl bg-stone-50 px-4 py-3">
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <ButtonLink href="/delivery" variant="secondary">
              Открыть страницу доставки
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-stone-950 p-8 text-stone-50">
          <SectionHeading
            eyebrow="B2B"
            title="Отдельный сценарий для дистрибьютеров и партнеров"
            description="Вторая ключевая аудитория сайта получает отдельную страницу с условиями сотрудничества, преимуществами и формой связи."
            tone="inverse"
          />
          <ul className="mt-8 space-y-4 text-sm leading-7 text-stone-300">
            {siteConfig.distributorBenefits.map((benefit) => (
              <li key={benefit} className="rounded-2xl bg-white/5 px-4 py-3">
                {benefit}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <ButtonLink href="/distributors" variant="secondary">
              Узнать об условиях
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
