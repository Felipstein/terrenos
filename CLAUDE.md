# Terrenos

App pessoal pra encontrar terrenos pra comprar. Mapa **mobile-first**, **sem login**, acessado pelo navegador do celular.

## O que o app faz
- Mapa com pins de todos os terrenos; cada pin mostra o **preço**.
- Tocar no pin → detalhe: galeria de fotos, foto preview grande, nome da rua, área total, comprimentos das medidas, link opcional (corretor).
- Botão de **rota** que abre o **Google Maps nativo** do celular com a rota até o terreno.
- O cadastro dos terrenos é feito na própria plataforma.

## Estrutura do repo
- `web/` — frontend: **Vite + React 19 (React Compiler) + TypeScript + TailwindCSS puro (v4)**, indent 2 espaços, gerenciador **pnpm**. shadcn como base de componente, mas **sem as CSS vars de tema** (Tailwind puro). Light mode.
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
- Mobile-first sempre. Sem login, sem auth. TS estrito, sem `any`.
- **1 componente por arquivo.** SRP; componente grande → divide; lógica/componente repetido → abstrai.
- Sempre **`export function`** — nunca `const` pra componente, nunca `export default`.
- Composition pattern estilo shadcn em **pasta por componente** (`Dialog/DialogRoot.tsx`, `Dialog/DialogTrigger.tsx`, …).
- **`type`** pra tipagem do front; **`interface`** pra contratos.
- **Camada de service**: a UI não conhece a origem dos dados. **Agora: localStorage**; depois troca pra backend sem mexer na UI.
- **UI minimalista, moderna, bonita; UX excelente. Nada de UI genérica de IA.** Light mode.
- **Testes só em negócio/regra** (services, validações, cálculos) — não em componente visual.

## Fluxo de trabalho
- Validar o **front primeiro** (com localStorage). Só quando o front estiver 100% definimos as rotas e montamos o contrato (skill `api-contract`).
- **Feature grande criada/alterada → rodar o agent `browser-tester`** pra testar no navegador e ver os logs antes de dar como pronto.

## Decisões em aberto (não chutar — perguntar)
- **Armazenamento dos terrenos** (backend próprio / Supabase / JSON / Sheets): a definir.
- **Biblioteca de mapa** (Leaflet / Google / Mapbox): a definir. O deep-link de rota pro Google Maps **independe** dessa escolha.

## Skills e agents deste projeto
- Skills: `frontend-conventions`, `api-contract`, `terreno-schema`, `map-deeplinks`, `ui-conventions`.
- Agents: `explorer`, `frontend-builder`, `browser-tester`, `contract-guardian`, `reviewer`.
