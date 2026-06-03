import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/index.css'
import { PriceMarker } from '../src/features/map/PriceMarker'
import { seedTerrenos } from '../src/services/seed'

function Harness() {
  return (
    <div className="topo-grid min-h-screen w-full p-6" style={{ background: '#9fb08a' }}>
      <p className="mb-4 font-mono text-xs text-paper">DEFAULT (todos não-selecionados)</p>
      <div className="mb-10 flex flex-wrap items-start gap-6">
        {seedTerrenos.map((t) => (
          <PriceMarker key={t.id} terreno={t} selected={false} onSelect={() => {}} />
        ))}
      </div>
      <p className="mb-4 font-mono text-xs text-paper">SELECTED (clay)</p>
      <div className="flex flex-wrap items-start gap-6">
        {seedTerrenos.map((t) => (
          <PriceMarker key={t.id} terreno={t} selected={true} onSelect={() => {}} />
        ))}
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode><Harness /></StrictMode>,
)
