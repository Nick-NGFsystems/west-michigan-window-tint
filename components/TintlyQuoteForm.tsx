'use client'

import { useEffect, useState } from 'react'
import { hasCookieConsent } from '@/components/CookieConsent'

// Zach's Tintly lead form, consent-gated.
//
// Why the gate: Tintly's form page loads the Meta Pixel and Google Analytics
// inside its frame. Those are cookie-based trackers, so per NGF-STANDARDS
// ("Privacy & cookie policy") they must not load until the visitor accepts. A
// banner that gates nothing is a false compliance signal, so the iframe itself
// is what's gated — not a script tag somewhere else.
//
// Declining is not a dead end: the phone number and a direct link to the form
// stay available, and the visitor can still load the form on demand.

interface TintlyQuoteFormProps {
  /** The Tintly-hosted form URL. */
  src: string
  /** Display phone number, e.g. "616.540.3107". */
  phoneDisplay: string
  /** Digits only, for the tel: href. */
  phoneHref: string
}

export default function TintlyQuoteForm({ src, phoneDisplay, phoneHref }: TintlyQuoteFormProps) {
  // Never render the frame during SSR — hasCookieConsent() is false on the
  // server, so this also keeps the markup consistent between server and client.
  const [consented, setConsented] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setConsented(hasCookieConsent())
  }, [])

  const frame = (
    <div
      className="overflow-hidden rounded-2xl"
      style={{ border: '1px solid rgba(200,168,75,0.3)', background: '#f3f4f6' }}
    >
      <iframe
        src={src}
        title="Request a free quote from West Michigan Window Tint"
        loading="lazy"
        /* Heights measured against the live form so it never scrolls inside the
           frame: 1528px at 343px wide, 1460px at >=592px, plus headroom for
           validation messages. Tintly's official embed script auto-resizes and
           would make these unnecessary. */
        className="block h-[1620px] w-full border-0 sm:h-[1540px]"
      />
    </div>
  )

  // Before hydration, reserve the space so the page doesn't jump.
  if (!mounted) {
    return <div className="h-[1620px] rounded-2xl sm:h-[1540px]" style={{ border: '1px solid var(--line)' }} />
  }

  if (consented) return frame

  return (
    <div
      className="rounded-2xl px-6 py-12 text-center"
      style={{ border: '1px solid var(--line)', background: 'var(--surface)' }}
    >
      <h2 className="text-xl font-bold text-[var(--text)]">One quick thing before the form loads</h2>
      <p className="mx-auto mt-3 max-w-md text-sm" style={{ color: 'var(--muted)' }}>
        Our quote form is hosted by Tintly, and its page uses analytics and advertising cookies. We only load it once
        you&rsquo;re happy for those cookies to be set.
      </p>

      <button
        type="button"
        onClick={() => setConsented(true)}
        className="btn-gold mt-6 inline-block"
      >
        Load the quote form
      </button>

      <p className="mt-6 text-sm" style={{ color: 'var(--muted)' }}>
        Rather not? Call Zach directly at{' '}
        <a href={`tel:${phoneHref}`} className="underline transition-colors hover:text-[var(--gold)]">
          {phoneDisplay}
        </a>
        .
      </p>
    </div>
  )
}
