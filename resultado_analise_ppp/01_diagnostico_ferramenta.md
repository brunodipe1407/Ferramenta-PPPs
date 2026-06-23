# 01 — Diagnóstico da Ferramenta

**Projeto analisado:** Concessão Administrativa do Centro Administrativo Fernando Ferrari (CAFF) — Estado do RS
**Ferramenta:** Ferramentas de Análise PPP — CAGE/SEFAZ-RS (repositório `brunodipe1407/Ferramenta-PPPs`)
**Data do diagnóstico:** 23/06/2026

---

## 1. Resumo da arquitetura

A ferramenta é uma **aplicação web 100% estática** (HTML + CSS + JavaScript puro, sem framework, sem build, sem backend). Roda inteiramente no navegador; não há login, servidor de aplicação nem banco de dados. A persistência é feita no **`localStorage` do navegador** (cada usuário/navegador é uma instância isolada).

**Estrutura de arquivos principais:**

| Arquivo | Papel |
|---|---|
| `index.html` (≈126 KB) | Tela **Início** (identificação do projeto) + tela **Relatórios** (capa + exportação) + *shell* que embute os módulos via `<iframe>` |
| `m1-psc-custo.html` (≈62 KB) | **Módulo 01 — PSC / Custo Público** (custo público anual do modelo atual) |
| `m2-matriz-riscos.html` (≈130 KB) | **Módulo 02 — Matriz de Riscos** (alocação Público/Compartilhado/Privado) |
| `m3-precificacao.html` (≈102 KB) | **Módulo 03 — Precificação de Obras** (análise crítica de orçamento/BDI) |
| `m4-checklist-custos.html` (≈211 KB) | **Módulo 04 — Checklist de Custos PPP** (87 itens transversais e setoriais) |
| `m5-vfm.html` (≈135 KB) | **Módulo 05 — Evidência Comparativa (VfM)** (PSC × PPP, Value for Money) |
| `comum.css`, `padrao-visual.css` | Estilos |
| `assets/` | Logotipos e imagens |
| `referencias/` | Planilhas Excel canônicas que originaram os módulos |
| `docs/CONTRATO_SHELL.md` | Documentação do *bridge* shell↔módulos |

**Bridge (comunicação shell ↔ módulos):** via `postMessage`. Mensagens: `gtsefaz_save`, `gtsefaz_clear`, `gtsefaz_projeto_set`, `gtsefaz_projeto_request`, `gtsefaz_goto`, `gtsefaz_subtab_changed`; respostas `gtsefaz_saved`, `gtsefaz_projeto`. Em modo embutido (`?embed=1`), os campos de identificação ficam *read-only* e são sincronizados a partir da tela Início.

**Fundamentação normativa:** Lei 11.079/2004 (PPP), Lei 14.133/2021, Lei estadual RS 12.234/2005, Decretos RS 53.495/2017 e 53.490/2017, MCASP, padrões TCE-RS.

---

## 2. Instruções de execução

A ferramenta **não requer dependências externas nem instalação**. Para uso:

1. **Online:** `https://brunodipe1407.github.io/Ferramenta-PPPs/`.
2. **Local:** basta abrir `index.html` num navegador (Chrome/Edge recomendados). Como os módulos são carregados em `<iframe>`, alguns navegadores bloqueiam `file://`; nesse caso, servir a pasta com um servidor estático simples:
   ```bash
   python3 -m http.server 8000   # depois abrir http://localhost:8000
   ```
3. **Fluxo:** Início (identificação) → M1…M5 → Relatórios (capa + PDF unificado ou sequencial).
4. **Persistência:** salva automaticamente em `localStorage` (debounce 500–600 ms). Botão "limpar" apaga os dados.

**Importante:** a ferramenta é interativa e dependente do navegador (DOM + `localStorage`). **Não há CLI nem API de importação/exportação de dados** — não é possível executá-la *headless* em servidor para preencher e gerar relatório de forma automatizada. Por isso, o preenchimento deste trabalho foi materializado em **arquivos JSON compatíveis com o formato interno de `localStorage`** (ver seção 5 e arquivos `06`/`09`/`11`/`13`/`15`/`17`).

---

## 3. Lista dos campos identificados (visão consolidada)

Detalhamento completo em **`02_matriz_campos.csv`**. Resumo por módulo:

- **Início / Capa:** Projeto, Órgão, Período, Processo PROA/SEI, Responsável, Data, Observações.
- **M1 — PSC/Custo Público:** cabeçalho (7 campos) + tabelas dinâmicas de **CAPEX, OPEX, Gestão, Receitas** (linhas `{item, modalidade, fonte, valor, observações}`) + **Premissas/Limitações** + totalizadores calculados (PSC bruto, por modalidade).
- **M2 — Matriz de Riscos:** identificação (12 campos) + **catálogo de referência de 16 categorias / 71 subcategorias** (R01–R16) com alocação típica embutida; por subcategoria: `{alocação, justificativa, mitigação, excluído}`; riscos customizáveis; ajustes setoriais (rodovias/saúde/educação/saneamento). **Não há campo de probabilidade×impacto** — é matriz de *alocação*.
- **M3 — Precificação de Obras:** 11 abas (Capa, Identificação, Metodologia, Referências, Componentes, Justificativa, Análise Crítica, Síntese, Relatório, Dashboard). Inclui métricas globais (valor, área, R$/m², **BDI manual**, contingência, encargos), 17 parcelas de custo, checklist crítico de 18 itens.
- **M4 — Checklist de Custos:** **87 itens** de custo (47 transversais A–F + 40 setoriais em 5 setores). Por item: `{aplicável, valor, status, anotações}`. Totalizadores automáticos.
- **M5 — Evidência Comparativa (VfM):** 7 sub-módulos (Identificação, PSC Bruto, Diagnóstico, Melhorias, Matriz de relevância, VfM, Conclusão). Parâmetros (TSD, sobrecusto, eficiência), VPLs (PSC bruto/ajustado/PPP), cards de melhorias qualitativas, 5 questões-chave, conclusão. VfM = VPL PSC Ajustado − VPL PPP (calculado).

---

## 4. Origem técnica dos campos

| Módulo | Chave de `localStorage` | Estrutura serializada (resumo) |
|---|---|---|
| Início / Capa | `gtsefaz_projeto_atual`, `gtsefaz_capa_*` | `{nome, orgao, periodo, proa, responsavel, data}` |
| M1 | `psc_cage_rs_v2` | `{header, rows:{capex,opex,gestao,receita}, premissas, confs}` |
| M2 | `matriz_riscos_ppp_rs_v1` | `{identificacao, riscos:{R01..R16:{sub:[…]}}, novos, filtroPill}` |
| M3 | `cage_rs_precificacao_obras_v1` | `{capa, identif, metod, refs, comps, justif, critic, sint, sintParecer}` |
| M4 | `checklist_cage_rs_v1` | `{header, setores, items:{<data-id>:{aplic,valor,status,nota}}}` |
| M5 | `vfm_cage_rs_v1` | `{_v, ts, fields:{byId, psc, ctTables}, mels, mc}` |

Os campos são gerados majoritariamente por **JavaScript** a partir de arrays/objetos de definição (ex.: `METODOLOGIAS`, `PARCELAS`, `NUCLEO_COMUM`, `AJUSTES_SETORIAIS`, listas de itens do checklist). Campos calculados (subtotais, % por modalidade, nível VfM, classificação do argumento) são derivados e **não** editáveis.

---

## 5. Observações sobre limitações de execução

1. **Sem execução headless / sem importação programática.** A ferramenta depende de DOM e `localStorage`; não expõe import/export de dados (apenas exportação visual de PDF). Logo, o preenchimento foi entregue como **JSON espelhando as chaves de `localStorage`** (carregável manualmente via console do navegador, p.ex. `localStorage.setItem('vfm_cage_rs_v1', JSON.stringify(obj))`).
2. **Persistência por navegador.** Não há sincronização entre máquinas/usuários.
3. **M2 não tem probabilidade×impacto.** É matriz de alocação (parte responsável), não de severidade.
4. **M3 não calcula BDI.** Os valores de BDI/encargos/contingência são entradas manuais; a ferramenta só valida soma de parcelas ≤ 100%.
5. **Persistência incompleta no M5.** Alguns campos dos *cards* de melhoria (texto livre) e os *chips* de modalidade **não** são serializados no `localStorage` (limitação real do código), embora os valores lógicos das melhorias (`rel/ev/just`) sejam preservados em `mels[]`.
6. **Combinação de PDF é manual** no modo sequencial.

---

## 6. Riscos de preenchimento incorreto

| Risco | Descrição | Mitigação adotada neste trabalho |
|---|---|---|
| **Confundir "custo atual" com "PSC"** | O M1 pede o **custo público atual anual**; o "PSC" do estudo de VfM é um **comparador de ciclo de vida** do projeto completo (30 anos). São coisas distintas. | Registrado expressamente em premissas do M1 e na conclusão do M5. |
| **Unidade monetária** | O modelo financeiro está em R$ milhões; a ferramenta espera **R$ (reais)**. | Conversão ×10⁶ aplicada nos JSON. |
| **Versão dos números do VfM** | Há divergência entre o Produto 10 (192,7 mi) e o modelo/apresentação (188,5 mi). | Divergência registrada e sinalizada (não apagada) em todos os artefatos. |
| **BDI/sobrecusto** | O sobrecusto de 25% aplica-se ao **PSC** (não ao orçamento da obra do M3). | Diferenciado nos campos. |
| **Campos não persistidos (M5)** | Texto dos cards pode se perder no recarregamento. | Conteúdo consolidado também em `mels[]` e nos relatórios. |
| **Setor no M2** | CAFF é edificação administrativa; não há ajuste setorial nativo. | Selecionado "outro" (sem ajustes setoriais). |
