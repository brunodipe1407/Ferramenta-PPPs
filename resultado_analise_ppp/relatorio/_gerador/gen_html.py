# -*- coding: utf-8 -*-
"""Gera um relatorio PPP com design de documento (HTML -> PDF via Chromium).
Le os CSVs da analise e produz um HTML tipografado, sem 'cara de print'."""
import csv, html, os

OUTHTML = "/tmp/rep_design/relatorio.html"
os.makedirs("/tmp/rep_design", exist_ok=True)
ROOT = "/home/user/Ferramenta-PPPs/resultado_analise_ppp"

def esc(s): return html.escape(str(s))
def readcsv(name):
    with open(os.path.join(ROOT, name), encoding="utf-8") as f:
        return list(csv.DictReader(f))

melh = readcsv("21_matriz_melhorias_qualitativas.csv")
custos = readcsv("20_checklist_custos_estado.csv")

# ---------------- dados-chave (verificados) ----------------
D = dict(
    projeto="Concessão Administrativa do Centro Administrativo Fernando Ferrari (CAFF)",
    concedente="Estado do Rio Grande do Sul — SERG / SPGG",
    analista="CAGE / SEFAZ-RS — Contadoria e Auditoria-Geral do Estado",
    modalidade="Concessão Administrativa (PPP, Lei nº 11.079/2004)",
    prazo="30 anos", databse="dez/2025", local="Porto Alegre/RS",
    estrut="BNDES (OCS 330/2024) · Consórcio RECAFF", data="23 de junho de 2026",
    vfm=188.5, psc=1904.7, ppp=1716.2, vfm_pct=9.9,
    contrapr_mes=21.86, contrapr_ano=262.3, capex=1332.3, opex=80.6, opex_atual=30.95,
    tsd=8.5, wacc=10.23, ebitda=52.71, rcl_pct=0.49, rcl_lim=5.0,
)
# decomposicoes (R$ milhoes)
PSC_DEC = [("Investimentos + Despesas (PSC bruto)",1606.3,"+"),("Aditivos contratuais (sobrecusto 25%)",401.6,"+"),
           ("Custo de transação (18 contratos)",1.5,"+"),("Atraso de obras (iPrazo RS 3,27)",16.3,"+"),
           ("Obtenção de receitas acessórias",-121.0,"-")]
PPP_DEC = [("Contraprestação (VPL)",2173.7,"+"),("Gestão contratual",4.9,"+"),("Neutralidade competitiva (tributos)",-462.4,"-")]
SENS = [("75% (−25%)",174.0),("70% (−30%)",183.3),("65% (−35%) — base",192.7)]

def brl(v, dec=1):
    s=f"{v:,.{dec}f}".replace(",","X").replace(".",",").replace("X",".")
    return s

# ---------------- grafico de barras comparativo (SVG) ----------------
def chart_compare():
    maxv=D["psc"]; W=520; H=210; bw=120; base=170; sc=130/maxv
    hppp=D["ppp"]*sc; hpsc=D["psc"]*sc
    return f'''<svg viewBox="0 0 {W} {H}" class="chart">
      <line x1="40" y1="{base}" x2="{W-20}" y2="{base}" stroke="#cfd8e3"/>
      <rect x="90" y="{base-hppp:.0f}" width="{bw}" height="{hppp:.0f}" rx="4" fill="#1f6feb"/>
      <text x="{90+bw/2}" y="{base-hppp-10:.0f}" class="bl" text-anchor="middle">R$ {brl(D['ppp'])} mi</text>
      <text x="{90+bw/2}" y="{base+18}" class="bx" text-anchor="middle">PPP</text>
      <rect x="300" y="{base-hpsc:.0f}" width="{bw}" height="{hpsc:.0f}" rx="4" fill="#16794a"/>
      <text x="{300+bw/2}" y="{base-hpsc-10:.0f}" class="bl" text-anchor="middle">R$ {brl(D['psc'])} mi</text>
      <text x="{300+bw/2}" y="{base+18}" class="bx" text-anchor="middle">Contratação tradicional (PSC)</text>
      <line x1="{90+bw}" y1="{base-hppp:.0f}" x2="300" y2="{base-hpsc:.0f}" stroke="#e2761b" stroke-width="2" stroke-dasharray="4 3"/>
      <rect x="186" y="{base-hpsc-2:.0f}" width="118" height="22" rx="11" fill="#fff3e6" stroke="#e2761b"/>
      <text x="245" y="{base-hpsc+13:.0f}" class="vfm" text-anchor="middle">VfM R$ {brl(D['vfm'])} mi</text>
    </svg>'''

# ---------------- barra de affordability ----------------
def chart_afford():
    pct=D["rcl_pct"]; lim=D["rcl_lim"]; W=520; fill=(pct/lim)*460
    return f'''<svg viewBox="0 0 {W} 70" class="chart">
      <rect x="30" y="20" width="460" height="22" rx="11" fill="#eef2f8"/>
      <rect x="30" y="20" width="{fill:.1f}" height="22" rx="11" fill="#16794a"/>
      <line x1="490" y1="12" x2="490" y2="50" stroke="#c0392b" stroke-width="2"/>
      <text x="490" y="62" class="bx" text-anchor="end">Limite legal 5,0% da RCL</text>
      <text x="34" y="62" class="bx">Comprometimento da RCL: <tspan class="bl">{brl(pct,2)}%</tspan></text>
    </svg>'''

def waterfall_table(rows, total_label, total):
    out='<table class="wf"><tbody>'
    for nome,val,sig in rows:
        cls="neg" if val<0 else "pos"
        out+=f'<tr><td>{esc(nome)}</td><td class="num {cls}">{("−" if val<0 else "+") if sig else ""} {brl(abs(val))}</td></tr>'
    out+=f'<tr class="tot"><td>{esc(total_label)}</td><td class="num">{brl(total)}</td></tr>'
    return out+'</tbody></table>'

# ---------------- tabelas ----------------
def tbl_custos():
    rows=""
    prev_color={"Sim":"s-sim","Não":"s-nao","Nao":"s-nao","Parcial":"s-parc","N/A":"s-na"}
    # destacar os quantificados + alguns
    keep=["1","4","10","11","15","17","31","34","39","40","41","45"]
    for r in custos:
        if r["item"] not in keep: continue
        prev=r["previsto_no_estudo_sim_nao_parcial"]
        cls=prev_color.get(prev,"s-parc")
        rows+=f'''<tr><td>{esc(r["custo_potencial"])}</td>
        <td><span class="pill {cls}">{esc(prev)}</span></td>
        <td>{esc(r["valor_estimado"])}</td>
        <td>{esc(r["responsavel_pelo_custo"])}</td></tr>'''
    return rows

def tbl_melh():
    rows=""
    relcls={"Essencial":"r-ess","Alta":"r-alta","Média":"r-med","Media":"r-med"}
    for r in melh:
        rel=r["relevancia_para_o_estado"]
        rows+=f'''<tr><td><strong>{esc(r["melhoria_qualitativa"])}</strong><div class="sub">{esc(r["situacao_esperada_com_ppp"])}</div></td>
        <td><span class="pill {relcls.get(rel,'r-med')}">{esc(rel)}</span></td>
        <td>{esc(r["mensuravel_sim_nao"])}</td>
        <td>{esc(r["localizacao"])}</td></tr>'''
    return rows

RISCOS=[("Transferidos ao parceiro privado","Projeto, Engenharia/Construção, Financiamento, Operação e Manutenção, Ciclo de vida do ativo, Ambientais vinculados à execução, Econômico-financeiros ordinários","priv"),
("Retidos pelo Estado","Riscos políticos e soberanos, força maior política, passivos ambientais pré-existentes","pub"),
("Compartilhados","Força maior natural (enchentes 2024), mudança de legislação, licenciamento ambiental, refinanciamento","comp")]

def tbl_riscos():
    out=""
    for t,d,c in RISCOS:
        out+=f'<tr><td><span class="dot {c}"></span><strong>{esc(t)}</strong></td><td>{esc(d)}</td></tr>'
    return out

# ---------------- HTML ----------------
HTML=f'''<!doctype html><html lang="pt-br"><head><meta charset="utf-8"><style>
:root{{--azul:#0b2a4a;--azul2:#1f6feb;--verde:#16794a;--cinza:#56627a;--linha:#e3e8f0;--bg:#f7f9fc;}}
*{{box-sizing:border-box;margin:0;padding:0}}
@page{{size:A4;margin:18mm 16mm}}
body{{font-family:'Segoe UI','Helvetica Neue',Arial,sans-serif;color:#1b2638;font-size:10.2pt;line-height:1.5}}
h1,h2,h3{{color:var(--azul);line-height:1.2}}
.sec{{margin:0 0 8mm;page-break-inside:avoid}}
.sec-h{{display:flex;align-items:center;gap:8px;border-bottom:2px solid var(--verde);padding-bottom:4px;margin-bottom:8px}}
.sec-h .n{{background:var(--verde);color:#fff;font-weight:700;font-size:9pt;padding:2px 9px;border-radius:5px}}
.sec-h h2{{font-size:14pt}}
p{{margin:0 0 6px}}
.lead{{color:var(--cinza)}}
.kpis{{display:grid;grid-template-columns:repeat(3,1fr);gap:6mm;margin:6mm 0}}
.kpi{{background:var(--bg);border:1px solid var(--linha);border-radius:10px;padding:10px 12px}}
.kpi .v{{font-size:18pt;font-weight:800;color:var(--azul)}}
.kpi .v.green{{color:var(--verde)}}
.kpi .l{{font-size:8pt;letter-spacing:.5px;text-transform:uppercase;color:var(--cinza);font-weight:600}}
.kpi .d{{font-size:8.5pt;color:var(--cinza)}}
table{{width:100%;border-collapse:collapse;font-size:9.3pt}}
th{{background:var(--azul);color:#fff;text-align:left;padding:6px 9px;font-size:8.3pt;letter-spacing:.4px;text-transform:uppercase}}
td{{padding:6px 9px;border-bottom:1px solid var(--linha);vertical-align:top}}
tr:nth-child(even) td{{background:#fafcff}}
.num{{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}}
.pill{{display:inline-block;padding:1px 8px;border-radius:10px;font-size:8pt;font-weight:700}}
.s-sim{{background:#e6f4ec;color:#16794a}} .s-nao{{background:#fdecec;color:#c0392b}}
.s-parc{{background:#fff4e0;color:#b8730a}} .s-na{{background:#eef0f4;color:#56627a}}
.r-ess{{background:#0b2a4a;color:#fff}} .r-alta{{background:#1f6feb;color:#fff}} .r-med{{background:#e6eefb;color:#1f6feb}}
.sub{{font-size:8.3pt;color:var(--cinza);margin-top:2px}}
.dot{{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px;vertical-align:middle}}
.dot.priv{{background:#1f6feb}} .dot.pub{{background:#c0392b}} .dot.comp{{background:#e2761b}}
.two{{display:grid;grid-template-columns:1fr 1fr;gap:6mm}}
.card{{border:1px solid var(--linha);border-radius:10px;padding:10px 12px}}
.card h3{{font-size:10.5pt;margin-bottom:6px}}
table.wf td{{padding:4px 8px;font-size:9pt}}
table.wf .tot td{{font-weight:800;color:var(--azul);border-top:2px solid var(--azul);background:#eef6f1}}
table.wf .num.neg{{color:#c0392b}} table.wf .num.pos{{color:#1b2638}}
.chart{{width:100%;height:auto;margin:4px 0}}
.chart .bl{{font:700 11px 'Segoe UI';fill:#1b2638}} .chart .bx{{font:600 9px 'Segoe UI';fill:#56627a}}
.chart .vfm{{font:800 10px 'Segoe UI';fill:#e2761b}}
.callout{{background:#fff8ec;border-left:4px solid #e2761b;border-radius:0 8px 8px 0;padding:8px 12px;font-size:9pt;margin:6px 0}}
.note{{font-size:8.5pt;color:var(--cinza);margin-top:4px}}
ul{{margin:4px 0 6px 16px}} li{{margin:2px 0}}
.tag{{display:inline-block;background:#e6f4ec;color:#16794a;border:1px solid #cfe6da;border-radius:5px;padding:2px 9px;font-size:8.5pt;font-weight:700}}
</style></head><body>

<!-- SUMARIO EXECUTIVO -->
<div class="sec">
  <div class="sec-h"><span class="n">01</span><h2>Sumário Executivo</h2></div>
  <p class="lead">Análise de vantajosidade (<em>Value for Money</em>) da {esc(D["modalidade"])} para reforma, equipagem, operação e manutenção do {esc(D["projeto"])}, sob a ótica do ente público. Comparação, a valor presente, entre a execução pela PPP e pela contratação tradicional (<em>Public Sector Comparator</em>), com a mesma qualidade e escopo.</p>
  <div class="kpis">
    <div class="kpi"><div class="l">Value for Money</div><div class="v green">R$ {brl(D["vfm"])} mi</div><div class="d">PPP {brl(D["vfm_pct"])}% mais barata que o PSC</div></div>
    <div class="kpi"><div class="l">Custo da PPP (VPL)</div><div class="v">R$ {brl(D["ppp"])} mi</div><div class="d">vs PSC R$ {brl(D["psc"])} mi</div></div>
    <div class="kpi"><div class="l">Comprometimento da RCL</div><div class="v">{brl(D["rcl_pct"],2)}%</div><div class="d">limite legal 5,0% — folga confortável</div></div>
    <div class="kpi"><div class="l">Contraprestação máxima</div><div class="v">R$ {brl(D["contrapr_ano"])} mi</div><div class="d">R$ {brl(D["contrapr_mes"],2)} mi/mês</div></div>
    <div class="kpi"><div class="l">Investimento (CAPEX)</div><div class="v">R$ {brl(D["capex"]/1000,2)} bi</div><div class="d">R$ 5,7 mil/m² · prazo {esc(D["prazo"])}</div></div>
    <div class="kpi"><div class="l">Taxa de desconto (TSD)</div><div class="v">{brl(D["tsd"])}%</div><div class="d">real a.a. · WACC privado {brl(D["wacc"],2)}%</div></div>
  </div>
  <p><span class="tag">Conclusão</span> &nbsp;Projeto com <strong>Value for Money positivo e robusto</strong> e <strong>impacto fiscal suportável</strong>, com melhorias qualitativas essenciais (transferência de riscos, qualidade aferida por Verificador Independente, celeridade). Preenchimento classificado como <strong>"Adequado com ressalvas"</strong>.</p>
</div>

<!-- IDENTIFICACAO -->
<div class="sec">
  <div class="sec-h"><span class="n">02</span><h2>Identificação do Projeto</h2></div>
  <table>
    <tr><th style="width:34%">Item</th><th>Descrição</th></tr>
    <tr><td>Objeto</td><td>{esc(D["projeto"])} — reforma, equipagem, operação e manutenção e exploração de receitas acessórias</td></tr>
    <tr><td>Poder concedente</td><td>{esc(D["concedente"])}</td></tr>
    <tr><td>Modalidade</td><td>{esc(D["modalidade"])}</td></tr>
    <tr><td>Prazo / data-base</td><td>{esc(D["prazo"])} · data-base {esc(D["databse"])} · {esc(D["local"])}</td></tr>
    <tr><td>Estruturação</td><td>{esc(D["estrut"])}</td></tr>
    <tr><td>Análise / responsável técnico</td><td>{esc(D["analista"])} — ótica do ente público</td></tr>
  </table>
</div>

<!-- ANALISE ECONOMICA / VfM -->
<div class="sec">
  <div class="sec-h"><span class="n">03</span><h2>Análise Econômico-Financeira e Value for Money</h2></div>
  {chart_compare()}
  <div class="two">
    <div class="card"><h3>Composição do PSC (contratação tradicional)</h3>{waterfall_table(PSC_DEC,"Custo da contratação tradicional",D["psc"])}</div>
    <div class="card"><h3>Composição do custo da PPP</h3>{waterfall_table(PPP_DEC,"Custo da PPP",D["ppp"])}</div>
  </div>
  <div class="callout"><strong>Divergência registrada:</strong> o resultado do VfM é R$ 188,5 mi no modelo financeiro (16/03/2026) e na apresentação ao CGCPPP (17/03), e R$ 192,7 mi no Produto 10 (10/03). Fonte preferível: modelo financeiro (mais recente). Recomenda-se conciliar antes do edital.</div>
  <div class="two" style="margin-top:6mm">
    <div class="card"><h3>Análise de sensibilidade do VfM</h3>
      <table><tr><th>Fator de eficiência comercial</th><th class="num">VfM (R$ mi)</th></tr>
      {''.join(f'<tr><td>{esc(a)}</td><td class="num">{brl(b)}</td></tr>' for a,b in SENS)}</table>
      <div class="note">VfM permanece positivo em todos os cenários — resultado robusto.</div>
    </div>
    <div class="card"><h3>Capacidade fiscal (Affordability)</h3>
      {chart_afford()}
      <div class="note">Contraprestação anual R$ {brl(D["contrapr_ano"])} mi · limite legal (5% da RCL) R$ 3.261,65 mi · margem ampla frente ao estoque de PPPs do Estado.</div>
    </div>
  </div>
</div>

<!-- CUSTOS DO ESTADO -->
<div class="sec">
  <div class="sec-h"><span class="n">04</span><h2>Custos Imputáveis ao Estado</h2></div>
  <p class="lead">Avaliados 45 custos potenciais do ente público (checklist completo no anexo). Principais itens:</p>
  <table>
    <tr><th>Custo potencial</th><th>Previsto</th><th>Valor estimado</th><th>Responsável</th></tr>
    {tbl_custos()}
  </table>
  <div class="note">Não aplicáveis: desapropriações (terreno público), aporte público, subsídios, reassentamentos, seguros (do privado). Possivelmente subestimados: verificador independente e monitoramento de KPIs (previstos, sem valor isolado).</div>
</div>

<!-- RISCOS -->
<div class="sec">
  <div class="sec-h"><span class="n">05</span><h2>Matriz de Alocação de Riscos</h2></div>
  <table><tr><th style="width:34%">Alocação</th><th>Categorias de risco</th></tr>{tbl_riscos()}</table>
  <div class="note">Alocação conforme matriz típica de referência; o Anexo VII (Matriz de Risco) do contrato não foi detalhado nos documentos analisados. Mitigações apoiadas no mecanismo de pagamento (CME = CMMáx × FDISP × FID), penalidades e garantia pública (FPE/RRF).</div>
</div>

<!-- MELHORIAS -->
<div class="sec">
  <div class="sec-h"><span class="n">06</span><h2>Melhorias Qualitativas Esperadas</h2></div>
  <table>
    <tr><th>Melhoria (situação esperada com a PPP)</th><th>Relevância</th><th>Mensurável</th><th>Evidência</th></tr>
    {tbl_melh()}
  </table>
  <div class="note">Como o VfM já é positivo, as melhorias qualitativas <strong>reforçam</strong> a decisão. As três essenciais justificariam a PPP mesmo num cenário de VfM marginal (orientação EPEC/CP3P).</div>
</div>

<!-- CONCLUSAO -->
<div class="sec">
  <div class="sec-h"><span class="n">07</span><h2>Conclusão e Recomendações</h2></div>
  <p>O projeto apresenta <strong>Value for Money positivo (R$ {brl(D["vfm"])} mi; {brl(D["vfm_pct"])}%)</strong>, <strong>affordability folgada ({brl(D["rcl_pct"],2)}% da RCL)</strong> e <strong>melhorias qualitativas essenciais</strong>, com transferência adequada de riscos ao parceiro privado. Persistem lacunas no custo atual desagregado e na precificação analítica da obra.</p>
  <p><strong>Classificação do preenchimento: Adequado com ressalvas.</strong> Apto a uso preliminar/instrução, condicionado à resolução das pendências abaixo.</p>
  <h3 style="font-size:10.5pt;margin:6px 0 2px">Pendências para validação humana</h3>
  <ul>
    <li>Conciliar a versão do VfM (R$ 192,7 mi × R$ 188,5 mi) e adotar a definitiva.</li>
    <li>Definir a RCL de referência (R$ 65.233 mi × R$ 56.500 mi) e recalcular o comprometimento.</li>
    <li>Obter e auditar o orçamento analítico da obra (composições, BDI, ART/RRT).</li>
    <li>Detalhar a Matriz de Risco (Anexo VII) e validar a alocação item a item.</li>
    <li>Quantificar verificador independente e monitoramento de KPIs.</li>
    <li>Avaliar, na decisão, o cenário híbrido (obra privada + operação pública), de custo inferior.</li>
  </ul>
</div>

</body></html>'''

with open(OUTHTML,"w",encoding="utf-8") as f:
    f.write(HTML)
print("HTML gerado:", OUTHTML, len(HTML), "bytes")
