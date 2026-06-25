# Gerador do relatório com design (CAFF)

Produz um relatório PPP tipografado (sem "cara de print" da ferramenta), a partir
dos dados da análise (CSVs em `resultado_analise_ppp/`) e de valores-chave verificados.

## Como rodar
1. Servir/abrir não é necessário (lê arquivos locais).
2. Gerar o HTML do corpo:  `python3 gen_html.py`  (gera /tmp/rep_design/relatorio.html)
3. Renderizar capa + corpo e mesclar:  `node render.cjs`
   - Requer Chromium (Playwright) e `pdf-lib`.
   - Saída: `Relatorio_PPP_CAFF_design.pdf`.

## Estrutura
- `gen_html.py` — monta o HTML (sumário executivo + KPIs, gráficos SVG, tabelas) lendo
  `20_checklist_custos_estado.csv` e `21_matriz_melhorias_qualitativas.csv`.
- `cover.html` — capa institucional.
- `render.cjs` — imprime capa (sem rodapé) + corpo (com rodapé/numeração) e mescla.

Identificação padronizada (corrige inconsistências do export nativo): nome completo,
concedente Estado do RS — SERG/SPGG, CAGE como unidade analista, período 2026 (data-base dez/2025).
