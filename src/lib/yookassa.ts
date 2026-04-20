type YooKassaPaymentMethod = "sbp" | "bank_card";

type CreatePaymentParams = {
  amount: number;
  description: string;
  returnUrl: string;
  metadata: Record<string, string>;
  paymentMethod: YooKassaPaymentMethod;
};

const YOOKASSA_API_URL = "https://api.yookassa.ru/v3/payments";

const getCredentials = () => {
  const shopId = process.env.YOOKASSA_SHOP_ID;
  const secretKey = process.env.YOOKASSA_SECRET_KEY;

  if (!shopId || !secretKey) {
    throw new Error("YooKassa credentials are not configured.");
  }

  return { shopId, secretKey };
};

export const isYooKassaConfigured = () =>
  Boolean(process.env.YOOKASSA_SHOP_ID && process.env.YOOKASSA_SECRET_KEY);

export const createYooKassaPayment = async ({
  amount,
  description,
  returnUrl,
  metadata,
  paymentMethod,
}: CreatePaymentParams) => {
  const { shopId, secretKey } = getCredentials();
  const idempotenceKey = crypto.randomUUID();
  const auth = Buffer.from(`${shopId}:${secretKey}`).toString("base64");

  const response = await fetch(YOOKASSA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotence-Key": idempotenceKey,
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount: {
        value: amount.toFixed(2),
        currency: "RUB",
      },
      description,
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: returnUrl,
      },
      payment_method_data: {
        type: paymentMethod,
      },
      metadata,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`YooKassa request failed: ${errorText}`);
  }

  return (await response.json()) as {
    id: string;
    confirmation?: {
      confirmation_url?: string;
    };
    status: string;
  };
};
