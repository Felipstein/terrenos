// Erro padronizado das chamadas HTTP. `status` é o código da resposta;
// `message` vem do corpo `{ message }` do contrato (schema Error) quando existe.
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}
