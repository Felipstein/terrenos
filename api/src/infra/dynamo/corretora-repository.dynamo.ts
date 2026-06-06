import {
  GetCommand,
  PutCommand,
  QueryCommand,
  type DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb'
import type { CorretoraRepository } from '../../application/ports/corretora-repository'
import type { Corretora } from '../../domain/corretora/corretora'
import { keys } from './keys'

/** Item como gravado na tabela: entidade + chaves do single-table + discriminador. */
type CorretoraItem = Corretora & {
  PK: string
  SK: string
  type: 'Corretora'
}

function toItem(accountId: string, corretora: Corretora): CorretoraItem {
  return {
    ...corretora,
    PK: keys.accountPk(accountId),
    SK: keys.corretoraSk(corretora.slug),
    type: 'Corretora',
  }
}

function toEntity(item: Record<string, unknown>): Corretora {
  const { PK, SK, type, ...corretora } = item as CorretoraItem
  return corretora
}

/** Implementação DynamoDB (single-table) do repositório de corretoras. */
export class DynamoCorretoraRepository implements CorretoraRepository {
  constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableName: string,
  ) {}

  async list(accountId: string): Promise<Corretora[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': keys.accountPk(accountId),
          ':sk': keys.corretoraSkPrefix,
        },
      }),
    )
    return (result.Items ?? []).map(toEntity)
  }

  async get(accountId: string, slug: string): Promise<Corretora | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { PK: keys.accountPk(accountId), SK: keys.corretoraSk(slug) },
      }),
    )
    return result.Item ? toEntity(result.Item) : null
  }

  async put(accountId: string, corretora: Corretora): Promise<void> {
    await this.client.send(
      new PutCommand({ TableName: this.tableName, Item: toItem(accountId, corretora) }),
    )
  }
}
