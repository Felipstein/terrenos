import type { TerrenoInput, TerrenoImagem } from '../lib/terreno-validation'

export type { TerrenoInput, TerrenoImagem }

export type Terreno = TerrenoInput & { id: string }
