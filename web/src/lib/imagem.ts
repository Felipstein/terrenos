import type { Terreno, TerrenoImagem } from '../types/terreno'

// A imagem principal: a marcada por principalId, senão a primeira, senão nenhuma.
export function imagemPrincipal(
  terreno: Pick<Terreno, 'imagens' | 'principalId'>,
): TerrenoImagem | undefined {
  const imagens = terreno.imagens
  if (!imagens || imagens.length === 0) return undefined
  return imagens.find((imagem) => imagem.id === terreno.principalId) ?? imagens[0]
}

// As demais imagens (sem a principal), preservando a ordem.
export function imagensSecundarias(
  terreno: Pick<Terreno, 'imagens' | 'principalId'>,
): TerrenoImagem[] {
  const principal = imagemPrincipal(terreno)
  if (!principal) return []
  return (terreno.imagens ?? []).filter((imagem) => imagem.id !== principal.id)
}
