// Mira/crosshair FIXA no centro do mapa, usada no modo de adição. É um overlay
// puramente visual (pointer-events-none) — quem confirma a posição é o botão
// "Criar aqui", que lê o centro atual do mapa. O usuário arrasta o MAPA pra
// posicionar o alvo (não há tap pra posicionar).
export function AddTargetCrosshair() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[900] grid place-items-center">
      <div className="relative -translate-y-3">
        <span className="block h-7 w-7 rounded-full border-2 border-clay bg-clay/10 shadow-sm" />
        <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay" />
        {/* haste apontando o ponto exato no chão */}
        <span className="absolute left-1/2 top-full h-3 w-px -translate-x-1/2 bg-clay" />
        <span className="absolute left-1/2 top-[calc(100%+12px)] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay shadow" />
      </div>
    </div>
  )
}
