const counterId = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID?.trim();
const counterIdNumber = counterId && /^\d+$/.test(counterId) ? Number(counterId) : null;

type EcommerceProduct = {
  id?: string;
  name: string;
  price?: number;
  quantity?: number;
};

declare global {
  interface Window {
    ym?: (id: number, action: string, ...params: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

/** Fire a Yandex.Metrica goal. No-op until a valid counter id is configured. */
export function reachGoal(goal: string) {
  if (!counterIdNumber || typeof window === "undefined") {
    return;
  }
  window.ym?.(counterIdNumber, "reachGoal", goal);
}

/** Push an ecommerce purchase into the Metrica dataLayer. No-op without a counter id. */
export function pushPurchase(order: { id: string; products: EcommerceProduct[] }) {
  if (!counterIdNumber || typeof window === "undefined") {
    return;
  }
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    ecommerce: {
      currencyCode: "RUB",
      purchase: {
        actionField: { id: order.id },
        products: order.products,
      },
    },
  });
}
