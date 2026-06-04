import type { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda'
import { makeHandler } from '../../http/makeHandler'
import { ok } from '../../http/response'
import { getAccountId } from '../../http/claims'
import { parseBody, requirePathParam } from '../../http/validate'
import { terrenoInputSchema } from '../../schemas/terreno.schema'
import { UpdateTerreno } from '../../application/terreno/update-terreno'
import { DynamoTerrenoRepository } from '../../infra/dynamo/terreno-repository.dynamo'
import { documentClient } from '../../infra/dynamo/client'
import { env } from '../../config/env'

const useCase = new UpdateTerreno(new DynamoTerrenoRepository(documentClient, env.tableName))

/** `PUT /terrenos/{id}` — protegida. Atualiza um terreno. */
export const handler = makeHandler(async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
  const accountId = getAccountId(event)
  const id = requirePathParam(event, 'id')
  const input = parseBody(event, terrenoInputSchema)
  const terreno = await useCase.execute(accountId, id, input)
  return ok(terreno)
})
