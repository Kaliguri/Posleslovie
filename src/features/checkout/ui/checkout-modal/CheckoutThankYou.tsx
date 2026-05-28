"use client";

import { siteConfig } from "@/shared/config/site";
import { DesignButton } from "@/shared/ui/DesignButton";

export function CheckoutThankYou({
  total,
  onClose,
}: Readonly<{
  total: number;
  onClose: () => void;
}>) {
  return (
    <div className="mx-auto max-w-lg py-6 text-center sm:py-10 sm:text-left">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e8c880] text-3xl font-extrabold text-[#0f172a] sm:mx-0">
        ✓
      </div>
      <h3 className="mt-6 text-h3 font-extrabold text-[#0f172a]">Заявка отправлена</h3>
      <p className="mt-3 text-body leading-relaxed text-[#0f172a]/80 [font-family:var(--font-inter)]">
        Спасибо! Мы получили ваш заказ на сумму{" "}
        <span className="font-bold text-[#0f172a]">{total} ₽</span> и свяжемся с вами в ближайшее
        время.
      </p>
      <p className="mt-2 text-sm text-[#656565] [font-family:var(--font-inter)]">
        Если появятся вопросы — звоните{" "}
        <a
          href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
          className="font-bold text-[#0f172a] underline underline-offset-2 hover:text-[#b08a35]"
        >
          {siteConfig.phone}
        </a>
        .
      </p>
      <div className="mt-8 flex justify-center sm:justify-start">
        <DesignButton variant="filled" showArrow={false} onClick={onClose}>
          Закрыть
        </DesignButton>
      </div>
    </div>
  );
}
