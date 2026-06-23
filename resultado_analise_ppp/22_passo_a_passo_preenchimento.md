# 22 — Passo a Passo de Preenchimento (roteiro para gravação)

**Projeto:** Concessão Administrativa do Centro Administrativo Fernando Ferrari (CAFF)
**Ferramenta:** Ferramentas de Análise PPP — CAGE/SEFAZ-RS

> **Como ler este roteiro:** cada passo traz **[ONDE INSERIR]** (campo da ferramenta), **[O QUE DIGITAR/SELECIONAR]** (valor pronto), **[FONTE]** (de onde vem a informação) e **[OBS]** (observação para o vídeo).
> **Convenções de valores:** campos numéricos da ferramenta esperam **R$ em reais** (sem "milhões"). Onde o estudo fala em "R$ milhões", já fiz a conversão (×1.000.000). Datas no formato **DD/MM/AAAA**.
> **Fontes citadas:** `VfM` = Análise de Value for Money (10/03/2026); `Apr.` = Apresentação CGCPPP (17/03/2026); `XLSM` = Modelo CAFF 16/03/2026.

---

## PASSO 0 — Preparação (antes de gravar)

1. Abra a ferramenta:
   - Online: `https://brunodipe1407.github.io/Ferramenta-PPPs/`; **ou**
   - Local: na pasta do projeto rode `python3 -m http.server 8000` e abra `http://localhost:8000`.
2. Use **Chrome ou Edge** (os módulos abrem em `iframe`; em `file://` pode falhar — por isso o servidor local).
3. **[OBS]** Tenha à mão este roteiro e os 3 documentos abertos. A ferramenta **salva sozinha** (rascunho no navegador). Se quiser começar do zero, use o botão **"limpar"**.

---

## PASSO 1 — Tela INÍCIO (Identificação do projeto)

> Esses dados alimentam os demais módulos automaticamente.

| # | [ONDE INSERIR] | [O QUE DIGITAR] | [FONTE] |
|---|---|---|---|
| 1.1 | Nome / Projeto | `Concessão Administrativa do Centro Administrativo Fernando Ferrari (CAFF)` | VfM p.4 / Apr. p.16 |
| 1.2 | Órgão concedente | `Estado do RS — Secretaria da Reconstrução Gaúcha (SERG) / SPGG (gestão predial)` | Apr. p.1,41 |
| 1.3 | Período | `2026 — data-base dez/2025 — prazo 30 anos` | Apr. p.16 / XLSM |
| 1.4 | Processo PROA/SEI | `Não identificado nos documentos (estruturação BNDES OCS 330/2024)` | — |
| 1.5 | Responsável | `Estruturação: BNDES / Consórcio RECAFF` | VfM p.41 |
| 1.6 | Data | `23/06/2026` (ou a data da gravação) | — |
| 1.7 | Observações (capa) | `Modalidade: Concessão Administrativa (Lei 11.079/2004). Objeto: reforma, equipagem, operação e manutenção do CAFF + receitas acessórias. Deliberação CGCPPP 17/03/2026.` | Apr. p.4,16 |

**[OBS]** Diga no vídeo que o **PROA/SEI não consta** nos documentos — registrar a lacuna é parte da boa prática (não inventar).

---

## PASSO 2 — MÓDULO 01 (PSC / Custo Público atual)

> Aqui entra o **custo ATUAL** do Estado operando o CAFF. **Atenção:** o "PSC" do estudo de VfM **não** é o custo atual — é um comparador de ciclo de vida (vai no M5). Diga isso no vídeo.

### 2.1 Cabeçalho
- **[ONDE]** Exercício de referência → **[DIGITAR]** `2025 (data-base dez/2025)`.
- **[ONDE]** Período abrangido → `Custo anual atual de operação do CAFF`.
- Demais campos de identificação já vêm da tela Início.

### 2.2 Tabela CAT B — OPEX (clique em "adicionar linha" para cada item)

| Item de Custo | Modalidade | Valor anual (R$) | Fonte / Obs | [FONTE] |
|---|---|---|---|---|
| `Operação e manutenção atual do CAFF (limpeza, segurança, manutenção predial, utilidades, zeladoria)` | Administração Indireta | `30950000` | `XLSM '00. PAINEL' G28 = R$ 30,95 mi (R$ 294/m²)` | XLSM G28/G29 |
| `Locação de imóvel externo — SEDUC/RS` | Contrato Licitado | `2805794` | `XLSM '12. Affordability' D30` | XLSM D30 |
| `Locação de imóvel externo — SPGG/RS (1)` | Contrato Licitado | `650629` | `XLSM '12' D34` | XLSM D34 |
| `Locação de imóvel externo — SPGG/RS (2)` | Contrato Licitado | `619733` | `XLSM '12' D38` | XLSM D38 |

### 2.3 CAT A (CAPEX), CAT C (Gestão), CAT D (Receitas)
- **[OBS]** Não há dado desagregado do modelo ATUAL. Crie **uma linha** em cada com valor `0` e observação:
  - CAPEX: `Não identificado nos documentos (o CAPEX de R$ 1,33 bi é do PROJETO da PPP, não do modelo atual).`
  - Gestão: `Inferência técnica — modelo atual gere até 18 contratos (VfM p.31); custo não quantificado.`
  - Receitas: `Não identificado valor atual de receitas acessórias.`

### 2.4 Premissas e Limitações (adicionar 3)
1. Tipo **Limitação**: `Documentos não trazem o custo da prestação atual desagregado; só o OPEX agregado (R$ 30,95 mi/ano).`
2. Tipo **Premissa**: `O 'PSC' do estudo de VfM é comparador de ciclo de vida (30 anos), não o custo atual.`
3. Tipo **Estimativa**: `Aluguéis externos (~R$ 4,08 mi/ano) deixam de existir após a centralização no CAFF.`

---

## PASSO 3 — MÓDULO 02 (Matriz de Riscos)

### 3.1 Aba "Identificação"
| [ONDE INSERIR] | [O QUE DIGITAR/SELECIONAR] | [FONTE] |
|---|---|---|
| Nome do Projeto | `Concessão Administrativa do CAFF` | — |
| Órgão/Secretaria | `SERG / SPGG` | Apr. |
| **Setor** | selecionar **`Outro (sem ajustes setoriais)`** | — (edificação administrativa) |
| **Modalidade** | selecionar **`Concessão Administrativa (PPP)`** | VfM p.4 |
| Valor estimado | `1.332.300.000,00` | Apr. p.18 |
| Prazo (anos) | `30` | Apr. p.16 |
| Objeto sintético | `Reforma, equipagem, operação e manutenção do CAFF + receitas acessórias` | VfM p.4 |
| **Fase atual** | selecionar **`Modelagem técnica/jurídica/financeira`** | Apr. p.38 |

### 3.2 Aba "Matriz de Riscos"
**[OBS]** O contrato tem **Matriz de Risco própria (Anexo VII)**, que **não foi fornecida**. Então **mantenha a alocação típica** sugerida pela ferramenta (não altere os botões Público/Compartilhado/Privado) e use o campo **Mitigação** para registrar o que os documentos comprovam. Sugestão de mitigações (digitar no 1º item de cada risco):

- **R03 Ambiental:** `Licenciamento e diretrizes no Anexo V; passivos pós-obra transferidos ao privado (VfM p.13-14).`
- **R04 Projeto / R05 Construção:** `Risco de projeto/construção transferido ao privado; remuneração só após Ordem de Operação; penalidades (Anexo VIII) (VfM p.13-15).`
- **R07 Operacional:** `Aferido pelo Verificador Independente; mecanismo de pagamento CME = CMMáx × FDISP × FID (FID 80-100%, trimestral, Anexo VI).`
- **R09 Financeiro:** `Risco de financiamento (recursos, juros, custo de capital) transferido ao privado (VfM p.13-14).`
- **R12 Força maior:** `Força maior natural (enchentes 2024) — compartilhado; diretrizes de resiliência (Apr. p.5-6).`
- **R13/R15 Político/Rescisão:** `Garantia pública FPE/RRF + vinculação de receitas (Anexo IX) (Apr. p.16,38).`
- **R16 Reversão:** `Reversibilidade do ativo em padrão de desempenho adequado (VfM p.16).`

### 3.3 Risco customizado (botão "Novo Risco")
- Título: `Resiliência climática / drenagem (pós-enchentes 2024)`
- Alocação típica: **Compartilhado** · Alocação proposta: **Compartilhado**
- Justificativa: `Evento de força maior natural recente (2024) com impacto no desenho do projeto.`
- Mitigação: `Diretrizes urbanísticas e projetuais específicas (Apr. p.5-6).`

**[FONTE riscos transferidos]** VfM p.13-14 (7 categorias: Projeto, Engenharia/Construção, Financiamento, O&M, Ciclo de vida, Ambientais, Econômico-financeiros).

---

## PASSO 4 — MÓDULO 03 (Precificação de Obras)

**[OBS importante]** Os documentos **não trazem orçamento analítico, composições, BDI nem ART/RRT**. Preencha o que há (capa, identificação, métricas globais e síntese) e **marque o restante como lacuna**. Diga isso no vídeo.

### 4.1 Aba "Capa"
- Obra/Projeto: `Concessão Administrativa do CAFF`
- Órgão: `Estado do RS / SERG` · Responsável: `CAGE/SEFAZ-RS (análise)` · Data início: `23/06/2026` · Versão: `1.0`

### 4.2 Aba "Identificação"
| [ONDE] | [DIGITAR/SELECIONAR] | [FONTE] |
|---|---|---|
| Objeto resumido | `Retrofit do CAFF/SEDUC/DAER + construção de PGE, garagens e áreas comerciais, equipagem e operação` | Apr. p.4 |
| Natureza | **`Obra mista`** | — |
| Área estimada (m²) | `257792` | Apr. p.26 |
| Valor total da obra (R$) | `1332300000` | Apr. p.18 |
| Prazo de execução | `72 meses (3 fases)` | Apr. p.27 |
| Localização | `Porto Alegre/RS` | — |
| Fase | **`Modelagem PPP`** | — |
| Data-base dos preços | `dez/2025` | XLSM |
| ART/RRT | **`Não informado`** + detalhe: `ART/RRT da precificação não identificada nos documentos.` | — |

### 4.3 Aba "Componentes" → 4.1 Métricas globais
| Métrica | Valor | Ref. / Obs | [FONTE] |
|---|---|---|---|
| Valor total da obra (R$) | `1332300000` | `CAPEX total do projeto` | Apr. p.18 |
| Área total (m²) | `257792` | — | Apr. p.26 |
| Custo por m² (R$/m²) | `5700` | `Abaixo da média de benchmark (13.070)` | Apr. p.18 |
| BDI / contingência / encargos | **deixar vazio** | `Não identificado nos documentos` | — |

### 4.4 Aba "Síntese" (7.4 Parecer global)
- Parecer: selecionar **`Parcialmente consistente — requer complementação`**.
- **[OBS]** Justifique: há benchmark robusto, mas falta orçamento analítico/BDI/ART para auditar a precificação.

---

## PASSO 5 — MÓDULO 04 (Checklist de Custos PPP)

### 5.1 Setores aplicáveis
- Marque **somente** o checkbox **`Edificações / Facilities`** (CAFF é complexo administrativo). Deixe os demais desmarcados.

### 5.2 Itens com evidência (para cada: Aplicável? + Valor + Status + Anotação)
> Bloco **C — Operação**, **D — Governança**, **F — Fiscais** e setorial **Edificações** são os mais relevantes.

| Item | Aplicável? | Valor (R$) | Status | Anotação | [FONTE] |
|---|---|---|---|---|---|
| **C.1 Contraprestação pública** | Sim | `262300000` | Quantificado | `R$ 262,3 mi/ano (R$ 21,86 mi/mês)` | XLSM G38 / Apr. p.4 |
| C.2 Aportes públicos | Não | — | Identificado | `n.a. para o CAFF (benchmark Apr. p.26)` | Apr. p.26 |
| C.3 Subsídios tarifários | N/A | — | — | `Concessão administrativa, sem tarifa de usuário` | — |
| **D.1 Equipe pública de gestão contratual** | Sim | `453400` | Quantificado | `R$ 453,4 mil/ano (VPL R$ 4,9 mi). 5 cargos` | VfM Tab.2 p.21 |
| **D.2 Verificador/certificador independente** | Sim | — | Identificado | `Previsto (Anexo IV/X); relatórios trimestrais. Custo não isolado` | Apr. p.17 |
| D.3 Monitoramento de KPIs | Sim | — | Identificado | `Sistema de Mensuração de Desempenho (Anexo IV; índice ID)` | Apr. p.17 |
| **A.1–A.8 Estruturação** | Sim/Parcial | — | Identificado | `Estruturação BNDES (OCS 330/2024); licitação na B3; consulta pública jun/2026` | VfM p.26 / Apr. p.27,40 |
| B.1 Desapropriações | Não | — | Identificado | `Terreno público existente — sem desapropriação relevante` | Apr. p.4,8 |
| B.2 Licenciamento ambiental | Sim | — | Identificado | `Diretrizes no Anexo V; risco transferido ao privado` | Apr. Anexo V |
| **B.6 Ocupação temporária de imóveis** | Sim | `4080000` | Estimado | `Aluguéis externos ~R$ 4,08 mi/ano durante obras (VfM p.29-30: R$ 16,3 mi VP no atraso)` | XLSM / VfM |
| **F.1 Neutralidade competitiva** | Sim | `462410000` | Quantificado | `Ajuste tributário −R$ 462,4 mi VP (PIS/COFINS/ISS/IRPJ/CSLL)` | XLSM G15 |
| F.2 Taxa de desconto do Estado | Sim | — | Identificado | `TSD 8,5% real (VfM p.18)` | VfM p.18 |
| **F.3 Fundo garantidor / garantia pública** | Sim | — | Identificado | `FPE como garantia subsidiária + RRF` | Apr. p.38 |
| **F.5 Impacto orçamentário / LRF** | Sim | — | Quantificado | `Comprometimento 0,49% da RCL (limite 5%)` | VfM Tab.4 |
| F.8 Encerramento e reversão de bens | Sim | — | Identificado | `Reversibilidade do ativo ao Estado (VfM p.16)` | VfM p.16 |
| Edi.1 Realocação de servidores | Sim | — | Identificado | `Durante o faseamento das obras` | Apr. |
| Edi.2 Aluguel de imóveis temporários | Sim | `4080000` | Estimado | `Ver B.6` | XLSM |
| Edi.7 Ocupação de imóveis do Estado cedidos | Sim | — | Identificado | `Custo de oportunidade do terreno público (122.051 m²)` | Apr. p.26 |

> Os demais itens (E — riscos/contingências; itens "parciais") podem ser marcados **Parcial / pendente** com a anotação correspondente do `20_checklist_custos_estado.csv`. **[OBS]** O resumo no topo soma automaticamente os valores dos itens "Sim/Parcial".

---

## PASSO 6 — MÓDULO 05 (Evidência Comparativa / VfM) — **o mais importante**

### 6.1 Md1 — Identificação e parâmetros
| [ONDE] | [DIGITAR/SELECIONAR] | [FONTE] |
|---|---|---|
| Secretaria/Órgão | `SERG / SPGG` | Apr. |
| Nome do serviço/objeto | `Concessão Administrativa do CAFF` | — |
| Exercício de referência | `2026` | — |
| Prazo do contrato (anos) | `30` | Apr. p.16 |
| **Modalidade comparada** | **`PPP Administrativa (Lei 11.079/2004)`** | VfM p.4 |
| Data-base | `dez/2025` | XLSM |
| Escopo atual (Estado) | `Operação/manutenção predial via múltiplos contratos (até 18 fornecedores); servidores em imóveis alugados externos` | VfM p.31 |
| Escopo PPP | `Retrofit, ampliação, equipagem, operação e manutenção integradas por concessionária única + receitas acessórias` | Apr. p.4 |
| **TSD (%)** | `8.5` | VfM p.18 |
| **Sobrecusto de obras (%)** | `25` | VfM p.27 |
| **Eficiência comercial pública (%)** | `65` | VfM p.40 (cenário-base) |
| Responsável | `Estruturação BNDES / Consórcio RECAFF` | VfM p.41 |
| Data | `23/06/2026` | — |

### 6.2 Md2 — Consolidação VPL (campos no fim da aba PSC)
| [ONDE INSERIR] | [O QUE DIGITAR] | [FONTE] |
|---|---|---|
| **VPL PSC Bruto (R$)** | `1606320000` | XLSM G19 |
| **VPL PSC Ajustado (R$)** | `1904670000` | XLSM G24 |
| **VPL Custo da PPP (R$)** | `1716200000` | XLSM G16 |

**[OBS]** A ferramenta calcula sozinha: **VfM = PSC Ajustado − PPP = R$ 188,5 mi**. Confirme que o painel mostra esse valor.

### 6.3 Md4 — Melhorias qualitativas (botão "adicionar melhoria" — criar 8 cards)
> Para cada card: **Denominação**, **Relevância** (radio), **Evidência** (radio), **Justifica pagar mais?** (radio).

| Denominação | Relevância | Evidência | Justifica? | [FONTE] |
|---|---|---|---|---|
| `Transferência de riscos ao parceiro privado` | Crítica | Robusta | Sim | VfM p.13-14 |
| `Garantia de qualidade (indicadores + Verificador Independente + penalidades)` | Crítica | Robusta | Sim | VfM p.15 / Apr. p.17 |
| `Celeridade na entrega (remuneração só após operação)` | Alta | Robusta | Sim | VfM p.11,15 |
| `Alocação eficiente (contrato único vs até 18 contratos)` | Alta | Moderada | Sim | VfM p.16,31 |
| `Reversibilidade do ativo` | Alta | Moderada | Parcial | VfM p.16 |
| `Modernização da infraestrutura administrativa` | Alta | Moderada | Parcial | Apr. p.5 |
| `Resiliência climática (pós-enchentes 2024)` | Alta | Moderada | Sim | Apr. p.5-6 |
| `Requalificação urbana (abertura à cidade)` | Média | Moderada | Parcial | Apr. p.4-6 |

**[OBS]** Ao classificar, a ferramenta calcula a "força do argumento". Com ≥3 essenciais + evidência robusta/moderada, sai **FORTE**.

### 6.4 Md6 — Questões-chave (Q1 a Q5)
- **Q1:** `A PPP NÃO custa mais: a valor presente a contratação tradicional custa R$ 1.904,7 mi e a PPP R$ 1.716,2 mi — VfM positivo de R$ 188,5 mi (~9,9%).`
- **Q2:** `Predominantemente essenciais: transferência de riscos, qualidade aferida e celeridade.`
- **Q3:** `Sim — atacam falhas reais: gestão fragmentada (18 contratos), atraso histórico (iPrazo RS 3,27), dispersão de secretarias, vulnerabilidade pós-2024.`
- **Q4:** `Sim — indicadores, Verificador Independente, penalidades, mecanismo CME=CMMáx×FDISP×FID e benchmarks de 4 centros administrativos.`
- **Q5:** `Sim — estudo de VfM e apresentação ao CGCPPP fundamentam; VfM positivo mesmo na sensibilidade (R$ 174 a 192,7 mi).`

### 6.5 Md7 — Conclusão
- **VfM Quantitativo:** `Positivo: R$ 188,5 mi (modelo 16/03) / R$ 192,7 mi (Produto 10).`
- **Diferencial de preço:** `PPP ~9,9% mais barata em VPL.`
- **Fundamentação pelo gestor:** selecionar **`Plenamente fundamentado — maioria das melhorias é Essencial com evidência Robusta/Moderada`**.
- **Conclusão (texto):** `O projeto apresenta Value for Money positivo e robusto: a PPP custa menos que a execução pública tradicional a valor presente e agrega ganhos qualitativos essenciais (riscos, qualidade aferida por Verificador Independente, celeridade e integração). Recomenda-se conciliar a divergência entre o Produto 10 (192,7 mi) e o modelo/apresentação (188,5 mi) antes do edital.`
- **Ressalvas (7.3):** registrar: custo atual não desagregado; algumas melhorias sem mensuração direta; garantias/mecanismo de pagamento dependem das minutas; parâmetros sensíveis (TSD/sobrecusto/eficiência); conciliar versões do VfM.

---

## PASSO 7 — Tela RELATÓRIOS (gerar o PDF)

1. Abra a tela **Relatórios**.
2. Selecione os módulos a anexar (M1 a M5).
3. Revise a **capa institucional** (puxa os dados da tela Início).
4. Gere o **PDF unificado** (recomendado). Se sair cortado, use o **modo sequencial** e combine depois.
5. **[OBS]** A combinação no modo sequencial é manual (Acrobat/PDFsam/qpdf).

---

## AVISOS PARA NARRAR NO VÍDEO (resumo das ressalvas)

1. **Divergência do VfM:** R$ 192,7 mi (Produto 10, 10/03) × **R$ 188,5 mi** (modelo 16/03 e apresentação 17/03). Usei a versão mais recente; conciliar antes do edital.
2. **"PSC" ≠ "custo atual":** o PSC do estudo é comparador de ciclo de vida; o custo atual desagregado não consta (só OPEX R$ 30,95 mi/ano).
3. **Anexos do contrato (IV–X) não foram fornecidos** — Matriz de Risco (VII) não detalhada.
4. **Precificação da obra não auditável** (sem orçamento analítico/BDI/ART) — M3 fica parcial.
5. **RCL de referência divergente** (65.233 × 56.500 mi) — afeta o % de comprometimento.
6. **Cenário híbrido** (obra privada + operação pública) custa menos (R$ 1.644,0 mi) — qualifica a decisão.
7. **Nunca inventar dado:** onde não há evidência, registrar "não identificado nos documentos".

> Valores prontos e fontes detalhadas também em: `05_matriz_evidencias.csv`, `20_checklist_custos_estado.csv`, `21_matriz_melhorias_qualitativas.csv` e nos JSON de preenchimento (`17_preenchimento_final.json`).
