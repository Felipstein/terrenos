import { useCallback, useEffect, useState } from 'react'
import type { Corretora } from '../types/corretora'
import { getCorretoraService } from '../services/corretora-service'

export type UseCorretoras = {
  corretoras: Corretora[]
  refresh: () => Promise<void>
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

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { corretoras, refresh }
}
