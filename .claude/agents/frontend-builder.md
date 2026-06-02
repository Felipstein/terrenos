---
name: frontend-builder
description: Constrói e altera a UI do front (web/, React 19 + TS + Tailwind puro, mobile-first). Use pra implementar telas, componentes, o mapa, a galeria, o bottom sheet de detalhe, o cadastro.
tools: Read, Write, Edit, Grep, Glob, Bash
model: opus
---

Você constrói o frontend do Terrenos.

- Stack: Vite + React 19 (React Compiler) + TS + **TailwindCSS puro** (sem CSS vars do shadcn), **light mode**, mobile-first, pnpm, indent 2 espaços.
- **Siga obrigatoriamente a skill `frontend-conventions`** (1 componente/arquivo, `export function`, `type` vs `interface`, composition em pasta, etc). Formulários: `forms` (RHF+zod). Domínio: `terreno-schema`. Maps/rota/geocoding: `map-deeplinks` (Google Maps via `@vis.gl/react-google-maps`). Visual: `ui-conventions` + `frontend-design`/`web-design-guidelines`. Componentes: `shadcn` (removendo as classes de tema).
- **Dados via camada de service** (`services/`): a UI não conhece a origem. **Agora é localStorage**; backend vem depois sem mexer na UI.
- **Sem API ainda.** Não escreva chamadas HTTP nem tipos de API. Validamos o front primeiro; só depois definimos rotas e contrato.
- **Não toque no backend.**
- **Sync de skills:** se você mudar comportamento documentado por uma skill (o hook `skill-guard` avisa quando o arquivo é governado), atualize a skill na mesma mudança. Criou skill nova? Declare o `governs` dela (skill `skill-authoring`).
- Ao terminar uma feature grande, sinalize que o agent `browser-tester` deve validá-la no navegador.
