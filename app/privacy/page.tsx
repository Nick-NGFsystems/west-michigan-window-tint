import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/layout/SiteHeader'
import { getNgfContent } from '@/lib/ngf'

// Privacy & Cookie Policy for West Michigan Window Tint.
//
// Keep this ACCURATE to what the site actually does today. It currently
// describes: the Tintly-hosted quote form at /quote, and the Meta Pixel +
// Google Analytics that Tintly's form page loads inside its frame.
//
// If the quote form is ever moved back to the site's own form + /api/quote,
// update section 3 — Resend and the NGF lead store re-enter the picture and
// Tintly leaves it. Bump LAST_UPDATED whenever this text changes.
//
// Not legal advice. Zach is the data controller and owns the final wording;
// flag "have your attorney review it" at handoff.

const LAST_UPDATED = 'August 2026'
const PHONE_DISPLAY = '616.540.3107'
const PHONE_HREF = '6165403107'

export const metadata: Metadata = {
  title: 'Privacy & Cookie Policy | West Michigan Window Tint',
  description:
    'How West Michigan Window Tint collects, uses, and protects your information when you use this website or request a quote.',
  alternates: { canonical: 'https://www.westmiwindowtint.com/privacy' },
  robots: { index: true, follow: true },
}

export default async function PrivacyPolicyPage() {
  const content = await getNgfContent()
  const businessName = content['brand.businessName'] || 'West Michigan Window Tint'
  const primaryColor = content['brand.primaryColor'] || '#C8A84B'

  return (
    <div className="min-h-screen">
      <SiteHeader businessName={businessName} content={content} primaryColor={primaryColor} />

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <span className="gold-chip">Legal</span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] sm:text-5xl">
          Privacy &amp; Cookie Policy
        </h1>
        <p className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>
          Last updated: {LAST_UPDATED}
        </p>

        <div className="mt-10 space-y-9 text-[15px] leading-relaxed" style={{ color: 'var(--muted)' }}>
          <p>
            This policy explains how <strong className="text-[var(--text)]">{businessName}</strong> (&ldquo;we,&rdquo;
            &ldquo;us&rdquo;) collects, uses, and protects information when you visit this website or contact us
            through it. We only collect what we need to quote your job and get back to you.
          </p>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text)]">1. Information we collect</h2>
            <p className="mt-2">
              <strong className="text-[var(--text)]">Information you give us.</strong> When you request a quote we
              collect what you enter on the form — typically your name, phone number, email address, vehicle details,
              the service you want, and any notes you add.
            </p>
            <p className="mt-2">
              <strong className="text-[var(--text)]">Information collected automatically.</strong> Like most websites,
              basic technical and usage data — your IP address, browser type, the pages you view, and the site you
              came from — may be collected through analytics tools and server logs.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text)]">2. How we use your information</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>To prepare your quote and respond to your request.</li>
              <li>To schedule and carry out the work you book with us.</li>
              <li>To operate, maintain, and improve this website.</li>
              <li>To keep records of communications and requests.</li>
            </ul>
            <p className="mt-2">
              We do <strong className="text-[var(--text)]">not</strong> sell your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text)]">3. How your information is stored &amp; shared</h2>
            <p className="mt-2">
              We use trusted service providers to run this site and handle quote requests on our behalf. They process
              your information only to provide services to us:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong className="text-[var(--text)]">Quote requests — Tintly.</strong> Our quote form is hosted by
                Tintly and displayed on this site. When you submit it, your details go to Tintly, where we manage
                quotes and jobs. Their handling of that data is governed by Tintly&rsquo;s own privacy policy.
              </li>
              <li>
                <strong className="text-[var(--text)]">Website hosting — Vercel.</strong>
              </li>
              <li>
                <strong className="text-[var(--text)]">Website &amp; content management — NGF Systems.</strong>
              </li>
              <li>
                <strong className="text-[var(--text)]">Analytics — Google.</strong> We use Google Analytics to measure
                how this site is used. It runs only if you accept cookies.
              </li>
              <li>
                <strong className="text-[var(--text)]">Analytics &amp; advertising on the quote form — Google and Meta
                (Facebook).</strong> Because our quote form is hosted by Tintly, their form page loads its own Google
                Analytics and Meta Pixel when it is displayed. Those are set by Tintly under their privacy policy.
              </li>
            </ul>
            <p className="mt-2">We may also disclose information if required by law or to protect our rights.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text)]">4. Cookies &amp; tracking</h2>
            <p className="mt-2">Cookies are small files stored on your device. This site uses:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong className="text-[var(--text)]">Essential cookies</strong>, needed for the site to function.
              </li>
              <li>
                <strong className="text-[var(--text)]">Analytics cookies</strong>, set by Google Analytics to measure
                how this site is used. These load <strong className="text-[var(--text)]">only after you accept</strong>{' '}
                in the cookie banner shown on your first visit. Decline and they are never loaded.
              </li>
              <li>
                <strong className="text-[var(--text)]">Cookies on the quote form.</strong> Our quote form is hosted by
                Tintly and displayed on this site. Their form page sets its own analytics and advertising cookies
                (Google Analytics and the Meta Pixel) when it loads, independently of the choice above, because they
                are set by Tintly rather than by us. See Tintly&rsquo;s privacy policy for how they use them.
              </li>
            </ul>
            <p className="mt-2">
              You can also control or delete cookies through your browser settings, and you can block third-party
              cookies to stop those set by the quote form. Blocking some cookies may affect how the site works.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text)]">5. Data retention</h2>
            <p className="mt-2">
              We keep quote requests for as long as needed to respond to you and for our legitimate business records,
              then delete or anonymize them.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text)]">6. Your choices &amp; rights</h2>
            <p className="mt-2">
              You may ask us to access, correct, or delete the personal information you&rsquo;ve given us. Depending on
              where you live, you may have additional rights under laws such as the California Consumer Privacy Act
              (CCPA/CPRA). To make a request, contact us using the details below. We do not sell your personal
              information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text)]">7. Children&rsquo;s privacy</h2>
            <p className="mt-2">
              This site is not directed to children under 13, and we do not knowingly collect personal information
              from them.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text)]">8. Changes to this policy</h2>
            <p className="mt-2">
              We may update this policy from time to time. When we do, we&rsquo;ll revise the &ldquo;Last
              updated&rdquo; date above.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text)]">9. Contact us</h2>
            <p className="mt-2">
              Questions about this policy or your information? Call {businessName} at{' '}
              <a href={`tel:${PHONE_HREF}`} className="underline transition-colors hover:text-[var(--gold)]">
                {PHONE_DISPLAY}
              </a>
              , or use the{' '}
              <Link href="/quote" className="underline transition-colors hover:text-[var(--gold)]">
                quote form
              </Link>
              . We serve Grand Rapids and the surrounding West Michigan area.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6" style={{ borderTop: '1px solid var(--line)' }}>
          <Link
            href="/"
            className="text-sm font-semibold transition-colors hover:text-[var(--gold)]"
            style={{ color: 'var(--muted)' }}
          >
            &larr; Back to home
          </Link>
        </div>
      </main>

      <footer
        className="px-4 py-8 text-center text-xs"
        style={{ color: 'var(--muted)', borderTop: '1px solid var(--line)' }}
      >
        © {new Date().getFullYear()} {businessName}. All rights reserved.
      </footer>
    </div>
  )
}
