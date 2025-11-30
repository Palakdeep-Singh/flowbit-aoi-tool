import { test, expect } from "@playwright/test";

test("draw polygon and save", async ({ page }) => {
  await page.goto("http://localhost:5173");

  // Click the draw polygon button
  await page.locator("button:has(svg)").nth(0).click(); // first icon

  // Simulate a polygon draw
  await page.mouse.click(400, 300);
  await page.mouse.click(500, 320);
  await page.mouse.click(480, 400);
  await page.mouse.dblclick(400, 300); // finish polygon

  // Check localStorage updated
  const stored = await page.evaluate(() => localStorage.getItem("flowbit:aoi"));
  expect(stored).not.toBeNull();
});
