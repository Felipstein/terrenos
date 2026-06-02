// Auto-cálculo das medidas: total = largura × comprimento.
// Dado quais 2 estão preenchidos, completa o 3º.

export type AreaFields = {
  total?: number
  largura?: number
  comprimento?: number
}

export type AreaField = 'total' | 'largura' | 'comprimento'

function round(value: number): number {
  return Math.round(value * 100) / 100
}

function valid(value: number | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
}

export function recalcArea(changed: AreaField, fields: AreaFields): AreaFields {
  const { total, largura, comprimento } = fields

  if (changed === 'largura' || changed === 'comprimento') {
    if (valid(largura) && valid(comprimento)) {
      return { ...fields, total: round(largura * comprimento) }
    }
    if (changed === 'largura' && valid(total) && valid(largura)) {
      return { ...fields, comprimento: round(total / largura) }
    }
    if (changed === 'comprimento' && valid(total) && valid(comprimento)) {
      return { ...fields, largura: round(total / comprimento) }
    }
    return fields
  }

  // changed === 'total'
  if (valid(total) && valid(largura)) {
    return { ...fields, comprimento: round(total / largura) }
  }
  if (valid(total) && valid(comprimento)) {
    return { ...fields, largura: round(total / comprimento) }
  }
  return fields
}
