import type { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda'
import { makeHandler } from '../../http/makeHandler'
import { noContent } from '../../http/response'
import { getAccountId } from '../../http/claims'
import { requirePathParam } from '../../http/validate'
import { DeleteTerreno } from '../../application/terreno/delete-terreno'
import { DynamoTerrenoRepository } from '../../infra/dynamo/terreno-repository.dynamo'
import { documentClient } from '../../infra/dynamo/client'
import { env } from '../../config/env'

const useCase = new DeleteTerreno(new DynamoTerrenoRepository(documentClient, env.tableName))

/** `DELETE /terrenos/{id}` — protegida. Remove um terreno. */
export const handler = makeHandler(async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
  const accountId = getAccountId(event)
  const id = requirePathParam(event, 'id')
  await useCase.execute(accountId, id)
  return noContent()
})
