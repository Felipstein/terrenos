import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TextField } from '../../components/TextField/TextField'
import { Button } from '../../components/Button/Button'

const loginSchema = z.object({
  username: z.string().min(1, 'Informe o usuário'),
  password: z.string().min(1, 'Informe a senha'),
})

type LoginValues = z.infer<typeof loginSchema>

type LoginScreenProps = {
  onLogin: (username: string, password: string) => Promise<void>
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  async function submit(values: LoginValues) {
    setError(null)
    try {
      await onLogin(values.username, values.password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login')
    }
  }

  return (
    <div className="topo-grid flex min-h-full items-center justify-center bg-paper p-6">
      <form
        onSubmit={handleSubmit(submit)}
        className="flex w-full max-w-sm flex-col gap-5 rounded-sm border border-line bg-surface p-6 shadow-sm"
      >
        <div className="text-center">
          <h1 className="font-serif text-3xl font-semibold text-ink">Terrenos</h1>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-taupe">
            acesso restrito
          </p>
        </div>
        <TextField
          id="username"
          label="Usuário"
          autoComplete="username"
          error={errors.username?.message}
          {...register('username')}
        />
        <TextField
          id="password"
          label="Senha"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        {error ? <p className="text-sm text-clay">{error}</p> : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    </div>
  )
}
