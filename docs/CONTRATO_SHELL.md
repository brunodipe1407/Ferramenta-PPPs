# Contrato Shell ↔ Módulos

Documento de referência para entender como `index.html` (shell) se comunica com os
módulos `m{1..5}-*.html` quando carregados em iframes. Use como onboarding ao
adicionar um novo módulo ou alterar o protocolo.

## Topologia

```
┌─────────────────── index.html (shell) ─────────────────────────┐
│  header (CAGE/SEFAZ · Salvar · Exportar · Limpar)              │
│  mod-tabs       [00 Início · 01 PSC · 02 … · 06 Relatórios]    │
│  subtab-bar     [01 Identif. · 02 PSC Bruto · …]  ← do módulo  │
│  ┌── content-area ───────────────────────────────────────────┐ │
│  │ <iframe id="frameN" src="mN-*.html?embed=1&v=NN">         │ │
│  └───────────────────────────────────────────────────────────┘ │
│  status-bar     ● Pronto · Módulo 2 — Matriz de Riscos PPP     │
└────────────────────────────────────────────────────────────────┘
```

- **Frame 1** (PSC) carrega `src` imediato. **Frames 2-5** lazy-load via
  `data-src` quando o usuário clica na aba.
- **Frame 6** ("Relatórios") não é iframe — é um painel `#reportPanel` interno do shell.

## Modos de execução

Cada módulo roda em dois modos:

| Modo            | Como detectar                                                       | Comportamento                                          |
|-----------------|----------------------------------------------------------------------|--------------------------------------------------------|
| **Standalone**  | URL sem `?embed=1`                                                   | UI completa, header próprio, status-bar visível        |
| **Embed**       | URL com `?embed=1` → `<html class="embed-mode">`                     | Esconde header/status próprios; delega ao shell        |

Detecção (no início de cada módulo):

```js
if (new URLSearchParams(location.search).has('embed')) {
  document.documentElement.classList.add('embed-mode');
}
```

CSS típico:

```css
html.embed-mode .app-header { display: none !important; }
html.embed-mode .status-bar  { display: none !important; }
html.embed-mode body         { padding-top: 0 !important; }
```

## Protocolo de mensagens (`postMessage`)

Toda comunicação usa `window.postMessage`. Mensagens são objetos com `type`
prefixado por `gtsefaz_`. Origem é `'*'` (mesma máquina) — não há checagem de
origem porque rodamos sob `file://` ou `localhost`.

### Shell → Módulo

| `type`                  | Payload                            | Quando                                                  |
|-------------------------|------------------------------------|---------------------------------------------------------|
| `gtsefaz_save`          | —                                  | Usuário clicou "Salvar" no header do shell              |
| `gtsefaz_clear`         | —                                  | Usuário clicou "Limpar" no header do shell              |
| `gtsefaz_goto`          | `{ index: number }`                | Usuário clicou em uma sub-aba na barra do shell         |
| `gtsefaz_projeto_set`   | `{ dados: ProjetoDados }`          | Push de estado do projeto (vindo do Hub ou outro módulo)|

### Módulo → Shell

| `type`                     | Payload                                            | Quando                                              |
|----------------------------|----------------------------------------------------|-----------------------------------------------------|
| `gtsefaz_saved`            | `{ mod: number }`                                  | Confirma `gtsefaz_save` (atualiza status-bar)       |
| `gtsefaz_subtab_changed`   | `{ mod: number, index: number }`                   | Usuário trocou sub-aba dentro do iframe             |
| `gtsefaz_projeto`          | `{ mod: number, dados: ProjetoDados }`             | Campos de identificação mudaram — propaga aos demais|
| `gtsefaz_projeto_request`  | `{ mod: number }`                                  | Módulo recém-carregado pede estado atual do projeto |
| `gtsefaz_progress`         | `{ preenchidos: number, total: number }`           | Atualiza barra de progresso (opcional)              |
| `gtsefaz_ready`            | —                                                  | (Reservado — não consumido atualmente pelo shell)   |

### `ProjetoDados`

```ts
type ProjetoDados = {
  nome?:         string;   // Nome / identificação do projeto
  orgao?:        string;   // Órgão / Secretaria responsável
  periodoRef?:   string;   // Período de referência (ex.: "2026")
  responsavel?:  string;   // Nome / cargo (opcional)
};
```

Convenção: nunca enviar `undefined`. Use string vazia `""` para "não preenchido".
O shell faz **merge** com o estado persistido (não sobrescreve campos quando
recebe payload parcial).

## Bridge / fallback cross-origin

O shell tenta injetar um `<script>` no `document.head` do iframe (função
`injectBridge`) que registra um listener genérico de `gtsefaz_goto` /
`gtsefaz_save` / `gtsefaz_clear`. Isso só funciona com **same-origin**.

⚠ **Em browsers com `file://` tratado como cross-origin (Chrome/Edge default), a
injeção falha silenciosamente** — o `try/catch` em `onFrameLoad` engole a
`SecurityError`.

Por isso, **cada módulo deve ter o seu próprio listener** que trata os tipos
acima. O bridge injetado é apenas redundância em cenários same-origin
(servidor local, JSDOM em testes). Handlers nos módulos são idempotentes —
ambos podem disparar sem efeito colateral.

Padrão recomendado em cada módulo (dentro do IIFE de embed-mode):

```js
window.addEventListener('message', (e) => {
  if (!e.data || typeof e.data !== 'object') return;
  if (e.data.type === 'gtsefaz_projeto_set') setDados(e.data.dados);
  else if (e.data.type === 'gtsefaz_goto')  goTo(parseInt(e.data.index, 10));
  else if (e.data.type === 'gtsefaz_save')  { salvar(); parent.postMessage({ type:'gtsefaz_saved', mod:MOD }, '*'); }
  else if (e.data.type === 'gtsefaz_clear') limpar();
});
```

## Sub-abas (módulos que têm)

| Módulo | Subtabs no shell                              | API interna do módulo                  |
|--------|-----------------------------------------------|-----------------------------------------|
| M1     | (nenhuma — rolagem contínua)                  | —                                       |
| M2     | 5: Identificação · Matriz · Dashboard · …     | `.nav-tab[data-tab=...]` + click         |
| M3     | 11: Instruções · Capa · Identif · …           | `switchTab(id: string)` + `TABS[]`      |
| M4     | (nenhuma — rolagem contínua)                  | —                                       |
| M5     | 7: Identificação · PSC Bruto · …              | `goTo(idx: number)` + tablist a11y      |

Convenção: **a ordem dos itens em `MODULES[N].subtabs` no shell deve corresponder
exatamente à ordem dos botões/abas dentro do módulo**. O shell envia `index`
posicional; o módulo traduz para sua API interna.

## Persistência

Cada módulo gerencia seu próprio `localStorage` com chave única:

| Módulo | Chave                       |
|--------|-----------------------------|
| Hub    | `gtsefaz_projeto_atual`     |
| M1     | (gerencia internamente)      |
| M2     | `matriz_riscos_data`         |
| M3     | (gerencia via `STORAGE_KEY`) |
| M4     | `checklist_cage_rs_v1`       |
| M5     | (gerencia internamente)      |

Auto-save: shell dispara `setInterval(pingAutoSave, 60000)` que envia
`gtsefaz_save` para todos os iframes carregados a cada 60s. Cada módulo
também faz seu próprio debounce em mudanças locais (~500ms).

## IDs comuns de campos de identificação

Quando um módulo expõe campos de identificação, deve usar (quando possível) um
destes ids — assim o shell consegue mapear automaticamente:

| Campo lógico | ID HTML preferido      |
|--------------|------------------------|
| nome         | `nomeProjeto`          |
| orgao        | `orgao`                |
| periodoRef   | `periodoRef`           |
| responsavel  | `responsavel`          |

Módulos legacy podem ter ids diferentes (ex.: M1 usa `m1-nome`, `m1-sec`,
`m1-ano`). Nesses casos, o módulo mapeia internamente os ids legacy para
chaves canônicas no payload `gtsefaz_projeto`.

## Cache-buster

Os iframes usam `?embed=1&v=NN` no `src` / `data-src`. Bumpar o `v=` força o
browser a recarregar o módulo após mudanças durante desenvolvimento. Padrão
atual: `v=20`. Aumente em mudanças que possam ser cacheadas indevidamente.

## Checklist para adicionar um novo módulo

1. Criar `mN-nome.html` com IIFE de detecção de embed-mode.
2. Adicionar entrada em `MODULES[N]` no shell (`name`, `subtabs`).
3. Adicionar `<iframe id="frameN" data-src="mN-nome.html?embed=1&v=NN">` no shell.
4. Implementar listener de `message` com os 4 tipos básicos
   (`gtsefaz_projeto_set`, `gtsefaz_goto` se tiver subtabs, `gtsefaz_save`,
   `gtsefaz_clear`).
5. Emitir `gtsefaz_projeto` quando campos de identificação mudarem (debounce 500ms).
6. Emitir `gtsefaz_projeto_request` no `init` para receber estado atual.
7. Se tiver subtabs: emitir `gtsefaz_subtab_changed` quando o usuário
   clicar internamente.
8. Validar a11y: tablist com `role="tablist"`/`role="tab"`/`role="tabpanel"`,
   roving `tabindex`, navegação por teclado (←/→, Home/End), `aria-selected`,
   `aria-controls`, `aria-labelledby`.
