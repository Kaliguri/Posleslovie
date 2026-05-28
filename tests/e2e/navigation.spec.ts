import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("страница имеет корректный lang=ru", async ({ page }) => {
    await page.goto("/");
    const lang = await page.getAttribute("html", "lang");
    expect(lang).toBe("ru");
  });

  test("модал «Для партнеров» открывается из навигации", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /для партнеров/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText(/партнерство/i)).toBeVisible();
  });

  test("модал «Контакты» открывается из навигации", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /контакты/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText(/контактные данные/i)).toBeVisible();
  });

  test("страница содержит JSON-LD разметку", async ({ page }) => {
    await page.goto("/");
    const scripts = page.locator('script[type="application/ld+json"]');
    await expect(scripts.first()).toBeAttached();
  });

  test("sitemap.xml доступен", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
  });
});
