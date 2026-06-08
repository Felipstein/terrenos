import { useLayoutEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'

type DraggableSheetProps = {
  peekHeight: number
  header: ReactNode
  children: ReactNode
  accessory?: ReactNode
  onExpandedChange?: (expanded: boolean) => void
}

// Gaveta persistente (não-modal) com 2 pontos de parada: recolhida (peek) e
// expandida. Arrasta pela alça; tocar na alça alterna. O mapa atrás continua
// interativo. Estilo Airbnb.
export function DraggableSheet({
  peekHeight,
  header,
  children,
  accessory,
  onExpandedChange,
}: DraggableSheetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)
  const drag = useRef({ active: false, startY: 0, startT: 0, maxT: 0, curT: 0, moved: 0 })

  function apply(translate: number, animate: boolean) {
    const el = ref.current
    if (!el) return
    el.style.transition = animate ? 'transform 0.34s cubic-bezier(0.22, 1, 0.36, 1)' : 'none'
    el.style.transform = `translateY(${translate}px)`
    drag.current.curT = translate
  }

  function rest(exp: boolean) {
    const el = ref.current
    if (!el) return
    const maxT = el.offsetHeight - peekHeight
    drag.current.maxT = maxT
    apply(exp ? 0 : maxT, true)
  }

  useLayoutEffect(() => {
    rest(expanded)
    function onResize() {
      rest(expanded)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, peekHeight])

  function setExp(exp: boolean) {
    setExpanded(exp)
    onExpandedChange?.(exp)
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    drag.current.active = true
    drag.current.startY = event.clientY
    drag.current.startT = drag.current.curT
    drag.current.maxT = el.offsetHeight - peekHeight
    drag.current.moved = 0
    el.style.transition = 'none'
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const d = drag.current
    if (!d.active) return
    const delta = event.clientY - d.startY
    d.moved = Math.max(d.moved, Math.abs(delta))
    apply(Math.min(Math.max(d.startT + delta, 0), d.maxT), false)
  }

  function onPointerUp() {
    const d = drag.current
    if (!d.active) return
    d.active = false
    if (d.moved < 6) {
      setExp(!expanded)
      return
    }
    const exp = d.curT < d.maxT / 2
    setExp(exp)
    if (exp === expanded) rest(exp)
  }

  return (
    <div
      ref={ref}
      className="fixed inset-x-0 bottom-0 z-[1000] flex flex-col rounded-t-2xl border-t border-line bg-surface shadow-[0_-8px_40px_rgba(33,29,21,0.18)]"
      style={{ height: '85dvh' }}
    >
      {accessory ? <div className="absolute -top-16 right-4">{accessory}</div> : null}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="shrink-0 touch-none select-none cursor-grab pb-1 pt-3 active:cursor-grabbing"
      >
        <div className="mx-auto h-1.5 w-12 rounded-full bg-line" />
      </div>
      <div className="shrink-0">{header}</div>
      <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {children}
      </div>
    </div>
  )
}
