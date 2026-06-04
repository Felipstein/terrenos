import { describe, expect, it, vi } from 'vitest'
import {
  NotAuthorizedException,
  type CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider'
import { CognitoAuthProvider } from '../../src/infra/cognito/auth-provider.cognito'
import { UnauthorizedError } from '../../src/domain/errors'

function providerWith(send: ReturnType<typeof vi.fn>): CognitoAuthProvider {
  const client = { send } as unknown as CognitoIdentityProviderClient
  return new CognitoAuthProvider(client, 'client-id')
}

describe('CognitoAuthProvider.login', () => {
  it('mapeia o AuthenticationResult pra AuthResult', async () => {
    const send = vi.fn().mockResolvedValue({
      AuthenticationResult: {
        AccessToken: 'access',
        RefreshToken: 'refresh',
        ExpiresIn: 3600,
      },
    })
    const result = await providerWith(send).login('felipe@x.com', 'pw')
    expect(result).toEqual({
      accessToken: 'access',
      refreshToken: 'refresh',
      expiresIn: 3600,
      username: 'felipe@x.com',
    })
  })

  it('converte erro de credencial do Cognito em UnauthorizedError', async () => {
    const send = vi
      .fn()
      .mockRejectedValue(new NotAuthorizedException({ message: 'bad', $metadata: {} }))
    await expect(providerWith(send).login('felipe@x.com', 'wrong')).rejects.toBeInstanceOf(
      UnauthorizedError,
    )
  })
})

describe('CognitoAuthProvider.refresh', () => {
  it('devolve o refresh token rotacionado quando o Cognito manda um novo', async () => {
    const send = vi.fn().mockResolvedValue({
      AuthenticationResult: {
        AccessToken: 'access-2',
        RefreshToken: 'refresh-2',
        ExpiresIn: 3600,
      },
    })
    const result = await providerWith(send).refresh('refresh-1')
    expect(result).toEqual({ accessToken: 'access-2', refreshToken: 'refresh-2', expiresIn: 3600 })
  })

  it('reusa o refresh atual se o Cognito não rotacionar', async () => {
    const send = vi.fn().mockResolvedValue({
      AuthenticationResult: { AccessToken: 'access-2', ExpiresIn: 3600 },
    })
    const result = await providerWith(send).refresh('refresh-1')
    expect(result.refreshToken).toBe('refresh-1')
  })
})
