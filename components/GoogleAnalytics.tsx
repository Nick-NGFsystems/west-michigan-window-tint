'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { hasCookieConsent } from '@/components/CookieConsent'

/**
 * GA4 for this site, gated on cookie consent.
 *
 * Per NGF-STANDARDS "SEO & analytics § 5": GA4 sets cookies, so it must not load
 * until the visitor accepts. This is a client component because a server
 * component cannot read consent, and mounting gtag unconditionally is a
 * compliance problem regardless of how the banner behaves.
 *
 * Renders nothing when:
 *   - NEXT_PUBLIC_GA_ID is unset (safe no-op until the GA4 property exists), or
 *   - the visitor has not accepted cookies.
 *
 * CookieConsent reloads the page on Accept, so this re-evaluates and GA loads on
 * the next render.
 *
 * NOTE: this gates THIS site's analytics only. The Tintly form embedded on
 * /quote loads its own Meta Pixel and Google Analytics inside its frame, under
 * tintly.io's origin and privacy policy. Both are disclosed in /privacy.
 */
export default function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID

  // Consent lives in localStorage, which is unavailable during SSR. Reading it
  // in an effect keeps the server and first client render identical (both render
  // nothing), so there is no hydration mismatch.
  const [consented, setConsented] = useState(false)
  useEffect(() => setConsented(hasCookieConsent()), [])

  if (!id || !consented) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${id}');
      `}</Script>
    </>
  )
}
