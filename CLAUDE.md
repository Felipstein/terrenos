# Terrenos

App pessoal pra encontrar terrenos pra comprar. **Mobile-first**, com **login básico**, acessado pelo navegador do celular.

## O que o app faz
- Duas views (abas): **Mapa** (Google Maps com pins de preço) e **Lista** (busca por endereço + ordenação por preço).
- Tocar no pin/item → detalhe enxuto: preço (opcional), rua, área (total/largura/comprimento), **corretora** (opcional), link opcional, **WhatsApp** do contato (opcional), fotos, **editar** e **excluir**.
- Botão de **rota** que abre o **Google Maps nativo** do celular com a rota até o terreno; botão de **WhatsApp** (wa.me) quando há contato.
- **Cadastro/edição** na própria plataforma: pick do ponto no mapa **ou** colar link do Google Maps (curto resolvido pelo backend); endereço autopreenchido (geocoding); medidas com auto-cálculo (total = largura × comprimento); corretora com autocomplete reutilizável.
- **Fotos** opcionais por terreno (upload via presigned S3). **Login real** via backend (Cognito).

## Estrutura do repo
- `web/` — frontend: **Vite + React 19 (React Compiler) + TypeScript + TailwindCSS puro (v4)**, indent 2 espaços, gerenciador **pnpm**. shadcn como base de componente, mas **sem as CSS vars de tema** (Tailwind puro). Light mode.
  - Mapa: **Google Maps** via `@vis.gl/react-google-maps` (chave em `VITE_GOOGLE_MAPS_API_KEY`; restringir por domínio + teto de cota pra não gerar custo). Sem chave, o app cai num placeholder e o resto funciona.
  - Formulários: **react-hook-form + zod + @hookform/resolvers** (skill `forms`).
- `contract/openapi.yaml` — **contrato da API** entre front e backend. Fonte da verdade.
- `api/` — backend **neste repo**: **TypeScript serverless** (AWS Lambda + httpApi + DynamoDB single-table + Cognito + S3). Arquitetura hexagonal (`domain/` → `application/{ports,use-cases}` → `infra/` → `http/` → `functions/`). Validação `zod/mini`. Deploy via `serverless`. Detalhes em `api/README.md`. **Pode mexer** — mantendo o contrato em sync.

## Regra do contrato (IMPORTANTE)
`contract/openapi.yaml` é a **fonte da verdade** da API.
- Criou rota nova, mudou request/response, status code ou shape de dado → **atualize `contract/openapi.yaml` na MESMA mudança**, antes ou junto da implementação.
- O front consome **tipos gerados do contrato** — não escreva tipos de API à mão.
- Procedimento detalhado: skill `api-contract`.

## Como rodar
```bash
cd web && pnpm install && pnpm dev
```

## Convenções (resumo — detalhe na skill `frontend-conventions`)
- Mobile-first sempre. TS estrito, sem `any`.
- **Login real** via `AuthService` (Cognito: `/auth/login`, `/auth/refresh`, `/me`; só os tokens ficam no localStorage, atrás do service). Refresh token rotativo.
- **Formulários sempre com react-hook-form + zod** (skill `forms`).
- **1 componente por arquivo.** SRP; componente grande → divide; lógica/componente repetido → abstrai.
- Sempre **`export function`** — nunca `const` pra componente, nunca `export default`.
- Composition pattern estilo shadcn em **pasta por componente** (`Dialog/DialogRoot.tsx`, `Dialog/DialogTrigger.tsx`, …).
- **`type`** pra tipagem do front; **`interface`** pra contratos.
- **Camada de service**: a UI não conhece a origem dos dados — fala só com os services (`terreno-service`, `corretora-service`, `auth-service`, `upload-service`, `maps-service`) sobre o HTTP client (`lib/api/`). Tipos da API **gerados** do contrato (`pnpm gen:api`).
- **UI minimalista, moderna, bonita; UX excelente. Nada de UI genérica de IA.** Light mode.
- **Testes só em negócio/regra** (services, validações, cálculos) — não em componente visual.

## Skills sempre em sync (skill-guard)
- Skills que documentam **comportamento/regra** declaram `governs` (globs) no frontmatter.
- Mudou um arquivo governado **e o comportamento mudou** → **atualize a skill dona na mesma mudança**. O hook `skill-guard` lembra automático.
- Criou skill pra feature nova? Declare o `governs` dela. Procedimento: skill `skill-authoring`.

## Fluxo de trabalho
- Mudou rota/shape de dado → **contrato (`openapi.yaml`) + `pnpm gen:api` no front + impl no `api/` na MESMA mudança** (skill `api-contract`).
- **Feature grande criada/alterada → rodar o agent `browser-tester`** pra testar no navegador e ver os logs antes de dar como pronto.
- Mudança no `api/` **só vale após deploy** (`cd api && pnpm deploy`, ou CI/CD no push).

## Decisões já tomadas
- **Mapa:** Google Maps (`@vis.gl/react-google-maps`). Reverse-geocoding pelo próprio Google. Link curto do Maps resolvido no backend (`POST /maps/resolve-link`).
- **Armazenamento:** backend em `api/` (DynamoDB single-table), consumido via HTTP pelos services. Tokens de sessão no localStorage.
- **Login:** real, via Cognito (refresh token rotativo).

## Skills e agents deste projeto
- Skills: `frontend-conventions`, `forms`, `api-contract`, `terreno-schema`, `map-deeplinks`, `ui-conventions`, `skill-authoring`.
- Agents: `explorer`, `frontend-builder`, `browser-tester`, `contract-guardian`, `reviewer`.
