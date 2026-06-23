# 14 — Revisão Ciclo 4: Jurídica, Operacional, Qualitativa e de Riscos

**Objetivo:** revisar coerência contratual, operacional, qualitativa e de alocação de riscos; classificar as melhorias qualitativas quanto à relevância.
**Entrada:** `13_preenchimento_v4.json` → **Saída:** `15_preenchimento_v5.json`

---

## 1. Objeto, escopo, modalidade e prazo

| Elemento | Conteúdo | Fonte | OK? |
|---|---|---|---|
| Objeto | Reforma, equipagem, operação e manutenção do CAFF + exploração de receitas acessórias | VfM p.4 / apr. p.16 | ✅ |
| Escopo | Retrofit CAFF/SEDUC/DAER, construção PGE/garagens/comércio, equipagem, O&M, facilities | apr. p.4 | ✅ |
| Modalidade | Concessão Administrativa (PPP, Lei 11.079/2004) | VfM p.4 | ✅ |
| Prazo | 30 anos | apr. p.16 / XLSM | ✅ |
| Licitação | Concorrência internacional, menor contraprestação mensal, sessão B3 | apr. p.27 | ✅ |

## 2. Obrigações das partes

| Parte | Obrigações | Fonte |
|---|---|---|
| **Concessionária** | Obras, retrofit, manutenção predial, operação e gestão de facilities | apr. p.4 |
| **Poder Concedente (Estado)** | Regulação, fiscalização, pagamento da contraprestação, atividades-fim das secretarias | apr. p.4 |

→ Registrado em `res3` do M5 (v5).

## 3. Matriz de riscos — revisão de alocação

- **Transferidos ao privado** (VfM p.13–14): Projeto, Engenharia/Construção, Financiamento, O&M, Ciclo de vida do ativo, Ambientais vinculados à execução, Econômico-financeiros ordinários.
- **Retidos pelo Estado:** políticos, força maior política, passivos ambientais pré-existentes.
- **Compartilhados:** força maior natural (enchentes 2024), mudança de legislação.
- **No M2:** mantida a **alocação típica** do catálogo de referência (16 categorias / 71 subcategorias), pois o **Anexo VII (Matriz de Risco) não foi fornecido** — não se inventou alocação específica. Acrescentadas mitigações com mecanismos contratuais reais:
  - R07 (operacional): mecanismo de pagamento **CME = CMMáx × FDISP × FID** (FID 80–100%, trimestral, Anexo VI).
  - R05 (construção): penalidades (Anexo VIII); remuneração só após Ordem de Operação.
  - R13/R15: garantia pública FPE/RRF; vinculação de receitas (Anexo IX).
- Adicionado **risco customizado**: resiliência climática/drenagem (pós-enchentes 2024), compartilhado.

## 4. Indicadores, mecanismo de pagamento, penalidades, reequilíbrio, governança

| Elemento | Conteúdo | Fonte |
|---|---|---|
| Indicadores de desempenho | Índice de Desempenho (ID), apuração trimestral; piso 80% para FID; waiver 2 trimestres | apr. p.17,22,24 |
| Mecanismo de pagamento | CME = CMMÁX × FDISP × FID; CMC complementar (extra-CMMÁX) | apr. p.24-25 (Anexo VI) |
| Verificação independente | Verificador Independente; relatórios trimestrais (15 dias para aprovação) | apr. p.17 (Anexo IV/X) |
| Penalidades / glosas | Anexo VIII; desconto via FID | apr. p.16 |
| Reequilíbrio | Eventos previstos (matriz de risco / mecanismo de pagamento) | Anexo VI/VII |
| Governança | Definição de papéis na operação; revisão PGE; envio TCE/RS | apr. p.38 |

## 5. Melhorias qualitativas — classificação de relevância para o Estado

| Melhoria | Relevância | Evidência | Justifica maior custo? |
|---|---|---|---|
| Transferência de riscos | **Essencial** | Robusta | Sim |
| Garantia de qualidade (ID + Verificador + penalidades) | **Essencial** | Robusta | Sim |
| Celeridade na entrega (remuneração só após operação) | **Essencial** | Robusta | Sim |
| Alocação eficiente (contrato único vs 18 contratos) | **Alta** | Moderada | Sim |
| Reversibilidade do ativo | **Alta** | Moderada | Parcial |
| Modernização da infraestrutura | **Alta** | Moderada | Parcial |
| Resiliência climática (pós-2024) | **Alta** | Moderada | Sim |
| Centralização de secretarias (fim de aluguéis externos) | **Alta** | Moderada/mensurável | Sim |
| Requalificação urbana | **Média** | Moderada | Parcial |

Detalhe completo em `21_matriz_melhorias_qualitativas.csv`.

## 6. As melhorias qualitativas justificam eventual maior custo da PPP?

**Pergunta dupla:**
- **Caso o VfM fosse negativo:** as três melhorias **essenciais** (transferência de riscos, qualidade aferida, celeridade) seriam suficientes para justificar um diferencial de custo moderado — análise alinhada à orientação do EPEC/CP3P (benefícios não financeiros podem justificar a PPP mesmo com VfM quantitativo pequeno).
- **No caso concreto:** **a PPP já é mais barata** que a contratação tradicional (VfM **positivo** de R$ 188,5 mi). Logo, as melhorias qualitativas **reforçam** uma decisão que já se sustenta quantitativamente — não precisam "compensar" um custo maior.

**Conclusão do ciclo 4:** coerência jurídica/operacional confirmada; alocação de riscos consistente com a prática (com ressalva de que o Anexo VII não foi detalhado); melhorias qualitativas classificadas e predominantemente **essenciais/altas**.
