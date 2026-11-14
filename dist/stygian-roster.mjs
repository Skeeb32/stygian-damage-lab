const ELEMENTS = ['Anemo', 'Cryo', 'Dendro', 'Electro', 'Geo', 'Hydro', 'Pyro'];
const ELEMENT_KEYS = Object.fromEntries(ELEMENTS.map((name) => [name.toLowerCase(), name]));
const ROUTE_IDS = {
  shark: 'stormfang',
  'emperor-of-fire-and-iron': 'emperor',
  'radiant-moongecko': 'moongecko',
};

export function decodeEntities(value) {
  return String(value ?? '')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}

export function stripHtml(value) {
  return decodeEntities(String(value ?? '').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function parseHp(section, level) {
  const marker = new RegExp(`LVL\\s*${level}`, 'i');
  const start = section.search(marker);
  if (start < 0) return null;
  const value = section.slice(start, start + 700).match(/>\s*([\d.]+)\s*<\/div>/);
  if (!value) return null;
  const parsed = Number(value[1].replace(/\./g, '').replace(/,/g, ''));
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

export function parseStygianHomepage(html) {
  const heading = html.indexOf('>Stygian Onslaught</h1>');
  if (heading < 0) throw new Error('Stygian homepage did not contain the current season heading.');
  const header = html.slice(heading, heading + 2600);
  const version = header.match(/<div[^>]*>\s*(\d+\.\d+)\s*<\/div>/)?.[1];
  const dateRange = stripHtml(header).match(/(\d{4})\/(\d{2})\/(\d{2})\s*-\s*(\d{4})\/(\d{2})\/(\d{2})/);
  if (!version || !dateRange) throw new Error('Could not read the active Stygian version and season dates.');
  const start = `${dateRange[1]}-${dateRange[2]}-${dateRange[3]}`;
  const end = `${dateRange[4]}-${dateRange[5]}-${dateRange[6]}`;
  const matches = [...html.matchAll(/href="\/boss\/([a-z0-9-]+)"/gi)];
  const bosses = [];
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const from = match.index;
    const to = matches[i + 1]?.index ?? html.length;
    const segment = html.slice(from, to);
    const route = match[1];
    const name = stripHtml(segment.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i)?.[1] ?? '');
    const image = decodeEntities(segment.match(/<img[^>]+alt="[^"]*"[^>]+src="([^"]+)"/i)?.[1] ?? '');
    const hp105 = parseHp(segment, 105);
    const hp110 = parseHp(segment, 110);
    if (!name || !image || !hp105 || !hp110) continue;
    bosses.push({
      id: ROUTE_IDS[route] ?? route,
      route,
      name,
      image,
      hp: { '105': hp105, '110': hp110 },
      source: `https://www.stygian.moe/boss/${route}`,
    });
  }
  if (!bosses.length || bosses.length > 10) throw new Error('Could not read a valid Stygian boss roster.');
  return { version, start, end, bosses };
}

function parseResistances(html) {
  const phases = [];
  const pattern = /<div[^>]*>\s*([^<>]{2,60})\s*<\/div>\s*<ul[^>]*>([\s\S]*?)<\/ul>/gi;
  for (const match of html.matchAll(pattern)) {
    const label = stripHtml(match[1]);
    if (!/(?:RES|resistance|carapace|shield)/i.test(label)) continue;
    const map = {};
    for (const row of match[2].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)) {
      const element = row[1].match(/<img[^>]+alt="(physical|anemo|cryo|dendro|electro|geo|hydro|pyro)"/i)?.[1]?.toLowerCase();
      const value = row[1].match(/>(-?\d+(?:\.\d+)?)%\s*<\/span>/i)?.[1];
      if (element && value && ELEMENT_KEYS[element]) map[ELEMENT_KEYS[element]] = Number(value);
    }
    if (!Object.keys(map).length) continue;
    const values = new Set(Object.values(map));
    const isRegular = /^Regular RES$/i.test(label);
    phases.push({ name: isRegular ? 'Regular' : label, res: values.size === 1 ? [...values][0] : null, resByElement: map, description: label });
  }
  return phases;
}

function parseListAfterHeading(html, heading) {
  const index = html.indexOf(heading);
  if (index < 0) return [];
  const rest = html.slice(index + heading.length, index + heading.length + 30000);
  const list = rest.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i)?.[1];
  if (!list) return [];
  return [...list.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => stripHtml(m[1])).filter(Boolean);
}

export function parseStygianBossPage(html) {
  const phases = parseResistances(html);
  const mechanics = parseListAfterHeading(html, 'Mechanical Guide</h2>');
  return { phases, mechanics };
}

export async function readLiveStygianRoster(fetchImpl = fetch) {
  const headers = { accept: 'text/html,application/xhtml+xml', 'user-agent': 'StygianDamageLab/1.0 (https://github.com/Skeeb32/stygian-damage-lab)' };
  const homeResponse = await fetchImpl('https://www.stygian.moe/', { headers, signal: AbortSignal.timeout(12000) });
  if (!homeResponse.ok) throw new Error(`Stygian.moe returned HTTP ${homeResponse.status}.`);
  const homeHtml = await homeResponse.text();
  if (new TextEncoder().encode(homeHtml).byteLength > 2_000_000) throw new Error('Stygian.moe homepage exceeded the response limit.');
  const roster = parseStygianHomepage(homeHtml);
  const detailed = await Promise.all(roster.bosses.map(async (boss) => {
    try {
      const response = await fetchImpl(boss.source, { headers, signal: AbortSignal.timeout(12000) });
      if (!response.ok) return boss;
      const html = await response.text();
      if (new TextEncoder().encode(html).byteLength > 2_000_000) return boss;
      return { ...boss, ...parseStygianBossPage(html) };
    } catch { return boss; }
  }));
  return { ...roster, bosses: detailed, checkedAt: new Date().toISOString().slice(0, 10), source: 'https://www.stygian.moe/' };
}
