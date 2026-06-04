import type { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda'
import { makeHandler } from '../../http/makeHandler'
import { ok } from '../../http/response'
import { getAccountId } from '../../http/claims'
import { ListTerrenos } from '../../application/terreno/list-terrenos'
import { DynamoTerrenoRepository } from '../../infra/dynamo/terreno-repository.dynamo'
import { documentClient } from '../../infra/dynamo/client'
import { env } from '../../config/env'

const useCase = new ListTerrenos(new DynamoTerrenoRepository(documentClient, env.tableName))

/** `GET /terrenos` — protegida. Lista todos os terrenos da conta. */
export const handler = makeHandler(async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
  const terrenos = await useCase.execute(getAccountId(event))
  return ok(terrenos)
})
