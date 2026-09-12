#!/usr/bin/env node
/**
 * End-to-end smoke suite: every sitemap page in both themes at three viewports, the setup page
 * flows, the header menu, the overlays and the SEO files, in headless Chrome. See README.md.
 *
 *   node scripts/e2e/run.mjs [--base http://localhost:4173] [--only /setup] [--concurrency 4]
 *                            [--verbose]
 */
import { parseArgs } from 'node:util';
import { launchChrome } from '../lib/chrome.mjs';
import {
  parseXmlInBrowser,
  runHeaderMenu,
  runOverlay,
  runPageCase,
  runSetupFlow,
} from './browser-checks.mjs';
import {
  EXTRA_PAGES,
  KNOWN_BUGS,
  LOCALE_PREFIXES,
  OVERLAYS,
  THEMES,
  VIEWPORTS,
} from './config.mjs';
import { checkPageStatus, checkSeoFiles, fetchChain } from './http-checks.mjs';

const { values: args } = parseArgs({
  options: {
    base: { type: 'string', default: process.env.E2E_BASE_URL ?? 'http://localhost:4173' },
    only: { type: 'string' },
    concurrency: { type: 'string', default: process.env.E2E_CONCURRENCY ?? '4' },
    verbose: { type: 'boolean', default: false },
  },
});
const BASE = args.base.replace(/\/$/, '');
const CONCURRENCY = Math.max(1, Number(args.concurrency) || 4);
const JOB_TIMEOUT_MS = 120_000;
const HARD_TIMEOUT_MS = Number(process.env.E2E_TIMEOUT_MS ?? 15 * 60_000);

// --- Results -----------------------------------------------------------------------------------

const results = [];
const noise = [];
const record = (group, subject, variant, check, ok, detail = '') =>
  results.push({ group, subject, variant, check, ok: Boolean(ok), detail: ok ? '' : detail });

// --- Pages -------------------------------------------------------------------------------------

/** Sorts a path into landing / setup / content, ignoring a locale prefix like /tr. */
function describePage(path, status) {
  const prefix = LOCALE_PREFIXES.find((p) => path === `/${p}` || path.startsWith(`/${p}/`));
  const rest = prefix ? path.slice(prefix.length + 1) || '/' : path;
  const setup = rest.match(/^\/setup\/([^/]+)$/);
  const kind =
    status !== 200 ? 'not-found' : rest === '/' ? 'landing' : setup ? 'setup' : 'content';
  return { path, status, kind, slug: setup?.[1] ?? null, locale: prefix ?? null };
}

async function discoverPages() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`GET /sitemap.xml answered ${res.status}`);
  const xml = await res.text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => new URL(match[1].trim()).pathname,
  );
  return [
    ...paths.map((path) => describePage(path, 200)),
    ...EXTRA_PAGES.map((page) => describePage(page.path, page.status ?? 200)),
  ];
}

// --- Running -----------------------------------------------------------------------------------

function withTimeout(promise, ms, label) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms);
    }),
  ]).finally(() => clearTimeout(timer));
}

async function runJobs(jobs) {
  let next = 0;
  let done = 0;
  const worker = async () => {
    while (next < jobs.length) {
      const job = jobs[next++];
      const started = Date.now();
      try {
        await withTimeout(job.run(), JOB_TIMEOUT_MS, job.label);
      } catch (err) {
        job.check('job finished', false, err.message);
      }
      const failed = job.own.filter((c) => !c.ok).length;
      done++;
      const status = failed ? `FAIL (${failed})` : 'ok';
      const seconds = ((Date.now() - started) / 1000).toFixed(1);
      console.log(
        `  [${String(done).padStart(3)}/${jobs.length}] ${status.padEnd(9)} ${job.label}  ${seconds}s`,
      );
      if (args.verbose) {
        for (const c of job.own) console.log(`        ${c.ok ? 'ok  ' : 'FAIL'}  ${c.name}`);
      }
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
}

// --- Report ------------------------------------------------------------------------------------

const knownBug = (result) => KNOWN_BUGS.find((bug) => bug.check === result.check);

/** "ok", "2 FAIL", or "1 BUG" when every failure in the cell is a known bug. */
const cell = (items) => {
  if (items.length === 0) return '-';
  const failed = items.filter((r) => !r.ok);
  const unknown = failed.filter((r) => !knownBug(r)).length;
  if (unknown) return `${unknown} FAIL${failed.length > unknown ? '+' : ''}`;
  return failed.length ? `${failed.length} BUG` : 'ok';
};

function table(headers, rows) {
  const widths = headers.map((h, i) => Math.max(h.length, ...rows.map((row) => row[i].length)));
  const line = (cells) =>
    cells
      .map((c, i) => c.padEnd(widths[i]))
      .join('  ')
      .trimEnd();
  return [line(headers), line(widths.map((w) => '-'.repeat(w))), ...rows.map(line)].join('\n');
}

/** One line per failure, with the same failure in several theme/viewport cases folded together. */
function printGrouped(failures, label, variantCount) {
  const groups = new Map();
  for (const f of failures) {
    const key = [f.group, f.subject, f.check, f.detail].join('\u0000');
    if (!groups.has(key)) groups.set(key, { ...f, variants: [] });
    if (f.variant) groups.get(key).variants.push(f.variant);
  }
  for (const g of groups.values()) {
    const where =
      g.variants.length === 0
        ? ''
        : g.variants.length === variantCount && g.group === 'page'
          ? '  (every theme and viewport)'
          : `  (${g.variants.join(', ')})`;
    console.log(`  ${label}  ${g.group}  ${g.subject}${where}\n        ${g.check}: ${g.detail}`);
  }
}

function printSummary(pages, elapsedMs) {
  const variants = THEMES.flatMap((theme) => VIEWPORTS.map((v) => `${theme} ${v.name}`));
  const pageRows = pages.map((page) => {
    const own = results.filter((r) => r.subject === page.path);
    return [
      page.path,
      cell(own.filter((r) => r.group === 'http')),
      ...variants.map((variant) =>
        cell(own.filter((r) => r.group === 'page' && r.variant === variant)),
      ),
      cell(own.filter((r) => r.group === 'flow')),
    ];
  });
  console.log(
    `\nPages (${pages.length} pages x ${THEMES.length} themes x ${VIEWPORTS.length} viewports)\n`,
  );
  console.log(table(['Page', 'HTTP', ...variants, 'Flows'], pageRows));

  const bySubject = (group) => {
    const subjects = [...new Set(results.filter((r) => r.group === group).map((r) => r.subject))];
    return subjects.map((subject) => {
      const own = results.filter((r) => r.group === group && r.subject === subject);
      return [subject, `${own.filter((r) => r.ok).length}/${own.length}`, cell(own)];
    });
  };
  console.log('\nOverlays\n');
  console.log(table(['Overlay', 'Checks', 'Result'], bySubject('overlay')));
  console.log('\nSEO files\n');
  console.log(table(['File', 'Checks', 'Result'], bySubject('seo')));

  const failures = results.filter((r) => !r.ok);
  const unknown = failures.filter((f) => !knownBug(f));
  if (unknown.length) {
    console.log(`\nFailures (${unknown.length})\n`);
    printGrouped(unknown, 'FAIL', variants.length);
  }
  for (const bug of KNOWN_BUGS) {
    const hits = failures.filter((f) => knownBug(f) === bug);
    if (!hits.length) continue;
    console.log(`\nKnown bug, still failing (${hits.length}): ${bug.check}\n  ${bug.note}\n`);
    printGrouped(hits, 'BUG ', variants.length);
  }

  if (noise.length) {
    const reasons = new Map();
    for (const n of noise) reasons.set(n.reason, (reasons.get(n.reason) ?? 0) + 1);
    console.log(`\nAllowlisted console messages (${noise.length})\n`);
    for (const [reason, count] of reasons) console.log(`  ${count}x  ${reason}`);
  }

  const passed = results.length - failures.length;
  const cases = results.filter((r) => r.group === 'page');
  const caseCount = new Set(cases.map((r) => `${r.subject} ${r.variant}`)).size;
  const minutes = Math.floor(elapsedMs / 60_000);
  const seconds = Math.round((elapsedMs % 60_000) / 1000);
  console.log(
    `\n${caseCount} page cases, ${results.length} checks: ${passed} passed, ${failures.length} failed` +
      ` (${failures.length - unknown.length} of them known bugs)` +
      ` in ${minutes}m ${String(seconds).padStart(2, '0')}s against ${BASE}`,
  );
}

// --- Main --------------------------------------------------------------------------------------

async function main() {
  const started = Date.now();
  const up = await fetch(BASE).catch(() => null);
  if (!up) {
    throw new Error(
      `Nothing answers at ${BASE}. Build and serve the app first (see scripts/e2e/README.md).`,
    );
  }

  const only = args.only;
  const allPages = await discoverPages();
  const pages = only ? allPages.filter((page) => page.path.includes(only)) : allPages;
  const overlays = only ? OVERLAYS.filter((o) => o.path.includes(only)) : OVERLAYS;
  console.log(
    `Smoke testing ${BASE}: ${pages.length} pages, ${overlays.length} overlays, concurrency ${CONCURRENCY}\n`,
  );

  const { images, icons } = await checkPageStatus(
    BASE,
    pages,
    (group, subject, check, ok, detail) => record(group, subject, '', check, ok, detail),
  );

  const chrome = await launchChrome({ hardTimeoutMs: HARD_TIMEOUT_MS });
  try {
    const origin = new URL(BASE).origin;

    const jobs = [];
    const job = (group, subject, variant, label, run) => {
      const own = [];
      const check = (name, ok, detail) => {
        own.push({ name, ok, detail });
        record(group, subject, variant, name, ok, detail);
      };
      jobs.push({ label, check, own, run: () => run(check) });
    };
    for (const page of pages) {
      for (const theme of THEMES) {
        for (const viewport of VIEWPORTS) {
          const variant = `${theme} ${viewport.name}`;
          job('page', page.path, variant, `${page.path}  ${variant}`, (check) =>
            runPageCase({ chrome, base: BASE, page, theme, viewport, check, noise }),
          );
        }
      }
    }
    for (const page of pages.filter((p) => p.kind === 'setup')) {
      job('flow', page.path, 'dark 1440x900', `${page.path}  setup flow`, (check) =>
        runSetupFlow({ chrome, base: BASE, page, check, noise, origin }),
      );
    }
    for (const landing of pages.filter((p) => p.kind === 'landing')) {
      const setupPaths = allPages
        .filter((p) => p.kind === 'setup' && p.locale === landing.locale)
        .map((p) => p.path);
      job('flow', landing.path, 'dark 1440x900', `${landing.path}  header Widgets menu`, (check) =>
        runHeaderMenu({ chrome, base: BASE, path: landing.path, setupPaths, check, noise }),
      );
    }
    for (const overlay of overlays) {
      job('overlay', overlay.path, '', `${overlay.path}  overlay`, async (check) => {
        await checkOverlayStatus(overlay, check);
        await runOverlay({ chrome, base: BASE, overlay, check, noise });
      });
    }

    await runJobs(jobs);

    if (!only) {
      await checkSeoFiles(
        BASE,
        { images, icons, parseXml: (xml) => parseXmlInBrowser(chrome, xml) },
        (group, subject, check, ok, detail) => record(group, subject, '', check, ok, detail),
      );
    }
  } finally {
    await chrome.close();
  }

  printSummary(pages, Date.now() - started);
  return results.some((r) => !r.ok) ? 1 : 0;
}

/** Overlays may redirect once to add their default params, but must end on a 200. */
async function checkOverlayStatus(overlay, check) {
  const { res, hops, loop } = await fetchChain(new URL(overlay.path, BASE).href);
  await res?.body?.cancel();
  check(
    'HTTP 200 without a redirect loop',
    !loop && res?.status === 200,
    hops.map((hop) => `${hop.status} ${hop.url}`).join(' -> '),
  );
}

try {
  process.exitCode = await main();
} catch (err) {
  console.error(`\n${err instanceof Error ? err.message : err}`);
  process.exitCode = 1;
}
