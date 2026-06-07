import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, type ChangeEvent } from 'react'
import type { Terreno, TerrenoInput } from '../../types/terreno'
import { terrenoSchema } from '../../lib/terreno-validation'
import { recalcArea, type AreaField } from '../../lib/area'
import { TextField } from '../../components/TextField/TextField'
import { CurrencyField } from '../../components/CurrencyField/CurrencyField'
import { Combobox } from '../../components/Combobox/Combobox'
import { Switch } from '../../components/Switch/Switch'
import { Button } from '../../components/Button/Button'
import type { Corretora } from '../../types/corretora'
import { LocationPicker } from './LocationPicker'
import { PasteMapsLink } from './PasteMapsLink'
import { useReverseGeocode } from '../map/useReverseGeocode'
import { useImageUploads } from './useImageUploads'
import { ImageUploader } from '../../components/ImageUploader/ImageUploader'

type TerrenoFormValues = {
  rua: string
  isCorner: boolean
  preco?: number
  lat: number
  lng: number
  areaTotal: number
  largura?: number
  comprimento?: number
  link?: string
  whatsapp?: string
  corretora?: string
}

type TerrenoFormProps = {
  initial: Terreno | null
  centerLat: number
  centerLng: number
  corretoras: Corretora[]
  onSubmit: (input: TerrenoInput) => Promise<void> | void
  onDirtyChange?: (dirty: boolean) => void
}

function numU(value: number | undefined): number | undefined {
  return typeof value === 'number' && !Number.isNaN(value) ? value : undefined
}

function toDefaults(initial: Terreno | null, lat: number, lng: number): Partial<TerrenoFormValues> {
  if (!initial) return { lat, lng, isCorner: false }
  return {
    rua: initial.rua,
    isCorner: initial.isCorner,
    preco: initial.preco,
    lat: initial.lat,
    lng: initial.lng,
    areaTotal: initial.areaTotal,
    largura: initial.largura,
    comprimento: initial.comprimento,
    link: initial.link,
    whatsapp: initial.whatsapp,
    corretora: initial.corretora,
  }
}

export function TerrenoForm({
  initial,
  centerLat,
  centerLng,
  corretoras,
  onSubmit,
  onDirtyChange,
}: TerrenoFormProps) {
  const reverseGeocode = useReverseGeocode()
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<TerrenoFormValues>({
    resolver: zodResolver(terrenoSchema) as Resolver<TerrenoFormValues>,
    defaultValues: toDefaults(initial, centerLat, centerLng),
  })

  const lat = watch('lat')
  const lng = watch('lng')
  const uploads = useImageUploads(initial?.imagens, initial?.principalId)

  // Avisa o sheet quando há alterações não salvas (campos do form ou galeria),
  // pra ele confirmar antes de fechar sem querer. Usamos `dirtyFields` em vez de
  // `isDirty`: o `isDirty` do react-hook-form "pisca" true num form intocado
  // (comparação interna com valueAsNumber/NaN), enquanto `dirtyFields` só ganha
  // chaves quando um campo é de fato alterado.
  const dirty = Object.keys(dirtyFields).length > 0 || uploads.dirty
  useEffect(() => {
    onDirtyChange?.(dirty)
  }, [dirty, onDirtyChange])

  async function applyPoint(nextLat: number, nextLng: number) {
    setValue('lat', nextLat, { shouldValidate: true, shouldDirty: true })
    setValue('lng', nextLng, { shouldValidate: true, shouldDirty: true })
    const address = await reverseGeocode(nextLat, nextLng)
    if (address) setValue('rua', address, { shouldValidate: true, shouldDirty: true })
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

  async function submit(values: TerrenoFormValues) {
    const { imagens, principalId } = uploads.getResult()
    await onSubmit({ ...values, imagens, principalId } as TerrenoInput)
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

      <Combobox
        id="corretora"
        label="Corretora (opcional)"
        value={watch('corretora') ?? ''}
        options={corretoras.map((c) => ({ value: c.name, label: c.name }))}
        onChange={(next) => setValue('corretora', next, { shouldValidate: true, shouldDirty: true })}
        allowFreeText
        placeholder="Digite ou escolha uma corretora"
        emptyLabel="Nenhuma corretora ainda — digite pra cadastrar"
        error={errors.corretora?.message}
      />

      <Switch
        id="isCorner"
        label="Terreno de esquina"
        description="Marque se o lote fica numa esquina."
        checked={watch('isCorner') ?? false}
        onChange={(next) => setValue('isCorner', next, { shouldValidate: true, shouldDirty: true })}
      />

      <CurrencyField
        id="preco"
        label="Preço (opcional)"
        value={watch('preco')}
        onChange={(next) => setValue('preco', next, { shouldValidate: true, shouldDirty: true })}
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

      <TextField
        id="whatsapp"
        label="WhatsApp do contato (opcional)"
        placeholder="(45) 99999-0000"
        inputMode="tel"
        error={errors.whatsapp?.message}
        {...register('whatsapp')}
      />

      <ImageUploader
        images={uploads.images}
        principalId={uploads.principalId}
        onAddFiles={uploads.addFiles}
        onRetry={uploads.retry}
        onRemove={uploads.remove}
        onSetPrincipal={uploads.setPrincipal}
      />

      <Button type="submit" disabled={isSubmitting || uploads.uploading} className="mt-1">
        {isSubmitting ? 'Salvando…' : initial ? 'Salvar alterações' : 'Salvar terreno'}
      </Button>
    </form>
  )
}
