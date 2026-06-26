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

test("opens partners modal and requires consent for lead form", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Для партнеров" }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText("Хотите стать нашим партнером?")).toBeVisible();

  await page.getByLabel("Имя").fill("Тест Партнер");
  await page.getByLabel("Телефон").fill("+7 (999) 111-22-33");
  await page.getByLabel("Email").fill("partner@example.ru");
  await page.getByRole("button", { name: "Стать партнером" }).click();

  await expect(
    page.getByText("Подтвердите согласие с обработкой персональных данных."),
  ).toBeVisible();
  await page
    .getByLabel(/Нажимая на кнопку, вы соглашаетесь с обработкой персональных данных/)
    .check();
  await expect(
    page.getByText("Подтвердите согласие с обработкой персональных данных."),
  ).not.toBeVisible();
});
