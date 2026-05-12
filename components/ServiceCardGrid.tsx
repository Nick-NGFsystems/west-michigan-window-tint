'use client'

import React, { useState, useEffect, useRef } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

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

// Service card shown in the grid
function ServiceCard({ svc, idx, icon, onOpen }: {
  svc: Service; idx: number; icon: string; onOpen: (idx: number, imgIdx: number) => void
}) {
  const images = getImages(svc, idx)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => setCurrent(c => (c + 1) % images.length), 3500)
    return () => clearInterval(id)
  }, [images.length])

  return (
    <div onClick={() => onOpen(idx, 0)}
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

// Grid
interface Props extends React.HTMLAttributes<HTMLDivElement> {
  services: Service[]
  icons: string[]
}

export default function ServiceCardGrid({ services, icons, ...rest }: Props) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [slides, setSlides] = useState<{ src: string }[]>([])

  function openLightbox(svcIdx: number, imgIdx: number) {
    const images = getImages(services[svcIdx], svcIdx)
    setSlides(images.map(src => ({ src })))
    setIndex(imgIdx)
    setOpen(true)
  }

  return (
    <>
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2" {...rest}>
        {services.map((svc, i) => (
          <ServiceCard key={i} svc={svc} idx={i}
            icon={icons[i] ?? String(i + 1).padStart(2, '0')}
            onOpen={openLightbox} />
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={index}
        plugins={[Zoom, Fullscreen, Thumbnails]}
        zoom={{ maxZoomPixelRatio: 4, doubleTapDelay: 300, doubleClickDelay: 300 }}
        thumbnails={{ position: 'bottom', width: 80, height: 60, gap: 8, padding: 4 }}
      />
    </>
  )
}
