# 12 — Revisão Ciclo 3: Econômico-Financeira e VfM

**Objetivo:** revisar consistência dos dados financeiros e do Value for Money; verificar se o VfM contempla os custos da modalidade PPP e se o comparador público é coerente; identificar custos ausentes ou subestimados.
**Entrada:** `11_preenchimento_v3.json` → **Saída:** `13_preenchimento_v4.json`

---

## 1. Revisão dos componentes (valores em R$ milhões, VPL @ TSD 8,5%, modelo 16/03)

### Custo da PPP = R$ 1.716,2
| Componente | Valor | Verificação |
|---|---|---|
| Contraprestação (VPL) | 2.173,7 | XLSM `12.` G13 |
| (+) Gestão contratual | 4,9 | G14 |
| (−) Neutralidade competitiva | −462,4 | G15 (tributos PPP) |
| **= Custo PPP** | **1.716,2** | G16 ✅ |

### PSC (contratação tradicional) = R$ 1.904,7
| Componente | Valor | Verificação |
|---|---|---|
| Investimentos + Despesas (PSC bruto) | 1.606,3 | G19 |
| (+) Aditivos contratuais (sobrecusto 25%) | 401,6 | G20 |
| (+) Custo de transação (18 contratos) | 1,5 | G21 |
| (+) Atraso de obras (iPrazo 3,27) | 16,3 | G22 |
| (−) Obtenção de receitas acessórias | −121,0 | G23 |
| **= Custo Contratação Tradicional** | **1.904,7** | G24 ✅ |

### **VfM = 1.904,7 − 1.716,2 = R$ 188,5 mi (≈9,9%)** ✅

## 2. Checklist econômico-financeiro

| Item | Situação | Observação |
|---|---|---|
| CAPEX | ✅ | R$ 1,33 bi (R$ 5,7 mil/m²); abaixo do benchmark (13,07) |
| OPEX | ✅ | R$ 80,6 mi/ano (total) / 58,7 obrigatório |
| Reinvestimentos | ✅ | R$ 256,4 mi (incluídos no CAPEX total) |
| Receitas | ✅ | Acessórias R$ 41,3 mi/ano; VPL no PSC R$ 121,2 mi (fator 65–75%) |
| Contraprestações | ✅ | R$ 262,3 mi/ano (máx.) |
| Aportes | ⚠️ | **n.a.** (benchmark indica ausência de aporte) — confirmar no edital |
| Garantias | ✅ | FPE/RRF + vinculação de receitas (Anexo IX) |
| Taxa de desconto | ✅ | TSD 8,5% (VfM); WACC 10,23% (viabilidade privada) — não confundir |
| Fluxo de desembolsos do Estado | ✅ | Contraprestação + gestão contratual |
| Custos diretos/indiretos do Estado | ✅ | Quantificados: gestão R$ 453,4 mil/ano; neutralidade −462,4 mi |

## 3. Atenção especial — custos imputáveis ao Estado (síntese; detalhe em `20`)

| Custo | Contemplado? | Valor/observação |
|---|---|---|
| Desapropriações | **Não** (terreno público) | R$ 0 estimado |
| Licenciamento ambiental | Parcial | Anexo V; risco transferido |
| Reassentamentos | Não aplicável | — |
| Fiscalização / gestão contratual | **Sim** | R$ 453,4 mil/ano (VPL 4,9 mi) |
| Verificador independente | **Sim** | Custo não isolado — **subestimação potencial** |
| Consultorias (estruturação) | Parcial | BNDES/RECAFF; sem valor isolado |
| Seguros | Não (do privado) | Expurgados do PSC |
| Garantias públicas | **Sim** | FPE/RRF |
| Aportes públicos | Não | — |
| Contraprestações | **Sim** | R$ 262,3 mi/ano |
| Receitas acessórias | **Sim** | exploradas pela PPP / no PSC (70%) |
| Subsídios | Não aplicável | concessão administrativa |
| Custos de transição | **Sim** | faseamento; aluguéis externos durante obras |
| Custos de gestão contratual | **Sim** | ver acima |
| Reequilíbrio | Sim (contingente) | Anexo VI/VII |
| Encerramento / bens reversíveis | Sim | reversibilidade (VfM p.16) |
| Contingências fiscais | Sim | comprometimento 0,49% da RCL |

## 4. Custos potencialmente ausentes ou subestimados

1. **Verificador Independente:** previsto, mas **não destacado no fluxo de custos** do PSC nem da gestão do Estado — possível subestimação.
2. **Custo de monitoramento de KPIs / SMD:** não isolado.
3. **Gestão pública remanescente** (atividades-fim das secretarias): não quantificada.
4. **Passivos ambientais pré-existentes:** retidos pelo Estado, sem provisão explícita.
5. **Custo de oportunidade do terreno público** cedido à PPP (122.051 m²): registrado qualitativamente (M4 Edi.7).

## 5. Verificações de coerência do VfM

- ✅ O VfM **contempla os custos exclusivos da PPP** (gestão contratual + ajuste de neutralidade competitiva).
- ✅ O comparador público (PSC) parte do **mesmo orçamento da PPP** (boa prática CP3P), com expurgo de itens exclusivos da PPP (SPE, seguros/garantias, verificador, remuneração de estudos/B3).
- ✅ O VfM é **robusto** na análise de sensibilidade (R$ 174,0–192,7 mi).
- ⚠️ O **cenário híbrido** (obra privada + operação pública) resulta em custo **menor** (R$ 1.644,0 mi) que a PPP completa — o próprio estudo reconhece que parte do ganho vem da execução privada do investimento; isso merece destaque na decisão (não invalida o VfM principal, mas qualifica-o).

## 6. Ações executadas

- Detalhada a decomposição de PPP e PSC nas ressalvas do M5 (`res4`).
- Reforçadas as notas quantitativas no M4 (gestão D.1, affordability F.5, atraso B.6, transação A.6).

**Conclusão do ciclo 3:** dados financeiros **consistentes e rastreáveis**; VfM positivo e robusto; alertas de subestimação (verificador, monitoramento) e do cenário híbrido registrados.
