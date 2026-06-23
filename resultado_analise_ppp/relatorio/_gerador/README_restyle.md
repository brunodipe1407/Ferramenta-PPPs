# Restyle do relatório nativo (mesmo conteúdo, visual de documento)

Aplica um visual tipografado SOBRE o relatório que a ferramenta gera, **sem alterar
os textos**: oculta elementos de interface (campos de formulário, botões, abas,
toasts) e reestiliza tipografia/tabelas/cabeçalhos.

## Arquivos
- `override.css` — folha de estilo de impressão (cores, tabelas, campos→texto).
- `cleanup.js` — remove elementos só de UI e converte input/select/textarea em texto.
- `fullgen.cjs` — pipeline: capa + M1..M5 (com preparo por módulo) → PDF único numerado.

## Preparo por módulo (essencial)
- **M2**: ativa a aba *Relatório* + `atualizarRelatorio()` (a matriz fica em aba oculta).
- **M3**: `switchTab('rel')` (gera o Relatório Técnico).
- **M5**: percorre os 7 painéis (`goTo`) para popular VfM/Melhorias/Conclusão.

## Rodar
1. Servir a ferramenta:  `npx http-server -p 8099 -c-1 .`
2. `node fullgen.cjs`  (requer Chromium/Playwright + pdf-lib; usa bypassCSP).
   Saída: `Relatorio_PPP_CAFF_ferramenta_design.pdf`.

> Lê o preenchimento de `resultado_analise_ppp/17_preenchimento_final.json`.
> Para usar SEU preenchimento, exporte o localStorage da ferramenta para esse formato.
