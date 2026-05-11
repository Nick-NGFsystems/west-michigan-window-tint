'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'

type Service = { name?: string; desc?: string; image?: string }

const EXTRA_IMAGES: Record<number, string[]> = {
  0: [
    '/images/BlueBMWFR.jpeg', '/images/BlueBMWSL.jpeg', '/images/GreenDodgeFL.jpeg',
    '/images/SilverSubaruFL.jpeg', '/images/SilverSubaruSL.jpeg', '/images/WhiteCivicFR.jpeg',
    '/images/WhiteGMCFL.jpeg', '/images/WhiteJeepFR.jpeg', '/images/WhiteJeepSL.jpeg',
  ],
  1: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&h=440&fit=crop&q=80',
    'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=700&h=440&fit=crop&q=80',
  ],
  2: [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=700&h=440&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=700&h=440&fit=crop&q=80',
  ],
  3: [
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=700&h=440&fit=crop&q=80',
    'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=700&h=440&fit=crop&q=80',
  ],
}

const FALLBACK = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=700&h=440&fit=crop&q=80'

function getImages(svc: Service, idx: number): string[] {
  const extras = EXTRA_IMAGES[idx]
  if (extras && extras.length > 0) return extras
  return [svc.image || FALLBACK]
}

// ── DragScroll — reusable horizontal drag-to-scroll strip ─────────────────────

function DragScroll({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref      = useRef<HTMLDivElement>(null)
  const startX   = useRef(0)
  const scrollX  = useRef(0)
  const active   = useRef(false)

  function onPointerDown(e: React.PointerEvent) {
    if (!ref.current) return
    active.current = true
    startX.current  = e.clientX
    scrollX.current = ref.current.scrollLeft
    ref.current.setPointerCapture(e.pointerId)
    ref.current.style.cursor = 'grabbing'
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!active.current || !ref.current) return
    ref.current.scrollLeft = scrollX.current - (e.clientX - startX.current)
  }
  function onPointerUp(e: React.PointerEvent) {
    if (!ref.current) return
    active.current = false
    ref.current.style.cursor = 'grab'
    ref.current.releasePointerCapture(e.pointerId)
  }
  function onWheel(e: React.WheelEvent) {
    if (!ref.current) return
    e.preventDefault()
    ref.current.scrollLeft += e.deltaY + e.deltaX
  }

  return (
    <div ref={ref}
      className={'no-scrollbar flex gap-2 overflow-x-auto select-none ' + (className ?? '')}
      style={{ cursor: 'grab', touchAction: 'pan-x', ...style }}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove}
      onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onWheel={onWheel}
    >
      {children}
      <div className="w-3 flex-shrink-0" />
    </div>
  )
}

// ── ServiceCard ────────────────────────────────────────────────────────────────

function ServiceCard({ svc, idx, icon, onOpen }: { svc: Service; idx: number; icon: string; onOpen: (i: number) => void }) {
  const images = getImages(svc, idx)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => setCurrent(c => (c + 1) % images.length), 3500)
    return () => clearInterval(id)
  }, [images.length])

  return (
    <div onClick={() => onOpen(idx)} className="panel-gold flex cursor-pointer flex-col overflow-hidden transition-all hover:border-[rgba(200,168,75,0.45)]">
      <div className="relative h-44 w-full overflow-hidden">
        {images.map((src, i) => (
          <img key={src} src={src} alt={svc.name ?? ''}
            data-ngf-field={i === 0 ? `services.items.${idx}.image` : undefined}
            data-ngf-label={i === 0 ? 'Photo' : undefined}
            data-ngf-type={i === 0 ? 'image' : undefined}
            data-ngf-section={i === 0 ? 'Services' : undefined}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(10,10,10,0.7) 100%)' }} />
        <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold tracking-widest"
          style={{ background: 'rgba(10,10,10,0.7)', border: '1px solid rgba(200,168,75,0.4)', color: 'var(--gold)' }}>
          {icon}
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
            {images.map((_, i) => (
              <div key={i} className="rounded-full transition-all duration-300"
                style={{ width: i === current ? '14px' : '6px', height: '6px', background: i === current ? 'var(--gold)' : 'rgba(255,255,255,0.35)' }} />
            ))}
          </div>
        )}
        <div className="absolute bottom-3 left-4 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(232,192,96,0.75)' }}>
          Tap to view
        </div>
      </div>
      <div className="flex flex-col gap-2 p-5">
        <h3 data-ngf-field={`services.items.${idx}.name`} data-ngf-label="Service Name" data-ngf-type="text" data-ngf-section="Services"
          className="text-base font-semibold text-[var(--text)]">{svc.name ?? ''}</h3>
        <p data-ngf-field={`services.items.${idx}.desc`} data-ngf-label="Description" data-ngf-type="textarea" data-ngf-section="Services"
          className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{svc.desc ?? ''}</p>
      </div>
    </div>
  )
}

// ── Lightbox ──────────────────────────────────────────────────────────────────

type DragState = { sx: number; sy: number; px: number; py: number; moved: boolean }

function Lightbox({ services, icons, initialIdx, onClose }: {
  services: Service[]; icons: string[]; initialIdx: number; onClose: () => void
}) {
  const [svcIdx, setSvcIdx]   = useState(initialIdx)
  const [imgIdx, setImgIdx]   = useState(0)
  const [zoom, setZoom]       = useState(1)
  const [dragging, setDragging] = useState(false)
  const [isFS, setIsFS]       = useState(false)

  // Refs — for things that must not cause re-renders during drag
  const panRef   = useRef({ x: 0, y: 0 })
  const dragRef  = useRef<DragState | null>(null)
  const imgLayer = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const zoomRef  = useRef(1)

  const svc    = services[svcIdx]
  const images = getImages(svc, svcIdx)

  // Keep zoomRef mirrored to zoom state (for use inside event handlers without stale closure)
  useEffect(() => { zoomRef.current = zoom }, [zoom])

  // Write transform directly to DOM — zero React re-renders during drag
  const applyTransform = useCallback((z: number, px: number, py: number, animated = false) => {
    if (!imgLayer.current) return
    imgLayer.current.style.transition = animated ? 'transform 0.18s ease' : 'none'
    imgLayer.current.style.transform  = `translate(${px}px, ${py}px) scale(${z})`
  }, [])

  const resetView = useCallback(() => {
    panRef.current = { x: 0, y: 0 }
    setZoom(1)
    applyTransform(1, 0, 0, true)
  }, [applyTransform])

  // Sync transform when zoom changes via buttons / keyboard (not during drag)
  useEffect(() => {
    applyTransform(zoom, panRef.current.x, panRef.current.y, true)
  }, [zoom, applyTransform])

  const prev = useCallback(() => { setImgIdx(i => (i - 1 + images.length) % images.length); resetView() }, [images.length, resetView])
  const next = useCallback(() => { setImgIdx(i => (i + 1) % images.length); resetView() }, [images.length, resetView])

  useEffect(() => { setImgIdx(0); resetView() }, [svcIdx, resetView])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Fullscreen
  useEffect(() => {
    const h = () => setIsFS(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', h)
    return () => document.removeEventListener('fullscreenchange', h)
  }, [])

  function toggleFS() {
    if (!document.fullscreenElement) modalRef.current?.requestFullscreen().catch(() => {})
    else document.exitFullscreen().catch(() => {})
  }

  // Keyboard
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape')     { if (zoomRef.current > 1) resetView(); else onClose() }
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === '+')          setZoom(z => Math.min(+(z + 0.5).toFixed(1), 4))
      if (e.key === '-')          setZoom(z => { const nz = Math.max(+(z - 0.5).toFixed(1), 1); if (nz === 1) panRef.current = { x: 0, y: 0 }; return nz })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, prev, next, resetView])

  // ── Drag helpers ─────────────────────────────────────────────────────────────

  function startDrag(clientX: number, clientY: number) {
    dragRef.current = { sx: clientX, sy: clientY, px: panRef.current.x, py: panRef.current.y, moved: false }
    setDragging(true)
  }

  function moveDrag(clientX: number, clientY: number) {
    if (!dragRef.current) return
    const dx = clientX - dragRef.current.sx
    const dy = clientY - dragRef.current.sy
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragRef.current.moved = true
    if (zoomRef.current > 1) {
      const nx = dragRef.current.px + dx
      const ny = dragRef.current.py + dy
      panRef.current = { x: nx, y: ny }
      applyTransform(zoomRef.current, nx, ny, false)
    }
  }

  function endDrag() {
    if (!dragRef.current) return
    const wasMoved = dragRef.current.moved
    dragRef.current = null
    setDragging(false)
    if (!wasMoved) {
      if (zoomRef.current === 1) setZoom(2.5)
      else resetView()
    }
  }

  function cancelDrag() {
    dragRef.current = null
    setDragging(false)
  }

  // Mouse
  function onMouseDown(e: React.MouseEvent) { e.preventDefault(); startDrag(e.clientX, e.clientY) }
  function onMouseMove(e: React.MouseEvent) { moveDrag(e.clientX, e.clientY) }
  function onMouseUp()                      { endDrag() }
  function onMouseLeave()                   { cancelDrag() }  // always cancel on leave

  // Touch
  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 1) startDrag(e.touches[0].clientX, e.touches[0].clientY)
  }
  function onTouchMove(e: React.TouchEvent) {
    if (e.touches.length !== 1) return
    if (zoomRef.current > 1) e.preventDefault()
    moveDrag(e.touches[0].clientX, e.touches[0].clientY)
  }
  function onTouchEnd()   { endDrag() }
  function onTouchCancel() { cancelDrag() }

  // Wheel zoom on image area
  function onImgWheel(e: React.WheelEvent) {
    e.preventDefault()
    setZoom(z => {
      const nz = Math.min(Math.max(+(z - e.deltaY * 0.003).toFixed(2), 1), 4)
      if (nz === 1) panRef.current = { x: 0, y: 0 }
      return nz
    })
  }

  function zoomIn()  { setZoom(z => Math.min(+(z + 0.5).toFixed(1), 4)) }
  function zoomOut() { setZoom(z => { const nz = Math.max(+(z - 0.5).toFixed(1), 1); if (nz === 1) panRef.current = { x: 0, y: 0 }; return nz }) }

  // ── Derived styles ────────────────────────────────────────────────────────────

  const cursor = zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in'

  const modalStyle: React.CSSProperties = isFS
    ? { background: '#0a0a0a', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 0, border: 'none' }
    : { background: '#111', border: '1px solid rgba(200,168,75,0.2)', maxHeight: '90dvh', display: 'flex', flexDirection: 'column', borderRadius: '16px' }

  const imgAreaStyle: React.CSSProperties = isFS
    ? { flex: 1, position: 'relative', overflow: 'hidden', background: '#000', minHeight: 0 }
    : { position: 'relative', overflow: 'hidden', background: '#000', height: '54vw', maxHeight: '360px', minHeight: '200px' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.9)' }} onClick={onClose}>
      <div ref={modalRef} className="relative w-full sm:max-w-xl overflow-hidden"
        style={modalStyle} onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="flex flex-shrink-0 items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--line)' }}>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold"
              style={{ background: 'rgba(200,168,75,0.12)', border: '1px solid rgba(200,168,75,0.35)', color: 'var(--gold)' }}>
              {icons[svcIdx]}
            </span>
            <span className="text-sm font-semibold text-[var(--text)]">{svc?.name}</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>{imgIdx + 1} / {images.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={zoomOut} disabled={zoom <= 1}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-base transition-colors disabled:opacity-30 hover:text-[var(--gold)]"
              style={{ color: 'var(--muted)', border: '1px solid var(--line)' }} aria-label="Zoom out">−</button>
            <span className="min-w-[34px] text-center text-[11px] font-semibold tabular-nums"
              style={{ color: zoom > 1 ? 'var(--gold-light)' : 'var(--muted)' }}>
              {zoom === 1 ? '1×' : `${zoom.toFixed(1)}×`}
            </span>
            <button onClick={zoomIn} disabled={zoom >= 4}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-base transition-colors disabled:opacity-30 hover:text-[var(--gold)]"
              style={{ color: 'var(--muted)', border: '1px solid var(--line)' }} aria-label="Zoom in">+</button>
            <button onClick={toggleFS}
              className="flex h-7 items-center justify-center rounded-lg text-xs ml-1 transition-colors hover:text-[var(--gold)]"
              style={{ color: 'var(--muted)', border: '1px solid var(--line)', minWidth: '28px', padding: '0 8px' }} aria-label="Fullscreen">
              {isFS ? 'Exit' : '⛶'}
            </button>
            <button onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-sm ml-0.5 transition-colors hover:text-[var(--gold)]"
              style={{ color: 'var(--muted)', border: '1px solid var(--line)' }} aria-label="Close">✕</button>
          </div>
        </div>

        {/* ── Image area ── */}
        <div style={{ ...imgAreaStyle, cursor }}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onTouchCancel={onTouchCancel}
          onWheel={onImgWheel}>
          {/* Single transform layer — direct DOM writes during drag, no re-renders */}
          <div ref={imgLayer} className="absolute inset-0 will-change-transform" style={{ transformOrigin: 'center center' }}>
            {images.map((src, i) => (
              <img key={src} src={src} alt={`${svc?.name ?? ''} ${i + 1}`} draggable={false}
                className="absolute inset-0 h-full w-full object-contain select-none"
                style={{ opacity: i === imgIdx ? 1 : 0, transition: 'opacity 0.25s ease', pointerEvents: 'none' }}
              />
            ))}
          </div>

          {/* Prev / Next arrows — hidden when zoomed in */}
          {images.length > 1 && zoom === 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); prev() }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full text-xl transition-all active:scale-95"
                style={{ background: 'rgba(10,10,10,0.7)', border: '1px solid rgba(200,168,75,0.35)', color: 'var(--gold)' }}>&#8249;</button>
              <button onClick={e => { e.stopPropagation(); next() }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full text-xl transition-all active:scale-95"
                style={{ background: 'rgba(10,10,10,0.7)', border: '1px solid rgba(200,168,75,0.35)', color: 'var(--gold)' }}>&#8250;</button>
            </>
          )}

          {/* Zoom hint overlay */}
          <div className="pointer-events-none absolute bottom-2 right-2 z-10 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{ background: 'rgba(10,10,10,0.6)', color: 'rgba(232,192,96,0.7)' }}>
            {zoom > 1 ? 'Click to reset' : 'Click to zoom'}
          </div>
        </div>

        {/* ── Thumbnails (drag-scrollable) ── */}
        {images.length > 1 && (
          <DragScroll className="px-3 py-2 flex-shrink-0" style={{ borderTop: '1px solid var(--line)' }}>
            {images.map((src, i) => (
              <button key={i} onClick={() => { setImgIdx(i); resetView() }}
                className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg transition-opacity"
                style={{ border: i === imgIdx ? '2px solid var(--gold)' : '2px solid rgba(255,255,255,0.08)', opacity: i === imgIdx ? 1 : 0.45 }}>
                <img src={src} alt="" className="h-full w-full object-cover pointer-events-none" draggable={false} />
              </button>
            ))}
          </DragScroll>
        )}

        {/* ── Service switcher (drag-scrollable) ── */}
        {services.length > 1 && (
          <DragScroll className="px-3 pb-3 pt-2 flex-shrink-0" style={{ borderTop: '1px solid var(--line)' }}>
            {services.map((s, i) => (
              <button key={i} onClick={() => setSvcIdx(i)}
                className="flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all"
                style={{ background: i === svcIdx ? 'rgba(200,168,75,0.15)' : 'transparent', border: i === svcIdx ? '1px solid rgba(200,168,75,0.5)' : '1px solid var(--line)', color: i === svcIdx ? 'var(--gold-light)' : 'var(--muted)', whiteSpace: 'nowrap' }}>
                {icons[i]} {s.name}
              </button>
            ))}
          </DragScroll>
        )}
      </div>
    </div>
  )
}

// ── Grid (default export) ─────────────────────────────────────────────────────

interface Props extends React.HTMLAttributes<HTMLDivElement> { services: Service[]; icons: string[] }

export default function ServiceCardGrid({ services, icons, ...rest }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  return (
    <>
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2" {...rest}>
        {services.map((svc, i) => (
          <ServiceCard key={i} svc={svc} idx={i} icon={icons[i] ?? String(i + 1).padStart(2, '0')} onOpen={setLightboxIdx} />
        ))}
      </div>
      {lightboxIdx !== null && (
        <Lightbox services={services} icons={icons} initialIdx={lightboxIdx} onClose={() => setLightboxIdx(null)} />
      )}
    </>
  )
}
