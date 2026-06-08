import { useCallback, useEffect, useState } from 'react'
import type { Corretora, CorretoraUpdateInput } from '../types/corretora'
import { getCorretoraService } from '../services/corretora-service'

export type UseCorretoras = {
  corretoras: Corretora[]
  refresh: () => Promise<void>
  update: (slug: string, input: CorretoraUpdateInput) => Promise<Corretora>
}

export function useCorretoras(): UseCorretoras {
  const [corretoras, setCorretoras] = useState<Corretora[]>([])

  // .then(setCorretoras) (não await) pra o setState não ser síncrono no efeito.
  // Falha degrada de boa: autocomplete/filtro ficam sem sugestões.
  const refresh = useCallback(() => {
    return getCorretoraService()
      .list()
      .then(setCorretoras)
      .catch((error: unknown) => {
        console.error('Falha ao carregar corretoras:', error)
      })
  }, [])

  // Edita uma corretora e reconcilia a lista em memória (sem refetch).
  const update = useCallback(async (slug: string, input: CorretoraUpdateInput) => {
    const updated = await getCorretoraService().update(slug, input)
    setCorretoras((prev) => prev.map((c) => (c.slug === updated.slug ? updated : c)))
    return updated
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { corretoras, refresh, update }
}
