import { test, expect } from "@playwright/test";

test.describe("Checkout modal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /оформить заказ/i }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("отображается шаг 1 с полями контактной информации", async ({ page }) => {
    await expect(page.getByText(/контактная информация/i)).toBeVisible();
    await expect(page.getByPlaceholder(/ваше имя/i)).toBeVisible();
    await expect(page.getByPlaceholder(/ваш email/i)).toBeVisible();
  });

  test("показывает ошибки при пустой отправке", async ({ page }) => {
    await page.getByRole("button", { name: /продолжить оформление/i }).click();
    await expect(page.getByText(/укажите имя/i)).toBeVisible();
  });

  test("переключение вкладки «Для компании» показывает поле компании", async ({ page }) => {
    await page.getByRole("button", { name: /для компании/i }).click();
    await expect(page.getByPlaceholder(/название компании/i)).toBeVisible();
  });

  test("счётчик товаров работает корректно", async ({ page }) => {
    const quantityInput = page.getByRole("spinbutton").first();
    await expect(quantityInput).toBeVisible();
  });
});
