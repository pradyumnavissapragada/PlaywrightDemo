import { test, expect } from '../../fixtures/test';

test.describe('Portfolio UI smoke and recruiter experience', () => {
  test('@smoke homepage presents quality engineering experience', async ({ portfolio }) => {
    await portfolio.open();
    await portfolio.expectLandingPage();
  });

  test('@smoke Quality Lab can be expanded', async ({ portfolio }) => {
    await portfolio.open();
    await portfolio.openQualityLab();
  });

  test('P-Bot career assistant opens without contacting the AI service', async ({ portfolio, page }) => {
    await portfolio.open();
    await portfolio.openCareerAssistant();
    await expect(page.locator('#chat-form')).toBeVisible();
  });

  test('recruiters can navigate to automation architecture', async ({ portfolio, page }) => {
    await portfolio.open();
    await page.locator('a[href="#framework"]').first().click();
    await expect(page).toHaveURL(/#framework$/);
    await expect(page.locator('#framework h2')).toBeVisible();
  });
});
