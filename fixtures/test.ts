import { test as base, expect } from '@playwright/test';
import { PortfolioPage } from '../pages/PortfolioPage';
import { ReleaseReadinessClient } from '../src/api/ReleaseReadinessClient';

type AppFixtures = {
  portfolio: PortfolioPage;
  releaseApi: ReleaseReadinessClient;
};

export const test = base.extend<AppFixtures>({
  portfolio: async ({ page }, use) => {
    await use(new PortfolioPage(page));
  },
  releaseApi: async ({ request }, use) => {
    await use(new ReleaseReadinessClient(request));
  }
});
export { expect };
