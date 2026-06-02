---
name: skill-authoring
description: Use ao criar ou editar uma skill deste projeto (.claude/skills). Como declarar o que a skill governa e manter as skills em sincronia com o código automaticamente.
---

# Autoria de skills (mantendo tudo em sync)

Skills que documentam **comportamento, regra ou contrato** de arquivos devem declarar o que governam. Assim o hook `skill-guard` lembra de atualizá-las sempre que esses arquivos mudarem.

## Regra
Ao criar/editar uma skill que documenta comportamento de código, adicione no frontmatter:

```yaml
governs:
  - web/src/lib/maps.ts
  - web/src/features/map/**
```

- Globs: `*` casa um segmento; `**` casa qualquer profundidade.
- Skills de **convenção** (como escrever código — `frontend-conventions`, `ui-conventions`) **não** declaram `governs`: você as segue, elas não "driftam" a cada edit.
- Mudou o comportamento de um arquivo governado → **atualize a skill dona na MESMA mudança**.

## Como funciona (auto-extensível)
O hook `.claude/hooks/skill-guard.mjs` lê o `governs` de **todas** as skills a cada edição. Se o arquivo editado casa com algum glob, injeta um lembrete citando a skill. **Skill nova com `governs` entra no sistema sozinha** — nunca se edita o hook.

## Ao criar uma skill pra uma feature nova
1. Documente a feature na skill.
2. Declare `governs` com os arquivos/dirs da feature.
3. Pronto — daí pra frente, mexer nesses arquivos já lembra de atualizar a skill.
