import { describe, expect, it } from 'vitest'
import type { Terreno } from '../types/terreno'
import { filterAndSort } from './terreno-filters'

function terreno(
  id: string,
  rua: string,
  preco: number | undefined,
  areaTotal: number | undefined = 200,
  corretora?: string,
  isCorner = false,
): Terreno {
  return { id, rua, preco, lat: -22.9, lng: -47.0, areaTotal, corretora, isCorner }
}

const data: Terreno[] = [
  terreno('a', 'Rua das Palmeiras', 300000, 500),
  terreno('b', 'Avenida Brasil', 100000, 300),
  terreno('c', 'Rua dos Ipês', 200000, 100),
]

describe('filterAndSort', () => {
  it('ordena do mais barato ao mais caro', () => {
    const r = filterAndSort(data, { query: '', sort: 'price-asc', corretora: '', corner: 'all' })
    expect(r.map((t) => t.preco)).toEqual([100000, 200000, 300000])
  })

  it('ordena do mais caro ao mais barato', () => {
    const r = filterAndSort(data, { query: '', sort: 'price-desc', corretora: '', corner: 'all' })
    expect(r.map((t) => t.preco)).toEqual([300000, 200000, 100000])
  })

  it('ordena por área (menor e maior)', () => {
    expect(
      filterAndSort(data, { query: '', sort: 'area-asc', corretora: '', corner: 'all' }).map(
        (t) => t.areaTotal,
      ),
    ).toEqual([100, 300, 500])
    expect(
      filterAndSort(data, { query: '', sort: 'area-desc', corretora: '', corner: 'all' }).map(
        (t) => t.areaTotal,
      ),
    ).toEqual([500, 300, 100])
  })

  it('manda terrenos sem preço pro fim (asc e desc)', () => {
    const comPrecoVazio: Terreno[] = [
      terreno('a', 'Rua A', 300000),
      terreno('x', 'Rua X', undefined),
      terreno('b', 'Rua B', 100000),
    ]
    expect(
      filterAndSort(comPrecoVazio, {
        query: '',
        sort: 'price-asc',
        corretora: '',
        corner: 'all',
      }).map((t) => t.id),
    ).toEqual(['b', 'a', 'x'])
    expect(
      filterAndSort(comPrecoVazio, {
        query: '',
        sort: 'price-desc',
        corretora: '',
        corner: 'all',
      }).map((t) => t.id),
    ).toEqual(['a', 'b', 'x'])
  })

  it('ordena por preço/m² (do mais barato ao mais caro por m²)', () => {
    // a: 300000/500 = 600 · b: 100000/300 ≈ 333 · c: 200000/100 = 2000
    expect(
      filterAndSort(data, { query: '', sort: 'pricePerSqm-asc', corretora: '', corner: 'all' }).map(
        (t) => t.id,
      ),
    ).toEqual(['b', 'a', 'c'])
    expect(
      filterAndSort(data, { query: '', sort: 'pricePerSqm-desc', corretora: '', corner: 'all' }).map(
        (t) => t.id,
      ),
    ).toEqual(['c', 'a', 'b'])
  })

  it('manda terrenos sem preço/m² pro fim na ordenação por m² (asc e desc)', () => {
    const semValor: Terreno[] = [
      terreno('a', 'Rua A', 300000, 300), // 1000/m²
      terreno('x', 'Rua X', undefined, 200), // sem preço
      terreno('b', 'Rua B', 100000, 500), // 200/m²
    ]
    expect(
      filterAndSort(semValor, {
        query: '',
        sort: 'pricePerSqm-asc',
        corretora: '',
        corner: 'all',
      }).map((t) => t.id),
    ).toEqual(['b', 'a', 'x'])
    expect(
      filterAndSort(semValor, {
        query: '',
        sort: 'pricePerSqm-desc',
        corretora: '',
        corner: 'all',
      }).map((t) => t.id),
    ).toEqual(['a', 'b', 'x'])
  })

  it('manda terrenos sem área pro fim (asc e desc)', () => {
    // `undefined` explícito acionaria o default do factory; monta o sem-área na mão.
    const semArea: Terreno = {
      id: 'x',
      rua: 'Rua X',
      preco: 100000,
      lat: -22.9,
      lng: -47.0,
      isCorner: false,
    }
    const comAreaVazia: Terreno[] = [
      terreno('a', 'Rua A', 100000, 500),
      semArea,
      terreno('b', 'Rua B', 100000, 300),
    ]
    expect(
      filterAndSort(comAreaVazia, {
        query: '',
        sort: 'area-asc',
        corretora: '',
        corner: 'all',
      }).map((t) => t.id),
    ).toEqual(['b', 'a', 'x'])
    expect(
      filterAndSort(comAreaVazia, {
        query: '',
        sort: 'area-desc',
        corretora: '',
        corner: 'all',
      }).map((t) => t.id),
    ).toEqual(['a', 'b', 'x'])
  })

  it('filtra por endereço (case-insensitive)', () => {
    const r = filterAndSort(data, { query: 'rua', sort: 'price-asc', corretora: '', corner: 'all' })
    expect(r.map((t) => t.id)).toEqual(['c', 'a'])
  })

  it('filtra por corretora (nome exato; "" = todas)', () => {
    const comCorretora: Terreno[] = [
      terreno('a', 'Rua A', 100000, 200, 'Imobiliária Silva'),
      terreno('b', 'Rua B', 200000, 200, 'Corretora X'),
      terreno('c', 'Rua C', 300000, 200), // sem corretora
    ]
    expect(
      filterAndSort(comCorretora, {
        query: '',
        sort: 'price-asc',
        corretora: 'Imobiliária Silva',
        corner: 'all',
      }).map((t) => t.id),
    ).toEqual(['a'])
    expect(
      filterAndSort(comCorretora, { query: '', sort: 'price-asc', corretora: '', corner: 'all' }),
    ).toHaveLength(3)
    expect(
      filterAndSort(comCorretora, {
        query: 'rua a',
        sort: 'price-asc',
        corretora: 'Corretora X',
        corner: 'all',
      }),
    ).toHaveLength(0)
  })

  it('filtra por esquina (all / corner / non-corner)', () => {
    const mix: Terreno[] = [
      terreno('a', 'Rua A', 100000, 200, undefined, true),
      terreno('b', 'Rua B', 200000, 200, undefined, false),
      terreno('c', 'Rua C', 300000, 200, undefined, true),
    ]
    expect(
      filterAndSort(mix, { query: '', sort: 'price-asc', corretora: '', corner: 'all' }),
    ).toHaveLength(3)
    expect(
      filterAndSort(mix, { query: '', sort: 'price-asc', corretora: '', corner: 'corner' }).map(
        (t) => t.id,
      ),
    ).toEqual(['a', 'c'])
    expect(
      filterAndSort(mix, { query: '', sort: 'price-asc', corretora: '', corner: 'non-corner' }).map(
        (t) => t.id,
      ),
    ).toEqual(['b'])
  })

  it('não muta o array original', () => {
    const copy = [...data]
    filterAndSort(data, { query: '', sort: 'price-desc', corretora: '', corner: 'all' })
    expect(data).toEqual(copy)
  })
})
