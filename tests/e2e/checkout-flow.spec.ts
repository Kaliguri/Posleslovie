import { test, expect } from "@playwright/test";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

type CheckoutBody = {
  quantity: number;
  total: number;
  unitPrice: number;
  formValues: { name: string; email: string; city: string };
};

test("completes the full 3-step checkout and sends a well-formed payload", async ({ page }) => {
  const captured: CheckoutBody[] = [];

  // Intercept the AmoCRM worker so the test is deterministic and never creates a real CRM lead.
  await page.route(/amocrm-worker\.e2e/, async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: corsHeaders });
      return;
    }
    captured.push(route.request().postDataJSON() as CheckoutBody);
    await route.fulfill({
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto("/");
  await page
    .getByRole("button", { name: /оформить заказ/i })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();

  // Step 1 — contact info
  await page.getByPlaceholder(/ваше имя/i).fill("Полина Тест");
  await page.getByPlaceholder("+7 (000) 000-00-00").fill("+7 (978) 673-47-01");
  await page.getByPlaceholder(/ваш email/i).fill("buyer@example.ru");
  await page.getByPlaceholder("Москва").fill("Москва");
  await page.getByRole("button", { name: /продолжить оформление/i }).click();

  // Step 2 — accept consent, proceed to scheduling
  const proceedButton = page.getByRole("button", { name: /договориться о созвоне/i });
  await expect(proceedButton).toBeVisible();
  await page.getByRole("checkbox").first().check();
  await proceedButton.click();

  // Step 3 — submit the order
  await page.getByRole("button", { name: /завершить оформление/i }).click();

  // Thank-you screen confirms success
  await expect(page.getByRole("heading", { name: /заявка отправлена/i })).toBeVisible();

  // The payload sent to the worker is well-formed
  expect(captured.length).toBeGreaterThan(0);
  const payload = captured[0];
  expect(payload.quantity).toBeGreaterThanOrEqual(1);
  expect(payload.unitPrice).toBeGreaterThan(0);
  expect(payload.total).toBe(payload.quantity * payload.unitPrice);
  expect(payload.formValues.name).toBe("Полина Тест");
  expect(payload.formValues.email).toBe("buyer@example.ru");
  expect(payload.formValues.city).toBe("Москва");
});
