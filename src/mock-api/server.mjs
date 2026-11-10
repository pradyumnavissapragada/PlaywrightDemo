import { createServer } from 'node:http';

const port = Number(process.env.QA_API_PORT || 4173);
const send = (res, status, data) => {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'access-control-allow-origin': 'http://127.0.0.1:4173'
  });
  res.end(JSON.stringify(data));
};

const server = createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    send(res, 200, { status: 'ok', service: 'release-readiness-demo' });
    return;
  }
  if (req.method !== 'POST' || req.url !== '/v1/release-readiness') {
    send(res, 404, { error: 'not_found' });
    return;
  }
  try {
    let raw = '';
    for await (const chunk of req) {
      raw += chunk;
      if (raw.length > 16_384) {
        send(res, 413, { error: 'payload_too_large' });
        return;
      }
    }
    const data = JSON.parse(raw);
    const isRate = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100;
    const valid = data && isRate(data.regressionPassRate) &&
      isRate(data.criticalPathCoverage) &&
      Number.isSafeInteger(data.criticalDefects) && data.criticalDefects >= 0;
    if (!valid) {
      send(res, 400, { error: 'invalid_assessment', message: 'Valid percentages and non-negative integer defect count required' });
      return;
    }
    const checks = {
      regression: data.regressionPassRate > 85,
      criticalDefects: data.criticalDefects === 0,
      coverageAdvisory: data.criticalPathCoverage >= 80
    };
    send(res, 200, {
      status: checks.regression && checks.criticalDefects ? 'QA_SIGNOFF' : 'HOLD',
      checks,
      policy: { regression: 'strictly greater than 85%', criticalDefects: 'zero', coverage: '80% advisory only' }
    });
  } catch {
    send(res, 400, { error: 'invalid_json' });
  }
});
server.listen(port, '127.0.0.1', () => console.log('Demo API listening on ' + port));
