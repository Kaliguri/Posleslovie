import { test, expect } from "@playwright/test";

test("opens checkout modal from hero CTA", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Оформить заказ" }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText("Оформление заказа")).toBeVisible();
});

test("opens mobile menu and checkout action", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Открыть меню" }).click();
  await expect(page.getByRole("navigation", { name: "Мобильная навигация" })).toBeVisible();
  await page
    .getByRole("navigation", { name: "Мобильная навигация" })
    .getByRole("button", { name: "Оформить заказ" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("opens partners modal and submits lead form", async ({ page }) => {
  // Intercept the AmoCRM worker call so the test is deterministic and never creates a real CRM lead.
  // Match only the worker host (it lives on a Cloudflare *.workers.dev domain) to avoid racing with
  // page/asset requests. The call is cross-origin, so we answer the CORS preflight (OPTIONS) and
  // include CORS headers on the POST response, otherwise the browser blocks it.
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  await page.route(/amocrm-worker\.e2e/, async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: corsHeaders });
      return;
    }
    await route.fulfill({
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Для партнеров" }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText("Хотите стать нашим партнером?")).toBeVisible();

  await page.getByLabel("Имя").fill("Тест Партнер");
  await page.getByLabel("Телефон").fill("+7 (999) 111-22-33");
  await page.getByLabel("Email").fill("partner@example.ru");
  await page.getByRole("checkbox", { name: /персональных данных/i }).check();
  await page.getByRole("button", { name: "Стать партнером" }).click();

  await expect(page.getByText(/заявка отправлена/i)).toBeVisible();
});
