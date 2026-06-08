const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

// Números "medida" (área, dimensão): teto de 2 casas decimais na EXIBIÇÃO.
// O dado cru continua cru (ex: 269.83000000000004); só o display arredonda.
// Zeros à direita são removidos (267.6, 300, 269.83) — o requisito é o teto, não forçar 2 casas.
const measureFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
})

// Centraliza o teto de 2 casas pra qualquer número de medida exibido na UI.
export function formatNumber(value: number): string {
  return measureFormatter.format(value)
}

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
  return `${formatNumber(squareMeters)} m²`
}

// Medida linear (largura, comprimento) em metros, com teto de 2 casas.
export function formatMeasure(meters: number): string {
  return `${formatNumber(meters)} m`
}

// Dimensão "L×C" pro pin e pra tabela, cada lado com teto de 2 casas.
export function formatDimensions(
  largura: number | undefined,
  comprimento: number | undefined,
): string | undefined {
  if (largura === undefined || comprimento === undefined) return undefined
  return `${formatNumber(largura)}×${formatNumber(comprimento)}`
}

// Rótulo quando o terreno não tem nenhuma medida de área informada
// (todas opcionais — pode salvar sem medidas).
export const AREA_UNKNOWN = '—'

export function displayArea(squareMeters: number | undefined): string {
  return squareMeters === undefined ? AREA_UNKNOWN : formatArea(squareMeters)
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
  areaTotal: number | undefined,
): number | undefined {
  if (preco === undefined || areaTotal === undefined) return undefined
  if (!Number.isFinite(areaTotal) || areaTotal <= 0) return undefined
  return preco / areaTotal
}

// Formato compacto pra caber bem no mobile (coluna estreita, sem scroll horizontal):
// valores normais arredondam os reais ("R$ 333/m²"); a partir de 10 mil usa sufixo
// "K" pra não estourar a coluna ("R$ 500K/m²" em vez de "R$ 500.000/m²").
export function formatPricePerSqm(value: number): string {
  const rounded = Math.round(value)
  if (rounded >= 10_000) return `R$ ${compact(rounded / 1_000)}K/m²`
  return `${formatPrice(rounded)}/m²`
}

export function displayPricePerSqm(value: number | undefined): string {
  return value === undefined ? '—' : formatPricePerSqm(value)
}
