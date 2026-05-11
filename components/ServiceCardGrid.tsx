'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'

type Service = { name?: string; desc?: string; image?: string }

const EXTRA_IMAGES: Record<number, string[]> = {
  0: [
    '/images/Tint/BlueBMWFR.jpeg',
    '/images/Tint/BlueBMWSL.jpeg',
    '/images/Tint/GreenDodgeFL.jpeg',
    '/images/Tint/RedTruckDS.jpeg',
    '/images/Tint/RedTruckPS.jpeg',
    '/images/Tint/RedTruckPSF.jpeg',
    '/images/Tint/SilverSubaruFL.jpeg',
    '/images/Tint/SilverSubaruSL.jpeg',
    '/images/Tint/WhiteCivicFR.jpeg',
    '/images/Tint/WhiteGMCFL.jpeg',
    '/images/Tint/WhiteJeepFR.jpeg',
    '/images/Tint/WhiteJeepSL.jpeg',
    '/images/Tint/WhiteToyotaDS.jpeg',
  ],
  1: [
    '/images/Residential-Commercial/BathroomWindowTint.jpeg',
    '/images/Residential-Commercial/HouseInteriorWindowTint.jpeg',
    '/images/Residential-Commercial/HouseWindowTint.jpeg',
  ],
  2: [
    '/images/Vinyl-Wrap/IMG_9248.jpeg',
    '/images/Vinyl-Wrap/IMG_9250.jpeg',
    '/images/Vinyl-Wrap/IMG_9260.jpeg',
    '/images/Vinyl-Wrap/IMG_9263.jpeg',
    '/images/Vinyl-Wrap/IMG_9265.jpeg',
    '/images/Vinyl-Wrap/IMG_9266.jpeg',
    '/images/Vinyl-Wrap/IMG_9267.jpeg',
    '/images/Vinyl-Wrap/IMG_9272.jpeg',
    '/images/Vinyl-Wrap/IMG_9273.jpeg',
  ],
  3: [
    '/images/Ambient-Lighting/IMG_9246.jpeg',
    '/images/Ambient-Lighting/IMG_9247.jpeg',
    '/images/Ambient-Lighting/IMG_9251.jpeg',
    '/images/Ambient-Lighting/IMG_9252.jpeg',
    '/images/Ambient-Lighting/IMG_9253.jpeg',
    '/images/Ambient-Lighting/IMG_9257.jpeg',
    '/images/Ambient-Lighting/IMG_9258.jpeg',
    '/images/Ambient-Lighting/IMG_9269.jpeg',
    '/images/Ambient-Lighting/IMG_9276.jpeg',
  ],
}

function getImages(svc: Service, idx: number): string[] {
  const extras = EXTRA_IMAGES[idx]
  if (extras && extras.length > 0) return extras
  return [svc.image || '']
}

// ── DragScroll (thumbnail / service tab rows) ────────────────────────────────
// Lazy pointer-capture: only capture after real movement so child clicks fire.

function DragScroll({
  children,
  className,
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const ref      = useRef<HTMLDivElement>(null)
  const startX   = useRef(0)
  const scrollX  = useRef(0)
  const active   = useRef(false)
  const captured = useRef(false)

  function onPointerDown(e: React.PointerEvent) {
    if (!ref.current) return
    active.current   = true
    captured.current = false
    startX.current   = e.clientX
    scrollX.current  = ref.current.scrollLeft
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!active.current || !ref.current) return
    const dx = Math.abs(e.clientX - startX.current)
    if (!captured.current && dx > 4) {
      captured.current = true
      ref.current.setPointerCapture(e.pointerId)
      ref.current.style.cursor = 'grabbing'
    }
    if (captured.current) {
      ref.current.scrollLeft = scrollX.current - (e.clientX - startX.current)
    }
  }
  function onPointerUp(e: React.PointerEvent) {
    if (!ref.current) return
    active.current = false
    ref.current.style.cursor = 'grab'
    if (captured.current) {
      captured.current = false
      ref.current.releasePointerCapture(e.pointerId)
    }
  }
  function onWheel(e: React.WheelEvent) {
    if (!ref.current) return
    e.preventDefault()
    ref.current.scrollLeft += e.deltaY + e.deltaX
  }

  return (
    <div
      ref={ref}
      className={'no-scrollbar flex gap-2 overflow-x-auto select-none ' + (className ?? '')}
      style={{ cursor: 'grab', touchAction: 'pan-x', ...style }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
    >
      {children}
      <div className="w-3 flex-shrink-0" />
    </div>
  )
}

// ── ServiceCard ──────────────────────────────────────────────────────────────

function ServiceCard({
  svc,
  idx,
  icon,
  onOpen,
}: {
  svc: Service
  idx: number
  icon: string
  onOpen: (i: number) => void
}) {
  const images = getImages(svc, idx)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => setCurrent(c => (c + 1) % images.length), 3500)
    return () => clearInterval(id)
  }, [images.length])

  return (
    <div
      onClick={() => onOpen(idx)}
      className="panel-gold flex cursor-pointer flex-col overflow-hidden transition-all hover:border-[rgba(200,168,75,0.45)]"
    >
      <div className="relative h-44 w-full overflow-hidden">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={svc.name ?? ''}
            data-ngf-field={i === 0 ? `services.items.${idx}.image` : undefined}
            data-ngf-label={i === 0 ? 'Photo' : undefined}
            data-ngf-type={i === 0 ? 'image' : undefined}
            data-ngf-section={i === 0 ? 'Services' : undefined}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(10,10,10,0.7) 100%)' }}
        />
        <div
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold tracking-widest"
          style={{ background: 'rgba(10,10,10,0.7)', border: '1px solid rgba(200,168,75,0.4)', color: 'var(--gold)' }}
        >
          {icon}
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
            {images.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? '14px' : '6px',
                  height: '6px',
                  background: i === current ? 'var(--gold)' : 'rgba(255,255,255,0.35)',
                }}
              />
            ))}
          </div>
        )}
        <div
          className="absolute bottom-3 left-4 text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: 'rgba(232,192,96,0.75)' }}
        >
          Tap to view
        </div>
      </div>
      <div className="flex flex-col gap-2 p-5">
        <h3
          data-ngf-field={`services.items.${idx}.name`}
          data-ngf-label="Service Name"
          data-ngf-type="text"
          data-ngf-section="Services"
          className="text-base font-semibold text-[var(--text)]"
        >
          {svc.name ?? ''}
        </h3>
        <p
          data-ngf-field={`services.items.${idx}.desc`}
          data-ngf-label="Description"
          data-ngf-type="textarea"
          data-ngf-section="Services"
          className="text-sm leading-relaxed"
          style={{ color: 'var(--muted)' }}
        >
          {svc.desc ?? ''}
        </p>
      </div>
    </div>
  )
}

// ── Lightbox ─────────────────────────────────────────────────────────────────
// Mobile: swipe left/right to navigate, no tap-to-zoom.
// Desktop: arrow keys, scroll-wheel zoom, drag to pan when zoomed.
// Zoom uses actual width/height (not CSS scale) for crisp rendering.

function Lightbox({
  services,
  icons,
  initialIdx,
  onClose,
}: {
  services: Service[]
  icons: string[]
  initialIdx: number
  onClose: () => void
}) {
  const [svcIdx, setSvcIdx] = useState(initialIdx)
  const [imgIdx, setImgIdx] = useState(0)
  const [zoom, setZoom]     = useState(1)
  const [isFS, setIsFS]     = useState(false)

  const panRef   = useRef({ x: 0, y: 0 })
  const imgLayer = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const zoomRef  = useRef(1)

  // Touch: swipe to navigate (zoom=1) or pan (zoom>1)
  const swipeStart = useRef<{ sx: number; sy: number } | null>(null)
  const panStart   = useRef<{ sx: number; sy: number; px: number; py: number } | null>(null)
  // Mouse: pan when zoomed
  const mouseStart = useRef<{ sx: number; sy: number; px: number; py: number } | null>(null)

  const svc    = services[svcIdx]
  const images = getImages(svc, svcIdx)

  useEffect(() => { zoomRef.current = zoom }, [zoom])

  // Size-based zoom: renders image at actual pixel dimensions, no blurry upscaling.
  const applyTransform = useCallback((z: number, px: number, py: number, animated = false) => {
    if (!imgLayer.current) return
    imgLayer.current.style.transition = animated
      ? 'width 0.18s ease, height 0.18s ease, transform 0.18s ease'
      : 'none'
    imgLayer.current.style.width     = `${z * 100}%`
    imgLayer.current.style.height    = `${z * 100}%`
    imgLayer.current.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`
  }, [])

  const resetView = useCallback(() => {
    panRef.current = { x: 0, y: 0 }
    setZoom(1)
    applyTransform(1, 0, 0, true)
  }, [applyTransform])

  useEffect(() => {
    applyTransform(zoom, panRef.current.x, panRef.current.y, true)
  }, [zoom, applyTransform])

  const prev = useCallback(() => {
    setImgIdx(i => (i - 1 + images.length) % images.length)
    resetView()
  }, [images.length, resetView])

  const next = useCallback(() => {
    setImgIdx(i => (i + 1) % images.length)
    resetView()
  }, [images.length, resetView])

  useEffect(() => { setImgIdx(0); resetView() }, [svcIdx, resetView])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const h = () => setIsFS(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', h)
    return () => document.removeEventListener('fullscreenchange', h)
  }, [])

  function toggleFS() {
    if (!document.fullscreenElement) modalRef.current?.requestFullscreen().catch(() => {})
    else document.exitFullscreen().catch(() => {})
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape')     { if (zoomRef.current > 1) resetView(); else onClose() }
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === '+')          setZoom(z => Math.min(+(z + 0.5).toFixed(1), 4))
      if (e.key === '-')          setZoom(z => {
        const nz = Math.max(+(z - 0.5).toFixed(1), 1)
        if (nz === 1) panRef.current = { x: 0, y: 0 }
        return nz
      })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, prev, next, resetView])

  // ── Mouse handlers (desktop pan when zoomed) ───────────────────────────────
  function onMouseDown(e: React.MouseEvent) {
    if (zoomRef.current <= 1) return
    e.preventDefault()
    mouseStart.current = {
      sx: e.clientX, sy: e.clientY,
      px: panRef.current.x, py: panRef.current.y,
    }
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!mouseStart.current) return
    const nx = mouseStart.current.px + (e.clientX - mouseStart.current.sx)
    const ny = mouseStart.current.py + (e.clientY - mouseStart.current.sy)
    panRef.current = { x: nx, y: ny }
    applyTransform(zoomRef.current, nx, ny, false)
  }
  function onMouseUp()    { mouseStart.current = null }
  function onMouseLeave() { mouseStart.current = null }

  // ── Touch handlers ─────────────────────────────────────────────────────────
  // zoom=1  -> track horizontal swipe for navigation
  // zoom>1  -> track drag for panning
  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length !== 1) return
    const t = e.touches[0]
    if (zoomRef.current > 1) {
      panStart.current = { sx: t.clientX, sy: t.clientY, px: panRef.current.x, py: panRef.current.y }
    } else {
      swipeStart.current = { sx: t.clientX, sy: t.clientY }
    }
  }
  function onTouchMove(e: React.TouchEvent) {
    if (e.touches.length !== 1) return
    const t = e.touches[0]
    if (zoomRef.current > 1 && panStart.current) {
      e.preventDefault()
      const nx = panStart.current.px + (t.clientX - panStart.current.sx)
      const ny = panStart.current.py + (t.clientY - panStart.current.sy)
      panRef.current = { x: nx, y: ny }
      applyTransform(zoomRef.current, nx, ny, false)
    }
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (panStart.current) {
      panStart.current = null
      return
    }
    if (!swipeStart.current) return
    const t  = e.changedTouches[0]
    const dx = t.clientX - swipeStart.current.sx
    const dy = t.clientY - swipeStart.current.sy
    swipeStart.current = null
    // Horizontal swipe > 50px and clearly more horizontal than vertical
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      dx < 0 ? next() : prev()
    }
  }
  function onTouchCancel() {
    swipeStart.current = null
    panStart.current   = null
  }

  // ── Scroll wheel zoom (desktop) ────────────────────────────────────────────
  function onImgWheel(e: React.WheelEvent) {
    e.preventDefault()
    setZoom(z => {
      const nz = Math.min(Math.max(+(z - e.deltaY * 0.003).toFixed(2), 1), 4)
      if (nz === 1) panRef.current = { x: 0, y: 0 }
      return nz
    })
  }

  function zoomIn() { setZoom(z => Math.min(+(z + 0.5).toFixed(1), 4)) }
  function zoomOut() {
    setZoom(z => {
      const nz = Math.max(+(z - 0.5).toFixed(1), 1)
      if (nz === 1) panRef.current = { x: 0, y: 0 }
      return nz
    })
  }

  const cursor = zoom > 1 ? 'grab' : 'default'

  const modalStyle: React.CSSProperties = isFS
    ? { background: '#0a0a0a', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 0, border: 'none' }
    : { background: '#111', border: '1px solid rgba(200,168,75,0.2)', maxHeight: '90dvh', display: 'flex', flexDirection: 'column', borderRadius: '16px' }

  const imgAreaStyle: React.CSSProperties = isFS
    ? { flex: 1, position: 'relative', overflow: 'hidden', background: '#000', minHeight: 0 }
    : { position: 'relative', overflow: 'hidden', background: '#000', height: '54vw', maxHeight: '360px', minHeight: '200px' }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.9)' }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative w-full sm:max-w-xl overflow-hidden"
        style={modalStyle}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex flex-shrink-0 items-center justify-between px-4 py-3"
          style={{ borderBottom: '1px solid var(--line)' }}
        >
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold"
              style={{ background: 'rgba(200,168,75,0.12)', border: '1px solid rgba(200,168,75,0.35)', color: 'var(--gold)' }}
            >
              {icons[svcIdx]}
            </span>
            <span className="text-sm font-semibold text-[var(--text)]">{svc?.name}</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {imgIdx + 1} / {images.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={zoomOut}
              disabled={zoom <= 1}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-base transition-colors disabled:opacity-30 hover:text-[var(--gold)]"
              style={{ color: 'var(--muted)', border: '1px solid var(--line)' }}
              aria-label="Zoom out"
            >
              -
            </button>
            <span
              className="min-w-[34px] text-center text-[11px] font-semibold tabular-nums"
              style={{ color: zoom > 1 ? 'var(--gold-light)' : 'var(--muted)' }}
            >
              {zoom === 1 ? '1x' : `${zoom.toFixed(1)}x`}
            </span>
            <button
              onClick={zoomIn}
              disabled={zoom >= 4}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-base transition-colors disabled:opacity-30 hover:text-[var(--gold)]"
              style={{ color: 'var(--muted)', border: '1px solid var(--line)' }}
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              onClick={toggleFS}
              className="flex h-7 items-center justify-center rounded-lg text-xs ml-1 transition-colors hover:text-[var(--gold)]"
              style={{ color: 'var(--muted)', border: '1px solid var(--line)', minWidth: '28px', padding: '0 8px' }}
              aria-label="Fullscreen"
            >
              {isFS ? 'Exit' : 'FS'}
            </button>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-sm ml-0.5 transition-colors hover:text-[var(--gold)]"
              style={{ color: 'var(--muted)', border: '1px solid var(--line)' }}
              aria-label="Close"
            >
              X
            </button>
          </div>
        </div>

        {/* Image area */}
        <div
          style={{ ...imgAreaStyle, cursor }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchCancel}
          onWheel={onImgWheel}
        >
          {/* imgLayer: positioned from center so width/height changes zoom symmetrically */}
          <div
            ref={imgLayer}
            className="absolute will-change-transform"
            style={{
              left: '50%',
              top: '50%',
              width: '100%',
              height: '100%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {images.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`${svc?.name ?? ''} ${i + 1}`}
                draggable={false}
                className="absolute inset-0 h-full w-full object-contain select-none"
                style={{
                  opacity: i === imgIdx ? 1 : 0,
                  transition: 'opacity 0.25s ease',
                  pointerEvents: 'none',
                }}
              />
            ))}
          </div>

          {/* Prev / Next arrows — block ALL touch and pointer events from reaching the image area */}
          {images.length > 1 && (
            <>
              <button
                onTouchStart={e => e.stopPropagation()}
                onTouchEnd={e => e.stopPropagation()}
                onPointerDown={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
                onClick={e => { e.stopPropagation(); prev() }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full text-xl transition-all active:scale-95"
                style={{ background: 'rgba(10,10,10,0.75)', border: '1px solid rgba(200,168,75,0.4)', color: 'var(--gold)', touchAction: 'none' }}
                aria-label="Previous"
              >
                {'<'}
              </button>
              <button
                onTouchStart={e => e.stopPropagation()}
                onTouchEnd={e => e.stopPropagation()}
                onPointerDown={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
                onClick={e => { e.stopPropagation(); next() }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full text-xl transition-all active:scale-95"
                style={{ background: 'rgba(10,10,10,0.75)', border: '1px solid rgba(200,168,75,0.4)', color: 'var(--gold)', touchAction: 'none' }}
                aria-label="Next"
              >
                {'>'}
              </button>
            </>
          )}

          {/* Hint */}
          <div
            className="pointer-events-none absolute bottom-2 right-2 z-10 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{ background: 'rgba(10,10,10,0.6)', color: 'rgba(232,192,96,0.7)' }}
          >
            {zoom > 1 ? 'Drag to pan' : images.length > 1 ? 'Swipe to browse' : ''}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <DragScroll className="px-3 py-2 flex-shrink-0" style={{ borderTop: '1px solid var(--line)' }}>
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => { setImgIdx(i); resetView() }}
                className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg transition-opacity"
                style={{
                  border: i === imgIdx ? '2px solid var(--gold)' : '2px solid rgba(255,255,255,0.08)',
                  opacity: i === imgIdx ? 1 : 0.45,
                }}
              >
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover pointer-events-none"
                  draggable={false}
                />
              </button>
            ))}
          </DragScroll>
        )}

        {/* Service switcher */}
        {services.length > 1 && (
          <DragScroll className="px-3 pb-3 pt-2 flex-shrink-0" style={{ borderTop: '1px solid var(--line)' }}>
            {services.map((s, i) => (
              <button
                key={i}
                onClick={() => setSvcIdx(i)}
                className="flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all"
                style={{
                  background: i === svcIdx ? 'rgba(200,168,75,0.15)' : 'transparent',
                  border: i === svcIdx ? '1px solid rgba(200,168,75,0.5)' : '1px solid var(--line)',
                  color: i === svcIdx ? 'var(--gold-light)' : 'var(--muted)',
                  whiteSpace: 'nowrap',
                }}
              >
                {icons[i]} {s.name}
              </button>
            ))}
          </DragScroll>
        )}
      </div>
    </div>
  )
}

// ── Grid (default export) ────────────────────────────────────────────────────

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  services: Service[]
  icons: string[]
}

export default function ServiceCardGrid({ services, icons, ...rest }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  return (
    <>
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2" {...rest}>
        {services.map((svc, i) => (
          <ServiceCard
            key={i}
            svc={svc}
            idx={i}
            icon={icons[i] ?? String(i + 1).padStart(2, '0')}
            onOpen={setLightboxIdx}
          />
        ))}
      </div>
      {lightboxIdx !== null && (
        <Lightbox
          services={services}
          icons={icons}
          initialIdx={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  )
}
