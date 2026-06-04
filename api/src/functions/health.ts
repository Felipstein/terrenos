import { makeHandler } from '../http/makeHandler'
import { ok } from '../http/response'

/** `GET /health` — pública. */
export const handler = makeHandler(async () => ok({ status: 'ok' }))
