import type { Terreno } from '../types/terreno'

// Dados de exemplo (região de Campinas/SP). Mock em memória — reseta no reload.
// Imagens via picsum (placeholder). Um terreno fica sem foto de propósito.
export const seedTerrenos: Terreno[] = [
  {
    id: 'seed-1',
    rua: 'Rua das Palmeiras, 120',
    preco: 185000,
    lat: -22.9056,
    lng: -47.0608,
    areaTotal: 250,
    largura: 10,
    comprimento: 25,
    link: 'https://example.com/anuncio/1',
    imagens: [
      { id: 'seed-1-a', url: 'https://picsum.photos/seed/terreno1a/800/600' },
      { id: 'seed-1-b', url: 'https://picsum.photos/seed/terreno1b/800/600' },
      { id: 'seed-1-c', url: 'https://picsum.photos/seed/terreno1c/800/600' },
    ],
    principalId: 'seed-1-b',
  },
  {
    id: 'seed-2',
    rua: 'Rua Sete de Setembro, 45',
    preco: 320000,
    lat: -22.9132,
    lng: -47.0721,
    areaTotal: 420,
    largura: 14,
    comprimento: 30,
    imagens: [
      { id: 'seed-2-a', url: 'https://picsum.photos/seed/terreno2a/800/600' },
      { id: 'seed-2-b', url: 'https://picsum.photos/seed/terreno2b/800/600' },
    ],
    principalId: 'seed-2-a',
  },
  {
    id: 'seed-3',
    rua: 'Estrada do Sol, km 3',
    preco: 540000,
    lat: -22.8987,
    lng: -47.0489,
    areaTotal: 1000,
    largura: 20,
    comprimento: 50,
    link: 'https://example.com/anuncio/3',
    imagens: [
      { id: 'seed-3-a', url: 'https://picsum.photos/seed/terreno3a/800/600' },
      { id: 'seed-3-b', url: 'https://picsum.photos/seed/terreno3b/800/600' },
      { id: 'seed-3-c', url: 'https://picsum.photos/seed/terreno3c/800/600' },
    ],
    principalId: 'seed-3-a',
  },
  {
    id: 'seed-4',
    rua: 'Avenida Aurora, 880',
    preco: 1250000,
    lat: -22.9201,
    lng: -47.0555,
    areaTotal: 600,
    largura: 15,
    comprimento: 40,
    // sem imagens (testa o caso opcional)
  },
  {
    id: 'seed-5',
    rua: 'Rua dos Ipês, 12',
    preco: 99000,
    lat: -22.9045,
    lng: -47.0712,
    areaTotal: 180,
    largura: 9,
    comprimento: 20,
    link: 'https://example.com/anuncio/5',
    imagens: [{ id: 'seed-5-a', url: 'https://picsum.photos/seed/terreno5a/800/600' }],
    principalId: 'seed-5-a',
  },
]
