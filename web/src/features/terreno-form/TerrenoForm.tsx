import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ChangeEvent } from 'react'
import type { Terreno, TerrenoInput } from '../../types/terreno'
import { terrenoSchema } from '../../lib/terreno-validation'
import { recalcArea, type AreaField } from '../../lib/area'
import { TextField } from '../../components/TextField/TextField'
import { CurrencyField } from '../../components/CurrencyField/CurrencyField'
import { Button } from '../../components/Button/Button'
import { LocationPicker } from './LocationPicker'
import { PasteMapsLink } from './PasteMapsLink'
import { useReverseGeocode } from '../map/useReverseGeocode'

type TerrenoFormValues = {
  rua: string
  preco: number
  lat: number
  lng: number
  areaTotal: number
  largura?: number
  comprimento?: number
  link?: string
}

type TerrenoFormProps = {
  initial: Terreno | null
  centerLat: number
  centerLng: number
  onSubmit: (input: TerrenoInput) => void
}

function numU(value: number | undefined): number | undefined {
  return typeof value === 'number' && !Number.isNaN(value) ? value : undefined
}

function toDefaults(initial: Terreno | null, lat: number, lng: number): Partial<TerrenoFormValues> {
  if (!initial) return { lat, lng }
  return {
    rua: initial.rua,
    preco: initial.preco,
    lat: initial.lat,
    lng: initial.lng,
    areaTotal: initial.areaTotal,
    largura: initial.largura,
    comprimento: initial.comprimento,
    link: initial.link,
  }
}

export function TerrenoForm({ initial, centerLat, centerLng, onSubmit }: TerrenoFormProps) {
  const reverseGeocode = useReverseGeocode()
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TerrenoFormValues>({
    resolver: zodResolver(terrenoSchema) as Resolver<TerrenoFormValues>,
    defaultValues: toDefaults(initial, centerLat, centerLng),
  })

  const lat = watch('lat')
  const lng = watch('lng')

  async function applyPoint(nextLat: number, nextLng: number) {
    setValue('lat', nextLat, { shouldValidate: true })
    setValue('lng', nextLng, { shouldValidate: true })
    const address = await reverseGeocode(nextLat, nextLng)
    if (address) setValue('rua', address, { shouldValidate: true })
  }

  const areaRegisters = {
    total: register('areaTotal', { valueAsNumber: true }),
    largura: register('largura', { valueAsNumber: true }),
    comprimento: register('comprimento', { valueAsNumber: true }),
  }

  function handleAreaChange(field: AreaField) {
    return async (event: ChangeEvent<HTMLInputElement>) => {
      await areaRegisters[field].onChange(event)
      const values = getValues()
      const next = recalcArea(field, {
        total: numU(values.areaTotal),
        largura: numU(values.largura),
        comprimento: numU(values.comprimento),
      })
      if (field !== 'total' && next.total !== undefined) setValue('areaTotal', next.total)
      if (field !== 'largura' && next.largura !== undefined) setValue('largura', next.largura)
      if (field !== 'comprimento' && next.comprimento !== undefined) {
        setValue('comprimento', next.comprimento)
      }
    }
  }

  function submit(values: TerrenoFormValues) {
    onSubmit(values as TerrenoInput)
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <LocationPicker lat={lat} lng={lng} onChange={applyPoint} />
        <p className="text-xs text-taupe">Toque no mapa ou arraste o pino pra marcar o local.</p>
        <PasteMapsLink onResolved={applyPoint} />
      </div>

      <TextField
        id="rua"
        label="Rua / endereço"
        placeholder="Preenche sozinho pelo mapa — edite se precisar"
        error={errors.rua?.message}
        {...register('rua')}
      />

      <CurrencyField
        id="preco"
        label="Preço"
        value={watch('preco')}
        onChange={(next) => setValue('preco', next as number, { shouldValidate: true })}
        error={errors.preco?.message}
      />

      <div>
        <div className="grid grid-cols-3 gap-3">
          <TextField
            id="areaTotal"
            label="Total (m²)"
            inputMode="decimal"
            error={errors.areaTotal?.message}
            {...areaRegisters.total}
            onChange={handleAreaChange('total')}
          />
          <TextField
            id="largura"
            label="Largura (m)"
            inputMode="decimal"
            {...areaRegisters.largura}
            onChange={handleAreaChange('largura')}
          />
          <TextField
            id="comprimento"
            label="Comprimento (m)"
            inputMode="decimal"
            {...areaRegisters.comprimento}
            onChange={handleAreaChange('comprimento')}
          />
        </div>
        <p className="mt-1 text-xs text-taupe">Preencha 2 e o terceiro se completa.</p>
      </div>

      <TextField
        id="link"
        label="Link do anúncio (opcional)"
        placeholder="https://..."
        error={errors.link?.message}
        {...register('link')}
      />

      <Button type="submit" disabled={isSubmitting} className="mt-1">
        {initial ? 'Salvar alterações' : 'Salvar terreno'}
      </Button>
    </form>
  )
}
