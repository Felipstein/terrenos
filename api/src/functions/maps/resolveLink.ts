import type { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda'
import { makeHandler } from '../../http/makeHandler'
import { ok } from '../../http/response'
import { parseBody } from '../../http/validate'
import { resolveMapsLinkSchema } from '../../schemas/maps.schema'
import { ResolveMapsLink } from '../../application/maps/resolve-maps-link'
import { HttpMapsResolver } from '../../infra/maps/maps-resolver.http'

const useCase = new ResolveMapsLink(new HttpMapsResolver())

/** `POST /maps/resolve-link` — protegida. Resolve link do Maps em coordenadas. */
export const handler = makeHandler(async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
  const { url } = parseBody(event, resolveMapsLinkSchema)
  const location = await useCase.execute(url)
  return ok(location)
})
