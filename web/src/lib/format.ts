const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 0,
})

// Intl usa espaços especiais (NBSP / narrow NBSP) entre símbolo e número.
// Normalizamos pra espaço comum, pra display previsível e testável.
const irregularSpaces = new RegExp('[\\u00A0\\u202F]', 'g')

function normalizeSpaces(value: string): string {
  return value.replace(irregularSpaces, ' ')
}

export function formatPrice(value: number): string {
  return normalizeSpaces(priceFormatter.format(value))
}

export function formatArea(squareMeters: number): string {
  return `${numberFormatter.format(squareMeters)} m²`
}

function compact(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace('.', ',')
}

export function formatPriceShort(value: number): string {
  if (value >= 1_000_000) return `R$ ${compact(value / 1_000_000)}M`
  if (value >= 1_000) return `R$ ${compact(value / 1_000)} mil`
  return formatPrice(value)
}

// Rótulo quando o terreno ainda não tem preço (a negociar).
export const PRICE_TBD = 'Sob consulta'

export function displayPrice(value: number | undefined): string {
  return value === undefined ? PRICE_TBD : formatPrice(value)
}

export function displayPriceShort(value: number | undefined): string {
  return value === undefined ? PRICE_TBD : formatPriceShort(value)
}

// Preço por m² = preço / área total. Calculado 100% no front (preço e área já
// existem no terreno). Indefinido quando falta preço ou a área não é positiva —
// nesses casos a UI mostra "—" e a ordenação manda pro fim.
export function pricePerSquareMeter(
  preco: number | undefined,
  areaTotal: number,
): number | undefined {
  if (preco === undefined || !Number.isFinite(areaTotal) || areaTotal <= 0) return undefined
  return preco / areaTotal
}

// Formato compacto pra caber bem no mobile: "R$ 333/m²" (arredonda os reais).
export function formatPricePerSqm(value: number): string {
  return `${formatPrice(Math.round(value))}/m²`
}

export function displayPricePerSqm(value: number | undefined): string {
  return value === undefined ? '—' : formatPricePerSqm(value)
}
