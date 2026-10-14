// Renderiza o vídeo quadro a quadro com Chromium headless (SwiftShader) e monta o MP4 com ffmpeg.
//
//   node render.mjs                      → todos os 2700 quadros + folder.mp4
//   node render.mjs --frames 0,375,1350  → só esses quadros (em frames/)
//   node render.mjs --workers 3 --resume → paraleliza e pula PNGs já existentes
//
// Cada quadro n é renderizado com t = n / 30 por window.renderFrame(t), sem estado entre quadros,
// então dividir os quadros entre várias páginas não altera o resultado.

import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = path.dirname(fileURLToPath(import.meta.url));
export const FPS = 30;
export const TOTAL = 2700;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.css': 'text/css', '.json': 'application/json',
};

export function serve() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const file = path.join(ROOT, url === '/' ? 'index.html' : url);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404); res.end(); return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

export async function launch() {
  return chromium.launch({
    args: ['--use-angle=swiftshader', '--use-gl=angle', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  });
}

export async function openPage(browser, port) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('pageerror:', e.message));
  await page.goto(`http://127.0.0.1:${port}/index.html`);
  await page.waitForFunction(() => window.__ready === true || window.__error, null, { timeout: 120000 });
  const err = await page.evaluate(() => window.__error);
  if (err) throw new Error(err);
  return page;
}

// Renderiza t e devolve o PNG do canvas (bytes)
export async function renderPng(page, t) {
  await page.evaluate((tt) => window.renderFrame(tt), t);
  const url = await page.evaluate(() => document.getElementById('c').toDataURL('image/png'));
  return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
}

const framePath = (dir, n) => path.join(dir, `${String(n).padStart(5, '0')}.png`);

async function main() {
  const argv = process.argv.slice(2);
  const opt = (name, def) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : def; };
  const workers = Number(opt('--workers', 3));
  const outDir = path.join(ROOT, opt('--out', 'frames'));
  const resume = argv.includes('--resume');
  const list = opt('--frames', null);
  const frames = list ? list.split(',').map(Number) : Array.from({ length: TOTAL }, (_, n) => n);
  fs.mkdirSync(outDir, { recursive: true });

  const server = await serve();
  const port = server.address().port;
  const browser = await launch();
  let done = 0;
  const todo = frames.filter((n) => !(resume && fs.existsSync(framePath(outDir, n))));
  await Promise.all(Array.from({ length: Math.min(workers, todo.length) }, async (_, w) => {
    const page = await openPage(browser, port);
    for (let j = w; j < todo.length; j += workers) {
      const n = todo[j];
      fs.writeFileSync(framePath(outDir, n), await renderPng(page, n / FPS));
      done++;
      if (done % 50 === 0 || done === todo.length) console.log(`quadros: ${done}/${todo.length}`);
    }
    await page.close();
  }));
  await browser.close();
  server.close();

  if (!list) {
    const r = spawnSync('ffmpeg', ['-y', '-framerate', String(FPS), '-i', path.join(outDir, '%05d.png'),
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', path.join(ROOT, 'folder.mp4')], { stdio: 'inherit' });
    if (r.status !== 0) process.exit(r.status ?? 1);
    console.log('pronto: folder.mp4');
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
