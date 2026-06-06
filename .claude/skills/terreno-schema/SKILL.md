---
name: terreno-schema
description: Use ao modelar, exibir, cadastrar, editar ou validar dados de um terreno (preço, rua, área, largura, comprimento, link). Define os campos canônicos e a regra de auto-cálculo das medidas.
governs:
  - web/src/types/terreno.ts
  - web/src/lib/terreno-validation.ts
  - web/src/lib/area.ts
  - web/src/lib/format.ts
  - web/src/services/terreno-service.ts
  - web/src/services/seed.ts
  - web/src/lib/imagem.ts
  - web/src/services/upload-service.ts
  - web/src/features/terreno-form/**
  - web/src/features/terreno-detail/TerrenoInfo.tsx
---

# Modelo de dados: Terreno

Campos canônicos (independe de onde os dados ficam guardados).

| Campo | Tipo | Obrigatório | Notas |
|-------|------|-------------|-------|
| `id` | string | sim | identificador único |
| `rua` | string | sim | endereço; autopreenchido via geocoding, **editável** |
| `preco` | number | não | em BRL; **opcional** — ausente quando ainda está a negociar |
| `lat` | number | sim | latitude do pin |
| `lng` | number | sim | longitude do pin |
| `areaTotal` | number | sim | área total em m² |
| `largura` | number | não | metros |
| `comprimento` | number | não | metros |
| `link` | string | não | anúncio do corretor |
| `imagens` | `TerrenoImagem[]` | não | `{ id, url }` — opcional |
| `principalId` | string | não | id da imagem principal (pin, hover da tabela, detalhe) |

> `imagemPrincipal(terreno)` (`lib/imagem.ts`) = a marcada por `principalId`, senão a 1ª. Upload via `upload-service.ts` (mock: data URL em memória; backend depois retorna URL remota — só troca a impl). Estados de upload no hook `useImageUploads`.

## Preço ausente (a negociar)
`preco` é opcional. Sem valor, exibe-se o rótulo **"Sob consulta"** (`PRICE_TBD` em `lib/format.ts`) via `displayPrice` / `displayPriceShort` — **não** chamar `formatPrice` direto com valor possivelmente `undefined`. No mapa o pin sem preço usa cor **taupe** (vs. clay com preço, moss selecionado). Na ordenação por preço, os sem-preço vão sempre pro **fim** (asc e desc).

## Auto-cálculo das medidas
`total = largura × comprimento`. Preenchidos 2, o 3º se completa. Lógica pura e testada em `lib/area.ts` (`recalcArea`) — **não** reimplementar inline.

## Validação
A fonte da validação é o zod em `lib/terreno-validation.ts` (`terrenoSchema`); o form consome via `zodResolver` (skill `forms`). `TerrenoInput = z.infer<typeof terrenoSchema>` e `Terreno = TerrenoInput & { id }`.

## Storage
**Mock em memória** via `terreno-service.ts` (`createMemoryTerrenoService`): começa do `seed.ts` e **reseta a cada reload** (sem persistência — é dado de exemplo). O service esconde a origem; quando virar API, troca-se a implementação e reflete no `contract/openapi.yaml` (skill `api-contract`).
