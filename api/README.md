# Terrenos API

Backend serverless do app Terrenos. Serve o contrato em `../contract/openapi.yaml`
(fonte da verdade). **Simples, em camadas, baixo custo.**

- **Runtime:** AWS Lambda (Node 24, arm64, 128MB), API Gateway **httpApi**.
- **Dados:** DynamoDB **single-table** (PAY_PER_REQUEST, sem GSI).
- **Auth:** Cognito (login `USER_PASSWORD_AUTH`, refresh **rotativo**, JWT authorizer).
- **Imagens:** S3 via **presigned POST** (o Lambda só assina, nunca recebe o binário).
- **Build:** esbuild nativo do Serverless v4, `@aws-sdk/*` externo (vem no runtime);
  só o `zod/mini` é bundlado → bundle minúsculo. Validação com `zod/mini`.

## Arquitetura (camadas + inversão de dependência)

```
src/
  domain/        Entidades e regras puras (Terreno, invariantes, erros). Sem libs.
  application/
    ports/       Interfaces (abstrações): repository, auth, storage, maps.
    <feature>/   Use cases. Dependem SÓ das ports (constructor injection).
  infra/         Adapters que implementam as ports (DynamoDB, Cognito, S3, fetch).
  http/          Plumbing: makeHandler, response, errors, claims, validate.
  schemas/       Schemas zod/mini das requests.
  functions/     Entrypoints Lambda. Cada um faz o wiring das suas deps (ver abaixo).
  config/        Acesso tipado a env vars.
```

Fluxo de uma request:
`functions/*` → `makeHandler` (parse/claims/erros) → **use case** → **port** ← **adapter (infra)**.

**Composição por função (não há container global):** cada arquivo em `functions/`
instancia o use case com os adapters concretos no escopo do módulo. Isso mantém o
bundle de cada Lambda mínimo (uma função de auth não carrega o cliente do S3) e o
cold start baixo. Trocar uma implementação = trocar o adapter no entrypoint.

A regra de negócio nunca conhece HTTP nem AWS: lança erros de domínio
(`domain/errors.ts`) que `http/errors.ts` traduz pra status code.

## Single-table design

Uma tabela, chaves genéricas `PK`/`SK`. Tudo de uma conta na mesma partição.

| Item    | PK                 | SK              | Notas                          |
|---------|--------------------|-----------------|--------------------------------|
| Terreno | `ACCT#<accountId>` | `TERRENO#<id>`  | `accountId` = `sub` do Cognito |

Access patterns (cobrem o contrato inteiro, **sem GSI** → mais barato):
- **Listar terrenos:** `Query PK = ACCT#x AND begins_with(SK, "TERRENO#")`.
- **Get/Put/Delete por id:** chave exata `PK` + `SK`.

Builders de chave centralizados em `src/infra/dynamo/keys.ts`. Pra adicionar uma
entidade nova, defina lá o par PK/SK dela (mantendo um prefixo no SK) e crie o
repository/adapter correspondente — sem migração de schema.

## Auth (Cognito)

- `accountId = sub` do Cognito (1 usuário = 1 conta = 1 partição). Sem custom
  attribute, sem PreTokenGeneration.
- `POST /auth/login` → `USER_PASSWORD_AUTH` (email como username).
- `POST /auth/refresh` → `REFRESH_TOKEN_AUTH`. **Rotation habilitada**: devolve um
  refresh token novo a cada chamada (o front persiste o novo).
- `GET /me` → `GetUser` (autoriza pelo próprio access token, sem IAM) → e-mail.
- O front manda o **access token** no header; o JWT authorizer valida.

## Uploads (presigned POST)

`POST /uploads { contentType }` → `{ upload: { url, fields }, image: { id, url } }`.
O cliente faz o `multipart/form-data` POST direto pro S3 (campo `file` por último).
O policy assinado trava tamanho (≤ 5MB) e content-type. Objeto em
`images/<accountId>/<id>.<ext>`, leitura pública só desse prefixo (bucket policy).

## Comandos

```bash
pnpm install
pnpm typecheck     # tsc --noEmit (estrito)
pnpm test          # vitest (regras de negócio)

# Deploy é feito pelo Felipe:
pnpm deploy        # serverless deploy --stage dev

# Seed da conta única (rodar local após o 1º deploy, com suas credenciais AWS).
# --password é OBRIGATÓRIO; --stage é opcional (default dev). Descobre o
# user pool sozinho pelo nome `terrenos-<stage>-user-pool`:
pnpm seed --password '<senha>'                # stage dev
pnpm seed --password '<senha>' --stage prod   # prod
```

> Seed num app serverless é um **script local one-off** (`scripts/seed.ts`), rodado
> contra os recursos já deployados — não é um endpoint/Lambda. Idempotente. Sem
> senha no repo: a senha vem sempre por `--password`. No CI/CD esse mesmo comando
> é um step pós-deploy (senha vinda de secret).

## CI/CD (deploy automático de prod)

Workflow: `.github/workflows/deploy-api.yml`. Backend-only — o front sobe sozinho
na Vercel. Toda vez que um commit que toca `api/**` chega na `main`:

1. `pnpm install --frozen-lockfile`
2. **`pnpm run typecheck`** + **`pnpm run test`** (gate — falhou, não deploya)
3. `serverless deploy --stage prod`
4. `pnpm run seed --stage prod` (idempotente; senha vinda do secret)

**Auth na AWS via OIDC** (`aws-actions/configure-aws-credentials`): o GitHub assume
uma IAM role por token de curta duração. **Nenhuma access key estática** guardada —
ideal pra repo público. A role (`GitHubActionsRole`) é **IaC**: vive no
`serverless.yml`, criada só no stack de prod (`Condition: IsProd`), e a trust policy
só aceita `repo:Felipstein/terrenos:ref:refs/heads/main`.

### Setup (uma vez só)

```bash
# 1) OIDC provider do GitHub (único por conta AWS; idempotente).
cd api && pnpm setup:oidc

# 2) 1º deploy de prod LOCAL (com suas creds admin) — é ele que cria a role.
#    Bootstrap: a partir daqui o CI assume a role sozinho.
pnpm run deploy --stage prod

# 3) Pegue o ARN da role no output do deploy (chave GitHubActionsRoleArn).
#    Se precisar de novo depois:
aws cloudformation describe-stacks --stack-name terrenos-prod \
  --query "Stacks[0].Outputs[?OutputKey=='GitHubActionsRoleArn'].OutputValue" --output text
```

```text
# 4) GitHub → Settings → Secrets and variables → Actions → New repository secret:
AWS_DEPLOY_ROLE_ARN    ARN do passo 3 (arn:aws:iam::<conta>:role/terrenos-github-actions-role)
SEED_PASSWORD          a senha da conta única (fica só no secret, nunca no repo)
SERVERLESS_ACCESS_KEY  access key do Serverless Framework v4 (app.serverless.com → Access Keys)
```

Depois disso, é só dar merge na `main`. Pra rodar sem commit: aba **Actions →
Deploy API (prod) → Run workflow**.

## Variáveis de ambiente (injetadas pelo serverless.yml)

| Var                    | Origem                                    |
|------------------------|-------------------------------------------|
| `MAIN_TABLE_NAME`      | nome da tabela DynamoDB                    |
| `COGNITO_CLIENT_ID`    | client do user pool                        |
| `COGNITO_USER_POOL_ID` | user pool                                  |
| `IMAGES_BUCKET_NAME`   | bucket de imagens                          |
| `PUBLIC_ASSET_BASE_URL`| base pública do bucket (`https://…`)       |
