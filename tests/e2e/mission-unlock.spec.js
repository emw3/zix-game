import { test, expect } from "@playwright/test";
import { navigateToLevel, playSolution } from "./helpers.js";

test.describe("Mission unlock progression", () => {
  test("Complete level 1 → back to missions → level 2 unlocked", async ({ page }) => {
    await navigateToLevel(page, 1, "en");

    // Play solution for level 1
    await playSolution(page, [
      "right", "right", "pick", "down", "down", "pick", "right", "right", "pick",
    ]);

    // Wait for success overlay
    await expect(page.getByTestId("result-overlay")).toBeVisible({ timeout: 15000 });

    // Click "Next mission" to go back to missions
    await page.getByTestId("result-action").click();

    // Should be on missions screen — level 2 should be clickable
    await expect(page.getByTestId("mission-2")).toBeVisible();

    // Level 2 should not be grayed out (opacity 1 = unlocked)
    const mission2 = page.getByTestId("mission-2");
    const opacity = await mission2.evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacity)).toBe(1);
  });

  test("localStorage has completed=[1] after success", async ({ page }) => {
    await navigateToLevel(page, 1, "en");

    // Play solution
    await playSolution(page, [
      "right", "right", "pick", "down", "down", "pick", "right", "right", "pick",
    ]);

    await expect(page.getByTestId("result-overlay")).toBeVisible({ timeout: 15000 });
    await page.getByTestId("result-action").click();

    // Check localStorage
    const completed = await page.evaluate(() => {
      const data = localStorage.getItem("zix-completed");
      return data ? JSON.parse(data) : null;
    });
    expect(completed).toContain(1);
  });
});
