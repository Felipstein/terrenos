---
name: terreno-schema
description: Use ao modelar, exibir, cadastrar ou validar dados de um terreno (preço, rua, área, medidas, fotos, link). Define os campos canônicos de um Terreno. Independe de onde os dados ficam guardados.
---

# Modelo de dados: Terreno

Campos canônicos de um terreno. Independe de onde os dados ficam guardados (backend, JSON, etc).

| Campo | Tipo | Obrigatório | Notas |
|-------|------|-------------|-------|
| `id` | string | sim | identificador único |
| `nome` | string | não | apelido do terreno (ex: "Terreno da esquina") |
| `rua` | string | sim | nome da rua / endereço |
| `preco` | number | sim | em BRL — padronize a unidade (reais ou centavos) e mantenha consistente |
| `lat` | number | sim | latitude do pin |
| `lng` | number | sim | longitude do pin |
| `areaTotal` | number | sim | área total em m² |
| `medidas` | array | não | comprimentos dos lados (ex: `["frente 12m", "fundo 30m"]`) |
| `fotos` | string[] | não | URLs das fotos da galeria |
| `fotoPreview` | string | não | URL da foto grande de destaque |
| `link` | string | não | link externo (anúncio do corretor) |

## Regras
- `lat`/`lng` posicionam o pin e alimentam o deep-link de rota → skill `map-deeplinks`.
- `preco`: padronize a unidade e documente no contrato quando a rota existir.
- Quando esse dado virar resposta de API, ele deve refletir no `contract/openapi.yaml` → skill `api-contract`.
