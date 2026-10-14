# Você não está sozinha — vídeo motion graphics

Vídeo de 90 s (1920×1080, 30 fps, 2700 quadros) feito a partir do folder "Você não está sozinha". O arquivo final é o `folder.mp4`.

## Renderizar de novo

```bash
npm install                 # three 0.160.0, @fontsource, playwright 1.56.1
node render.mjs             # renderiza frames/00000.png … 02699.png e gera folder.mp4
node verify.mjs             # roda as verificações e gera contact-sheet.png
```

Opções do `render.mjs`: `--workers 3` (páginas em paralelo), `--resume` (pula PNGs já existentes), `--frames 0,375,1350 --out preview` (só alguns quadros). O Chromium roda em modo headless com `--use-angle=swiftshader`. A montagem usa `ffmpeg -framerate 30 -i frames/%05d.png -c:v libx264 -pix_fmt yuv420p -crf 18 folder.mp4`.

## Como funciona

- `index.html` carrega as fontes do `@fontsource` (Bricolage Grotesque 800 e Source Sans 3 600) e o `scene.js`.
- `scene.js` expõe `window.renderFrame(t)`. A função calcula toda a cena a partir de `t` e chama `renderer.render` uma vez. Não guarda estado entre quadros e não usa relógio nem aleatoriedade. A variação entre elementos vem de fórmulas do índice (ângulo áureo, `sin(i*1.7)` etc.).
- Cada letra é um plano 3D com textura gerada uma única vez em canvas 2D.
- O morphing usa 4096 pontos na mesma ordem em todas as formas: esfera → cubo → escudo → casa → anel de ícones → esfera.
- A câmera segue keyframes em Catmull-Rom, percorridos com `easeInOutCubic`, mais uma órbita lenta de `0.15·sin(0.2t)`.
- `verify.mjs` faz cinco verificações:
  1. procura termos proibidos no código;
  2. compara o SHA-256 de t = 0, 12.5, 45 e 89 renderizados duas vezes;
  3. confere que cada frase fica parada pelo menos 1 s a cada 3 palavras;
  4. gera a folha de contatos;
  5. roda o `ffprobe` no MP4.
