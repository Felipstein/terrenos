import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

/**
 * DocumentClient compartilhado. `removeUndefinedValues` deixa os campos
 * opcionais (largura, link, imagens…) sumirem do item em vez de virar `null`.
 */
export const documentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
})
