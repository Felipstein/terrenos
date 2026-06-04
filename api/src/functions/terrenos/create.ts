import type { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda'
import { makeHandler } from '../../http/makeHandler'
import { created } from '../../http/response'
import { getAccountId } from '../../http/claims'
import { parseBody } from '../../http/validate'
import { terrenoInputSchema } from '../../schemas/terreno.schema'
import { CreateTerreno } from '../../application/terreno/create-terreno'
import { DynamoTerrenoRepository } from '../../infra/dynamo/terreno-repository.dynamo'
import { documentClient } from '../../infra/dynamo/client'
import { env } from '../../config/env'

const useCase = new CreateTerreno(new DynamoTerrenoRepository(documentClient, env.tableName))

/** `POST /terrenos` — protegida. Cria um terreno. */
export const handler = makeHandler(async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
  const accountId = getAccountId(event)
  const input = parseBody(event, terrenoInputSchema)
  const terreno = await useCase.execute(accountId, input)
  return created(terreno)
})
