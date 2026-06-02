---
name: forms
description: Use ao criar ou alterar QUALQUER formulário no front. Padrão obrigatório do projeto: react-hook-form + zod + @hookform/resolvers.
---

# Formulários — padrão do projeto

**Todo** formulário usa **react-hook-form + zod + @hookform/resolvers**. Sem exceção.

## Receita
1. Schema **zod** = fonte da validação (ex: `lib/terreno-validation.ts`). Reaproveite o schema do domínio quando existir.
2. `useForm({ resolver: zodResolver(schema), defaultValues })`.
3. Campos via componente `TextField` — em React 19 o `ref` é prop normal, então `{...register('campo')}` flui direto pro input.
4. Numéricos: `register('campo', { valueAsNumber: true })`.
5. Erros: `errors.campo?.message` (mensagens vêm do zod).
6. **Lógica de negócio do form** (ex: auto-cálculo, derivações) vai em **função pura testada** (ex: `lib/area.ts`), nunca inline no componente.

## Exemplos no repo
- `features/terreno-form/TerrenoForm.tsx` (form complexo: mapa, auto-cálculo, geocoding).
- `features/auth/LoginScreen.tsx` (form simples).

## Observação
O React Compiler emite um warning de "não memoizável" ao usar `watch()` do RHF — é esperado e benigno (só pula a memoização daquele componente).
