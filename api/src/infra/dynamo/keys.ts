/**
 * Builders das chaves do single-table design.
 *
 * | Item      | PK                  | SK                  |
 * |-----------|---------------------|---------------------|
 * | Terreno   | `ACCT#<accountId>`  | `TERRENO#<id>`      |
 * | Corretora | `ACCT#<accountId>`  | `CORRETORA#<slug>`  |
 *
 * Tudo de uma conta vive na mesma partição (`PK`), então listar é um `Query`
 * barato por `PK` + `begins_with(SK, '<PREFIXO>#')`. Pra adicionar uma entidade
 * nova, defina aqui o par PK/SK dela e mantenha o prefixo no `SK`.
 */
export const keys = {
  accountPk: (accountId: string): string => `ACCT#${accountId}`,
  terrenoSk: (id: string): string => `TERRENO#${id}`,
  terrenoSkPrefix: 'TERRENO#',
  corretoraSk: (slug: string): string => `CORRETORA#${slug}`,
  corretoraSkPrefix: 'CORRETORA#',
} as const
