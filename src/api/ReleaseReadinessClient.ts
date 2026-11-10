import type { APIRequestContext, APIResponse } from '@playwright/test';

export type ReleaseAssessment = {
  regressionPassRate: number;
  criticalDefects: number;
  criticalPathCoverage: number;
};

export type ReleaseDecision = {
  status: 'QA_SIGNOFF' | 'HOLD';
  checks: { regression: boolean; criticalDefects: boolean; coverageAdvisory: boolean };
};

export class ReleaseReadinessClient {
  constructor(private readonly request: APIRequestContext) {}

  health(): Promise<APIResponse> {
    return this.request.get('/health');
  }

  assess(input: ReleaseAssessment | Record<string, unknown>): Promise<APIResponse> {
    return this.request.post('/v1/release-readiness', { data: input });
  }
}
