'use client'

import { useEffect, useState } from 'react'

// Zach's Tintly lead form.
//
// Tintly's form page loads their own Meta Pixel and Google Analytics inside the
// frame, which set cookies under tintly.io's origin and policy. So the frame is
// gated on an EXPLICIT decline only:
//
//   no choice yet -> load  (the banner is still up; this is the default state)
//   accepted      -> load
//   declined      -> do NOT load; offer an explicit opt-in + the phone number
//
// The point of the narrow gate is that ignoring someone who actively clicked
// "Decline" contradicts the button, while gating everyone charges a click to the
// majority who never touch the banner. Only the explicit decline is honoured.
//
// This reads the consent key directly rather than using hasCookieConsent(),
// which collapses null and 'declined' into false — this component needs to tell
// those two apart. The key and its values are the documented contract in
// NGF-STANDARDS ("Consent API"): `ngf-cookie-consent` = 'accepted' | 'declined'.
// components/CookieConsent.tsx is a canonical synced file and must not be
// hand-edited to export more.
const CONSENT_KEY = 'ngf-cookie-consent'

// Measured against the live form so it never scrolls inside the frame: 1528px at
// 343px wide, 1460px at >=592px, plus headroom for validation messages. Tintly's
// official embed script auto-resizes and would make these unnecessary.
const FRAME_HEIGHT = 'h-[1620px] sm:h-[1540px]'

interface TintlyQuoteFormProps {
  /** The Tintly-hosted form URL. */
  src: string
  /** Display phone number, e.g. "616.540.3107". */
  phoneDisplay: string
  /** Digits only, for the tel: href. */
  phoneHref: string
}

export default function TintlyQuoteForm({ src, phoneDisplay, phoneHref }: TintlyQuoteFormProps) {
  // Consent lives in localStorage, so the decision can only be made after mount.
  // Until then reserve the frame's exact height, so the common case (no choice /
  // accepted) has no layout shift.
  const [mounted, setMounted] = useState(false)
  const [declined, setDeclined] = useState(false)

  useEffect(() => {
    setMounted(true)
    setDeclined(window.localStorage.getItem(CONSENT_KEY) === 'declined')
  }, [])

  if (!mounted) {
    return <div className={`rounded-2xl ${FRAME_HEIGHT}`} style={{ border: '1px solid var(--line)' }} />
  }

  if (declined) {
    return (
      <div
        className="rounded-2xl px-6 py-12 text-center"
        style={{ border: '1px solid var(--line)', background: 'var(--surface)' }}
      >
        <h2 className="text-xl font-bold text-[var(--text)]">You declined cookies</h2>
        <p className="mx-auto mt-3 max-w-md text-sm" style={{ color: 'var(--muted)' }}>
          Our quote form is hosted by Tintly, and their form sets its own analytics cookies when it loads. We&rsquo;ve
          left it off so we don&rsquo;t override that choice — you can still load it if you&rsquo;d like.
        </p>

        <button type="button" onClick={() => setDeclined(false)} className="btn-gold mt-6 inline-block">
          Load the form anyway
        </button>

        <p className="mt-6 text-sm" style={{ color: 'var(--muted)' }}>
          Or skip it and call Zach directly at{' '}
          <a href={`tel:${phoneHref}`} className="underline transition-colors hover:text-[var(--gold)]">
            {phoneDisplay}
          </a>
          .
        </p>
      </div>
    )
  }

  // The Tintly form is light-themed on a dark site. The bordered card makes that
  // read as an intentional panel rather than a pasted-on block.
  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{ border: '1px solid rgba(200,168,75,0.3)', background: '#f3f4f6' }}
    >
      <iframe
        src={src}
        title="Request a free quote from West Michigan Window Tint"
        loading="lazy"
        className={`block w-full border-0 ${FRAME_HEIGHT}`}
      />
    </div>
  )
}
