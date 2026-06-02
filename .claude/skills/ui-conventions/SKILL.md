---
name: ui-conventions
description: Use ao construir ou estilizar qualquer tela do app Terrenos. Identidade visual (cartográfica), tokens, tipografia e padrões mobile-first + desktop.
---

# UI — Terrenos (identidade cartográfica / topográfica)

App **mobile-first** com layout responsivo. Estética **cartográfica**: papel creme, verde-musgo, terracota; serif de caráter + monoespaçada nos números. **Nada de cara "IA genérica"** (zinc + tudo arredondado + branco).

## Tokens (definidos em `web/src/index.css` via `@theme`)
- Cores: `paper` (fundo creme), `surface` (painéis), `ink` (texto), `moss`/`moss-700` (primário/verde), `clay`/`clay-600` (acento terracota), `taupe` (texto secundário), `line` (bordas finas). Use as utilities: `bg-paper`, `text-ink`, `bg-moss`, `text-clay`, `border-line`, `text-taupe`, etc.
- Fontes: `font-serif` (Fraunces — títulos), `font-sans` (Archivo — corpo/UI), `font-mono` (IBM Plex Mono — **todos os números**: preço, área, dimensão, coordenadas).
- `.topo-grid`: textura sutil de grade topográfica (login, placeholders).

## Regras visuais
- **Cantos retos**: `rounded-sm` (campos, botões, pills), no máximo `rounded-md`/`rounded-lg`. Sem `rounded-2xl/3xl`.
- **Números em mono** sempre (`font-mono tabular-nums`).
- Bordas finas `border-line`; acento `clay` pra estados ativos/CTA de rota; primário `moss`.
- Light mode. Toque-alvo ≥ 44px.

## Layout
- **Mobile**: mapa de fundo + **gaveta deslizante** (`DraggableSheet`) com busca + tabela. FAB de cadastro + "Sair" flutuantes.
- **Desktop (`md:`)**: **dois painéis** — `SidePanel` (largura fixa, busca + tabela + "+ Novo" + "Sair") à esquerda e o mapa preenchendo o resto. Os dois lados compartilham o mesmo estado de filtro.
- **Modais** (detalhe/cadastro): bottom sheet no mobile, **centralizados com largura limitada** no desktop (ver `BottomSheetPanel`).

## Tabela de terrenos
- Colunas: **Endereço** (trunca) · **Área** · **Dim.** (L×C) · **Preço**.
- Headers **Área** e **Preço** são botões que ordenam (toggle asc/desc, seta em `clay` quando ativo). Ver `TerrenoTable`.
- Pin do mapa = pill creme com preço em mono + ponta; `clay` quando selecionado; a linha da tabela destaca o selecionado.

## Componentes-chave
- **Inputs** (`TextField`): estilo "papel" — preenchido (`bg-paper`) com linha inferior (`border-b-2`) que acende `moss` no foco. Sem caixa de borda completa.
- **Dinheiro** (`CurrencyField`): valor grande em mono com `R$` fixo, formata milhares ao digitar (estilo Nubank). Usado no preço.
- **Confirmação destrutiva** (`AlertDialog`): modal centralizado com ícone, título serif e botão `variant="accent"` (terracota) — sempre pra ações tipo excluir.
- **Gaveta mobile** (`DraggableSheet`): aceita `accessory` (ex: FAB de adicionar) que fica grudado no topo e sobe junto com a gaveta.
- Validação: mensagens em PT-BR (fallback global em `lib/zod-pt.ts`).

## Visual
- Qualidade/criatividade: skills `frontend-design` e `web-design-guidelines`.
- Componentes via `shadcn` (removendo as classes de tema → tokens acima).
