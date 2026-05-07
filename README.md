# Ferramenta-PPPs
Consolidação dos 4 módulos elaborados
# Ferramentas de Análise PPP — CAGE/SEFAZ-RS

Conjunto de instrumentos de apoio à instrução de processos de **Parcerias Público-Privadas (PPP) e Concessões**, desenvolvido pela CAGE/RS no âmbito do **GT-PPPs** da **Secretaria da Fazenda do Rio Grande do Sul**.

> ⚠️ **Versão em fase de avaliação interna.** Este conjunto está em **teste piloto**. Os resultados produzidos pela ferramenta **não substituem** análise técnica fundamentada nem constituem manifestação oficial da CAGE-RS. Deve ser utilizado como instrumento auxiliar de organização e padronização das analises.

---

## Acesso

🔗 **Acesse em:** (https://brunodipe1407.github.io/Ferramenta-PPPs/)

A ferramenta roda inteiramente no navegador. Não há login, não há servidor de aplicação, não há banco de dados.

---

## O que é

Consolidação de quatro instrumentos articulados que subsidiam o início da análise de processos de PPP no âmbito do Estado do RS:

| # | Módulo | Finalidade |
|---|---|---|
| 01 | **PSC — Custo Público** | Levantamento estruturado de custos para construir o *Public Sector Comparator* (linha de base de custo público anual do modelo atual de execução). |
| 02 | **Matriz de Riscos** | Alocação de riscos entre Poder Público, Concessionário e compartilhados, com classificação de probabilidade e impacto. |
| 03 | **Precificação de Obras** | Análise crítica de precificação de obras em estudos, modelagens, projetos e editais (BDI, composições, regionalização, atualização). |
| 04 | **Checklist de Custos PPP** | Identificação sistemática de custos transversais (estruturação, implantação, operação, governança, riscos, fiscais) e setoriais — mitiga o risco de existirem custos não capturados no modelo de VfM, sem substituir a modelagem financeira detalhada. |
| 05 | **Evidência Comparativa (VfM)** | Comparação entre PSC e proposta PPP, apuração de *Value for Money* e fundamentação da vantagem econômica (art. 10, I, "a", da Lei 11.079/2004). |
| 06 | **Relatórios** | Geração de capa institucional + exportação consolidada (PDF unificado ou sequencial) dos módulos selecionados como anexos do parecer técnico. |

A tela de **Início** centraliza a identificação do projeto e o acesso aos módulos. A ordem reflete o fluxo natural de análise: caracterizar o custo público (M1) → mapear riscos (M2) → validar o custo privado das obras (M3) → garantir cobertura de custos via checklist (M4) → consolidar a evidência comparativa (M5) → gerar relatório (M6).

---

## Fluxo típico de uso

1. **Tela Início** — preencha a identificação do projeto (nome, órgão concedente, período, processo PROA/SEI, responsável). Esses dados alimentam os módulos seguintes.
2. **Módulos 01 a 05** — trabalhe os instrumentos pertinentes ao caso. Os módulos podem ser usados de forma independente ou consolidados no Relatório.
3. **Tela Relatórios** — selecione os módulos a anexar, revise a capa institucional e gere o relatório:
   - **PDF unificado** (recomendado): um único arquivo com capa + módulos em sequência, pronto para anexar ao parecer.
   - **Modo sequencial**: gera N PDFs separados (capa + 1 por módulo) para você combinar depois com Acrobat / PDFsam / qpdf.

A ferramenta salva automaticamente cada alteração no navegador (rascunho local). Pressione `Esc` ou `H` em qualquer módulo para voltar à tela inicial.

---

## Privacidade e tratamento dos dados

- **Todos os dados ficam no seu navegador** (`localStorage`). Nada é enviado para qualquer servidor.
- **Não há rastreamento** de uso, métricas, cookies de terceiros ou analytics.
- **Cada usuário vê apenas seus próprios dados.** Abrir a URL pública não expõe trabalho de ninguém — cada navegador é uma instância isolada.
- Para apagar tudo: clique no botão **limpar**.

> ⚠️ Por estar em ambiente público de testes, **não insira dados sensíveis ou sigilosos de processos reais**. Use casos hipotéticos, dados públicos ou números fictícios para validar o fluxo da ferramenta. Para uso institucional efetivo, aguardar a hospedagem em infraestrutura interna institucional.

---

## Feedback

O propósito desta versão é **coletar críticas, sugestões e relatos de bugs** dos usuários antes de evoluir para uma versão final. Toda contribuição é bem-vinda:

- **Bugs e travamentos** — descreva o passo a passo, módulo afetado e, se possível, anexe print
- **Sugestões de campos faltantes** ou desnecessários por módulo
- **Discordâncias metodológicas** quanto aos cálculos, classificações ou referências legais
- **Aderência aos padrões TCE-RS, MCASP, Lei 14.133/2021 e Lei 11.079/2004**
- **Usabilidade** — pontos onde a interface confunde ou onde o fluxo poderia ser mais direto

📧 Envie para: _[brunodp@sefaz.rs.gov.br]_
💬 Ou abra uma _issue_ neste repositório (aba **Issues** acima)

---

## Limitações conhecidas

- A combinação dos PDFs ao final da exportação é **manual** (você gera N PDFs e combina externamente).
- Os logos institucionais da CAGE e SEFAZ-RS estão em formato de placeholder tipográfico nesta versão de teste.
- O Módulo 02 (Matriz de Riscos) carrega lentamente no primeiro acesso devido a dados de referência embarcados.
- A geração de **PDF unificado** depende do navegador (testado em Chrome e Edge): se o PDF sair com módulos cortados, prefira o modo sequencial.
- A ferramenta foi testada nos navegadores Chrome e Edge. Em outros navegadores pode haver inconsistências.

---

## Ficha técnica

**Versão:** 1.3 (avaliação interna — `2026-05`) — adiciona Módulo 04 (Checklist de Custos), reordena módulos para refletir o fluxo de análise e introduz exportação de relatório em PDF unificado.
**Tipo:** Aplicação web estática (HTML/CSS/JavaScript), sem dependências de servidor
**Compatibilidade:** Chrome, Edge, em versões recentes
**Persistência:** `localStorage` do navegador (cada usuário, cada navegador)

**Fundamentação normativa principal**

- Lei Federal nº **11.079/2004** — institui normas gerais para PPPs
- Lei Estadual RS nº **12.234/2005** — institui o Programa de PPP no Rio Grande do Sul
- Decreto RS nº **53.495/2017** e alterações — regulamenta o Programa de PPP estadual
- Decreto RS nº **53.490/2017** — institui o Conselho Gestor das PPPs
- Lei Federal nº **14.133/2021** — Nova Lei de Licitações e Contratos Administrativos
- **MCASP** (Manual de Contabilidade Aplicada ao Setor Público) — STN/Tesouro Nacional
- **NBC TSP** (Normas Brasileiras de Contabilidade — Setor Público) — CFC
- Manuais de referência: *Partnerships Victoria*, *HM Treasury Green Book*, *Banco Mundial PPP Reference Guide*

---

## Estrutura do repositório

```
.
├── index.html                    # Shell: tela inicial, navegação, capa, relatórios
├── m1-psc-custo.html             # Módulo 01 — PSC Custo Público
├── m2-matriz-riscos.html         # Módulo 02 — Matriz de Riscos
├── m3-precificacao.html          # Módulo 03 — Precificação de Obras
├── m4-checklist-custos.html      # Módulo 04 — Checklist de Custos PPP (transversal + setores)
├── m5-vfm.html                   # Módulo 05 — Evidência Comparativa / VfM
├── padrao-visual.css             # Padronização visual transversal
├── assets/                       # Imagens dos cards da home (card-01 … card-05)
└── referencias/                  # Planilhas Excel de referência (fonte canônica)
```

---

## Créditos

Desenvolvido pelos **Auditores do Estado da Contadoria e Auditoria-Geral do Estado do Rio Grande do Sul (CAGE-RS)** no âmbito do **GT-PPPs** da **Secretaria da Fazenda do Rio Grande do Sul (SEFAZ-RS)**.

Esta ferramenta é instrumento de apoio à atuação técnica e segue as diretrizes institucionais de transparência ativa do Estado do RS.

---

_Última atualização: maio/2026_
