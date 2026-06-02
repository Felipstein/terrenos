---
name: ui-conventions
description: Use ao construir ou estilizar qualquer tela do app Terrenos. Princípios mobile-first e padrões visuais deste projeto.
---

# Convenções de UI — Terrenos

App é **mobile-first**: desenhado pro navegador do celular, uma mão, na rua.

## Princípios
- A tela inteira é o mapa. UI sobreposta (bottom sheet, FAB), não telas separadas pesadas.
- Toque-alvo mínimo 44px. Botão de rota grande e óbvio.
- O pin mostra o **preço** direto (label no pin), pra escanear rápido sem precisar tocar.
- Detalhe do terreno em **bottom sheet** que sobe; galeria com swipe horizontal.
- Foto preview grande no topo do detalhe.
- Performance: muitas fotos → lazy load; o mapa não pode travar com dezenas de pins.

## Visual
- Qualidade visual: use as skills `frontend-design` e `web-design-guidelines`.
- Componentes: use a skill `shadcn`.
- Evite a estética "AI genérica": tipografia e espaçamento com intenção.
