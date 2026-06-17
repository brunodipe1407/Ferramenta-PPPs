# CAFF — Dados extraídos para os pilotos (M1–M5)

> Digest interno de validação. Fonte: `Modelo CAFF 2026.03.16_v2 (1).xlsm`, `Plano de Negócios _20260309 (1).docx`. Cenário **"Premissas atuais"** (coluna G do Painel de Resultados; data do modelo 17/03/2026). Valores em R$ salvo indicação. **Não é parecer** — base para pilotos da ferramenta.

## Identificação
- Projeto: **Centro Administrativo do Estado do RS (CAFF)** — Concessão Administrativa (PPP), modelagem BNDES.
- Ativos: CAFF + Garagem Anexa; PGE + Garagem; DAER; edifícios acessórios (Torres K/L, Escola P, Praça Comercial, Restaurantes, Estacionamentos, Urbanização).
- Prazo: **2 anos de construção + 30 de operação**. WACC real **10,2% a.a.** (nominal 14,1%); CAPM real 11%.
- Aporte público: **R$ 0**. Comprometimento da RCL: ~0,49%.

## M1 — PSC / Custo Público Anual (JÁ FEITO; referência)
- CAPEX anualizado (anuidade WACC real 10,2%/30a, fator 0,10787): CAFF+Garagem R$ 76,4 mi · PGE+Garagem R$ 31,7 mi · DAER R$ 12,2 mi → **R$ 120,3 mi/ano** (Investimento Obrigatório Total R$ 1.115,56 mi · Painel G12-G15).
- OPEX obrigatório anual: CAFF R$ 39,14 mi (G24) · PGE R$ 11,22 mi (G25) · DAER R$ 8,36 mi (G26) → **R$ 58,72 mi/ano** (G23). Ref.: OPEX atual do CAFF hoje R$ 30,95 mi/ano (G28).
- Receita acessória máxima anual: **R$ 41,32 mi** (G32).
- Gestão/Fiscalização: a estimar (não consta no modelo privado).
- **PSC Bruto ≈ R$ 137,7 mi/ano**.

## M6 / VfM quantitativo (aba "12. Affordability e VfM") — em R$ MILHÕES, VPL
Taxa de desconto (ambos os cenários): 8,5%. Sobrecusto CAPEX 25%, Sobrecusto OPEX 25%.

Bridge do custo da Contratação Tradicional (PSC, VPL):
- Investimentos + Despesas: 1.606,32 (G19)
- Aditivos Contratuais: 401,58 (G20)
- Custo de Transação: 1,45 (G21)
- Atraso de Obras: 16,334 (G22)
- (−) Obtenção de Receitas: −121,014 (G23)
- **Custo da Contratação Tradicional (PSC) = R$ 1.904,67 mi** (G24/G28)

Bridge do custo da PPP (VPL):
- Contraprestação: 2.173,73 (G13)
- Gestão Contratual: 4,873 (G14)
- (−) Neutralidade Competitiva: −462,407 (G15)
- **Custo da PPP = R$ 1.716,20 mi** (G16/G26)

- **VfM = 1.904,67 − 1.716,20 = R$ 188,47 mi (9,9%)** a favor da PPP (G27/G29).
- ⚠️ Inconsistência a registrar: o Painel de Resultados (G45) reporta "Value for Money ≈ 0" para "Premissas atuais" (def. diferente / outro cenário); a aba 12 traz o bridge detalhado com VfM R$ 188,47 mi. Usar a aba 12 como decomposição autoritativa e citar a divergência.

Para o tool m5-vfm (M6): VPL do Estado/PSC (va) = R$ 1.904.670.000 ; VPL da PPP (vp) = R$ 1.716.200.000 ; VfM = va − vp = R$ 188.470.000.

## M2 — Matriz de Alocação de Riscos
Riscos identificados no planejamento (Plano de Negócios, cap. desempenho/riscos):
- Intervenções em edificações existentes de grande porte (risco de obra/retrofit).
- Compatibilização entre obras e operação de órgãos públicos em funcionamento.
- Condições estruturais e prediais dos ativos existentes (risco de projeto/geológico-predial).
- Interface com a malha urbana e mobilidade do entorno.

Riscos precificados no modelo (aba 12) — indicam alocação econômica:
- Sobrecusto de CAPEX (25%) e de OPEX (25%) → risco de construção e de operação **transferido** à concessionária na PPP (compõe a neutralidade competitiva / eficiência).
- Atraso de obras: tempo médio histórico 6,81; modelado 3 anos; impacto VfM R$ 16,33 mi → risco de prazo **transferido** na PPP, **retido** na contratação tradicional.
- Aditivos contratuais: R$ 401,58 mi no PSC → risco de **aditivos/sobrepreço** maior na contratação tradicional.
- Custo de transação: R$ 1,45 mi.
- Obtenção de receitas acessórias (R$ −121 mi): risco de **demanda/receita** das atividades acessórias **transferido** à concessionária.
- Indicadores de desempenho vinculados à contraprestação (mecanismo de pagamento por desempenho) → risco de **desempenho/disponibilidade** transferido.
- ⚠️ A matriz contratual detalhada está em "instrumento específico da modelagem" — NÃO consta neste material. Registrar como ressalva; o piloto traz a alocação econômica inferida, não a matriz contratual oficial.

## M3 — Precificação de Obras / Benchmark de CAPEX
- Investimento Obrigatório Total R$ 1.115,56 mi; Investimento Total R$ 1.291,64 mi.
- Investimento Obrigatório / m² = R$ 4,49 mil/m² (G17); Investimento Total / m² = R$ 5,72 mil/m² (G19).
- Benchmark de CAPEX (aba Benchmarks) — projetos comparáveis "Centros Administrativos":
  - **Centro Administrativo de São Paulo**: CAPEX R$ 4,17 bilhões; 219.331 m²; taxa 9,89%; data-base jul/2025 (benchmark de maior porte e mais recente).
  - Centro Administrativo (Maceió) — contrato iniciado (jan/2025).
  - Sede da PGE (Rondônia) — contrato iniciado (2022).
  - Centro Administrativo (Angra dos Reis) — contrato iniciado (2019).
- Demolição/realocação do Prédio P: CAPEX de implantação R$ 4,6 mi (reinvestimentos de 30 anos à parte).
- Reforma Tributária (LC 214/2025): CBS/IBS substituem ICMS/ISS/PIS/COFINS — risco/efeito tributário sobre a precificação.

## M4 — Checklist de Custos (completude)
Estrutura de custos do modelo (verificar cobertura):
- CAPEX: B3 e ressarcimento de estudos (BNDES); certificador de obra; construção e reinvestimento por ativo (A-CAFF, B-SEDUC, C-PGE, D-Estac., E-Esquina, F/G-Prédios baixos, H-Garagem, I-Praça, J/M-Restaurantes, K/L-Torres, N-DAER, O-Torre, P-Escola); urbanização. Split: investimento obrigatório × associado a receitas acessórias.
- OPEX: administrativo da SPE (gastos administrativos; **verificador independente**; **garantias e seguros**); operação e manutenção por ativo; OPEX obrigatório × atividades acessórias. Ref.: contrato atual de Facilities Management do complexo (marcenaria, layout).
- Demais blocos do modelo: D&A (aba 07), Tributos (08), Dívida (09), Custos de transação (incluídos), reinvestimentos por vida útil.
- Receitas: contraprestação + acessórias (comercial R$120/m²/mês; corporativo R$100/m²/mês; +R$50/m²/mês promoção em áreas comerciais; estacionamento; condomínio; vacância 10%).

## M5 — Melhorias qualitativas (M4 do "Vale Pagar Mais") e classificação (M5)
Diretrizes de desempenho / melhorias trazidas pela concessão (Plano de Negócios):
1. Eficiência das infraestruturas e sistemas prediais (modernização) — Essencial.
2. Sustentabilidade ambiental das edificações — Relevante.
3. Acessibilidade universal e melhoria da mobilidade interna — Essencial.
4. Segurança dos usuários e adequação às normas técnicas — Essencial.
5. Flexibilidade de layout e adaptabilidade dos espaços — Relevante.
6. Indicadores de desempenho vinculados à contraprestação (pagamento por desempenho / manutenção garantida ao longo de 30 anos) — Essencial (atica a falha de manutenção reativa do modelo atual).
7. Retrofit/requalificação dos ativos existentes (CAFF, DAER, edifícios internos) — Relevante.

Falhas do padrão atual (M3 diagnóstico) que essas melhorias endereçam:
- Manutenção predial reativa e subfinanciada; OPEX atual R$ 30,95 mi/ano sem garantia de desempenho.
- Ativos existentes com condições estruturais/prediais defasadas (necessidade de retrofit).
- Ausência de mecanismo de incentivo ao nível de serviço.
- Aluguéis externos de órgãos (SEDUC R$ 2,81 mi/ano em 3.757 m²; SPGG R$ 0,65 mi/ano) — dispersão e custo de locação evitável com a consolidação no complexo.

Evidência: benchmarks de Centros Administrativos (SP, Maceió, Rondônia, Angra); Produto Anteprojeto de Engenharia e Arquitetura; Estudo de Vocação Complementar e Análise de Demanda.
