/**
 * Seed da conta única. Cria o usuário no Cognito se ainda não existir
 * (idempotente). Roda LOCAL, com suas credenciais AWS — não é uma Lambda.
 *
 * Num app serverless, seed = script one-off rodado contra os recursos já
 * deployados (não vira endpoint). Daí viver em `scripts/`.
 *
 * Uso:
 *   pnpm seed --password '<senha>'                  # stage dev (default)
 *   pnpm seed --password '<senha>' --stage prod     # outro stage
 *   pnpm seed --password '<senha>' --email outro@x  # outro e-mail (opcional)
 *
 * --password é OBRIGATÓRIO (sem default — nada de senha no repo).
 * Descobre o user pool sozinho pelo nome `terrenos-<stage>-user-pool`.
 * Região vem de AWS_REGION (default sa-east-1).
 */
import { parseArgs } from 'node:util'
import {
  AdminCreateUserCommand,
  AdminGetUserCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
  ListUserPoolsCommand,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider'

const SERVICE = 'terrenos'
const DEFAULT_EMAIL = 'luisfelipe-oliveira@outlook.com.br'

const { values } = parseArgs({
  options: {
    password: { type: 'string' },
    stage: { type: 'string', default: 'dev' },
    email: { type: 'string', default: DEFAULT_EMAIL },
  },
})

if (!values.password) {
  console.error("Senha obrigatória. Uso: pnpm seed --password '<senha>' [--stage dev]")
  process.exit(1)
}

const password = values.password
const stage = values.stage
const email = values.email

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION ?? 'sa-east-1',
})

/** Acha o id do user pool pelo nome do serviço/stage (paginando se preciso). */
async function resolveUserPoolId(): Promise<string> {
  const name = `${SERVICE}-${stage}-user-pool`
  let nextToken: string | undefined
  do {
    const page = await client.send(new ListUserPoolsCommand({ MaxResults: 60, NextToken: nextToken }))
    const found = page.UserPools?.find((pool) => pool.Name === name)
    if (found?.Id) {
      return found.Id
    }
    nextToken = page.NextToken
  } while (nextToken)

  throw new Error(
    `User pool "${name}" não encontrado. Confirme o --stage e a região (AWS_REGION) do deploy.`,
  )
}

async function userExists(userPoolId: string): Promise<boolean> {
  try {
    await client.send(new AdminGetUserCommand({ UserPoolId: userPoolId, Username: email }))
    return true
  } catch (error) {
    if (error instanceof UserNotFoundException) {
      return false
    }
    throw error
  }
}

async function seed(): Promise<void> {
  const userPoolId = await resolveUserPoolId()

  if (await userExists(userPoolId)) {
    console.log(`Conta "${email}" já existe em ${stage} — nada a fazer.`)
    return
  }

  await client.send(
    new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: email,
      MessageAction: 'SUPPRESS', // não manda e-mail de convite
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },
      ],
    }),
  )

  // Senha permanente (sem fluxo FORCE_CHANGE_PASSWORD).
  await client.send(
    new AdminSetUserPasswordCommand({
      UserPoolId: userPoolId,
      Username: email,
      Password: password,
      Permanent: true,
    }),
  )

  console.log(`Conta "${email}" criada em ${stage} (pool ${userPoolId}).`)
}

seed().catch((error: unknown) => {
  console.error('Falha na seed:', error)
  process.exit(1)
})
