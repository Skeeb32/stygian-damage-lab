import { assets } from './assets.mjs';

const USER_AGENT = 'StygianDamageLab/1.0 (https://github.com/Skeeb32/stygian-damage-lab)';
const MAX_UPSTREAM_BYTES = 2 * 1024 * 1024;
const defaultTtl = 30;

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra },
  });
}

function contentType(path) {
  if (path.endsWith('.html')) return 'text/html; charset=utf-8';
  if (path.endsWith('.css')) return 'text/css; charset=utf-8';
  if (path.endsWith('.mjs') || path.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (path.endsWith('.json')) return 'application/json; charset=utf-8';
  if (path.endsWith('.svg')) return 'image/svg+xml';
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.webp')) return 'image/webp';
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
  return 'application/octet-stream';
}

async function enka(request, ctx) {
  const url = new URL(request.url);
  const uid = url.searchParams.get('uid') || '';
  if (!/^\d{9}$/.test(uid)) return json({ error: 'Enter a valid 9-digit Genshin UID.' }, 400);

  const cache = globalThis.caches?.default;
  const cacheKey = new Request(`${url.origin}/__enka-cache/${uid}`);
  const cached = await cache?.match(cacheKey);
  if (cached) return cached;

  let upstream;
  try {
    upstream = await fetch(`https://enka.network/api/uid/${uid}/`, {
      headers: { accept: 'application/json', 'user-agent': USER_AGENT },
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    return json({ error: 'Enka could not be reached. Try again later.' }, 503);
  }

  const statusMessages = {
    400: 'Enka rejected the UID format. Check that it has 9 digits.',
    404: 'No Genshin account was found for that UID.',
    424: 'Enka reports game maintenance or an upstream game-data issue.',
    429: 'Enka rate-limited this lookup. Wait before trying again.',
    500: 'Enka is temporarily unavailable. Try again later.',
    503: 'Enka is temporarily unavailable. Try again later.',
  };
  if (!upstream.ok) return json({ error: statusMessages[upstream.status] || `Enka returned HTTP ${upstream.status}.` }, upstream.status === 429 ? 429 : 502);

  const declaredSize = Number(upstream.headers.get('content-length') || 0);
  if (declaredSize > MAX_UPSTREAM_BYTES) return json({ error: 'The Enka response exceeded the safe import limit.' }, 502);
  const text = await upstream.text();
  if (new TextEncoder().encode(text).byteLength > MAX_UPSTREAM_BYTES) return json({ error: 'The Enka response exceeded the safe import limit.' }, 502);

  let data;
  try { data = JSON.parse(text); } catch { return json({ error: 'Enka returned data this importer could not read.' }, 502); }
  if (!data || typeof data !== 'object' || !data.playerInfo || typeof data.playerInfo !== 'object') {
    return json({ error: 'Enka returned an incomplete player profile.' }, 502);
  }

  const ttl = Math.max(1, Math.min(3600, Number.isFinite(Number(data.ttl)) ? Number(data.ttl) : defaultTtl));
  const result = json({ uid, fetchedAt: new Date().toISOString(), ttl, playerInfo: data.playerInfo, avatarInfoList: Array.isArray(data.avatarInfoList) ? data.avatarInfoList : null });
  if (cache && ttl > 0) {
    const response = new Response(await result.clone().text(), {
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': `public, max-age=${ttl}` },
    });
    ctx?.waitUntil?.(cache.put(cacheKey, response));
  }
  return result;
}

export default {
  async fetch(request, env, ctx) {
    void env;
    const url = new URL(request.url);
    if (url.pathname === '/api/enka') {
      if (request.method !== 'GET') return json({ error: 'Use GET for UID lookups.' }, 405, { allow: 'GET' });
      return enka(request, ctx);
    }

    const path = decodeURIComponent(url.pathname || '/');
    const normalized = path === '/' ? '/index.html' : path;
    if (normalized.includes('..') || normalized.includes('\\')) return new Response('Not found', { status: 404 });
    const asset = assets[normalized];
    if (!asset) return new Response('Not found', { status: 404 });
    return new Response(Uint8Array.from(atob(asset.body), ch => ch.charCodeAt(0)), {
      headers: {
        'content-type': asset.type || contentType(normalized),
        'cache-control': normalized === '/index.html' ? 'no-cache' : 'public, max-age=3600',
        'x-content-type-options': 'nosniff',
      },
    });
  },
};
