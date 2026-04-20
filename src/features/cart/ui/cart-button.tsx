"use client";

import { useCart } from "@/features/cart/model/cart-context";

export const CartButton = () => {
  const { itemsCount, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className="inline-flex items-center gap-3 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-950 transition hover:border-stone-950"
    >
      <span>Корзина</span>
      <span className="rounded-full bg-stone-950 px-2 py-0.5 text-xs text-white">
        {itemsCount}
      </span>
    </button>
  );
};
