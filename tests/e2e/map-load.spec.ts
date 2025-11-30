import { test, expect } from "@playwright/test";

test("map loads correctly", async ({ page }) => {
  await page.goto("http://localhost:5173");

  // Map container exists
  const map = page.locator("#map");
  await expect(map).toBeVisible();

  // Canvas rendered by OpenLayers
  await expect(page.locator("canvas").first()).toBeVisible();
});
