// node --test scripts/e2e/http-checks.test.mjs
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { after, before, test } from 'node:test';
import { checkSeoFiles } from './http-checks.mjs';

let server;
let base;

before(async () => {
  server = createServer((req, res) => {
    if (req.url === '/robots.txt') {
      res.writeHead(200, { 'content-type': 'text/plain' });
      res.end('User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml\n');
      return;
    }
    res.writeHead(404, { 'content-type': 'text/html' });
    res.end('not found');
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

test('reports missing SEO files as failures instead of crashing', async () => {
  const results = [];
  // The runner's record() returns what Array#push returns, a number.
  const record = (group, subject, check, ok, detail) =>
    results.push({ subject, check, ok, detail });
  await checkSeoFiles(
    base,
    { images: [`${base}/og/missing.png`], icons: [`${base}/missing.ico`], parseXml: () => null },
    record,
  );
  const failed = results.filter((result) => !result.ok).map((result) => result.subject);
  assert.ok(failed.includes('/og/missing.png'), JSON.stringify(results));
  assert.ok(failed.includes('/sitemap.xml'));
  assert.ok(failed.includes('/manifest.json'));
  assert.ok(failed.includes('/missing.ico'));
});
