---
name: frontend-conventions
description: Use SEMPRE que criar ou alterar qualquer código do frontend (web/) — componentes, hooks, services, tipos, estilos. Regras obrigatórias de arquitetura, nomenclatura e estilo deste projeto.
---

# Convenções de frontend — Terrenos

Regras **obrigatórias**. Todo código do front segue isto.

## Stack
- Vite + React 19 (React Compiler) + TypeScript.
- **TailwindCSS puro** (v4). **Sem as CSS vars de tema do shadcn** — não usar `bg-background`, `text-foreground`, etc.
- **shadcn** pode ser usado como base de componente, mas ao trazer um: **remova as classes de tema** e troque por cores Tailwind concretas (ex: `bg-white`, `text-zinc-900`, `border-zinc-200`).
- **Light mode** apenas.
- pnpm, indent 2 espaços.

## Componentes
- **1 componente por arquivo.** Nunca dois no mesmo arquivo.
- Componente grande demais? **Divida.** Cada componente tem **uma única responsabilidade**.
- **Lógica repetida → abstraia** (hook ou util). **Componente repetido → abstraia** (componente reutilizável).
- **Composition pattern** quando fizer sentido (não force).
- Sempre **`export function`**. **Nunca `const` pra componente. Nunca `export default`.**

```tsx
// ✅
export function TerrenoCard(props: TerrenoCardProps) { ... }

// ❌ const Component = () => {}
// ❌ export default function () {}
```

## Composition pattern com 1 componente por arquivo
Como cada arquivo tem só 1 componente, quebre o composto em **pasta por componente**:

```
Dialog/
  DialogRoot.tsx       // export function DialogRoot
  DialogTrigger.tsx    // export function DialogTrigger
  DialogContent.tsx    // export function DialogContent
  index.ts             // só re-exporta os nomes (não é componente)
```

`index.ts` apenas reexporta (`export { DialogRoot } from './DialogRoot'`), pra ergonomia do import. Reexport nomeado é permitido; default não.

## Tipagem
- **`type`** para qualquer tipagem do front (props, estados, modelos de UI).
- **`interface`** para **contratos** (ex: o contrato de um service, formato de dados externos).

```ts
type TerrenoCardProps = { terreno: Terreno; onSelect: (id: string) => void }
interface TerrenoService { list(): Promise<Terreno[]> }
```

## Camada de service (importante)
O front **não conhece de onde os dados vêm**. Toda leitura/escrita passa por um **service** em `services/`.
- **Agora**: implementação em **localStorage**.
- **Depois**: quando o backend existir, troca-se a implementação do service — **a UI não muda**.
- O service expõe um **`interface`** (contrato) e retorna **tipos do domínio** (`terreno-schema`), nunca detalhes de storage/HTTP.

```ts
// services/terreno-service.ts
interface TerrenoService {
  list(): Promise<Terreno[]>
  save(terreno: Terreno): Promise<void>
}
export function createLocalTerrenoService(): TerrenoService { ... }
```

## Testes
- Teste **só o que é negócio/regra**: services, validações, cálculos (ex: área, formatação de preço).
- **Não** testar componente puramente visual.

## UI / UX
- **UX excelente, UI minimalista, moderna e bonita.** Nada de "UI genérica de IA".
- Mobile-first (ver skill `ui-conventions`). Qualidade visual: skills `frontend-design` / `web-design-guidelines`.

## Estrutura sugerida
```
web/src/
  components/   # reutilizáveis (1 por arquivo)
  features/     # por feature (mapa, terreno-detalhe, cadastro)
  services/     # camada de dados (localStorage agora)
  hooks/        # lógica reutilizável
  types/        # types do domínio
  lib/          # utils puros
```
