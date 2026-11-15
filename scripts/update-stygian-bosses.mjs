import { readFile, writeFile } from 'node:fs/promises';
import { readLiveStygianRoster } from '../dist/stygian-roster.mjs';

const path = new URL('../dist/stygian-bosses.json', import.meta.url);
const modulePath = new URL('../dist/stygian-bosses.mjs', import.meta.url);
const current = JSON.parse(await readFile(path, 'utf8'));
const live = await readLiveStygianRoster();

function phaseKey(name) {
  const value = String(name).toLowerCase();
  if (/regular|opening/.test(value)) return 'regular';
  if (/dull carapace/.test(value)) return 'dull-carapace';
  if (/shield|valiant/.test(value)) return 'shielded';
  return value;
}

function mergeBoss(remote) {
  const previous = current.bosses.find((boss) => boss.id === remote.id);
  const sourcePhases = remote.phases?.length ? remote.phases : [];
  const previousPhases = previous?.phases ?? [];
  const phases = [];
  const phaseNames = new Set();
  for (const phase of [...sourcePhases, ...previousPhases]) {
    const key = phaseKey(phase.name);
    if (phaseNames.has(key)) continue;
    phaseNames.add(key);
    phases.push(phase);
  }
  return {
    id: remote.id,
    name: remote.name,
    hp: remote.hp,
    phases: phases.length ? phases : [{ name: 'Resistance not published', res: null, resByElement: {}, description: 'No resistance table was detected on the source page.' }],
    note: previous?.note ?? 'Roster entry detected from Stygian.moe. Verify encounter notes before relying on this boss in a damage estimate.',
    mechanics: remote.mechanics?.length ? remote.mechanics : (previous?.mechanics ?? []),
    image: remote.image,
    source: remote.source,
    traits: previous?.traits ?? [],
    ...(previous?.guide ? { guide: previous.guide } : {}),
  };
}

const next = {
  ...current,
  version: live.version,
  start: live.start,
  end: live.end,
  source: live.source,
  status: 'Roster, HP, artwork, resistance tables, and mechanical guide text refreshed from Stygian.moe; encounter guide recommendations remain curated.',
  sourceType: 'Automatically refreshed from Stygian.moe HTML. The source documents no public boss API. Current roster, level 105/110 HP, artwork, published resistance tables, and mechanical-guide bullets are synced; traits and team recommendations remain curated when available.',
  bosses: live.bosses.map(mergeBoss),
};

const comparable = (value) => JSON.stringify(value, (key, entry) => key === 'verified' ? undefined : entry);
let snapshot = current;
if (comparable(current) === comparable(next)) {
  console.log(`Stygian ${live.version} roster is already current (${live.bosses.length} bosses).`);
} else {
  next.verified = live.checkedAt;
  snapshot = next;
  await writeFile(path, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`Updated Stygian ${live.version}: ${live.bosses.map((boss) => boss.name).join(', ')}`);
}
await writeFile(modulePath, `export default ${JSON.stringify(snapshot, null, 2)};\n`);
