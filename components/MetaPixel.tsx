'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { hasCookieConsent } from '@/components/CookieConsent'

/**
 * Meta (Facebook) Pixel, gated on cookie consent.
 *
 * Do NOT paste Meta's snippet from their docs straight into the layout. Two
 * things about this site would break it or break the site's promises:
 *
 *  1. CSP. next.config.js sets an explicit script-src/connect-src allowlist, so
 *     an un-allowlisted connect.facebook.net script is silently blocked — the
 *     pixel would look installed and never fire. The origins are allowlisted
 *     alongside this component.
 *  2. Consent. The pixel sets cookies, so per NGF-STANDARDS it must not load
 *     until the visitor accepts. Meta's snippet fires on page load.
 *
 * Meta's snippet also ends with a <noscript><img src=".../tr?id=..."></noscript>
 * beacon. It is deliberately omitted: a noscript image cannot be gated by JS, so
 * it would fire for every visitor regardless of consent — exactly what the
 * banner exists to prevent. The cost is losing script-disabled visitors, which
 * is a rounding error next to firing a tracker on someone who declined.
 *
 * Renders nothing when NEXT_PUBLIC_FB_PIXEL_ID is unset (safe no-op until Zach
 * supplies his ID from Events Manager) or when consent has not been given.
 */
export default function MetaPixel() {
  const id = process.env.NEXT_PUBLIC_FB_PIXEL_ID

  // Consent lives in localStorage, unavailable during SSR. Reading it in an
  // effect keeps the server and first client render identical (both nothing),
  // so there is no hydration mismatch.
  const [consented, setConsented] = useState(false)
  useEffect(() => setConsented(hasCookieConsent()), [])

  if (!id || !consented) return null

  return (
    <Script id="meta-pixel" strategy="afterInteractive">{`
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window,document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${id}');
      fbq('track', 'PageView');
    `}</Script>
  )
}
