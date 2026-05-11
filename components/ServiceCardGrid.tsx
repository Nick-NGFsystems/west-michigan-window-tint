'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'

type Service = { name?: string; desc?: string; image?: string }

const EXTRA_IMAGES: Record<number, string[]> = {
  0: [
    '/images/Tint/BlueBMWFR.jpeg', '/images/Tint/BlueBMWSL.jpeg',
    '/images/Tint/GreenDodgeFL.jpeg', '/images/Tint/RedTruckDS.jpeg',
    '/images/Tint/RedTruckPS.jpeg', '/images/Tint/RedTruckPSF.jpeg',
    '/images/Tint/SilverSubaruFL.jpeg', '/images/Tint/SilverSubaruSL.jpeg',
    '/images/Tint/WhiteCivicFR.jpeg', '/images/Tint/WhiteGMCFL.jpeg',
    '/images/Tint/WhiteJeepFR.jpeg', '/images/Tint/WhiteJeepSL.jpeg',
    '/images/Tint/WhiteToyotaDS.jpeg',
  ],
  1: [
    '/images/Residential-Commercial/BathroomWindowTint.jpeg',
    '/images/Residential-Commercial/HouseInteriorWindowTint.jpeg',
    '/images/Residential-Commercial/HouseWindowTint.jpeg',
  ],
  2: [
    '/images/Vinyl-Wrap/IMG_9248.jpeg', '/images/Vinyl-Wrap/IMG_9250.jpeg',
    '/images/Vinyl-Wrap/IMG_9260.jpeg', '/images/Vinyl-Wrap/IMG_9263.jpeg',
    '/images/Vinyl-Wrap/IMG_9265.jpeg', '/images/Vinyl-Wrap/IMG_9266.jpeg',
    '/images/Vinyl-Wrap/IMG_9267.jpeg', '/images/Vinyl-Wrap/IMG_9272.jpeg',
    '/images/Vinyl-Wrap/IMG_9273.jpeg',
  ],
  3: [
    '/images/Ambient-Lighting/IMG_9246.jpeg', '/images/Ambient-Lighting/IMG_9247.jpeg',
    '/images/Ambient-Lighting/IMG_9251.jpeg', '/images/Ambient-Lighting/IMG_9252.jpeg',
    '/images/Ambient-Lighting/IMG_9253.jpeg', '/images/Ambient-Lighting/IMG_9257.jpeg',
    '/images/Ambient-Lighting/IMG_9258.jpeg', '/images/Ambient-Lighting/IMG_9269.jpeg',
    '/images/Ambient-Lighting/IMG_9276.jpeg',
  ],
}

function getImages(svc: Service, idx: number): string[] {
  const extras = EXTRA_IMAGES[idx]
  return extras && extras.length > 0 ? extras : [svc.image || '']
}

// Scrollable row — lazy pointer capture so child buttons still get clicks
function DragScroll({ children, className, style }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const startX = useRef(0); const scrollX = useRef(0)
  const active = useRef(false); const captured = useRef(false)

  function onPointerDown(e: React.PointerEvent) {
    if (!ref.current) return
    active.current = true; captured.current = false
    startX.current = e.clientX; scrollX.current = ref.current.scrollLeft
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!active.current || !ref.current) return
    if (!captured.current && Math.abs(e.clientX - startX.current) > 4) {
      captured.current = true; ref.current.setPointerCapture(e.pointerId)
      ref.current.style.cursor = 'grabbing'
    }
    if (captured.current) ref.current.scrollLeft = scrollX.current - (e.clientX - startX.current)
  }
  function onPointerUp(e: React.PointerEvent) {
    if (!ref.current) return
    active.current = false; ref.current.style.cursor = 'grab'
    if (captured.current) { captured.current = false; ref.current.releasePointerCapture(e.pointerId) }
  }
  function onWheel(e: React.WheelEvent) {
    if (!ref.current) return
    e.preventDefault(); ref.current.scrollLeft += e.deltaY + e.deltaX
  }

  return (
    <div ref={ref}
      className={'no-scrollbar flex gap-2 overflow-x-auto select-none ' + (className ?? '')}
      style={{ cursor: 'grab', touchAction: 'pan-x', ...style }}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove}
      onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onWheel={onWheel}>
      {children}
      <div className="w-3 flex-shrink-0" />
    </div>
  )
}

// Service card in grid
function ServiceCard({ svc, idx, icon, onOpen }: {
  svc: Service; idx: number; icon: string; onOpen: (i: number) => void
}) {
  const images = getImages(svc, idx)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => setCurrent(c => (c + 1) % images.length), 3500)
    return () => clearInterval(id)
  }, [images.length])

  return (
    <div onClick={() => onOpen(idx)}
      className="panel-gold flex cursor-pointer flex-col overflow-hidden transition-all hover:border-[rgba(200,168,75,0.45)]">
      <div className="relative h-44 w-full overflow-hidden">
        {images.map((src, i) => (
          <img key={src} src={src} alt={svc.name ?? ''}
            data-ngf-field={i === 0 ? `services.items.${idx}.image` : undefined}
            data-ngf-label={i === 0 ? 'Photo' : undefined}
            data-ngf-type={i === 0 ? 'image' : undefined}
            data-ngf-section={i === 0 ? 'Services' : undefined}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }} />
        ))}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(10,10,10,0.7) 100%)' }} />
        <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold tracking-widest"
          style={{ background: 'rgba(10,10,10,0.7)', border: '1px solid rgba(200,168,75,0.4)', color: 'var(--gold)' }}>
          {icon}
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
            {images.map((_, i) => (
              <div key={i} className="rounded-full transition-all duration-300"
                style={{ width: i === current ? '14px' : '6px', height: '6px',
                  background: i === current ? 'var(--gold)' : 'rgba(255,255,255,0.35)' }} />
            ))}
          </div>
        )}
        <div className="absolute bottom-3 left-4 text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: 'rgba(232,192,96,0.75)' }}>Tap to view</div>
      </div>
      <div className="flex flex-col gap-2 p-5">
        <h3 data-ngf-field={`services.items.${idx}.name`} data-ngf-label="Service Name"
          data-ngf-type="text" data-ngf-section="Services"
          className="text-base font-semibold text-[var(--text)]">{svc.name ?? ''}</h3>
        <p data-ngf-field={`services.items.${idx}.desc`} data-ngf-label="Description"
          data-ngf-type="textarea" data-ngf-section="Services"
          className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{svc.desc ?? ''}</p>
      </div>
    </div>
  )
}

// Arrow button — fully isolated from image-area touch/pointer events
function ArrowBtn({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  function stop(e: React.SyntheticEvent) { e.stopPropagation() }
  return (
    <button
      onTouchStart={stop} onTouchMove={stop} onTouchEnd={stop}
      onPointerDown={stop} onMouseDown={stop}
      onClick={e => { e.stopPropagation(); onClick() }}
      aria-label={dir === 'prev' ? 'Previous' : 'Next'}
      style={{
        position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 10,
        [dir === 'prev' ? 'left' : 'right']: 8,
        width: 40, height: 40, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, fontWeight: 600, cursor: 'pointer', touchAction: 'none',
        background: 'rgba(10,10,10,0.78)', border: '1px solid rgba(200,168,75,0.45)',
        color: 'var(--gold)',
      }}>
      {dir === 'prev' ? '<' : '>'}
    </button>
  )
}

// Lightbox
// - Centered modal on all screen sizes
// - Tap image  → zoom in (2.5x); tap again → zoom out
// - Drag / touch-drag → pan while zoomed
// - Swipe left/right → navigate (only when not zoomed)
// - +/- buttons in header → zoom
// - Thumbnails → jump to image
// - Service tabs → switch service
// - Zoom uses actual width/height (not CSS scale) for crisp rendering
function Lightbox({ services, icons, initialIdx, onClose }: {
  services: Service[]; icons: string[]; initialIdx: number; onClose: () => void
}) {
  const [svcIdx, setSvcIdx] = useState(initialIdx)
  const [imgIdx, setImgIdx] = useState(0)
  const [zoom, setZoom]     = useState(1)
  const [hint, setHint]     = useState<string>('')

  const panRef      = useRef({ x: 0, y: 0 })
  const imgLayerRef = useRef<HTMLDivElement>(null)
  const zoomRef     = useRef(1)

  // Touch tracking
  const touchRef = useRef<{ x: number; y: number; moved: boolean } | null>(null)
  const panDrag  = useRef<{ sx: number; sy: number; px: number; py: number } | null>(null)
  // Mouse tracking (desktop pan)
  const mouseDrag = useRef<{ sx: number; sy: number; px: number; py: number } | null>(null)

  const svc    = services[svcIdx]
  const images = getImages(svc, svcIdx)

  useEffect(() => { zoomRef.current = zoom }, [zoom])

  // Size-based zoom: increases actual render dimensions so browser draws
  // from full-res source rather than scaling a downsampled bitmap.
  const applyTransform = useCallback((z: number, px: number, py: number, animated = false) => {
    if (!imgLayerRef.current) return
    imgLayerRef.current.style.transition = animated
      ? 'width 0.2s ease, height 0.2s ease, transform 0.2s ease' : 'none'
    imgLayerRef.current.style.width     = `${z * 100}%`
    imgLayerRef.current.style.height    = `${z * 100}%`
    imgLayerRef.current.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`
  }, [])

  const resetZoom = useCallback(() => {
    panRef.current = { x: 0, y: 0 }
    setZoom(1)
    applyTransform(1, 0, 0, true)
  }, [applyTransform])

  // Sync transform whenever zoom changes via +/- buttons
  useEffect(() => {
    applyTransform(zoom, panRef.current.x, panRef.current.y, true)
  }, [zoom, applyTransform])

  const prev = useCallback(() => { setImgIdx(i => (i - 1 + images.length) % images.length); resetZoom() }, [images.length, resetZoom])
  const next = useCallback(() => { setImgIdx(i => (i + 1) % images.length); resetZoom() }, [images.length, resetZoom])

  useEffect(() => { setImgIdx(0); resetZoom() }, [svcIdx, resetZoom])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape')     { zoomRef.current > 1 ? resetZoom() : onClose() }
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
  }, [onClose, prev, next, resetZoom])

  // ── Touch handlers ────────────────────────────────────────────────────────
  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length !== 1) return
    const t = e.touches[0]
    if (zoomRef.current > 1) {
      panDrag.current = { sx: t.clientX, sy: t.clientY, px: panRef.current.x, py: panRef.current.y }
    } else {
      touchRef.current = { x: t.clientX, y: t.clientY, moved: false }
    }
  }
  function onTouchMove(e: React.TouchEvent) {
    if (e.touches.length !== 1) return
    const t = e.touches[0]
    if (zoomRef.current > 1 && panDrag.current) {
      e.preventDefault()
      const nx = panDrag.current.px + (t.clientX - panDrag.current.sx)
      const ny = panDrag.current.py + (t.clientY - panDrag.current.sy)
      panRef.current = { x: nx, y: ny }
      applyTransform(zoomRef.current, nx, ny, false)
    } else if (touchRef.current) {
      if (Math.abs(t.clientX - touchRef.current.x) > 6 || Math.abs(t.clientY - touchRef.current.y) > 6) {
        touchRef.current.moved = true
      }
    }
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (panDrag.current) { panDrag.current = null; return }
    if (!touchRef.current) return
    const t  = e.changedTouches[0]
    const dx = t.clientX - touchRef.current.x
    const dy = t.clientY - touchRef.current.y
    const moved = touchRef.current.moved
    touchRef.current = null

    if (!moved) {
      // Tap: toggle zoom
      if (zoomRef.current === 1) {
        const nz = 2.5
        setZoom(nz)
        applyTransform(nz, 0, 0, true)
        setHint('Drag to pan | Tap to reset')
      } else {
        resetZoom()
        setHint('')
      }
    } else if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      // Swipe to navigate (only when not zoomed)
      dx < 0 ? next() : prev()
    }
  }
  function onTouchCancel() { touchRef.current = null; panDrag.current = null }

  // ── Mouse handlers (desktop pan when zoomed) ──────────────────────────────
  function onMouseDown(e: React.MouseEvent) {
    if (zoomRef.current <= 1) return
    e.preventDefault()
    mouseDrag.current = { sx: e.clientX, sy: e.clientY, px: panRef.current.x, py: panRef.current.y }
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!mouseDrag.current) return
    const nx = mouseDrag.current.px + (e.clientX - mouseDrag.current.sx)
    const ny = mouseDrag.current.py + (e.clientY - mouseDrag.current.sy)
    panRef.current = { x: nx, y: ny }
    applyTransform(zoomRef.current, nx, ny, false)
  }
  function onMouseUp()    { mouseDrag.current = null }
  function onMouseLeave() { mouseDrag.current = null }

  // ── Scroll-wheel zoom (desktop) ───────────────────────────────────────────
  function onWheel(e: React.WheelEvent) {
    e.preventDefault()
    setZoom(z => {
      const nz = Math.min(Math.max(+(z - e.deltaY * 0.003).toFixed(2), 1), 4)
      if (nz === 1) panRef.current = { x: 0, y: 0 }
      return nz
    })
  }

  function zoomIn()  { setZoom(z => Math.min(+(z + 0.5).toFixed(1), 4)) }
  function zoomOut() {
    setZoom(z => {
      const nz = Math.max(+(z - 0.5).toFixed(1), 1)
      if (nz === 1) { panRef.current = { x: 0, y: 0 }; setHint('') }
      return nz
    })
  }

  const hintText = hint || (zoom === 1 ? (images.length > 1 ? 'Swipe or tap to zoom' : 'Tap to zoom') : '')

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(0,0,0,0.88)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '12px',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 576,
        background: '#111', borderRadius: 16,
        border: '1px solid rgba(200,168,75,0.2)',
        display: 'flex', flexDirection: 'column',
        maxHeight: '92dvh', overflow: 'hidden',
      }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', borderBottom: '1px solid var(--line)', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <span style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, borderRadius: 8, fontSize: 11, fontWeight: 700, flexShrink: 0,
              background: 'rgba(200,168,75,0.12)', border: '1px solid rgba(200,168,75,0.35)',
              color: 'var(--gold)',
            }}>{icons[svcIdx]}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{svc?.name}</span>
            {images.length > 1 && (
              <span style={{ fontSize: 11, color: 'var(--muted)', flexShrink: 0 }}>{imgIdx + 1}/{images.length}</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <button onClick={zoomOut} disabled={zoom <= 1}
              style={{
                width: 30, height: 30, borderRadius: 8, border: '1px solid var(--line)',
                background: 'transparent', color: 'var(--muted)', fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', opacity: zoom <= 1 ? 0.3 : 1,
              }} aria-label="Zoom out">-</button>
            <span style={{ fontSize: 11, fontWeight: 600, minWidth: 32, textAlign: 'center',
              color: zoom > 1 ? 'var(--gold-light)' : 'var(--muted)' }}>
              {zoom === 1 ? '1x' : `${zoom.toFixed(1)}x`}
            </span>
            <button onClick={zoomIn} disabled={zoom >= 4}
              style={{
                width: 30, height: 30, borderRadius: 8, border: '1px solid var(--line)',
                background: 'transparent', color: 'var(--muted)', fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', opacity: zoom >= 4 ? 0.3 : 1,
              }} aria-label="Zoom in">+</button>
            <button onClick={onClose}
              style={{
                width: 30, height: 30, borderRadius: 8, border: '1px solid var(--line)',
                background: 'transparent', color: 'var(--muted)', fontSize: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', marginLeft: 2,
              }} aria-label="Close">X</button>
          </div>
        </div>

        {/* ── Image area ─────────────────────────────────────────────────── */}
        <div
          onTouchStart={onTouchStart} onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd} onTouchCancel={onTouchCancel}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove}
          onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}
          onWheel={onWheel}
          style={{
            position: 'relative', flexShrink: 0, overflow: 'hidden',
            background: '#000',
            height: '56vw', maxHeight: 380, minHeight: 200,
            cursor: zoom > 1 ? 'grab' : 'default',
          }}>
          {/* imgLayer: sized by zoom for crisp rendering */}
          <div ref={imgLayerRef} style={{
            position: 'absolute', left: '50%', top: '50%',
            width: '100%', height: '100%',
            transform: 'translate(-50%, -50%)',
          }}>
            {images.map((src, i) => (
              <img key={src} src={src} alt={`${svc?.name ?? ''} ${i + 1}`}
                draggable={false}
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'contain', pointerEvents: 'none', userSelect: 'none',
                  opacity: i === imgIdx ? 1 : 0, transition: 'opacity 0.22s ease',
                }} />
            ))}
          </div>

          {/* Arrows */}
          {images.length > 1 && zoom === 1 && (
            <>
              <ArrowBtn dir="prev" onClick={prev} />
              <ArrowBtn dir="next" onClick={next} />
            </>
          )}

          {/* Hint */}
          {hintText && (
            <div style={{
              position: 'absolute', bottom: 8, right: 8, zIndex: 10, pointerEvents: 'none',
              background: 'rgba(10,10,10,0.65)', borderRadius: 6, padding: '3px 8px',
              fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
              color: 'rgba(232,192,96,0.8)',
            }}>{hintText}</div>
          )}

          {/* Dots */}
          {images.length > 1 && zoom === 1 && (
            <div style={{
              position: 'absolute', bottom: 8, left: 0, right: 0,
              display: 'flex', justifyContent: 'center', gap: 6, pointerEvents: 'none',
            }}>
              {images.map((_, i) => (
                <div key={i} style={{
                  height: 6, borderRadius: 3,
                  width: i === imgIdx ? 14 : 6,
                  background: i === imgIdx ? 'var(--gold)' : 'rgba(255,255,255,0.35)',
                  transition: 'all 0.25s',
                }} />
              ))}
            </div>
          )}
        </div>

        {/* ── Thumbnails ──────────────────────────────────────────────────── */}
        {images.length > 1 && (
          <DragScroll className="px-3 py-2 flex-shrink-0"
            style={{ borderTop: '1px solid var(--line)' }}>
            {images.map((src, i) => (
              <button key={i} onClick={() => { setImgIdx(i); resetZoom() }}
                style={{
                  flexShrink: 0, width: 64, height: 48, borderRadius: 8,
                  overflow: 'hidden', padding: 0, cursor: 'pointer',
                  background: 'transparent',
                  border: i === imgIdx ? '2px solid var(--gold)' : '2px solid rgba(255,255,255,0.08)',
                  opacity: i === imgIdx ? 1 : 0.45,
                }}>
                <img src={src} alt="" draggable={false}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
              </button>
            ))}
          </DragScroll>
        )}

        {/* ── Service tabs ────────────────────────────────────────────────── */}
        {services.length > 1 && (
          <DragScroll className="px-3 pb-3 pt-2 flex-shrink-0"
            style={{ borderTop: '1px solid var(--line)' }}>
            {services.map((s, i) => (
              <button key={i} onClick={() => setSvcIdx(i)}
                style={{
                  flexShrink: 0, borderRadius: 999, padding: '6px 12px',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                  background: i === svcIdx ? 'rgba(200,168,75,0.15)' : 'transparent',
                  border: i === svcIdx ? '1px solid rgba(200,168,75,0.5)' : '1px solid var(--line)',
                  color: i === svcIdx ? 'var(--gold-light)' : 'var(--muted)',
                }}>
                {icons[i]} {s.name}
              </button>
            ))}
          </DragScroll>
        )}
      </div>
    </div>
  )
}

// Grid
interface Props extends React.HTMLAttributes<HTMLDivElement> {
  services: Service[]; icons: string[]
}

export default function ServiceCardGrid({ services, icons, ...rest }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  return (
    <>
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2" {...rest}>
        {services.map((svc, i) => (
          <ServiceCard key={i} svc={svc} idx={i}
            icon={icons[i] ?? String(i + 1).padStart(2, '00')}
            onOpen={setLightboxIdx} />
        ))}
      </div>
      {lightboxIdx !== null && (
        <Lightbox services={services} icons={icons}
          initialIdx={lightboxIdx} onClose={() => setLightboxIdx(null)} />
      )}
    </>
  )
}
