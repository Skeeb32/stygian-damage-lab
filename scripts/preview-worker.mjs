import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const source = await readFile(resolve(root, 'dist/server/index.js'), 'utf8');
const worker = (await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)).default;
const port = Number(process.env.PORT || 8766);

createServer(async (incoming, outgoing) => {
  try {
    const request = new Request(new URL(incoming.url || '/', `http://127.0.0.1:${port}`), { method: incoming.method || 'GET', headers: incoming.headers });
    const response = await worker.fetch(request, {}, {});
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch {
    outgoing.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    outgoing.end('Local Worker preview failed. Rebuild the Worker artifact and retry.');
  }
}).listen(port, '127.0.0.1', () => {
  process.stdout.write(`Stygian Worker preview: http://127.0.0.1:${port}\n`);
});
