import { readdir, readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import { resolve, relative, extname, posix } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const dist = resolve(root, 'dist');
const server = resolve(dist, 'server');
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
};

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === 'server' || entry.name === '.openai') continue;
    const filename = resolve(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Refusing to package symbolic link: ${filename}`);
    if (entry.isDirectory()) files.push(...await walk(filename));
    else if ((await stat(filename)).isFile()) files.push(filename);
  }
  return files;
}

const files = await walk(dist);
const entries = {};
for (const filename of files) {
  const key = `/${posix.normalize(relative(dist, filename).split(requireSep()).join('/'))}`;
  entries[key] = { type: mime[extname(filename).toLowerCase()] || 'application/octet-stream', body: (await readFile(filename)).toString('base64') };
}

const workerSource = (await readFile(resolve(root, 'worker/index.js'), 'utf8')).replace(/^import \{ assets \} from '\.\/assets\.mjs';\s*/m, '');
if (workerSource === undefined || !workerSource.includes('export default')) throw new Error('Worker entrypoint is missing.');
await mkdir(server, { recursive: true });
await writeFile(resolve(server, 'index.js'), `const assets = JSON.parse(${JSON.stringify(JSON.stringify(entries))});\n${workerSource}`);
await mkdir(resolve(dist, '.openai'), { recursive: true });
await writeFile(resolve(dist, '.openai/hosting.json'), await readFile(resolve(root, '.openai/hosting.json')));
console.log(`Built Worker with ${files.length} static assets (${(Buffer.byteLength(JSON.stringify(entries)) / 1024 / 1024).toFixed(2)} MiB encoded).`);

function requireSep() { return process.platform === 'win32' ? '\\' : '/'; }
