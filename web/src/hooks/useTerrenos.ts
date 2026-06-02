import { useEffect, useState } from 'react'
import type { Terreno, TerrenoInput } from '../types/terreno'
import { getTerrenoService } from '../services/terreno-service'
import { genId } from '../lib/id'

export type UseTerrenos = {
  terrenos: Terreno[]
  loading: boolean
  addTerreno: (input: TerrenoInput) => Promise<Terreno>
  updateTerreno: (terreno: Terreno) => Promise<void>
  removeTerreno: (id: string) => Promise<void>
}

export function useTerrenos(): UseTerrenos {
  const [terrenos, setTerrenos] = useState<Terreno[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTerrenoService()
      .list()
      .then((list) => {
        setTerrenos(list)
        setLoading(false)
      })
  }, [])

  async function refresh(): Promise<void> {
    setTerrenos(await getTerrenoService().list())
  }

  async function addTerreno(input: TerrenoInput): Promise<Terreno> {
    const terreno: Terreno = { ...input, id: genId() }
    await getTerrenoService().save(terreno)
    await refresh()
    return terreno
  }

  async function updateTerreno(terreno: Terreno): Promise<void> {
    await getTerrenoService().save(terreno)
    await refresh()
  }

  async function removeTerreno(id: string): Promise<void> {
    await getTerrenoService().remove(id)
    await refresh()
  }

  return { terrenos, loading, addTerreno, updateTerreno, removeTerreno }
}
