import { test, expect } from "@playwright/test";
import { navigateToLevel } from "./helpers.js";

test.describe("UI interactions", () => {
  test("Mute toggle changes icon", async ({ page }) => {
    await navigateToLevel(page, 1, "en");

    const muteBtn = page.getByTestId("mute-toggle");

    // Initially unmuted — should show speaker icon
    await expect(muteBtn).toContainText("🔊");

    // Click to mute
    await muteBtn.click();
    await expect(muteBtn).toContainText("🔇");

    // Click to unmute
    await muteBtn.click();
    await expect(muteBtn).toContainText("🔊");
  });

  test("Language toggle switches text", async ({ page }) => {
    await navigateToLevel(page, 1, "en");

    // Should see English text
    await expect(page.getByText("Run!")).toBeVisible();

    // Toggle language
    await page.getByTestId("lang-toggle").click();

    // Should see Spanish text
    await expect(page.getByText("¡Ejecutar!")).toBeVisible();
  });

  test("Back button returns to missions", async ({ page }) => {
    await navigateToLevel(page, 1, "en");

    // Verify we're in gameplay
    await expect(page.getByTestId("run-code")).toBeVisible();

    // Click back
    await page.getByTestId("back-button").click();

    // Should see missions screen
    await expect(page.getByTestId("mission-1")).toBeVisible();
  });
});
