"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { useCart } from "@/features/cart/model/cart-context";
import { formatPrice } from "@/shared/lib/format";

type PaymentMethod = "sbp" | "bank_card" | "cash_on_delivery";

const paymentLabels: Record<PaymentMethod, string> = {
  sbp: "СБП",
  bank_card: "Банковская карта",
  cash_on_delivery: "При получении",
};

export const CheckoutForm = () => {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("sbp");

  const deliveryPrice = useMemo(() => (subtotal >= 15000 ? 0 : 700), [subtotal]);
  const total = subtotal + deliveryPrice;

  if (items.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white p-8 text-center">
        <h2 className="text-2xl font-semibold text-stone-950">Корзина пока пуста</h2>
        <p className="mt-3 text-sm leading-6 text-stone-500">
          Добавьте наборы на главной странице, и здесь появится форма оформления.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-stone-50"
        >
          Перейти к товарам
        </Link>
      </div>
    );
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);

    const payload = {
      customer: {
        fullName: String(formData.get("fullName") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        email: String(formData.get("email") ?? ""),
      },
      delivery: {
        city: String(formData.get("city") ?? ""),
        address: String(formData.get("address") ?? ""),
        comment: String(formData.get("comment") ?? ""),
      },
      paymentMethod,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as
        | { success: true; orderId: string; redirectUrl?: string }
        | { success: false; message: string };

      if (!response.ok || !result.success) {
        throw new Error(result.success ? "Checkout failed" : result.message);
      }

      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
        return;
      }

      clearCart();
      router.push(`/checkout/success?order=${result.orderId}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Не удалось оформить заказ. Попробуйте снова.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form
        action={handleSubmit}
        className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm shadow-stone-950/5 md:p-8"
      >
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Оформление</p>
          <h2 className="mt-3 text-3xl font-semibold text-stone-950">Данные получателя</h2>
        </div>

        <div className="mt-8 grid gap-5">
          <label className="grid gap-2 text-sm text-stone-600">
            Имя и фамилия
            <input
              required
              name="fullName"
              className="rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
              placeholder="Анна Иванова"
            />
          </label>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-stone-600">
              Телефон
              <input
                required
                name="phone"
                type="tel"
                className="rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
                placeholder="+7 (999) 123-45-67"
              />
            </label>
            <label className="grid gap-2 text-sm text-stone-600">
              E-mail
              <input
                required
                name="email"
                type="email"
                className="rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
                placeholder="hello@brand.ru"
              />
            </label>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-stone-600">
              Город
              <input
                required
                name="city"
                className="rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
                placeholder="Москва"
              />
            </label>
            <label className="grid gap-2 text-sm text-stone-600">
              Адрес
              <input
                required
                name="address"
                className="rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
                placeholder="Улица, дом, офис/квартира"
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm text-stone-600">
            Комментарий к заказу
            <textarea
              name="comment"
              rows={4}
              className="rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
              placeholder="Пожелания по упаковке, интервалу доставки и т.д."
            />
          </label>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-semibold text-stone-950">Способ оплаты</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {(Object.keys(paymentLabels) as PaymentMethod[]).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`rounded-2xl border px-4 py-4 text-left text-sm transition ${
                  paymentMethod === method
                    ? "border-stone-950 bg-stone-950 text-stone-50"
                    : "border-stone-300 bg-white text-stone-700 hover:border-stone-950"
                }`}
              >
                {paymentLabels[method]}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-stone-950 px-5 py-4 text-sm font-medium text-stone-50 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Создаём заказ..."
            : paymentMethod === "cash_on_delivery"
              ? "Подтвердить заказ"
              : `Оплатить через ${paymentLabels[paymentMethod]}`}
        </button>
      </form>

      <aside className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm shadow-stone-950/5 md:p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Ваш заказ</p>
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-stone-950">{item.name}</p>
                <p className="text-sm text-stone-500">{item.quantity} шт.</p>
              </div>
              <span className="text-sm font-medium text-stone-950">
                {formatPrice(item.quantity * item.price)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-3 border-t border-stone-200 pt-6 text-sm">
          <div className="flex items-center justify-between text-stone-600">
            <span>Товары</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-stone-600">
            <span>Доставка</span>
            <span>{deliveryPrice === 0 ? "Бесплатно" : formatPrice(deliveryPrice)}</span>
          </div>
          <div className="flex items-center justify-between text-lg font-semibold text-stone-950">
            <span>Итого</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <div className="mt-8 rounded-[1.5rem] bg-stone-50 p-5 text-sm leading-6 text-stone-600">
          Онлайн-оплата проходит через ЮKassa: поддерживаются СБП и банковские карты. Для части заказов можно оставить оплату при получении.
        </div>
      </aside>
    </div>
  );
};
