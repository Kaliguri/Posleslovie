"use client";

export function CheckoutStickySummary({
  total,
  quantity,
  onContinue,
}: Readonly<{
  total: number;
  quantity: number;
  onContinue: () => void;
}>) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-[#e8c880]/40 bg-white/95 px-4 py-3 shadow-[0_-12px_40px_rgba(15,23,42,0.12)] backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-[920px] items-center justify-between gap-4">
        <div className="min-w-0 text-left">
          <p className="text-xs font-medium text-[#656565]">Итого · {quantity} шт.</p>
          <p className="text-xl font-extrabold text-[#0f172a]">{total} ₽</p>
        </div>
        <button
          type="button"
          onClick={onContinue}
          className="shrink-0 rounded-full bg-[#e8c880] px-5 py-3 text-sm font-bold text-[#0f172a] transition hover:bg-[#ffecbf]"
        >
          Продолжить
        </button>
      </div>
    </div>
  );
}
