// Static server for the production build, shared by the audit and the résumé PDF scripts.
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname } from 'node:path';
import { gzipSync } from 'node:zlib';
import { staticCandidates } from './audit/lib.mjs';

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2',
  '.xml': 'application/xml', '.txt': 'text/plain', '.ico': 'image/x-icon',
};
const COMPRESSIBLE = /^(text\/|application\/(json|xml)|image\/svg)/;

async function findFile(root, urlPath) {
  const candidates = staticCandidates(root, urlPath);
  for (const file of candidates ?? []) {
    if ((await stat(file).catch(() => null))?.isFile()) return file;
  }
  return null;
}

/** Static server that gzips text, like the host will; without it Lighthouse would blame the server. */
export function serveStatic(root) {
  const server = createServer(async (req, res) => {
    const file = await findFile(root, req.url ?? '/');
    const found = file ?? `${root}/404.html`;
    let body = await readFile(found).catch(() => Buffer.from('Not found'));
    const type = MIME[extname(found)] ?? 'application/octet-stream';
    const headers = { 'Content-Type': type, 'Cache-Control': 'public, max-age=31536000, immutable' };
    if (COMPRESSIBLE.test(type) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '')) {
      body = gzipSync(body);
      headers['Content-Encoding'] = 'gzip';
    }
    res.writeHead(file ? 200 : 404, headers).end(body);
  });
  return new Promise((done) => server.listen(0, '127.0.0.1', () => done({ server, base: `http://127.0.0.1:${server.address().port}` })));
}
