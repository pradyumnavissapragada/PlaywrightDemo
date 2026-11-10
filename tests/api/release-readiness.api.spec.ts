import { test, expect } from '../../fixtures/test';
import type { ReleaseDecision } from '../../src/api/ReleaseReadinessClient';

test.describe('Release readiness policy API (deterministic local demo)', () => {
  test('@smoke health endpoint publishes service metadata', async ({ releaseApi }) => {
    const response = await releaseApi.health();
    expect(response.status()).toBe(200);
    await expect(response).toBeOK();
    expect(await response.json()).toMatchObject({ status: 'ok' });
  });

  const cases = [
    { name: 'signs off above 85% with no critical defects', regression: 85.1, defects: 0, coverage: 80, status: 'QA_SIGNOFF' },
    { name: 'holds exactly at 85% regression boundary', regression: 85, defects: 0, coverage: 100, status: 'HOLD' },
    { name: 'holds when critical defects remain', regression: 100, defects: 1, coverage: 100, status: 'HOLD' },
    { name: 'treats low coverage as advisory under demonstrated policy', regression: 90, defects: 0, coverage: 75, status: 'QA_SIGNOFF' }
  ] as const;

  for (const item of cases) {
    test(item.name, async ({ releaseApi }) => {
      const response = await releaseApi.assess({
        regressionPassRate: item.regression,
        criticalDefects: item.defects,
        criticalPathCoverage: item.coverage
      });
      expect(response.status()).toBe(200);
      const decision = await response.json() as ReleaseDecision;
      expect(decision.status).toBe(item.status);
      expect(decision.checks.coverageAdvisory).toBe(item.coverage >= 80);
    });
  }

  test('rejects invalid negative defect count', async ({ releaseApi }) => {
    const response = await releaseApi.assess({ regressionPassRate: 95, criticalDefects: -1, criticalPathCoverage: 85 });
    expect(response.status()).toBe(400);
    expect(await response.json()).toMatchObject({ error: 'invalid_assessment' });
  });
});
