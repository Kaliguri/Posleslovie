import { CheckoutForm } from "@/features/checkout/ui/checkout-form";
import { SectionHeading } from "@/shared/ui/section-heading";

export const metadata = {
  title: "Оформление заказа",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <SectionHeading
        eyebrow="Checkout"
        title="Оформление заказа"
        description="Первая версия checkout уже поддерживает сценарии для СБП, банковских карт и оплаты при получении. Интеграция вынесена в серверный маршрут, чтобы позже добавить уведомления, CRM и статусы заказов."
      />
      <div className="mt-10">
        <CheckoutForm />
      </div>
    </div>
  );
}
