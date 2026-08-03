'use client'

import { resetCookieConsent } from '@/components/CookieConsent'

/**
 * Lets a visitor change their mind about cookies.
 *
 * Without this, the banner never returns after the first choice and consent can
 * never be withdrawn — which `npm run doctor` flags ("Consent can be
 * withdrawn"). resetCookieConsent() clears the stored choice and reloads, so the
 * banner comes back and gated scripts re-evaluate.
 *
 * Rendered on /privacy, which is where the banner itself links.
 */
export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={resetCookieConsent}
      className="underline transition-colors hover:text-[var(--gold)]"
    >
      change your cookie choice
    </button>
  )
}
