import { useEffect, useState } from 'react'
import type { Terreno, TerrenoInput } from '../types/terreno'
import { getTerrenoService } from '../services/terreno-service'

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
    const created = await getTerrenoService().create(input)
    await refresh()
    return created
  }

  async function updateTerreno(terreno: Terreno): Promise<void> {
    await getTerrenoService().update(terreno)
    await refresh()
  }

  async function removeTerreno(id: string): Promise<void> {
    await getTerrenoService().remove(id)
    await refresh()
  }

  return { terrenos, loading, addTerreno, updateTerreno, removeTerreno }
}
