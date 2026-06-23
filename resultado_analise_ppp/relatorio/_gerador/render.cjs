const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { PDFDocument } = require('/tmp/pdftools/node_modules/pdf-lib');
const fs = require('fs');
const OUT = '/home/user/Ferramenta-PPPs/resultado_analise_ppp/relatorio/Relatorio_PPP_CAFF_design.pdf';
(async () => {
  const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
  // CAPA
  const c = await b.newPage();
  await c.goto('file:///tmp/rep_design/cover.html', { waitUntil:'networkidle' });
  await c.emulateMedia({ media:'print' });
  await c.pdf({ path:'/tmp/rep_design/_cover.pdf', format:'A4', printBackground:true });
  await c.close();
  // CORPO
  const p = await b.newPage();
  await p.goto('file:///tmp/rep_design/relatorio.html', { waitUntil:'networkidle' });
  await p.emulateMedia({ media:'print' });
  const header = `<div style="font-size:7pt;color:#9aa6b8;width:100%;padding:0 16mm;display:flex;justify-content:space-between;font-family:Segoe UI,Arial">
    <span>Relatório de Análise PPP — CAFF</span><span>CAGE / SEFAZ-RS</span></div>`;
  const footer = `<div style="font-size:7pt;color:#9aa6b8;width:100%;padding:0 16mm;display:flex;justify-content:space-between;font-family:Segoe UI,Arial">
    <span>Documento técnico de apoio à decisão · ótica do ente público</span>
    <span>pág. <span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`;
  await p.pdf({ path:'/tmp/rep_design/_body.pdf', format:'A4', printBackground:true,
    displayHeaderFooter:true, headerTemplate:header, footerTemplate:footer,
    margin:{ top:'18mm', bottom:'16mm', left:'14mm', right:'14mm' } });
  await p.close();
  await b.close();
  // MERGE
  const out = await PDFDocument.create();
  for (const f of ['/tmp/rep_design/_cover.pdf','/tmp/rep_design/_body.pdf']) {
    const src = await PDFDocument.load(fs.readFileSync(f));
    const pgs = await out.copyPages(src, src.getPageIndices());
    pgs.forEach(x=>out.addPage(x));
  }
  fs.writeFileSync(OUT, await out.save());
  console.log('OK', OUT, 'paginas', out.getPageCount());
})().catch(e=>{console.error(e);process.exit(1)});
