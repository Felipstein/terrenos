import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Corretora, CorretoraUpdateInput } from '../../types/corretora'
import { corretoraEditSchema, type CorretoraEditValues } from '../../lib/corretora-validation'
import { TextField } from '../../components/TextField/TextField'
import { Button } from '../../components/Button/Button'

type CorretoraEditFormProps = {
  corretora: Corretora
  onSubmit: (slug: string, input: CorretoraUpdateInput) => Promise<void> | void
}

// Form de edição de uma corretora (nome + telefone). Não muda o slug.
export function CorretoraEditForm({ corretora, onSubmit }: CorretoraEditFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CorretoraEditValues>({
    resolver: zodResolver(corretoraEditSchema) as Resolver<CorretoraEditValues>,
    defaultValues: { name: corretora.name, phone: corretora.phone ?? '' },
  })

  async function submit(values: CorretoraEditValues) {
    await onSubmit(corretora.slug, { name: values.name, phone: values.phone ?? '' })
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <TextField id="corretora-name" label="Nome" error={errors.name?.message} {...register('name')} />
      <TextField
        id="corretora-phone"
        label="Telefone (opcional)"
        placeholder="(45) 3333-0000"
        inputMode="tel"
        error={errors.phone?.message}
        {...register('phone')}
      />
      <Button type="submit" disabled={isSubmitting} className="mt-1">
        {isSubmitting ? 'Salvando…' : 'Salvar corretora'}
      </Button>
    </form>
  )
}
