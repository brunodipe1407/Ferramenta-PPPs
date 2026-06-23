# 08 — Revisão Ciclo 1: Completude

**Objetivo:** identificar campos vazios, lacunas de informação e campos preenchidos sem evidência.
**Entrada:** `06_preenchimento_v1.json` → **Saída:** `09_preenchimento_v2.json`

---

## 1. Verificação dos campos obrigatórios

| Módulo | Obrigatórios | Situação |
|---|---|---|
| Início/Capa | Projeto, Órgão | ✅ Preenchidos (PROA/SEI = **não localizado**, registrado) |
| M1 | Identificação, ≥1 linha de custo | ✅ OPEX atual (R$ 30,95 mi/ano) + aluguéis externos |
| M2 | Nome, Setor, Modalidade | ✅ (setor "outro" — edificação administrativa) |
| M3 | Identificação, Metodologia, Análise Crítica | ⚠️ Parcial — falta orçamento analítico (lacuna documental real) |
| M5 | m1-sec, m1-nome, m1-ano, m1-resp, m1-data, r-conclusao | ✅ Todos preenchidos |

## 2. Lacunas reais identificadas (mantidas e marcadas)

1. **M1 — CAPEX/Gestão/Receita atuais não desagregados.** Os documentos só trazem o OPEX agregado atual do CAFF (R$ 30,95 mi/ano). CAPEX e receita atuais → **"não identificado"**. Custo de gestão atual → **inferência técnica** (até 18 contratos).
2. **M3 — Sem orçamento analítico, composições, BDI ou ART/RRT.** Precificação só auditável por benchmark. Lacuna estrutural.
3. **Anexos do contrato (IV–X) não fornecidos** — Matriz de Risco (VII), Mecanismo de Pagamento (VI), SMD (IV), etc.
4. **Processo PROA/SEI** não consta nos documentos.

## 3. Ações executadas

- Completado `periodoAbrang` do M1 (exercício 2025, custo anual de operação atual).
- Garantido que **todo item do M4 com `aplicável ∈ {sim, parcial}` tenha `status`** (preenchido como "pendente" quando não havia).
- Acrescentada a contraprestação **mensal** (R$ 21,86 mi) à nota do item C.1 do M4.
- Reforçado o vínculo de período do M5 ao Produto 10.
- **Nenhum preenchimento sem suporte documental foi mantido** — itens sem evidência permanecem com valor 0 e nota "não identificado" ou "inferência técnica".

## 4. Cobertura de preenchimento (v2)

| Bloco | Preenchido | Parcial/Inferência | Lacuna |
|---|---|---|---|
| Identificação | ● | | PROA/SEI |
| Custo atual do Estado (M1) | OPEX + aluguéis | Gestão (inferência) | CAPEX/receita atuais |
| Riscos (M2) | Identificação + alocação típica | Justificativas por categoria | Detalhe do Anexo VII |
| Precificação (M3) | Métricas globais | Síntese/benchmark | Orçamento analítico/BDI |
| Custos do Estado (M4) | 55 dos 87 itens com evidência | itens "parcial/pendente" | itens setoriais não-edificação (n/a) |
| VfM (M5) | Núcleo completo | melhorias acessórias | — |

**Conclusão do ciclo 1:** preenchimento **completo no que há evidência**; lacunas reais marcadas explicitamente, sem invenção de dados.
