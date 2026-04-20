"use client";

import Link from "next/link";

import { useCart } from "@/features/cart/model/cart-context";
import { formatPrice } from "@/shared/lib/format";

export const CartDrawer = () => {
  const {
    items,
    subtotal,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Закрыть корзину"
          onClick={closeCart}
          className="fixed inset-0 z-40 bg-stone-950/30 backdrop-blur-sm"
        />
      ) : null}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md transform flex-col border-l border-stone-200 bg-white p-6 shadow-2xl transition ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Корзина</p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-950">Ваш заказ</h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-full border border-stone-300 px-3 py-1 text-sm text-stone-700"
          >
            Закрыть
          </button>
        </div>

        <div className="mt-6 flex-1 space-y-4 overflow-y-auto">
          {items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-stone-300 px-5 py-8 text-sm leading-6 text-stone-500">
              В корзине пока пусто. Добавьте наборы на главной странице, и они сразу появятся здесь.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="rounded-3xl border border-stone-200 p-4 shadow-sm shadow-stone-950/5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-stone-950">{item.name}</h3>
                    <p className="mt-1 text-sm text-stone-500">
                      {formatPrice(item.price)} за единицу
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-sm text-stone-500 hover:text-stone-950"
                  >
                    Удалить
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="inline-flex items-center rounded-full border border-stone-200">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-3 py-2 text-sm"
                    >
                      -
                    </button>
                    <span className="min-w-10 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-3 py-2 text-sm"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-medium text-stone-950">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-stone-200 pt-4">
          <div className="flex items-center justify-between text-sm text-stone-500">
            <span>Сумма</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="mt-5 grid gap-3">
            <Link
              href="/checkout"
              onClick={closeCart}
              className="inline-flex items-center justify-center rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-stone-50 transition hover:bg-stone-800"
            >
              Оформить заказ
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center justify-center rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-950 transition hover:border-stone-950"
            >
              Очистить корзину
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
