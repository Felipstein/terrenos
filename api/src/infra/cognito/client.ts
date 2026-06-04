import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'

/** Cliente Cognito compartilhado. Login/refresh são APIs públicas (sem IAM). */
export const cognitoClient = new CognitoIdentityProviderClient({})
