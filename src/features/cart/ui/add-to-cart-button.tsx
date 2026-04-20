"use client";

import { useCart } from "@/features/cart/model/cart-context";

export const AddToCartButton = ({ productId }: { productId: string }) => {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => addItem(productId)}
      className="inline-flex items-center justify-center rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-stone-50 transition hover:bg-stone-800"
    >
      Добавить в корзину
    </button>
  );
};
