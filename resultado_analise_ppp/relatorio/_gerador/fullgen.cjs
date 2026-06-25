const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { PDFDocument, StandardFonts, rgb } = require('/tmp/pdftools/node_modules/pdf-lib');
const fs = require('fs');
const BASE='http://127.0.0.1:8099';
const OUT='/home/user/Ferramenta-PPPs/resultado_analise_ppp/relatorio/Relatorio_PPP_CAFF_ferramenta_design.pdf';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

const COVER = `<!doctype html><html lang="pt-br"><head><meta charset="utf-8"><style>
@page{size:A4;margin:0}*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Arial,sans-serif;color:#0b2a4a;width:210mm;height:297mm;display:flex;flex-direction:column}
.top{height:10mm;background:linear-gradient(90deg,#0b2a4a,#16794a)}
.body{flex:1;padding:30mm 24mm 0}
.kick{font-size:11pt;letter-spacing:3px;color:#16794a;font-weight:700;text-transform:uppercase}
.org{font-size:10pt;color:#56627a;margin-top:3mm}
h1{font-size:29pt;line-height:1.15;margin:16mm 0 5mm}
.proj{font-size:13.5pt;color:#1f6feb;font-weight:600;margin-bottom:4mm}
.tag{display:inline-block;background:#eef6f1;color:#16794a;border:1px solid #cfe6da;border-radius:6px;padding:4px 12px;font-size:10pt;font-weight:700}
.kpibar{display:flex;gap:6mm;margin-top:18mm}
.kc{flex:1;border:1px solid #e3e8f0;border-radius:10px;padding:10px 12px;background:#f7f9fc}
.kc .v{font-size:15pt;font-weight:800;color:#0b2a4a}.kc .v.g{color:#16794a}
.kc .l{font-size:7.5pt;text-transform:uppercase;letter-spacing:.5px;color:#56627a;font-weight:600}
.meta{margin-top:auto;border-top:2px solid #e3e8f0;padding:7mm 0}
.row{display:flex;margin:2.5mm 0;font-size:10.5pt}.lab{width:52mm;color:#56627a;font-weight:600}.val{flex:1}
.foot{height:16mm;background:#0b2a4a;color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 24mm;font-size:8.5pt}
.sumario{margin-top:8mm;border:1px solid #e3e8f0;border-radius:10px;overflow:hidden}
.sumario .h{background:#0b2a4a;color:#fff;font-size:9pt;font-weight:700;letter-spacing:.5px;padding:6px 12px;text-transform:uppercase}
.sumario .it{display:flex;justify-content:space-between;padding:5px 12px;font-size:9.5pt;border-bottom:1px solid #eef2f8}
</style></head><body>
<div class="top"></div>
<div class="body">
  <div class="kick">Ferramentas de Análise PPP — CAGE / SEFAZ-RS</div>
  <div class="org">Estado do Rio Grande do Sul · Contadoria e Auditoria-Geral do Estado · GT-PPPs</div>
  <h1>Relatório de Análise PPP</h1>
  <div class="proj">Concessão Administrativa do Centro Administrativo Fernando Ferrari (CAFF)</div>
  <div class="tag">Documento técnico de apoio à decisão · ótica do ente público</div>
  <div class="sumario">
    <div class="h">Sumário — anexos do relatório</div>
    <div class="it"><span>Anexo A · Módulo 01 — PSC / Custo Público</span><span>Custo público atual</span></div>
    <div class="it"><span>Anexo B · Módulo 02 — Matriz de Riscos</span><span>Alocação de riscos</span></div>
    <div class="it"><span>Anexo C · Módulo 03 — Precificação de Obras</span><span>Análise crítica</span></div>
    <div class="it"><span>Anexo D · Módulo 04 — Checklist de Custos</span><span>Custos do Estado</span></div>
    <div class="it"><span>Anexo E · Módulo 05 — Evidência Comparativa (VfM)</span><span>Value for Money</span></div>
  </div>
  <div class="meta">
    <div class="row"><div class="lab">Poder concedente</div><div class="val">Estado do Rio Grande do Sul — SERG / SPGG</div></div>
    <div class="row"><div class="lab">Modalidade</div><div class="val">Concessão Administrativa (Lei nº 11.079/2004) · 30 anos</div></div>
    <div class="row"><div class="lab">Estruturação</div><div class="val">BNDES (OCS 330/2024) · Consórcio RECAFF</div></div>
    <div class="row"><div class="lab">Data de emissão</div><div class="val">23 de junho de 2026</div></div>
  </div>
</div>
<div class="foot"><span>CAGE — Contadoria e Auditoria-Geral do Estado · SEFAZ-RS</span><span>Relatório gerado pela ferramenta · visual reformatado</span></div>
</body></html>`;

(async () => {
  const all = JSON.parse(fs.readFileSync('resultado_analise_ppp/17_preenchimento_final.json','utf8')).localStorage;
  const css = fs.readFileSync('/tmp/restyle/override.css','utf8') + '\n.__val{font:inherit;color:#1b2638;white-space:pre-wrap}';
  const cleanup = fs.readFileSync('/tmp/restyle/cleanup.js','utf8');
  const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
  const ctx = await b.newContext({ bypassCSP:true });
  ctx.addInitScript(d=>{for(const k in d){try{localStorage.setItem(k,JSON.stringify(d[k]))}catch(e){}}}, all);

  // CAPA
  const cp = await ctx.newPage();
  await cp.setContent(COVER,{waitUntil:'networkidle'});
  await cp.emulateMedia({media:'print'});
  await cp.pdf({ path:'/tmp/restyle/_cover.pdf', format:'A4', printBackground:true });
  await cp.close();

  // MODULOS reestilizados
  const mods=[['m1-psc-custo.html','m1'],['m2-matriz-riscos.html','m2'],['m3-precificacao.html','m3'],
              ['m4-checklist-custos.html','m4'],['m5-vfm.html','m5']];
  for (const [mod,k] of mods){
    const p = await ctx.newPage();
    await p.goto(`${BASE}/${mod}`,{waitUntil:'networkidle'});
    await sleep(1300);
    // preparo por modulo: ativar a aba/visao "Relatorio" (conteudo imprimivel)
    if(k==='m2'){ await p.evaluate(()=>{ try{atualizarRelatorio&&atualizarRelatorio()}catch(e){}; const t=document.querySelector('[data-tab="relatorio"]'); t&&t.click(); }); await sleep(800); }
    if(k==='m3'){ await p.evaluate(()=>{ try{switchTab('rel')}catch(e){} }); await sleep(700); }
    if(k==='m5'){ for(let i=0;i<=6;i++){ await p.evaluate(x=>{try{goTo(x)}catch(e){}},i); await sleep(130);} await p.evaluate(()=>{try{goTo(0)}catch(e){}}); await sleep(300); }
    await p.evaluate(cleanup);
    await p.addStyleTag({ content: css });
    await p.emulateMedia({media:'print'});
    await p.pdf({ path:`/tmp/restyle/_${k}.pdf`, format:'A4', printBackground:true, margin:{top:'15mm',bottom:'15mm',left:'12mm',right:'12mm'} });
    await p.close();
  }
  await ctx.close(); await b.close();

  // MERGE + numeracao
  const out = await PDFDocument.create();
  const files=['_cover','_m1','_m2','_m3','_m4','_m5'];
  for (const f of files){ const s=await PDFDocument.load(fs.readFileSync(`/tmp/restyle/${f}.pdf`)); const pg=await out.copyPages(s,s.getPageIndices()); pg.forEach(x=>out.addPage(x)); }
  const font = await out.embedFont(StandardFonts.Helvetica);
  const pages = out.getPages(); const N=pages.length;
  pages.forEach((pg,i)=>{
    if(i===0) return; // capa sem rodape
    const {width}=pg.getSize();
    pg.drawText('Relatório de Análise PPP — CAFF · CAGE/SEFAZ-RS', {x:42,y:20,size:7,font,color:rgb(.6,.65,.72)});
    const t=`pág. ${i+1} / ${N}`;
    pg.drawText(t, {x:width-42-font.widthOfTextAtSize(t,7),y:20,size:7,font,color:rgb(.6,.65,.72)});
  });
  fs.writeFileSync(OUT, await out.save());
  console.log('OK', OUT, 'paginas', N);
})().catch(e=>{console.error(e);process.exit(1)});
