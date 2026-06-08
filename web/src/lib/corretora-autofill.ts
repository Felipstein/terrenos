import type { Corretora } from '../types/corretora'

// Lógica pura do autofill do telefone da corretora no form de terreno.
// Mantida fora do componente pra ser testável (ver skill `forms`).

// Telefone conhecido de uma corretora pelo nome (undefined se não houver).
export function corretoraPhone(corretoras: Corretora[], name: string | undefined): string | undefined {
  if (!name) return undefined
  return corretoras.find((c) => c.name === name)?.phone
}

// Ao trocar/digitar a corretora, qual valor o campo de telefone deve passar a ter.
// SEMPRE reflete a corretora ESCOLHIDA: se ela não tem telefone conhecido (ou é um
// nome novo), retorna '' pra LIMPAR — nunca deixa vazar o telefone da corretora
// anterior. O campo segue editável: o usuário pode digitar por cima.
export function nextCorretoraTelefone(corretoras: Corretora[], name: string | undefined): string {
  return corretoraPhone(corretoras, name) ?? ''
}
