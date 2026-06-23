# 10 — Revisão Ciclo 2: Aderência Documental

**Objetivo:** garantir que cada campo preenchido esteja aderente ao PDF e/ou XLSM; validar páginas, abas e células; registrar divergências.
**Entrada:** `09_preenchimento_v2.json` → **Saída:** `11_preenchimento_v3.json`

---

## 1. Conferência valor a valor (amostra crítica)

| Campo | Valor preenchido | Fonte conferida | OK? |
|---|---|---|---|
| Prazo | 30 anos | apr. p.16 / XLSM `00.` G10 | ✅ |
| TSD | 8,5% real | VfM PDF p.18 / XLSM `12.` G7-G8 | ✅ |
| OPEX atual CAFF | R$ 30,95 mi/ano | XLSM `00.` **G28** (R$ 294/m² em G29) | ✅ |
| Contraprestação mensal | R$ 21,86 mi | apr. p.4 / XLSM `00.` G33 | ✅ |
| Contraprestação anual | R$ 262,3 mi | XLSM `00.` G38 | ✅ (PDF: 262,0 — ver div.) |
| Gestão contratual | R$ 453,4 mil/ano | VfM PDF Tab.2 p.21 / XLSM `12.` G14 | ✅ |
| Neutralidade | −R$ 462,4 mi | XLSM `12.` G15 | ✅ (PDF: −459,1) |
| Custo PPP / PSC / VfM | 1.716,2 / 1.904,7 / 188,5 | XLSM `12.` G16/G24/G27 | ✅ (PDF difere) |
| Comprometimento RCL | 0,49% | VfM PDF Tab.4 / XLSM `00.` G47 | ✅ |
| iPrazo RS | 3,27 | VfM PDF p.28 | ✅ |
| Custo licitação | R$ 28.918,40 | VfM PDF p.31 / XLSM `12.` D18 | ✅ |

## 2. Divergências PDF × XLSM (registradas, não apagadas)

### Divergência principal — **resultado do VfM (versões do modelo)**
- **Produto 10 (PDF, 10/03/2026):** PSC **1.937,4** / PPP **1.744,7** → **VfM R$ 192,7 mi**.
- **Modelo XLSM (16/03/2026) e Apresentação CGCPPP (17/03/2026):** PSC **1.904,7** / PPP **1.716,2** → **VfM R$ 188,5 mi**.
- **Fonte mais adequada:** o **modelo XLSM (16/03)**, por ser a versão mais recente e coerente com a apresentação deliberativa ao Conselho Gestor. A diferença decorre de atualização do modelo entre 10/03 e 16/03 (todos os componentes — invest., aditivos, neutralidade — recuaram levemente).
- **Ação:** divergência inserida no campo `res5` (ressalvas) do M5 e replicada nos relatórios.

### Divergências menores
- **Contraprestação anual:** 262,0 (PDF Tab.1) × 262,3 (XLSM G38) → arredondamento. Registrado na nota do item C.1 do M4.
- **RCL de referência:** 65.233 mi (PDF Tab.4) × 56.500 mi (XLSM I99). Afeta o % de comprometimento (0,49% × 0,46%). **Pendência de validação humana.**
- **CAPEX:** R$ 1,33 bi (apr.) × R$ 1.291,6 mi invest. total (XLSM G21) × R$ 1.115,6 mi obrigatório (G12) → perímetros distintos (com/sem reinvestimentos e receitas acessórias).
- **OPEX:** R$ 80,6 mi/ano total (apr.) × R$ 58,7 mi obrigatório (XLSM G23) → perímetros distintos.

## 3. Ações executadas

- Inseridas as divergências nos campos correspondentes (`res5` do M5; notas dos itens C.1 e do M1).
- Validadas as **células exatas** (G28, G38, G14, G15, G16, G24, G27) e **páginas** das fontes na `05_matriz_evidencias.csv`.
- Corrigidas referências ambíguas: explicitado que o "PSC" do estudo **não** é o custo atual (é comparador de ciclo de vida).

**Conclusão do ciclo 2:** preenchimento **aderente às fontes**; todas as divergências explicitadas com indicação da fonte preferível, sem supressão das inconsistências.
