import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const WINDOW_LABELS: Record<string, string> = {
  'windshield':        'Windshield',
  'driver-front':      'Driver Front',
  'passenger-front':   'Passenger Front',
  'driver-rear':       'Driver Rear',
  'passenger-rear':    'Passenger Rear',
  'driver-quarter':    'Driver Quarter',
  'passenger-quarter': 'Passenger Quarter',
  'rear-window':       'Rear Window',
}

function labelWindows(ids: string[]): string {
  if (!ids || ids.length === 0) return 'None selected'
  return ids.map(id => WINDOW_LABELS[id] ?? id).join(', ')
}

// ---------------------------------------------------------------------------
// Best-effort in-memory rate limiter.
// Persists only within a warm serverless instance, so it is NOT a hard
// guarantee — it exists to blunt rapid bursts from a single IP without any
// external service. For durable limits, swap in Upstash/Vercel KV later.
// ---------------------------------------------------------------------------
const RATE_LIMIT_MAX    = 4               // max submissions per IP...
const RATE_LIMIT_WINDOW = 10 * 60 * 1000  // ...per 10 minutes
const hits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter(t => now - t < RATE_LIMIT_WINDOW)
  recent.push(now)
  hits.set(ip, recent)

  // Opportunistic cleanup so the map cannot grow unbounded
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every(t => now - t >= RATE_LIMIT_WINDOW)) hits.delete(key)
    }
  }

  return recent.length > RATE_LIMIT_MAX
}

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

function generateCarSvgTable(selected: string[]): string {
  const sel = new Set(selected)

  function cell(id: string, label: string, span = 1): string {
    const active  = sel.has(id)
    const bg      = active ? '#C8A84B' : '#1E1E1E'
    const color   = active ? '#000000' : '#555555'
    const border  = active ? '1px solid #E8C060' : '1px solid #2A2A2A'
    const weight  = active ? '700' : '400'
    const colspan = span > 1 ? ` colspan="${span}"` : ''
    return `<td${colspan} style="background:${bg};color:${color};border:${border};border-radius:4px;padding:10px 8px;text-align:center;font-size:10px;font-weight:${weight};letter-spacing:0.04em;font-family:Arial,sans-serif;">${label}</td>`
  }

  function gap(): string {
    return `<td style="width:10px;background:#141414;"></td>`
  }

  return `
<div style="text-align:center;margin:16px 0;">
  <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#8A8070;margin:0 0 8px 0;font-family:Arial,sans-serif;">Windows Selected</p>
  <table style="margin:0 auto;border-collapse:separate;border-spacing:3px;background:#141414;padding:10px 14px 14px;border-radius:8px;">
    <tr>
      <td colspan="3" style="text-align:center;font-size:9px;font-weight:700;letter-spacing:0.12em;color:#C8A84B;padding:0 0 5px 0;font-family:Arial,sans-serif;">&#9650; FRONT</td>
    </tr>
    <tr>${cell('windshield', 'Windshield', 3)}</tr>
    <tr>${cell('driver-front', 'DR Front')}${gap()}${cell('passenger-front', 'PS Front')}</tr>
    <tr>${cell('driver-rear', 'DR Rear')}${gap()}${cell('passenger-rear', 'PS Rear')}</tr>
    <tr>${cell('driver-quarter', 'DR Quarter')}${gap()}${cell('passenger-quarter', 'PS Quarter')}</tr>
    <tr>${cell('rear-window', 'Rear Window', 3)}</tr>
    <tr>
      <td colspan="3" style="text-align:center;font-size:9px;font-weight:700;letter-spacing:0.12em;color:#C8A84B;padding:5px 0 0 0;font-family:Arial,sans-serif;">&#9660; REAR</td>
    </tr>
  </table>
</div>`
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 16px;width:160px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#8A8070;vertical-align:top;white-space:nowrap;">
        ${label}
      </td>
      <td style="padding:10px 16px;font-size:14px;color:#F2EDE4;vertical-align:top;">
        ${value}
      </td>
    </tr>
  `
}

function section(title: string, rows: string, extra = '') {
  return `
    <div style="margin-bottom:24px;">
      <div style="padding:8px 16px;background:#1C1A17;border-left:3px solid #C8A84B;margin-bottom:2px;">
        <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#C8A84B;">${title}</span>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#141414;border-radius:0 0 8px 8px;overflow:hidden;">
        <tbody>
          ${rows}
        </tbody>
      </table>
      ${extra}
    </div>
  `
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  const apiKey       = process.env.RESEND_API_KEY
  const emailTo      = process.env.EMAIL_TO
  const emailFrom    = process.env.EMAIL_FROM    ?? 'noreply@westmiwindowtint.com'
  const businessName = process.env.BUSINESS_NAME ?? 'West Michigan Window Tint'
  const siteUrl      = process.env.SITE_URL      ?? 'westmiwindowtint.com'

  if (!apiKey) {
    console.error('RESEND_API_KEY is not set')
    return NextResponse.json({ success: false, error: 'Email service not configured' }, { status: 500 })
  }

  if (!emailTo) {
    console.error('EMAIL_TO is not set')
    return NextResponse.json({ success: false, error: 'Recipient not configured' }, { status: 500 })
  }

  try {
    const body = await req.json() as {
      name: string
      email: string
      phone: string
      service: string
      vehicleYear?: string
      vehicleMake?: string
      vehicleModel?: string
      hasTint?: string
      windowsGettingTint?: string[]
      contactMethod: string
      projectNotes?: string
      notes: string
      company?: string    // honeypot
      elapsedMs?: number  // time-to-submit
    }

    // --- Bot mitigation -----------------------------------------------------
    // 1) Honeypot: real users never see or fill the "company" field.
    if (body.company && body.company.trim() !== '') {
      // Pretend success so bots don't learn they were caught.
      return NextResponse.json({ success: true })
    }

    // 2) Time-to-submit: humans take more than a couple seconds to fill a form.
    if (typeof body.elapsedMs === 'number' && body.elapsedMs < 2500) {
      return NextResponse.json({ success: true })
    }

    // 3) Rate limit per IP (best-effort, in-memory).
    const ip = getClientIp(req)
    if (isRateLimited(ip)) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 })
    }

    // 4) Basic server-side validation.
    const name  = (body.name  ?? '').trim()
    const email = (body.email ?? '').trim()
    const phone = (body.phone ?? '').trim()

    if (!name || !email || !phone || !body.service) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }
    if (!EMAIL_RE.test(email) || email.length > 200) {
      return NextResponse.json({ success: false, error: 'Invalid email' }, { status: 400 })
    }
    if (name.length > 200 || phone.length > 40) {
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 })
    }
    // ------------------------------------------------------------------------

    const resend = new Resend(apiKey)

    const vehicleInfo = [body.vehicleYear, body.vehicleMake, body.vehicleModel]
      .filter(Boolean).join(' ') || 'Not provided'

    const contactMethodLabel: Record<string, string> = {
      phone: 'Phone Call',
      text:  'Text Message',
      email: 'Email',
    }

    const isAutoTint = !!body.vehicleYear || !!body.vehicleMake || !!body.vehicleModel || !!body.hasTint
    const windows    = body.windowsGettingTint ?? []

    const safeName  = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safePhone = escapeHtml(phone)

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:32px auto;padding:0 16px;">

    <div style="background:linear-gradient(135deg,#1C1A17,#141414);border:1px solid #2E2920;border-radius:12px 12px 0 0;padding:28px 24px;text-align:center;">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#C8A84B;margin-bottom:6px;">
        New Quote Request
      </div>
      <div style="font-size:22px;font-weight:700;color:#F2EDE4;">
        ${businessName}
      </div>
    </div>

    <div style="background:#0F0F0F;border:1px solid #2E2920;border-top:none;border-radius:0 0 12px 12px;padding:24px;">

      ${section('Contact Info', [
        row('Name',      safeName),
        row('Phone',     '<a href="tel:' + safePhone.replace(/\D/g, '') + '" style="color:#C8A84B;text-decoration:none;">' + safePhone + '</a>'),
        row('Email',     '<a href="mailto:' + safeEmail + '" style="color:#C8A84B;text-decoration:none;">' + safeEmail + '</a>'),
        row('Best Reach', contactMethodLabel[body.contactMethod] ?? escapeHtml(body.contactMethod ?? '')),
      ].join(''))}

      ${section('Service Requested', [
        row('Service', escapeHtml(body.service)),
      ].join(''))}

      ${body.projectNotes ? section('Project Details', [
        row('', escapeHtml(body.projectNotes)),
      ].join('')) : ''}

      ${isAutoTint ? section('Vehicle', [
        row('Vehicle',        escapeHtml(vehicleInfo)),
        row('Has Tint',       body.hasTint === 'yes' ? 'Yes' : body.hasTint === 'no' ? 'No' : 'Not answered'),
        row('Getting Tinted', labelWindows(windows)),
      ].join(''), windows.length > 0 ? generateCarSvgTable(windows) : '') : ''}

      ${body.notes ? section('Notes', [
        row('', escapeHtml(body.notes)),
      ].join('')) : ''}

      <div style="margin-top:24px;text-align:center;">
        <a href="mailto:${safeEmail}"
          style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#C8A84B,#E8C060);color:#0A0A0A;font-size:13px;font-weight:700;text-decoration:none;border-radius:10px;letter-spacing:0.05em;">
          Reply to ${safeName}
        </a>
      </div>

    </div>

    <div style="text-align:center;margin-top:16px;font-size:11px;color:#4A4440;">
      Sent via ${siteUrl}
    </div>

  </div>
</body>
</html>
    `

    const recipients = emailTo.split(',').map((e: string) => e.trim()).filter(Boolean)

    await resend.emails.send({
      from:    `${businessName} <${emailFrom}>`,
      to:      recipients,
      replyTo: email,
      subject: 'New Quote -- ' + name + ' - ' + body.service,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Quote submission error:', err)
    return NextResponse.json({ success: false, error: 'Failed to send' }, { status: 500 })
  }
}
