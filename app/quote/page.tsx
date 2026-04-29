'use client'

import { useState } from 'react'
import Link from 'next/link'

const SERVICES = [
  'Automobile Tint',
  'Residential Tint',
  'Commercial Tint',
  'Vinyl Wrap',
  'Ambient Lighting',
  'Multiple Services',
  'Not Sure — Need a Consultation',
]

const CONTACT_METHODS = [
  { value: 'phone', label: 'Phone Call' },
  { value: 'text',  label: 'Text Message' },
  { value: 'email', label: 'Email' },
]

export default function QuotePage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasTint, setHasTint] = useState<'yes' | 'no' | ''>('')
  const [contactMethod, setContactMethod] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const data = {
      name:          (form.elements.namedItem('name') as HTMLInputElement).value,
      email:         (form.elements.namedItem('email') as HTMLInputElement).value,
      phone:         (form.elements.namedItem('phone') as HTMLInputElement).value,
      vehicleYear:   (form.elements.namedItem('vehicleYear') as HTMLInputElement).value,
      vehicleMake:   (form.elements.namedItem('vehicleMake') as HTMLInputElement).value,
      vehicleModel:  (form.elements.namedItem('vehicleModel') as HTMLInputElement).value,
      service:       (form.elements.namedItem('service') as HTMLSelectElement).value,
      hasTint,
      contactMethod,
      notes:         (form.elements.namedItem('notes') as HTMLTextAreaElement).value,
    }
    const res = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setLoading(false)
    if (res.ok) setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-24 text-center">
        <div
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
          style={{ background: 'rgba(200,168,75,0.12)', border: '1px solid rgba(200,168,75,0.3)' }}
        >
          ✓
        </div>
        <h1 className="text-4xl font-bold text-[var(--text)]">Request Sent!</h1>
        <p className="mx-auto mt-4 max-w-md text-base" style={{ color: 'var(--muted)' }}>
          Zach will follow up with you shortly via your preferred contact method.
        </p>
        <Link href="/" className="btn-outline mt-8">← Back to Home</Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 pb-24 pt-6 sm:px-6">

      {/* Back nav */}
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:text-[var(--gold)]"
          style={{ color: 'var(--muted)' }}
        >
          ← Back to Home
        </Link>
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <span className="gold-chip">Free Quote</span>
          <h1 className="mt-4 text-4xl font-bold text-[var(--text)] sm:text-5xl">Get in Touch</h1>
          <p className="mt-3 text-base" style={{ color: 'var(--muted)' }}>
            Fill out the form below and Zach will get back to you quickly. No commitment required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Your Info */}
          <div className="panel p-6">
            <h2 className="text-lg font-semibold text-[var(--text)]">Your Info</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--muted)' }}>
                  Full Name *
                </label>
                <input id="name" name="name" required placeholder="John Smith" className="input-dark" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--muted)' }}>
                  Phone Number *
                </label>
                <input id="phone" name="phone" type="tel" required placeholder="(616) 555-0123" className="input-dark" />
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              <label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--muted)' }}>
                Email Address *
              </label>
              <input id="email" name="email" type="email" required placeholder="you@example.com" className="input-dark" />
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="panel p-6">
            <h2 className="text-lg font-semibold text-[var(--text)]">Vehicle Info</h2>
            <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>
              For residential/commercial inquiries, leave vehicle fields blank.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="vehicleYear" className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--muted)' }}>Year</label>
                <input id="vehicleYear" name="vehicleYear" maxLength={4} placeholder="2022" className="input-dark" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="vehicleMake" className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--muted)' }}>Make</label>
                <input id="vehicleMake" name="vehicleMake" placeholder="Toyota" className="input-dark" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="vehicleModel" className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--muted)' }}>Model</label>
                <input id="vehicleModel" name="vehicleModel" placeholder="Camry" className="input-dark" />
              </div>
            </div>

            {/* Existing tint toggle */}
            <div className="mt-5 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--muted)' }}>
                Does the vehicle already have tint?
              </p>
              <div className="flex gap-3">
                {(['yes', 'no'] as const).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setHasTint(val)}
                    className="flex-1 rounded-xl py-3 text-sm font-semibold capitalize transition-all"
                    style={{
                      border: hasTint === val ? '1px solid rgba(200,168,75,0.6)' : '1px solid var(--line)',
                      background: hasTint === val ? 'rgba(200,168,75,0.12)' : 'rgba(28,26,23,0.8)',
                      color: hasTint === val ? 'var(--gold-light)' : 'var(--muted)',
                    }}
                  >
                    {val === 'yes' ? 'Yes' : 'No'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Service & Contact */}
          <div className="panel p-6">
            <h2 className="text-lg font-semibold text-[var(--text)]">Service & Contact</h2>

            <div className="mt-4 space-y-1.5">
              <label htmlFor="service" className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--muted)' }}>
                Service Interested In *
              </label>
              <select
                id="service"
                name="service"
                required
                className="input-dark"
                style={{ appearance: 'none' }}
              >
                <option value="">Select a service...</option>
                {SERVICES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Best contact method */}
            <div className="mt-5 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--muted)' }}>
                Best Way to Reach You *
              </p>
              <div className="grid grid-cols-3 gap-3">
                {CONTACT_METHODS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setContactMethod(m.value)}
                    className="rounded-xl py-3 text-xs font-semibold transition-all"
                    style={{
                      border: contactMethod === m.value ? '1px solid rgba(200,168,75,0.6)' : '1px solid var(--line)',
                      background: contactMethod === m.value ? 'rgba(200,168,75,0.12)' : 'rgba(28,26,23,0.8)',
                      color: contactMethod === m.value ? 'var(--gold-light)' : 'var(--muted)',
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mt-5 space-y-1.5">
              <label htmlFor="notes" className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--muted)' }}>
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                placeholder="Anything else Zach should know..."
                className="input-dark resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !contactMethod}
            className="btn-gold w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send Quote Request'}
          </button>

        </form>
      </div>
    </main>
  )
}
