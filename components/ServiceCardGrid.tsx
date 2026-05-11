'use client'

import React, { useState, useEffect, useRef } from 'react'

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
  return (extras && extras.length > 0) ? extras : [svc.image || '']
}

// Horizontally scrollable row with drag support and lazy pointer capture
// so child buttons still receive click events.
function DragScroll({ children, className, style }: {
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
    active.current = true; captured.current = false
    startX.current = e.clientX; scrollX.current = ref.current.scrollLeft
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!active.current || !ref.current) return
    const dx = Math.abs(e.clientX - startX.current)
    if (!captured.current && dx > 4) {
      captured.current = true
      ref.current.setPointerCapture(e.pointerId)
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

// Service card shown in the grid
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

// Arrow button — blocks all touch/pointer/mouse events from reaching the image
// area so they can never accidentally trigger swipe logic.
function ArrowBtn({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  function block(e: React.SyntheticEvent) { e.stopPropagation() }
  return (
    <button
      onTouchStart={block} onTouchEnd={block} onTouchMove={block}
      onPointerDown={block} onMouseDown={block}
      onClick={(e) => { e.stopPropagation(); onClick() }}
      style={{
        position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 10,
        [dir === 'prev' ? 'left' : 'right']: 8,
        width: 40, height: 40, borderRadius: '50%', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: 18,
        background: 'rgba(10,10,10,0.75)', border: '1px solid rgba(200,168,75,0.4)',
        color: 'var(--gold)', cursor: 'pointer', touchAction: 'none',
      }}
      aria-label={dir === 'prev' ? 'Previous' : 'Next'}>
      {dir === 'prev' ? '<' : '>'}
    </button>
  )
}

// Lightbox — simple, no zoom, no fullscreen.
// Navigate with swipe, arrows, thumbnails, or keyboard arrows.
function Lightbox({ services, icons, initialIdx, onClose }: {
  services: Service[]; icons: string[]; initialIdx: number; onClose: () => void
}) {
  const [svcIdx, setSvcIdx] = useState(initialIdx)
  const [imgIdx, setImgIdx] = useState(0)
  const swipeRef = useRef<{ x: number; y: number } | null>(null)

  const svc    = services[svcIdx]
  const images = getImages(svc, svcIdx)

  // Reset image index when switching service
  useEffect(() => { setImgIdx(0) }, [svcIdx])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  setImgIdx(i => (i - 1 + images.length) % images.length)
      if (e.key === 'ArrowRight') setImgIdx(i => (i + 1) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, images.length])

  function prev() { setImgIdx(i => (i - 1 + images.length) % images.length) }
  function next() { setImgIdx(i => (i + 1) % images.length) }

  // Touch swipe handlers on the image area
  function onTouchStart(e: React.TouchEvent) {
    swipeRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (!swipeRef.current) return
    const dx = e.changedTouches[0].clientX - swipeRef.current.x
    const dy = e.changedTouches[0].clientY - swipeRef.current.y
    swipeRef.current = null
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      dx < 0 ? next() : prev()
    }
  }
  function onTouchCancel() { swipeRef.current = null }

  return (
    // Backdrop
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(0,0,0,0.88)',
      display: 'flex', alignItems: 'flex-end',
    }}>
      {/* Sheet — slides up from bottom */}
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 600, margin: '0 auto',
        background: '#111', borderRadius: '16px 16px 0 0',
        border: '1px solid rgba(200,168,75,0.2)',
        borderBottom: 'none',
        display: 'flex', flexDirection: 'column',
        maxHeight: '92dvh', overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', borderBottom: '1px solid var(--line)', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, borderRadius: 8, fontSize: 11, fontWeight: 700,
              background: 'rgba(200,168,75,0.12)', border: '1px solid rgba(200,168,75,0.35)',
              color: 'var(--gold)',
            }}>{icons[svcIdx]}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{svc?.name}</span>
            {images.length > 1 && (
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>{imgIdx + 1} / {images.length}</span>
            )}
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 13,
            background: 'transparent', border: '1px solid var(--line)',
            color: 'var(--muted)', cursor: 'pointer',
          }} aria-label="Close">X</button>
        </div>

        {/* Image area */}
        <div
          onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onTouchCancel={onTouchCancel}
          style={{
            position: 'relative', background: '#000', flexShrink: 0,
            height: '56vw', maxHeight: 380, minHeight: 200,
          }}>
          {images.map((src, i) => (
            <img key={src} src={src} alt={`${svc?.name ?? ''} ${i + 1}`}
              draggable={false}
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'contain', userSelect: 'none', pointerEvents: 'none',
                opacity: i === imgIdx ? 1 : 0, transition: 'opacity 0.22s ease',
              }} />
          ))}

          {images.length > 1 && (
            <>
              <ArrowBtn dir="prev" onClick={prev} />
              <ArrowBtn dir="next" onClick={next} />
              {/* Dot indicators */}
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
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <DragScroll className="px-3 py-2 flex-shrink-0"
            style={{ borderTop: '1px solid var(--line)' }}>
            {images.map((src, i) => (
              <button key={i} onClick={() => setImgIdx(i)}
                style={{
                  flexShrink: 0, width: 64, height: 48, borderRadius: 8,
                  overflow: 'hidden', padding: 0,
                  border: i === imgIdx ? '2px solid var(--gold)' : '2px solid rgba(255,255,255,0.08)',
                  opacity: i === imgIdx ? 1 : 0.45,
                  cursor: 'pointer', background: 'transparent',
                }}>
                <img src={src} alt="" draggable={false}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
              </button>
            ))}
          </DragScroll>
        )}

        {/* Service switcher */}
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
  services: Service[]
  icons: string[]
}

export default function ServiceCardGrid({ services, icons, ...rest }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  return (
    <>
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2" {...rest}>
        {services.map((svc, i) => (
          <ServiceCard key={i} svc={svc} idx={i}
            icon={icons[i] ?? String(i + 1).padStart(2, '0')}
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
