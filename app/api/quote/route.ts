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

function generateCarSvg(selected: string[]): string {
  const sel = new Set(selected)

  function wp(id: string) {
    const active = sel.has(id)
    const fill   = active ? 'rgba(200,168,75,0.55)' : 'rgba(255,255,255,0.07)'
    const stroke = active ? '#E8C060'               : 'rgba(255,255,255,0.18)'
    const sw     = active ? '2'                     : '1'
    return `fill="${fill}" stroke="${stroke}" stroke-width="${sw}"`
  }

  return `
<div style="text-align:center;margin:16px 0;">
  <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#8A8070;margin:0 0 10px 0;">Windows Selected</p>
  <svg viewBox="0 0 220 380" xmlns="http://www.w3.org/2000/svg" width="160" style="display:inline-block;">
    <!-- Body -->
    <rect x="30" y="45" width="160" height="280" rx="22"
      fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
    <!-- Door divider -->
    <line x1="34" y1="178" x2="186" y2="178" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    <!-- Center roof -->
    <rect x="75" y="120" width="70" height="138" rx="2"
      fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <!-- Wheel arches -->
    <ellipse cx="44" cy="132" rx="14" ry="16" fill="rgba(0,0,0,0.35)"/>
    <ellipse cx="176" cy="132" rx="14" ry="16" fill="rgba(0,0,0,0.35)"/>
    <ellipse cx="44" cy="248" rx="14" ry="16" fill="rgba(0,0,0,0.35)"/>
    <ellipse cx="176" cy="248" rx="14" ry="16" fill="rgba(0,0,0,0.35)"/>
    <!-- Windshield -->
    <polygon points="68,62 152,62 162,108 58,108" ${wp('windshield')}/>
    <!-- Driver front -->
    <rect x="34" y="118" width="36" height="52" rx="4" ${wp('driver-front')}/>
    <!-- Passenger front -->
    <rect x="150" y="118" width="36" height="52" rx="4" ${wp('passenger-front')}/>
    <!-- Driver rear -->
    <rect x="34" y="182" width="36" height="50" rx="4" ${wp('driver-rear')}/>
    <!-- Passenger rear -->
    <rect x="150" y="182" width="36" height="50" rx="4" ${wp('passenger-rear')}/>
    <!-- Driver quarter -->
    <rect x="34" y="240" width="36" height="20" rx="4" ${wp('driver-quarter')}/>
    <!-- Passenger quarter -->
    <rect x="150" y="240" width="36" height="20" rx="4" ${wp('passenger-quarter')}/>
    <!-- Rear window -->
    <polygon points="58,268 162,268 152,314 68,314" ${wp('rear-window')}/>
    <!-- Labels -->
    <text x="110" y="90" text-anchor="middle" font-size="7.5" fill="rgba(255,255,255,0.5)" font-family="sans-serif">Windshield</text>
    <text x="52"  y="148" text-anchor="middle" font-size="6.5" fill="rgba(255,255,255,0.45)" font-family="sans-serif">DR</text>
    <text x="168" y="148" text-anchor="middle" font-size="6.5" fill="rgba(255,255,255,0.45)" font-family="sans-serif">PS</text>
    <text x="52"  y="212" text-anchor="middle" font-size="6.5" fill="rgba(255,255,255,0.45)" font-family="sans-serif">DR</text>
    <text x="168" y="212" text-anchor="middle" font-size="6.5" fill="rgba(255,255,255,0.45)" font-family="sans-serif">PS</text>
    <text x="110" y="295" text-anchor="middle" font-size="7.5" fill="rgba(255,255,255,0.5)" font-family="sans-serif">Rear</text>
    <text x="110" y="22"  text-anchor="middle" font-size="8" fill="rgba(200,168,75,0.6)" font-family="sans-serif" font-weight="600" letter-spacing="2">FRONT</text>
    <text x="110" y="372" text-anchor="middle" font-size="8" fill="rgba(200,168,75,0.6)" font-family="sans-serif" font-weight="600" letter-spacing="2">REAR</text>
  </svg>
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

export async function POST(req: NextRequest) {
  const apiKey      = process.env.RESEND_API_KEY
  const emailTo     = process.env.EMAIL_TO
  const emailFrom   = process.env.EMAIL_FROM   ?? 'noreply@westmiwindowtint.com'
  const businessName = process.env.BUSINESS_NAME ?? 'West Michigan Window Tint'
  const siteUrl     = process.env.SITE_URL      ?? 'westmiwindowtint.com'

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
    }

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
        row('Name',      body.name),
        row('Phone',     '<a href="tel:' + body.phone.replace(/\D/g, '') + '" style="color:#C8A84B;text-decoration:none;">' + body.phone + '</a>'),
        row('Email',     '<a href="mailto:' + body.email + '" style="color:#C8A84B;text-decoration:none;">' + body.email + '</a>'),
        row('Best Reach', contactMethodLabel[body.contactMethod] ?? body.contactMethod),
      ].join(''))}

      ${section('Service Requested', [
        row('Service', body.service),
      ].join(''))}

      ${body.projectNotes ? section('Project Details', [
        row('', body.projectNotes),
      ].join('')) : ''}

      ${isAutoTint ? section('Vehicle', [
        row('Vehicle',        vehicleInfo),
        row('Has Tint',       body.hasTint === 'yes' ? 'Yes' : body.hasTint === 'no' ? 'No' : 'Not answered'),
        row('Getting Tinted', labelWindows(windows)),
      ].join(''), windows.length > 0 ? generateCarSvg(windows) : '') : ''}

      ${body.notes ? section('Notes', [
        row('', body.notes),
      ].join('')) : ''}

      <div style="margin-top:24px;text-align:center;">
        <a href="mailto:${body.email}"
          style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#C8A84B,#E8C060);color:#0A0A0A;font-size:13px;font-weight:700;text-decoration:none;border-radius:10px;letter-spacing:0.05em;">
          Reply to ${body.name}
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
      replyTo: body.email,
      subject: 'New Quote -- ' + body.name + ' - ' + body.service,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Quote submission error:', err)
    return NextResponse.json({ success: false, error: 'Failed to send' }, { status: 500 })
  }
}
