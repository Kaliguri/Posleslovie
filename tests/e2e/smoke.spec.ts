import { test, expect } from "@playwright/test";

test.describe("Smoke", () => {
  test("главная страница загружается", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Послесловие/i);
  });

  test("hero-секция видна", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("section").first();
    await expect(hero).toBeVisible();
  });

  test("кнопка CTA открывает модал оформления заказа", async ({ page }) => {
    await page.goto("/");
    const ctaButton = page.getByRole("button", { name: /оформить заказ/i }).first();
    await ctaButton.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText(/оформление заказа/i)).toBeVisible();
  });

  test("модал закрывается кнопкой «Закрыть»", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("button", { name: /оформить заказ/i })
      .first()
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: /закрыть/i }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("модал закрывается клавишей Escape", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("button", { name: /оформить заказ/i })
      .first()
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});
