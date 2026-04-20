import { NextRequest, NextResponse } from "next/server";

import { productMap } from "@/entities/product/model/products";
import { createYooKassaPayment, isYooKassaConfigured } from "@/lib/yookassa";

type CheckoutPayload = {
  customer: {
    fullName: string;
    phone: string;
    email: string;
  };
  delivery: {
    city: string;
    address: string;
    comment?: string;
  };
  paymentMethod: "sbp" | "bank_card" | "cash_on_delivery";
  items: Array<{
    productId: string;
    quantity: number;
  }>;
};

const calculateOrder = (payload: CheckoutPayload) => {
  const lines = payload.items.flatMap((line) => {
    const product = productMap.get(line.productId);

    if (!product || line.quantity <= 0) {
      return [];
    }

    return [
      {
        productId: line.productId,
        name: product.name,
        quantity: line.quantity,
        price: product.price,
      },
    ];
  });

  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const delivery = subtotal >= 15000 ? 0 : 700;

  return {
    lines,
    subtotal,
    delivery,
    total: subtotal + delivery,
  };
};

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as CheckoutPayload;

  if (!payload.customer.fullName || !payload.customer.phone || !payload.items.length) {
    return NextResponse.json(
      { success: false, message: "Не заполнены обязательные поля заказа." },
      { status: 400 },
    );
  }

  const order = calculateOrder(payload);

  if (!order.lines.length) {
    return NextResponse.json(
      { success: false, message: "Корзина пуста или содержит недоступные товары." },
      { status: 400 },
    );
  }

  const orderId = `PSL-${Date.now()}`;

  if (payload.paymentMethod === "cash_on_delivery") {
    return NextResponse.json({
      success: true,
      orderId,
    });
  }

  if (!isYooKassaConfigured()) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Для онлайн-оплаты нужно добавить YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY в переменные окружения.",
      },
      { status: 503 },
    );
  }

  try {
    const origin = new URL(request.url).origin;
    const payment = await createYooKassaPayment({
      amount: order.total,
      description: `Заказ ${orderId} для ${payload.customer.fullName}`,
      returnUrl: `${origin}/checkout/success?order=${orderId}`,
      paymentMethod: payload.paymentMethod,
      metadata: {
        orderId,
        phone: payload.customer.phone,
        email: payload.customer.email,
      },
    });

    return NextResponse.json({
      success: true,
      orderId,
      redirectUrl: payment.confirmation?.confirmation_url,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Не удалось инициализировать платёж. Попробуйте позже.",
      },
      { status: 502 },
    );
  }
}
