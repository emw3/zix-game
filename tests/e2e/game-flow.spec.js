import { test, expect } from "@playwright/test";

test.describe("Game flow navigation", () => {
  test("Splash → English → Intro → Missions → Level 1 → Gameplay", async ({ page }) => {
    await page.goto("/");

    // Splash screen visible
    await expect(page.getByText("ZIX")).toBeVisible();

    // Click English
    await page.getByTestId("lang-en").click();

    // Intro screen — click through 4 slides
    await expect(page.getByTestId("intro-next")).toBeVisible();
    for (let i = 0; i < 4; i++) {
      await page.getByTestId("intro-next").click();
    }

    // Missions screen visible
    await expect(page.getByTestId("mission-1")).toBeVisible();

    // Click level 1
    await page.getByTestId("mission-1").click();

    // Gameplay screen visible — run button should exist
    await expect(page.getByTestId("run-code")).toBeVisible();
  });

  test("Splash → Spanish → verify Spanish intro text", async ({ page }) => {
    await page.goto("/");

    // Click Spanish
    await page.getByTestId("lang-es").click();

    // Verify Spanish intro text appears
    await expect(page.getByText("Mi nave se estrelló")).toBeVisible();
  });
});
