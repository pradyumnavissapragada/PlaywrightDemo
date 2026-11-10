import { expect, type Page } from '@playwright/test';

export class PortfolioPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    const response = await this.page.goto('/pradyumna.github.io/', { waitUntil: 'domcontentloaded' });
    expect(response, 'Portfolio document should return a response').not.toBeNull();
    expect(response!.ok(), 'Portfolio document should load successfully').toBeTruthy();
  }

  async expectLandingPage(): Promise<void> {
    await expect(this.page).toHaveTitle(/Pradyumna Vissapragada/i);
    await expect(this.page.locator('#home h1')).toBeVisible();
    await expect(this.page.locator('#framework')).toBeAttached();
    await expect(this.page.locator('#lab')).toBeAttached();
  }

  async openQualityLab(): Promise<void> {
    const toggle = this.page.locator('#lab-toggle');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(this.page.locator('#lab-details')).toBeVisible();
  }

  async openCareerAssistant(): Promise<void> {
    const launcher = this.page.locator('#chat-launch');
    await launcher.click();
    await expect(this.page.locator('#chat-panel')).toBeVisible();
    await expect(launcher).toHaveAttribute('aria-expanded', 'true');
  }
}
