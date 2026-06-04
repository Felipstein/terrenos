import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  type DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb'
import type { TerrenoRepository } from '../../application/ports/terreno-repository'
import type { Terreno } from '../../domain/terreno/terreno'
import { keys } from './keys'

/** Item como gravado na tabela: entidade + chaves do single-table + discriminador. */
type TerrenoItem = Terreno & {
  PK: string
  SK: string
  type: 'Terreno'
}

function toItem(accountId: string, terreno: Terreno): TerrenoItem {
  return {
    ...terreno,
    PK: keys.accountPk(accountId),
    SK: keys.terrenoSk(terreno.id),
    type: 'Terreno',
  }
}

function toEntity(item: Record<string, unknown>): Terreno {
  const { PK, SK, type, ...terreno } = item as TerrenoItem
  return terreno
}

/** Implementação DynamoDB (single-table) do repositório de terrenos. */
export class DynamoTerrenoRepository implements TerrenoRepository {
  constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableName: string,
  ) {}

  async list(accountId: string): Promise<Terreno[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': keys.accountPk(accountId),
          ':sk': keys.terrenoSkPrefix,
        },
      }),
    )
    return (result.Items ?? []).map(toEntity)
  }

  async get(accountId: string, id: string): Promise<Terreno | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { PK: keys.accountPk(accountId), SK: keys.terrenoSk(id) },
      }),
    )
    return result.Item ? toEntity(result.Item) : null
  }

  async put(accountId: string, terreno: Terreno): Promise<void> {
    await this.client.send(
      new PutCommand({ TableName: this.tableName, Item: toItem(accountId, terreno) }),
    )
  }

  async delete(accountId: string, id: string): Promise<boolean> {
    const result = await this.client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { PK: keys.accountPk(accountId), SK: keys.terrenoSk(id) },
        ReturnValues: 'ALL_OLD',
      }),
    )
    return result.Attributes !== undefined
  }
}
