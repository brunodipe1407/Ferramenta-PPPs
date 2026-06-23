# 16 — Revisão Ciclo 5: Auditabilidade, Clareza e Relatório

**Objetivo:** produzir versão final consistente, rastreável e útil para a tomada de decisão.
**Entrada:** `15_preenchimento_v5.json` → **Saída:** `17_preenchimento_final.json` (+ `18_relatorio_final.md`, `19_sumario_executivo.md`)

---

## 1. Revisão de linguagem e padronização de termos

- Padronizados: "Poder Concedente / Estado do RS"; "contraprestação"; "VPL"; "TSD"; "PSC"; "Value for Money (VfM)".
- Unidades padronizadas: valores monetários em **R$ milhões** nos relatórios e em **R$ (reais)** nos JSON (formato esperado pela ferramenta).
- Eliminadas redundâncias entre módulos (a decomposição do VfM aparece uma vez no M5 e é referenciada nos demais).

## 2. Coerência entre campos (cross-check final)

| Verificação | Resultado |
|---|---|
| Prazo igual em M2, M3, M5 | ✅ 30 anos |
| Modalidade igual em todos | ✅ Concessão Administrativa |
| Contraprestação M4 = XLSM | ✅ R$ 262,3 mi/ano |
| VfM M5 = decomposição do ciclo 3 | ✅ R$ 188,5 mi |
| Melhorias M5 = `21_matriz_melhorias_qualitativas.csv` | ✅ 9 melhorias |
| Custos do Estado M4 = `20_checklist_custos_estado.csv` | ✅ 45 itens cobertos |

## 3. Consolidação de lacunas

1. Memória de custo da prestação **atual** desagregada (M1).
2. **Anexos contratuais IV–X** (Matriz de Risco, Mecanismo de Pagamento, SMD, Licenciamento, Penalidades, Garantias, Terceiros Independentes).
3. **Orçamento analítico da obra**, composições, BDI e ART/RRT (M3).
4. **Número do processo PROA/SEI**.
5. Custo isolado do **Verificador Independente** e do **monitoramento de KPIs**.
6. Valor da **remuneração de estudos / B3**.

## 4. Consolidação de alertas

1. **Divergência do VfM** (192,7 mi no Produto 10 × 188,5 mi no modelo/apresentação) — conciliar antes do edital.
2. **RCL de referência** divergente (65.233 × 56.500 mi) — afeta o % de comprometimento.
3. **Cenário híbrido** mais barato que a PPP completa — qualifica a decisão.
4. **Verificador/monitoramento** possivelmente subestimados.
5. **Aporte público** marcado "n.a." — confirmar no edital.

## 5. Pontos para validação humana (consolidado)

Ver lista objetiva no `18_relatorio_final.md` (seção 17) e no `19_sumario_executivo.md`. Cada ponto tem responsável sugerido e recomendação.

## 6. Status final do preenchimento

Acrescentado ao JSON final (`_meta.status_validacao`):
> **"Adequado com ressalvas"** — preenchimento rastreável; pendências: conciliar versões do VfM, obter orçamento analítico da obra (M3) e detalhar a matriz de risco do Anexo VII.

## 7. Saídas geradas

- `17_preenchimento_final.json` — versão final do preenchimento (6 chaves de `localStorage`).
- `18_relatorio_final.md` — relatório final (19 seções).
- `19_sumario_executivo.md` — sumário executivo.

**Conclusão do ciclo 5:** entrega final consistente, padronizada e auditável; todas as lacunas, divergências e pendências de validação humana consolidadas.
