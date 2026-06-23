# 04 — Índice do Modelo Financeiro (XLSM)

**Arquivo:** `simulacao/CAFF/Modelo CAFF 2026.03.16_v2 (1).xlsm` (data-base do modelo: **16/03/2026**)
**Estrutura:** 50 abas (planilhas). É a **fonte preferencial para CAPEX, OPEX, contraprestação, VfM e affordability**, por ser a versão mais recente e coerente com a apresentação ao CGCPPP (17/03).

> Observação: o arquivo é `.xlsm` (com macros). Extração feita com `openpyxl` (data_only). Há também duas planilhas auxiliares em `referencias/` (modelos canônicos da própria ferramenta), não confundir com o modelo do projeto.

---

## 1. Abas e finalidade

| Aba | Conteúdo | Relevância |
|---|---|---|
| **00. PAINEL DE RESULTADOS** | Síntese de resultados (Cenário 1 "Premissas atuais" col. G × Cenário 3 "Pré-viabilidade" col. E) | **Alta** — números-chave |
| 01a/01b/01c. Painel/Premissas | Painel de controle e premissas (projeto, temporais) | Premissas |
| **02. WACC-CAPM** | Custo de capital do privado | WACC |
| 03. Dados Macroeconômicos | IPCA, índices | Premissas |
| **04. RECEITA** | Contraprestação + receitas acessórias | Receitas |
| **05. OPEX** | Custos operacionais | OPEX |
| **06. CAPEX** | Investimentos | CAPEX |
| 07. D&A / 08. Tributos / 09. Dívida | Depreciação, tributos, financiamento | Neutralidade/fiscal |
| 10. DFs / 11. AUX BP | Demonstrações financeiras | Resultado |
| **12. Affordability e VfM** | **Cálculo do VfM e do comprometimento da RCL** | **Alta** — núcleo do VfM |
| A–P / URBANIZACAO | Orçamentos por edifício (CAFF, SEDUC, PGE, DAER, torres, garagens, escola, urbanização) | CAPEX detalhado |
| Custos operacionais / Resumo CMQ | Memória de OPEX | OPEX detalhado |
| MAPA / Benchmarks / Outputs / Premissas-Vocação | Benchmarks e parâmetros de receita | Receitas/benchmark |
| GRÁFICOS E TABELAS / Checks | Saídas e verificações | Auditoria |

---

## 2. Células-chave (aba `00. PAINEL DE RESULTADOS`, coluna **G** = "Premissas atuais" / Cenário 1)

| Célula | Indicador | Valor |
|---|---|---|
| E10/G10 | Prazo do contrato | **30 anos** |
| G12 | Investimento Obrigatório Total | **R$ 1.115,56 mi** |
| G19 | Investimento total / m² | R$ 5,72 mil/m² |
| G20 | CAPEX — média benchmark | R$ 13,07/m² (mil) |
| G21 | Investimento total | **R$ 1.291,64 mi** |
| G23 | OPEX Obrigatório Anual | **R$ 58,72 mi** |
| **G28** | **OPEX Atual CAFF (referência) — CUSTO ATUAL DO ESTADO** | **R$ 30,95 mi/ano** |
| G29 | OPEX Atual CAFF / m² | R$ 294,06/m² |
| G30 | OPEX Anual Atividades Acessórias | R$ 11,46 mi |
| G32 | Receita Acessória Máxima Anual | R$ 41,32 mi |
| G33 | Contraprestação Máxima Mensal | **R$ 21,86 mi** |
| G38 | Contraprestação Máxima Anual | **R$ 262,30 mi** |
| G40 | Margem EBITDA Média | 52,71% |
| G42 | TIR do Projeto Real (FCFF) | **10,23%** |
| G43 | TIR do Acionista Real (DDM) | 13,57% |
| G47 | Comprometimento da RCL | **0,49%** |

---

## 3. Células-chave (aba `12. Affordability e VfM`)

| Célula | Indicador | Valor |
|---|---|---|
| G7 / G8 | Taxa de desconto (Tradicional / PPP) | **8,5% / 8,5%** |
| G13 | Contraprestação (VPL) | R$ 2.173,73 mi |
| G14 | Gestão Contratual (VPL) | R$ 4,87 mi |
| G15 | Neutralidade Competitiva (VPL) | **−R$ 462,41 mi** |
| **G16/G26** | **Custo da PPP (VPL)** | **R$ 1.716,20 mi** |
| G19 | Investimentos + Despesas (PSC) | R$ 1.606,32 mi |
| G20 | Aditivos Contratuais (25%) | R$ 401,58 mi |
| G21 | Custo de Transação | R$ 1,45 mi |
| G22 | Atraso de Obras | R$ 16,33 mi |
| G23 | Obtenção de Receitas | −R$ 121,01 mi |
| **G24/G28** | **Custo da Contratação Tradicional (PSC)** | **R$ 1.904,67 mi** |
| **G27** | **Value for Money** | **R$ 188,47 mi** |
| G29 | VfM % | 9,9% |
| D16/D17 | Sobrecusto CAPEX / OPEX | 25% / 25% |
| D18 | Custo Anual com Licitação | R$ 28.918,40 |
| D19 | Tempo médio de atraso de obras | 6,81 |
| D26 | Quantidade de contratos | 18 |
| D30–D41 | **Aluguéis externos** (custo atual): SEDUC R$ 2,806 mi/ano; SPGG R$ 0,651 + 0,620 mi/ano | ≈ R$ 4,08 mi/ano |
| D45–D48 | Receitas acessórias Estado: ABL comercial 1.907 m² @ 78; corporativo 18.394 m² @ 65 | — |
| I99 | RCL do Ente (modelo) | R$ 56.500 mi |
| D102 | % máx. comprometimento da RCL (PPP) | 0,46% |

---

## 4. Memórias de cálculo e cronogramas

- **CAPEX por edifício e fase:** abas `A — CAFF`, `A — CAFF — AMPLIACAO`, `A — CAFF — RETROFIT`, `B — SEDUC`, `C — PGE`, `D…P`, `URBANIZACAO`; cronograma físico-financeiro no painel (linhas AF–BM) com faseamento (Fase 1/2/3).
- **OPEX detalhado:** aba `Custos operacionais` (1.629 linhas) e `Resumo CMQ`.
- **Receita:** aba `04. RECEITA` e `Outputs` (ABL comercial/corporativo, estacionamento: vagas, giro 1,5, ocupação 20%, R$ 30/vaga, repasse 45%).
- **Benchmarks:** aba `Benchmarks` e slide 26 da apresentação (4 centros administrativos comparáveis).

---

## 5. Divergências relevantes detectadas (XLSM × PDF)

| Indicador | XLSM (16/03) | VfM PDF (10/03) | Fonte mais adequada |
|---|---|---|---|
| **VfM** | **R$ 188,47 mi** | R$ 192,7 mi | XLSM (mais recente; = apresentação 188,5) |
| Custo PPP (VPL) | 1.716,2 | 1.744,7 | XLSM |
| PSC (VPL) | 1.904,7 | 1.937,4 | XLSM |
| Neutralidade | −462,4 | −459,1 | XLSM |
| Contraprestação anual | 262,3 | 262,0 | XLSM (arredondamento) |
| RCL de referência | 56.500 (I99) | 65.233 (Tab.4) | Conferir — afeta % de comprometimento |

> Ver tratamento completo em `05_matriz_evidencias.csv` e nas revisões `10`/`12`.
