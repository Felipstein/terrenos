# Terrenos

App pessoal pra encontrar terrenos pra comprar. Mapa **mobile-first**, **sem login**, acessado pelo navegador do celular.

## O que o app faz
- Mapa com pins de todos os terrenos; cada pin mostra o **preço**.
- Tocar no pin → detalhe: galeria de fotos, foto preview grande, nome da rua, área total, comprimentos das medidas, link opcional (corretor).
- Botão de **rota** que abre o **Google Maps nativo** do celular com a rota até o terreno.
- O cadastro dos terrenos é feito na própria plataforma.

## Estrutura do repo
- `web/` — frontend: **Vite + React 19 (React Compiler) + TypeScript**, indent 2 espaços, gerenciador **pnpm**.
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

## Convenções
- Mobile-first sempre: desenhe pro celular primeiro, depois adapte.
- Sem login, sem auth.
- TypeScript estrito; sem `any` em código de produção.

## Decisões em aberto (não chutar — perguntar)
- **Armazenamento dos terrenos** (backend próprio / Supabase / JSON / Sheets): a definir.
- **Biblioteca de mapa** (Leaflet / Google / Mapbox): a definir. O deep-link de rota pro Google Maps **independe** dessa escolha.

## Skills e agents deste projeto
- Skills: `api-contract`, `terreno-schema`, `map-deeplinks`, `ui-conventions`.
- Agents: `explorer`, `frontend-builder`, `contract-guardian`, `reviewer`.
