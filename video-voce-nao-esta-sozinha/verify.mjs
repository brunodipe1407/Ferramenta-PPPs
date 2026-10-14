// Verificações antes da entrega:
//  1. termos proibidos no código-fonte
//  2. determinismo: mesmo t → PNG idêntico (SHA-256), em páginas diferentes
//  3. tempo de leitura: cada frase parada ≥ 1 s por 3 palavras
//  4. folha de contatos (um quadro do meio de cada cena) → contact-sheet.png
//  5. ffprobe do folder.mp4: 2700 quadros, 90 s

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { ROOT, serve, launch, openPage, renderPng } from './render.mjs';

let ok = true;
const fail = (msg) => { ok = false; console.log('  FALHA:', msg); };

// 1 ─ termos proibidos
console.log('1. Termos proibidos');
const FORBIDDEN = ['Date', 'performance.now', 'requestAnimationFrame', 'setTimeout', 'setInterval', 'Clock', 'Math.random'];
for (const f of ['scene.js', 'index.html', 'render.mjs']) {
  const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
  for (const term of FORBIDDEN) {
    const n = src.split(term).length - 1;
    if (n) fail(`${f}: "${term}" aparece ${n}x`);
  }
}
console.log('  ok se nenhuma falha acima');

const server = await serve();
const browser = await launch();
const port = server.address().port;
const pageA = await openPage(browser, port);
const pageB = await openPage(browser, port);

// 2 ─ determinismo
console.log('2. Determinismo (SHA-256)');
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
for (const t of [0, 12.5, 45, 89]) {
  const a = sha(await renderPng(pageA, t));
  await renderPng(pageA, 60);                 // outro quadro no meio, para provar que não há estado
  const a2 = sha(await renderPng(pageA, t));
  const b = sha(await renderPng(pageB, t));   // página nova, ordem diferente
  const same = a === a2 && a === b;
  console.log(`  t=${t}: ${a.slice(0, 16)}… ${same ? 'iguais' : 'DIFERENTES'}`);
  if (!same) fail(`hash diferente em t=${t}`);
}

// 3 ─ tempo de leitura
console.log('3. Tempo de leitura (parada ≥ palavras/3 s)');
const report = await pageA.evaluate(() => window.textReport());
for (const r of report) {
  const hold = r.holdEnd - r.holdStart;
  const line = `${hold.toFixed(2)} s ≥ ${r.need.toFixed(2)} s  ${r.text.replace(/\n/g, ' / ')}`;
  if (hold + 1e-6 < r.need) fail(line); else console.log('  ok', line);
}

// 4 ─ folha de contatos
console.log('4. Folha de contatos');
const MIDS = [4, 15.5, 25.5, 30.5, 47, 61, 75.5, 84, 88.5];
const tmp = path.join(ROOT, 'preview');
fs.mkdirSync(tmp, { recursive: true });
for (const [k, t] of MIDS.entries()) fs.writeFileSync(path.join(tmp, `mid${k}.png`), await renderPng(pageA, t));
await browser.close();
server.close();
const ff = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...MIDS.flatMap((_, k) => ['-i', path.join(tmp, `mid${k}.png`)]),
  '-filter_complex', MIDS.map((_, k) => `[${k}]scale=960:540[s${k}]`).join(';') + ';' +
  MIDS.map((_, k) => `[s${k}]`).join('') + `xstack=inputs=9:layout=0_0|w0_0|w0+w1_0|0_h0|w0_h0|w0+w1_h0|0_h0+h3|w0_h0+h3|w0+w1_h0+h3`,
  path.join(ROOT, 'contact-sheet.png')], { stdio: 'inherit' });
if (ff.status !== 0) fail('ffmpeg da folha de contatos');
else console.log('  contact-sheet.png (t = ' + MIDS.join(', ') + ')');

// 5 ─ ffprobe
console.log('5. ffprobe folder.mp4');
const mp4 = path.join(ROOT, 'folder.mp4');
if (!fs.existsSync(mp4)) fail('folder.mp4 não existe (rode node render.mjs)');
else {
  const p = spawnSync('ffprobe', ['-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries',
    'stream=nb_read_frames,width,height,r_frame_rate:format=duration', '-of', 'json', mp4], { encoding: 'utf8' });
  const j = JSON.parse(p.stdout);
  const s = j.streams[0];
  const dur = Number(j.format.duration);
  console.log(`  ${s.width}x${s.height} @ ${s.r_frame_rate}, ${s.nb_read_frames} quadros, ${dur} s`);
  if (Number(s.nb_read_frames) !== 2700) fail('número de quadros ≠ 2700');
  if (Math.abs(dur - 90) > 0.01) fail('duração ≠ 90 s');
}

console.log(ok ? '\nTUDO OK' : '\nHÁ FALHAS');
process.exit(ok ? 0 : 1);
