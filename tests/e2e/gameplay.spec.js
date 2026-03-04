import { test, expect } from "@playwright/test";
import { navigateToLevel, playSolution } from "./helpers.js";

test.describe("Core gameplay", () => {
  test("Level 1: correct solution shows success overlay", async ({ page }) => {
    await navigateToLevel(page, 1, "en");

    // Play the solution: right, right, pick, down, down, pick, right, right, pick
    await playSolution(page, [
      "right", "right", "pick", "down", "down", "pick", "right", "right", "pick",
    ]);

    // Wait for the success overlay to appear (animation + execution delay)
    await expect(page.getByTestId("result-overlay")).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId("result-overlay").getByRole("heading")).toContainText("We did it!");
  });

  test("Level 1: wrong blocks show fail overlay", async ({ page }) => {
    await navigateToLevel(page, 1, "en");

    // Play wrong solution — just move left (wall) and pick (nothing there)
    await playSolution(page, ["left", "pick"]);

    // Wait for fail overlay
    await expect(page.getByTestId("result-overlay")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("There's a bug!")).toBeVisible();
  });

  test("Clear button removes blocks from drop zone", async ({ page }) => {
    await navigateToLevel(page, 1, "en");

    // Add some blocks
    await page.getByTestId("block-right").click();
    await page.getByTestId("block-down").click();

    // Verify drop zone has content (the "Drag & drop" placeholder should be gone)
    const dropZone = page.getByTestId("drop-zone");
    await expect(dropZone.getByText("Drag & drop")).not.toBeVisible();

    // Click clear
    await page.getByTestId("clear-code").click();

    // Drag & drop placeholder should reappear
    await expect(dropZone.getByText("Drag & drop")).toBeVisible();
  });
});
