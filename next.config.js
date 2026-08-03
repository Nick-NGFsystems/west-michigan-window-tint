/** @type {import('next').NextConfig} */

// Security baseline per NGF-STANDARDS "Security baseline — required on every NGF site".
//
// NOTE: there must be exactly ONE Content-Security-Policy entry. Next.js assembles
// headers into a plain object (last-write-wins), so a second CSP entry silently
// destroys the first — including frame-ancestors, which would block the portal
// editor's preview iframe. frame-ancestors is a DIRECTIVE inside this one policy.
const CSP = [
  "default-src 'self'",
  // 'unsafe-inline' / 'unsafe-eval' are required by the Next.js runtime chunks.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  // https: covers Unsplash fallbacks and portal-uploaded images on Vercel Blob.
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  // app.ngfsystems.com is needed for any browser-side call to the NGF public API
  // (LeadForm posts there directly). getNgfContent() is server-side and unaffected.
  "connect-src 'self' https://app.ngfsystems.com https://*.public.blob.vercel-storage.com",
  // go.tintly.io hosts Zach's lead form, embedded on /quote. Note the form's own
  // page loads Meta Pixel, GTM/GA4 and Stripe inside that frame — those run under
  // tintly.io's origin and policy, not ours, but they are still cookie-based
  // trackers reached from this site. See the consent note in app/quote/page.tsx.
  "frame-src 'self' https://go.tintly.io",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Lets the NGF portal editor embed this site for live preview.
  "frame-ancestors 'self' https://app.ngfsystems.com https://*.vercel.app",
].join('; ')

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: CSP },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
