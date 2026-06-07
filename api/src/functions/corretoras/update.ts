import type { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda'
import { makeHandler } from '../../http/makeHandler'
import { ok } from '../../http/response'
import { getAccountId } from '../../http/claims'
import { parseBody, requirePathParam } from '../../http/validate'
import { corretoraUpdateSchema } from '../../schemas/corretora.schema'
import { UpdateCorretora } from '../../application/corretora/update-corretora'
import { DynamoCorretoraRepository } from '../../infra/dynamo/corretora-repository.dynamo'
import { documentClient } from '../../infra/dynamo/client'
import { env } from '../../config/env'

const useCase = new UpdateCorretora(new DynamoCorretoraRepository(documentClient, env.tableName))

/** `PUT /corretoras/{slug}` — protegida. Atualiza nome/telefone de uma corretora. */
export const handler = makeHandler(async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
  const accountId = getAccountId(event)
  const slug = requirePathParam(event, 'slug')
  const update = parseBody(event, corretoraUpdateSchema)
  const corretora = await useCase.execute(accountId, slug, update)
  return ok(corretora)
})
