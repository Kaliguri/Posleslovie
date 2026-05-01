"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order") ?? "PSL-DEMO";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="rounded-[2.5rem] border border-stone-200 bg-white p-8 text-center shadow-sm shadow-stone-950/5 md:p-12">
        <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Спасибо</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-950">
          Заказ оформлен
        </h1>
        <p className="mt-4 text-base leading-7 text-stone-600">
          Мы сохранили заявку под номером <span className="font-medium">{orderId}</span>.
          Менеджер свяжется с вами для подтверждения деталей доставки и состава заказа.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-stone-50"
          >
            Вернуться на главную
          </Link>
          <Link
            href="/delivery"
            className="inline-flex rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-950"
          >
            Посмотреть доставку
          </Link>
        </div>
      </div>
    </div>
  );
}
