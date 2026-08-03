import Link from 'next/link'

// Zach's Tintly lead form. Submissions go to his Tintly account, NOT to the NGF
// lead store — so they do NOT appear in the client's portal "Form Submissions"
// inbox. See the note in app/api/quote/route.ts before changing this.
//
// If Tintly provides an official embed snippet from Zach's dashboard, prefer it:
// theirs typically auto-resizes via postMessage, which would let us drop the
// fixed heights below.
const TINTLY_FORM_URL = 'https://go.tintly.io/west-michigan-window-tint/forms/lead-mrqnumrh'

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

        {/* The Tintly form is light-themed on a dark site. Wrapping it in a
            bordered card makes that read as an intentional panel rather than a
            pasted-on block. */}
        <div
          className="overflow-hidden rounded-2xl"
          style={{ border: '1px solid rgba(200,168,75,0.3)', background: '#f3f4f6' }}
        >
          <iframe
            src={TINTLY_FORM_URL}
            title="Request a free quote from West Michigan Window Tint"
            loading="lazy"
            /* Heights measured against the live form so it never scrolls inside
               the frame: 1528px at 343px wide, 1460px at >=592px. Headroom added
               for validation messages. Tintly's official embed script would
               auto-resize and make these unnecessary. */
            className="block h-[1620px] w-full border-0 sm:h-[1540px]"
          />
        </div>

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
          <a href="tel:6165403107" className="underline transition-colors hover:text-[var(--gold)]">
            616.540.3107
          </a>
          .
        </p>
      </div>
    </main>
  )
}
