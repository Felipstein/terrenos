import type { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda'
import { makeHandler } from '../../http/makeHandler'
import { ok } from '../../http/response'
import { getAccountId } from '../../http/claims'
import { ListCorretoras } from '../../application/corretora/list-corretoras'
import { DynamoCorretoraRepository } from '../../infra/dynamo/corretora-repository.dynamo'
import { documentClient } from '../../infra/dynamo/client'
import { env } from '../../config/env'

const useCase = new ListCorretoras(new DynamoCorretoraRepository(documentClient, env.tableName))

/** `GET /corretoras` — protegida. Lista as corretoras usadas na conta. */
export const handler = makeHandler(async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
  const corretoras = await useCase.execute(getAccountId(event))
  return ok(corretoras)
})
