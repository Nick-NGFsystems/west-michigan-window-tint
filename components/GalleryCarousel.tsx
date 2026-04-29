'use client'

import { useState, useCallback } from 'react'

interface GalleryItem {
  image?: string
  caption?: string
}

interface GalleryCarouselProps {
  items: GalleryItem[]
  title: string
}

export default function GalleryCarousel({ items, title }: GalleryCarouselProps) {
  const [current, setCurrent] = useState(0)

  const prev = useCallback(() => {
    setCurrent(i => (i === 0 ? items.length - 1 : i - 1))
  }, [items.length])

  const next = useCallback(() => {
    setCurrent(i => (i === items.length - 1 ? 0 : i + 1))
  }, [items.length])

  return (
    <section
      id="gallery"
      className="px-4 py-20 sm:px-6"
      style={{ background: 'var(--surface)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}
    >
      <div className="mx-auto max-w-5xl">
        <h2
          data-ngf-field="gallery.title"
          data-ngf-label="Section Title"
          data-ngf-type="text"
          data-ngf-section="Gallery"
          className="text-center text-3xl font-bold text-[var(--text)] sm:text-4xl"
        >
          {title}
        </h2>

        {/* Carousel */}
        <div className="relative mt-10">
          {/* Track */}
          <div
            data-ngf-group="gallery.photos"
            data-ngf-item-label="Photo"
            data-ngf-min-items="1"
            data-ngf-max-items="12"
            data-ngf-item-fields='[{"key":"image","label":"Photo","type":"image"},{"key":"caption","label":"Caption","type":"text"}]'
            className="overflow-hidden rounded-2xl"
            style={{ border: '1px solid var(--line)' }}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {items.map((item, i) => (
                <div key={i} className="relative min-w-full" style={{ aspectRatio: '16/9' }}>
                  <img
                    src={item.image || ''}
                    alt={item.caption ?? `Photo ${i + 1}`}
                    data-ngf-field={`gallery.photos.${i}.image`}
                    data-ngf-label="Photo"
                    data-ngf-type="image"
                    data-ngf-section="Gallery"
                    className="h-full w-full object-cover"
                  />
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.65) 0%, transparent 45%)' }}
                  />
                  {/* Caption */}
                  {item.caption && (
                    <div className="absolute bottom-0 inset-x-0 p-5">
                      <span
                        data-ngf-field={`gallery.photos.${i}.caption`}
                        data-ngf-label="Caption"
                        data-ngf-type="text"
                        data-ngf-section="Gallery"
                        className="text-sm font-semibold uppercase tracking-[0.15em] text-white"
                      >
                        {item.caption}
                      </span>
                    </div>
                  )}
                  {/* Slide counter badge */}
                  <div
                    className="absolute right-4 top-4 rounded-lg px-2.5 py-1 text-xs font-semibold"
                    style={{ background: 'rgba(10,10,10,0.7)', border: '1px solid rgba(200,168,75,0.35)', color: 'var(--gold)' }}
                  >
                    {String(i + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prev button */}
          <button
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full transition-all hover:brightness-125 active:scale-95 sm:left-4 sm:h-11 sm:w-11"
            style={{ background: 'rgba(10,10,10,0.75)', border: '1px solid rgba(200,168,75,0.35)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold)' }}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Next button */}
          <button
            onClick={next}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full transition-all hover:brightness-125 active:scale-95 sm:right-4 sm:h-11 sm:w-11"
            style={{ background: 'rgba(10,10,10,0.75)', border: '1px solid rgba(200,168,75,0.35)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold)' }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Dot indicators */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to photo ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? '24px' : '8px',
                height: '8px',
                background: i === current
                  ? 'linear-gradient(90deg, var(--gold), var(--gold-light))'
                  : 'var(--line)',
              }}
            />
          ))}
        </div>

        {/* Thumbnail strip */}
        <div className="mt-5 grid grid-cols-6 gap-2">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Photo ${i + 1}`}
              className="relative overflow-hidden rounded-xl transition-all duration-300"
              style={{
                aspectRatio: '1',
                border: i === current
                  ? '2px solid var(--gold)'
                  : '2px solid transparent',
                opacity: i === current ? 1 : 0.5,
              }}
            >
              <img
                src={item.image || ''}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
