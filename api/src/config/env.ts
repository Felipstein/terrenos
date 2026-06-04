function required(name: string): string {
  const value = process.env[name]
  if (value === undefined || value === '') {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`)
  }
  return value
}

/**
 * Acesso tipado às variáveis de ambiente. Getters (lazy) pra que cada função só
 * exija o que realmente usa — uma Lambda de auth não quebra por falta do bucket.
 */
export const env = {
  get tableName(): string {
    return required('MAIN_TABLE_NAME')
  },
  get cognitoClientId(): string {
    return required('COGNITO_CLIENT_ID')
  },
  get imagesBucket(): string {
    return required('IMAGES_BUCKET_NAME')
  },
  get publicAssetBaseUrl(): string {
    return required('PUBLIC_ASSET_BASE_URL').replace(/\/+$/, '')
  },
}
