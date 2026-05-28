"use client";

import { FieldErrorMessage } from "@/features/checkout/ui/checkout-modal/FormParts";

export function CheckoutOrderPanel({
  checkoutProduct,
  quantity,
  total,
  error,
  onQuantityChange,
}: Readonly<{
  checkoutProduct: { title: string; price: number; image: string };
  quantity: number;
  total: number;
  error?: string;
  onQuantityChange: (q: number) => void;
}>) {
  return (
    <div className="text-center sm:text-left">
      <h3 className="text-[21px] font-extrabold sm:text-2xl">Детали заказа</h3>
      <div className="mt-3 h-[3px] rounded-full bg-[#c5c5c5] sm:mt-4" />
      <div className="mt-5 flex flex-col items-center gap-4 rounded-2xl bg-[#f8f8f8] p-3.5 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-4">
        <ZoomImage
          image={checkoutProduct.image}
          label={checkoutProduct.title}
          className="h-24 w-24 shrink-0 rounded-[10px] sm:h-[108px] sm:w-[108px]"
        />
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="font-bold">{checkoutProduct.title}</p>
          <div className="mt-4 flex items-center gap-3">
            <CounterButton onClick={() => onQuantityChange(quantity - 1)} disabled={quantity <= 1}>
              -
            </CounterButton>
            <input
              type="number"
              min={1}
              value={quantity}
              title="Product quantity"
              aria-label="Количество бомбочек"
              aria-invalid={Boolean(error)}
              onChange={(event) => onQuantityChange(Number(event.target.value))}
              className={`h-10 w-16 rounded-full border bg-white text-center font-bold outline-none ${
                error ? "border-red-500" : "border-[#e8c880]"
              }`}
            />
            <CounterButton onClick={() => onQuantityChange(quantity + 1)}>+</CounterButton>
          </div>
          {error ? <FieldErrorMessage message={error} /> : null}
        </div>
        <p className="shrink-0 font-bold sm:self-start">{checkoutProduct.price} ₽</p>
      </div>
      <div className="mt-5 h-[3px] rounded-full bg-[#c5c5c5] sm:mt-6" />
      <div className="mt-5 space-y-2 text-base sm:mt-6 sm:space-y-4 sm:text-xl">
        <p className="font-light">Количество: {quantity} шт.</p>
        <p className="font-light">Цена за 1 шт.: {checkoutProduct.price} руб.</p>
        <p className="font-extrabold">Итоговая сумма: {total} руб.</p>
      </div>
    </div>
  );
}

function ZoomImage({
  image,
  label,
  className,
}: Readonly<{ image: string; label: string; className: string }>) {
  return (
    <div
      aria-label={label || undefined}
      role={label ? "img" : undefined}
      className={`overflow-hidden bg-[#f8f8f8] zoom-frame ${className}`}
    >
      <div
        className="zoom-media h-full w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
    </div>
  );
}

function CounterButton({
  children,
  disabled = false,
  onClick,
}: Readonly<{ children: React.ReactNode; disabled?: boolean; onClick: () => void }>) {
  return (
    <button
      type="button"
      title={children === "+" ? "Increase product quantity" : "Decrease product quantity"}
      disabled={disabled}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0f172a]/50 font-bold transition hover:border-[#e8c880] hover:text-[#e8c880] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}
