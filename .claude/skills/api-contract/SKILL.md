---
name: api-contract
description: Use ao criar ou alterar qualquer rota da API, endpoint, formato de request/response, status code ou shape de dado trocado entre frontend e backend. O contrato (contract/openapi.yaml) é a fonte da verdade.
---

# Contrato da API (OpenAPI)

`contract/openapi.yaml` é a **fonte da verdade** da API entre o frontend (`web/`) e o backend (outra linguagem, fora deste repo).

## Regra de ouro
Qualquer mudança de API atualiza o contrato **na mesma mudança**:
- rota nova
- request mudou (params, query, body)
- response mudou (campos, tipos, status)
- removeu ou renomeou algo

**Contrato primeiro, implementação depois.** Se você mexeu em código de API e não tocou no `openapi.yaml`, algo está errado.

## Como adicionar/alterar um endpoint
1. Edite `contract/openapi.yaml`: adicione/edite o `path`, o `operationId`, parâmetros, e os schemas em `components/schemas`.
2. Regenere os tipos do front (ver abaixo).
3. Implemente o consumo no front usando os tipos gerados — nunca tipos à mão.
4. (Backend, quando existir) implemente conforme o contrato.

## Tipos no frontend
O front consome **tipos gerados** do contrato (ex: `openapi-typescript`), não tipos manuais. Assim, se o contrato muda e o front não acompanha, o **TypeScript quebra no build** — trava de verdade, não depende de ninguém lembrar.

> O setup do gerador é decisão futura (ainda só temos `/health`). O princípio já vale: nada de tipo de API escrito à mão.

## Backend em outra linguagem
O contrato é agnóstico de linguagem. Quando o backend for definido, ele gera stubs/validação a partir do mesmo `openapi.yaml`. Não duplique a definição em lugar nenhum.

## Relação com outras skills
- Os campos de um terreno viram schema aqui quando virarem resposta de API → `terreno-schema`.
