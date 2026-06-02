# Terrenos

App pessoal pra encontrar terrenos pra comprar. **Mobile-first**, com **login básico**, acessado pelo navegador do celular.

## O que o app faz
- Duas views (abas): **Mapa** (Google Maps com pins de preço) e **Lista** (busca por endereço + ordenação por preço).
- Tocar no pin/item → detalhe enxuto: preço, rua, área (total/largura/comprimento), link opcional, **editar** e **excluir**.
- Botão de **rota** que abre o **Google Maps nativo** do celular com a rota até o terreno.
- **Cadastro/edição** na própria plataforma: pick do ponto no mapa **ou** colar link do Google Maps; endereço autopreenchido (geocoding); medidas com auto-cálculo (total = largura × comprimento).
- **Sem fotos** (removido de propósito). **Login básico local** (temporário, trocável por backend).

## Estrutura do repo
- `web/` — frontend: **Vite + React 19 (React Compiler) + TypeScript + TailwindCSS puro (v4)**, indent 2 espaços, gerenciador **pnpm**. shadcn como base de componente, mas **sem as CSS vars de tema** (Tailwind puro). Light mode.
  - Mapa: **Google Maps** via `@vis.gl/react-google-maps` (chave em `VITE_GOOGLE_MAPS_API_KEY`; restringir por domínio + teto de cota pra não gerar custo). Sem chave, o app cai num placeholder e o resto funciona.
  - Formulários: **react-hook-form + zod + @hookform/resolvers** (skill `forms`).
- `contract/openapi.yaml` — **contrato da API** entre front e backend. Fonte da verdade.
- backend — vive **fora deste repo**, em outra linguagem (a definir). **Não mexer no backend** por enquanto.

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
- **Login básico local** via `AuthService` (sessão fake no localStorage, escondida atrás do service). Não é seguro de verdade — auth real (refresh token) vem com o backend.
- **Formulários sempre com react-hook-form + zod** (skill `forms`).
- **1 componente por arquivo.** SRP; componente grande → divide; lógica/componente repetido → abstrai.
- Sempre **`export function`** — nunca `const` pra componente, nunca `export default`.
- Composition pattern estilo shadcn em **pasta por componente** (`Dialog/DialogRoot.tsx`, `Dialog/DialogTrigger.tsx`, …).
- **`type`** pra tipagem do front; **`interface`** pra contratos.
- **Camada de service**: a UI não conhece a origem dos dados. **Agora: localStorage**; depois troca pra backend sem mexer na UI.
- **UI minimalista, moderna, bonita; UX excelente. Nada de UI genérica de IA.** Light mode.
- **Testes só em negócio/regra** (services, validações, cálculos) — não em componente visual.

## Skills sempre em sync (skill-guard)
- Skills que documentam **comportamento/regra** declaram `governs` (globs) no frontmatter.
- Mudou um arquivo governado **e o comportamento mudou** → **atualize a skill dona na mesma mudança**. O hook `skill-guard` lembra automático.
- Criou skill pra feature nova? Declare o `governs` dela. Procedimento: skill `skill-authoring`.

## Fluxo de trabalho
- Validar o **front primeiro** (com localStorage). Só quando o front estiver 100% definimos as rotas e montamos o contrato (skill `api-contract`).
- **Feature grande criada/alterada → rodar o agent `browser-tester`** pra testar no navegador e ver os logs antes de dar como pronto.

## Decisões já tomadas
- **Mapa:** Google Maps (`@vis.gl/react-google-maps`). Reverse-geocoding pelo próprio Google.
- **Armazenamento dos terrenos (agora):** **mock em memória** via service (`createMemoryTerrenoService`), reseta no reload. Sessão de login fica em localStorage. Backend (outra lang) depois, sem mexer na UI.
- **Login (agora):** básico local via service; auth real com refresh token vem com o backend.

## Skills e agents deste projeto
- Skills: `frontend-conventions`, `forms`, `api-contract`, `terreno-schema`, `map-deeplinks`, `ui-conventions`, `skill-authoring`.
- Agents: `explorer`, `frontend-builder`, `browser-tester`, `contract-guardian`, `reviewer`.
