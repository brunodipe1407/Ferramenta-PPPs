# 18 — Relatório Final de Análise

**Projeto:** Concessão Administrativa do Centro Administrativo Fernando Ferrari (CAFF)
**Poder Concedente:** Estado do Rio Grande do Sul
**Ferramenta:** Ferramentas de Análise PPP — CAGE/SEFAZ-RS
**Ótica da análise:** ente público
**Data:** 23/06/2026

---

## 1. Objetivo da análise

Analisar a ferramenta de geração de relatório de PPP, identificar seus campos, localizar nos documentos do projeto CAFF as informações pertinentes e preencher a ferramenta com base em evidências, sob a **ótica do ente público**, com foco em: (i) custo atual da prestação pelo Estado; (ii) melhorias qualitativas esperadas; (iii) comparação execução pública × PPP; (iv) custos imputáveis ao Estado; (v) aderência às exigências de Value for Money; (vi) rastreabilidade das evidências.

## 2. Documentos analisados

| Documento | Tipo | Data | Papel |
|---|---|---|---|
| Análise de Value for Money (Produto 10) | PDF, 41 p. | 10/03/2026 | Estudo de VfM (qualitativo + quantitativo) |
| Apresentação CGCPPP CAFF | PDF, 41 slides | 17/03/2026 | Deliberação do Conselho Gestor |
| Modelo CAFF 2026.03.16_v2 | XLSM, 50 abas | 16/03/2026 | Modelo econômico-financeiro (fonte preferencial de números) |
| Plano de Negócios | DOCX | 09/03/2026 | Não processado em detalhe (volumoso); referência cruzada |

Índices detalhados em `03_indice_pdf.md` e `04_indice_xlsx.md`.

## 3. Descrição da ferramenta

Aplicação web estática (HTML/CSS/JS), sem backend, com 6 telas/módulos (Início, M1 PSC-Custo, M2 Matriz de Riscos, M3 Precificação, M4 Checklist de Custos, M5 VfM) e persistência em `localStorage`. Não há execução *headless* nem importação programática — por isso o preenchimento foi entregue em **JSON espelhando as chaves de `localStorage`**. Detalhe em `01_diagnostico_ferramenta.md`.

## 4. Metodologia utilizada

1. Análise do repositório e mapeamento de **todos os campos** (6 módulos) → `02_matriz_campos.csv`.
2. Extração textual dos PDFs (PyMuPDF) e do modelo XLSM (openpyxl); sem OCR.
3. Construção da **matriz de evidências** (campo → fonte → página/aba/célula → grau de confiança) → `05_matriz_evidencias.csv`.
4. Preenchimento inicial (v1) priorizando confiança **Alta**; uso de **Média** com justificativa; sinalização de **Baixa/inferência**.
5. **5 ciclos de revisão** (completude → aderência documental → econômico-financeira/VfM → jurídica/operacional/qualitativa/riscos → auditabilidade) → `08`–`16` + versões `09`/`11`/`13`/`15`/`17`.
6. Checklist de **45 custos imputáveis ao Estado** → `20`; matriz de **melhorias qualitativas** → `21`.

## 5. Matriz de campos

Mapeados os campos dos 6 módulos (identificação; M1 CAPEX/OPEX/Gestão/Receita + premissas; M2 16 categorias de risco; M3 11 abas; M4 87 itens; M5 7 sub-módulos). Detalhe em `02_matriz_campos.csv`. Cada campo recebeu **status de preenchimento** (Preenchido / Parcial / Lacuna / Não localizado).

## 6. Matriz de evidências

Cada informação preenchida foi associada a fonte, localização precisa (página do PDF, aba/célula do XLSM) e **grau de confiança** (Alta/Média/Baixa/Não localizada). Detalhe em `05_matriz_evidencias.csv` (26 evidências-chave).

## 7. Resumo do preenchimento

| Módulo | Cobertura | Destaques |
|---|---|---|
| Identificação | Alta | CAFF; Concessão Administrativa; 30 anos; Estado do RS |
| M1 — Custo público atual | Parcial | OPEX atual **R$ 30,95 mi/ano** + aluguéis externos ~R$ 4,08 mi/ano; CAPEX/receita atuais = lacuna |
| M2 — Riscos | Parcial | Alocação típica + mitigações reais; Anexo VII não detalhado |
| M3 — Precificação | Parcial/Lacuna | CAPEX R$ 1,33 bi (R$ 5,7 mil/m²); sem orçamento analítico/BDI/ART |
| M4 — Custos do Estado | Alta | 45 itens avaliados; contraprestação, gestão, neutralidade, garantias quantificados |
| M5 — VfM | Alta | VfM positivo; 9 melhorias qualitativas; conclusão fundamentada |

## 8. Análise de completude

Preenchido **tudo o que há evidência**. Lacunas reais (mantidas e marcadas): custo atual desagregado; anexos contratuais IV–X; orçamento analítico da obra; PROA/SEI; custo isolado do verificador. Nenhum dado foi inventado. Ver `08_revisao_ciclo_1.md`.

## 9. Análise de consistência documental

Valores conferidos célula a célula contra o XLSM e página a página contra os PDFs. **Fonte preferencial de números: modelo XLSM (16/03)**, por ser a versão mais recente e coerente com a apresentação deliberativa. Divergências registradas (seção 15). Ver `10_revisao_ciclo_2.md`.

## 10. Análise econômico-financeira

- **CAPEX:** R$ 1,33 bi (construção R$ 1,0 bi + reinvestimentos R$ 256,4 mi + outros R$ 40,7 mi); R$ 5,7 mil/m² (abaixo do benchmark de R$ 13,07 mil/m²).
- **OPEX:** R$ 80,6 mi/ano total (60,7 obrigatório + 13,6 receitas acessórias + 6,3 admin.). **OPEX atual do CAFF: R$ 30,95 mi/ano.**
- **Contraprestação:** R$ 21,86 mi/mês → R$ 262,3 mi/ano (máx.).
- **Taxas:** TSD 8,5% real (VfM); WACC/TIR real 10,23% (viabilidade privada).
- **Affordability:** comprometimento de **0,49% da RCL** (limite legal 5%); folga confortável.
- Detalhe e decomposição em `12_revisao_ciclo_3.md`.

## 11. Análise de Value for Money

A metodologia é **aderente às exigências de VfM**: compara, a valor presente, os desembolsos do Estado na PPP × na contratação tradicional (PSC), partindo do mesmo orçamento e mesmo nível de qualidade (boa prática CP3P/EPEC), com análise **qualitativa** e **quantitativa**, **neutralidade competitiva**, **affordability** e **sensibilidade**.

**Resultado (modelo 16/03 / apresentação):** PSC **R$ 1.904,7 mi** × PPP **R$ 1.716,2 mi** → **VfM = R$ 188,5 mi (≈9,9%)**, positivo e **robusto** na sensibilidade (R$ 174,0–192,7 mi).

**Aderência ao art. 10, I, "a", da Lei 11.079/2004:** demonstrada (conveniência e oportunidade da PPP).

**Ressalvas:** (a) divergência de versão (Produto 10 indica R$ 192,7 mi); (b) o **cenário híbrido** (obra privada + operação pública) resulta em custo menor (R$ 1.644,0 mi), evidenciando que parte do ganho decorre da execução privada do investimento.

## 12. Análise dos custos imputáveis ao Estado

Avaliados **45 custos potenciais** (`20_checklist_custos_estado.csv`). Principais **previstos**: contraprestação (R$ 262,3 mi/ano), gestão contratual (R$ 453,4 mil/ano), neutralidade competitiva (−R$ 462,4 mi VP), garantias públicas (FPE/RRF), custos de transição/aluguéis externos, impacto fiscal (0,49% RCL). **Não aplicáveis:** desapropriações (terreno público), aporte, subsídios, reassentamentos, seguros (do privado). **Possivelmente subestimados:** verificador independente e monitoramento de KPIs (previstos, sem valor isolado).

## 13. Análise da matriz de riscos

Riscos de **projeto, construção, financiamento, O&M, ciclo de vida, ambientais e econômico-financeiros ordinários** transferidos ao privado; **políticos e força maior** retidos/compartilhados. No M2, manteve-se a alocação típica de referência (Anexo VII não fornecido) com mitigações reais (mecanismo de pagamento, penalidades, garantia FPE/RRF). Ver `14_revisao_ciclo_4.md`.

## 14. Análise das melhorias qualitativas

9 melhorias mapeadas (`21_matriz_melhorias_qualitativas.csv`); **3 essenciais** (transferência de riscos, qualidade aferida por Verificador Independente, celeridade), **5 altas**, **1 média**. Como o **VfM já é positivo**, as melhorias qualitativas **reforçam** a decisão. Mesmo num cenário de VfM marginal, as essenciais justificariam a PPP (orientação EPEC/CP3P).

## 15. Divergências entre PDF e XLSM

| Item | Produto 10 (10/03) | Modelo/Apresentação (16-17/03) | Fonte preferível |
|---|---|---|---|
| **VfM** | R$ 192,7 mi | **R$ 188,5 mi** | XLSM (mais recente) |
| Custo PPP (VPL) | 1.744,7 | 1.716,2 | XLSM |
| PSC (VPL) | 1.937,4 | 1.904,7 | XLSM |
| Neutralidade | −459,1 | −462,4 | XLSM |
| Contraprestação/ano | 262,0 | 262,3 | XLSM (arredondamento) |
| RCL de referência | 65.233 | 56.500 (modelo) | **A validar** |

## 16. Informações não localizadas

Processo PROA/SEI; memória de custo atual desagregada; Anexos contratuais IV–X; orçamento analítico da obra (composições, BDI, ART/RRT); custo isolado do verificador independente; valor da remuneração de estudos/B3.

## 17. Pontos que dependem de validação humana

1. **Conciliar o VfM** (192,7 × 188,5 mi) — adotar a versão definitiva antes do edital. *(Estruturador/CAGE)*
2. **Definir a RCL de referência** (65.233 × 56.500 mi) e recalcular o comprometimento. *(SEFAZ/Tesouro RS)*
3. **Obter e auditar o orçamento analítico** da obra (composições, BDI, ART/RRT). *(Engenharia/CAGE — M3)*
4. **Detalhar a Matriz de Risco (Anexo VII)** e validar a alocação item a item. *(PGE/CAGE — M2)*
5. **Quantificar verificador independente e monitoramento de KPIs**. *(Gestão contratual)*
6. **Confirmar inexistência de aporte e de desapropriações**. *(Modelagem/Edital)*
7. **Avaliar o cenário híbrido** na decisão (obra privada + operação pública custa menos). *(Conselho Gestor)*
8. **Registrar o nº do processo** administrativo (PROA/SEI). *(SERG)*

## 18. Conclusão

A documentação do projeto CAFF é **robusta e suficiente** para um preenchimento preliminar consistente e rastreável da ferramenta, especialmente nos módulos de **VfM (M5)** e **Checklist de Custos (M4)**. A análise confirma **Value for Money positivo** (R$ 188,5 mi; ~9,9%) e **affordability folgada** (0,49% da RCL), com **melhorias qualitativas essenciais** e **transferência adequada de riscos**. Persistem lacunas no **custo atual desagregado (M1)** e na **precificação analítica da obra (M3)**, além da **divergência numérica entre versões do VfM** e da **ausência dos anexos contratuais**.

**Classificação do preenchimento final: "Adequado com ressalvas".**
Adequado para uso preliminar/instrução do processo, condicionado à resolução das pendências de validação humana da seção 17 — em especial a conciliação da versão do VfM, a definição da RCL de referência e a obtenção do orçamento analítico da obra e do Anexo VII.

## 19. Recomendações

1. Adotar oficialmente a **versão mais recente do modelo** (16/03) e conciliar o Produto 10.
2. Anexar **orçamento analítico, composições, BDI e ART/RRT** ao processo (preencher integralmente o M3).
3. Disponibilizar os **Anexos contratuais IV–X** para detalhar M2 (riscos) e validar mecanismo de pagamento/garantias.
4. **Quantificar** verificador independente, monitoramento de KPIs e gestão pública remanescente.
5. **Padronizar a RCL** de referência e revisitar a affordability.
6. Levar à decisão o **comparativo PPP × cenário híbrido**, explicitando que a vantagem decorre majoritariamente da execução privada do investimento.
7. Conduzir a **consulta pública** e a revisão pela **PGE/TCE-RS** antes do edital (out/2026).
8. Registrar o **número do processo** e completar a identificação na ferramenta.
