/** Checks that need plain HTTP only: status codes, redirects and the SEO files. */

const MAX_REDIRECTS = 10;

/** Fetches `url` following redirects by hand, so loops and chains are visible. */
export async function fetchChain(url, init = {}) {
  const hops = [];
  let current = url;
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    const res = await fetch(current, { ...init, redirect: 'manual' });
    hops.push({ url: current, status: res.status });
    const location = res.headers.get('location');
    if (res.status < 300 || res.status >= 400 || !location) {
      return { res, hops, loop: false };
    }
    await res.body?.cancel();
    const next = new URL(location, current).href;
    if (hops.some((hop) => hop.url === next)) return { res: null, hops, loop: true };
    current = next;
  }
  return { res: null, hops, loop: true };
}

const describeChain = (hops) => hops.map((hop) => `${hop.status} ${hop.url}`).join(' -> ');

/** Reads width and height from a PNG's IHDR chunk. */
export function pngSize(bytes) {
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (bytes.length < 24 || signature.some((byte, i) => bytes[i] !== byte)) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (String.fromCharCode(...bytes.subarray(12, 16)) !== 'IHDR') return null;
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

const toBase = (base, absolute) => new URL(new URL(absolute).pathname, base).href;

const metaContents = (html, pattern) =>
  [...html.matchAll(pattern)].map((match) => match[1].replaceAll('&amp;', '&'));

/**
 * Status and redirects for every page. Sitemap pages must answer 200 without redirecting;
 * returns the image URLs their meta tags point at, for the OG image checks.
 */
export async function checkPageStatus(base, pages, record) {
  const images = new Set();
  const icons = new Set();
  await Promise.all(
    pages.map(async (page) => {
      const url = new URL(page.path, base).href;
      const check = (ok, detail) => record('http', page.path, 'HTTP status', ok, detail);
      try {
        const { res, hops, loop } = await fetchChain(url);
        if (loop) return check(false, `redirect loop: ${describeChain(hops)}`);
        if (hops.length > 1) return check(false, `redirects: ${describeChain(hops)}`);
        if (res.status !== page.status)
          return check(false, `got ${res.status}, want ${page.status}`);
        const html = await res.text();
        for (const src of metaContents(
          html,
          /<meta (?:property="og:image"|name="twitter:image") content="([^"]+)"/g,
        )) {
          images.add(toBase(base, src));
        }
        for (const href of metaContents(
          html,
          /<link rel="(?:icon|apple-touch-icon)"[^>]* href="([^"]+)"/g,
        )) {
          icons.add(new URL(href, base).href);
        }
        check(true, String(res.status));
      } catch (err) {
        check(false, err.message);
      }
    }),
  );
  return { images: [...images], icons: [...icons] };
}

async function expectFile(record, name, url, { type, status = 200 } = {}) {
  try {
    const { res, hops, loop } = await fetchChain(url);
    if (loop) return record('seo', name, 'served', false, `redirect loop: ${describeChain(hops)}`);
    if (res.status !== status) {
      return record('seo', name, 'served', false, `got ${res.status}, want ${status}`);
    }
    const contentType = res.headers.get('content-type') ?? '';
    const types = [type ?? []].flat();
    if (types.length && !types.some((t) => contentType.startsWith(t))) {
      return record('seo', name, 'content type', false, `got "${contentType}", want ${types}`);
    }
    record('seo', name, 'served', true, `${res.status} ${contentType}`);
    return res;
  } catch (err) {
    record('seo', name, 'served', false, err.message);
    return null;
  }
}

/**
 * robots.txt, sitemap.xml, llms.txt, OG images and app icons. `parseXml(text)` returns an
 * error message or null; the browser's DOMParser does the actual validation.
 */
export async function checkSeoFiles(base, { images, icons, parseXml }, record) {
  const robots = await expectFile(record, '/robots.txt', new URL('/robots.txt', base), {
    type: 'text/plain',
  });
  if (robots) {
    const text = await robots.text();
    record(
      'seo',
      '/robots.txt',
      'names a user agent and the sitemap',
      /^User-agent: \*$/m.test(text) && /^Sitemap: https?:\/\/\S+\/sitemap\.xml$/m.test(text),
      'needs "User-agent: *" and a "Sitemap: .../sitemap.xml" line',
    );
  }

  const sitemap = await expectFile(record, '/sitemap.xml', new URL('/sitemap.xml', base), {
    type: ['application/xml', 'text/xml'],
  });
  if (sitemap) {
    const xml = await sitemap.text();
    const error = await parseXml(xml);
    record('seo', '/sitemap.xml', 'valid XML urlset', !error, error ?? '');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
    const broken = [];
    await Promise.all(
      locs.map(async (loc) => {
        const { res, hops, loop } = await fetchChain(toBase(base, loc));
        if (loop || hops.length > 1 || res.status !== 200) {
          broken.push(`${loc}: ${loop ? 'redirect loop' : describeChain(hops)}`);
        }
        await res?.body?.cancel();
      }),
    );
    record(
      'seo',
      '/sitemap.xml',
      `every <loc> answers 200 (${locs.length})`,
      locs.length > 0 && broken.length === 0,
      locs.length === 0 ? 'no <loc> entries' : broken.join('; '),
    );
  }

  for (const file of ['/llms.txt', '/llms-full.txt']) {
    const res = await expectFile(record, file, new URL(file, base), { type: 'text/plain' });
    if (res) {
      const text = await res.text();
      record('seo', file, 'has content', text.trim().length > 200, `${text.length} bytes`);
    }
  }

  record('seo', 'OG images', 'pages point at OG images', images.length > 0, 'none found');
  for (const url of images) {
    const name = new URL(url).pathname;
    const res = await expectFile(record, name, url, { type: 'image/png' });
    if (!res) continue;
    const size = pngSize(new Uint8Array(await res.arrayBuffer()));
    record(
      'seo',
      name,
      'is a 1200x630 PNG',
      size?.width === 1200 && size?.height === 630,
      size ? `${size.width}x${size.height}` : 'not a PNG',
    );
  }

  const manifestRes = await expectFile(record, '/manifest.json', new URL('/manifest.json', base), {
    type: 'application/json',
  });
  const manifestIcons = [];
  if (manifestRes) {
    try {
      const manifest = await manifestRes.json();
      manifestIcons.push(...(manifest.icons ?? []));
      record('seo', '/manifest.json', 'lists icons', manifestIcons.length > 0, 'no icons');
    } catch (err) {
      record('seo', '/manifest.json', 'parses as JSON', false, err.message);
    }
  }
  for (const icon of manifestIcons) {
    const url = new URL(icon.src, base).href;
    const res = await expectFile(record, icon.src, url, { type: icon.type });
    if (!res) continue;
    const [width, height] = (icon.sizes ?? '').split('x').map(Number);
    if (icon.type === 'image/png' && width) {
      const size = pngSize(new Uint8Array(await res.arrayBuffer()));
      record(
        'seo',
        icon.src,
        `is ${icon.sizes}`,
        size?.width === width && size?.height === height,
        size ? `${size.width}x${size.height}` : 'not a PNG',
      );
    } else {
      await res.body?.cancel();
    }
  }
  for (const url of icons) {
    const res = await expectFile(record, new URL(url).pathname, url);
    await res?.body?.cancel();
  }
}
