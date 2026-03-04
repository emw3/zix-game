/**
 * Navigate from splash screen to a specific level.
 * @param {import('@playwright/test').Page} page
 * @param {number} level - Level number to navigate to
 * @param {'es'|'en'} lang - Language to select
 */
export async function navigateToLevel(page, level, lang = "en") {
  await page.goto("/");

  // Select language on splash screen
  await page.getByTestId(lang === "es" ? "lang-es" : "lang-en").click();

  // Click through 4 intro slides
  for (let i = 0; i < 4; i++) {
    await page.getByTestId("intro-next").click();
  }

  // Wait for missions screen, then click the level
  await page.getByTestId(`mission-${level}`).click();
}

/**
 * Click solution blocks in the palette then run.
 * @param {import('@playwright/test').Page} page
 * @param {string[]} blockIds - Array of block IDs to click
 */
export async function playSolution(page, blockIds) {
  for (const id of blockIds) {
    await page.getByTestId(`block-${id}`).click();
  }
  await page.getByTestId("run-code").click();
}
