import Link from 'next/link'
import TintlyQuoteForm from '@/components/TintlyQuoteForm'

// Zach's Tintly lead form. Submissions go to his Tintly account, NOT to the NGF
// lead store — so they do NOT appear in the client's portal "Form Submissions"
// inbox. See the note at the top of app/api/quote/route.ts before changing this.
//
// If Tintly provides an official embed snippet from Zach's dashboard, prefer it:
// theirs typically auto-resizes via postMessage, which would let TintlyQuoteForm
// drop its fixed heights.
const TINTLY_FORM_URL = 'https://go.tintly.io/west-michigan-window-tint/forms/lead-mrqnumrh'
const PHONE_DISPLAY = '616.540.3107'
const PHONE_HREF = '6165403107'

export default function QuotePage() {
  return (
    <main className="min-h-screen px-4 pb-24 pt-6 sm:px-6">

      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:text-[var(--gold)]"
          style={{ color: 'var(--muted)' }}
        >
          Back to Home
        </Link>
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        <div className="mb-8">
          <span className="gold-chip">Free Quote</span>
          <h1 className="mt-4 text-4xl font-bold text-[var(--text)] sm:text-5xl">Get in Touch</h1>
          <p className="mt-3 text-base" style={{ color: 'var(--muted)' }}>
            Fill out the form below and Zach will get back to you quickly. No commitment required.
          </p>
        </div>

        <TintlyQuoteForm
          src={TINTLY_FORM_URL}
          phoneDisplay={PHONE_DISPLAY}
          phoneHref={PHONE_HREF}
        />

        <p className="mt-4 text-center text-xs" style={{ color: 'var(--muted)' }}>
          Having trouble with the form?{' '}
          <a
            href={TINTLY_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors hover:text-[var(--gold)]"
          >
            Open it in a new tab
          </a>{' '}
          or call{' '}
          <a href={`tel:${PHONE_HREF}`} className="underline transition-colors hover:text-[var(--gold)]">
            {PHONE_DISPLAY}
          </a>
          .
        </p>
      </div>
    </main>
  )
}
