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
  if (!ids || ids.length === 0) return '—'
  return ids.map(id => WINDOW_LABELS[id] ?? id).join(', ')
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

function section(title: string, rows: string) {
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
    </div>
  `
}

export async function POST(req: NextRequest) {
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
      windowsWithTint?: string[]
      windowsGettingTint?: string[]
      contactMethod: string
      notes: string
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const vehicleInfo = [body.vehicleYear, body.vehicleMake, body.vehicleModel]
      .filter(Boolean).join(' ') || '—'

    const contactMethodLabel: Record<string, string> = {
      phone: 'Phone Call',
      text: 'Text Message',
      email: 'Email',
    }

    const isAutoTint = !!body.vehicleYear || !!body.vehicleMake || !!body.vehicleModel || !!body.hasTint

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:32px auto;padding:0 16px;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1C1A17,#141414);border:1px solid #2E2920;border-radius:12px 12px 0 0;padding:28px 24px;text-align:center;">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#C8A84B;margin-bottom:6px;">
        New Quote Request
      </div>
      <div style="font-size:22px;font-weight:700;color:#F2EDE4;">
        West Michigan Window Tint
      </div>
    </div>

    <!-- Body -->
    <div style="background:#0F0F0F;border:1px solid #2E2920;border-top:none;border-radius:0 0 12px 12px;padding:24px;">

      ${section('Contact Info', [
        row('Name', body.name),
        row('Phone', `<a href="tel:${body.phone.replace(/\D/g,'')}" style="color:#C8A84B;text-decoration:none;">${body.phone}</a>`),
        row('Email', `<a href="mailto:${body.email}" style="color:#C8A84B;text-decoration:none;">${body.email}</a>`),
        row('Best Reach', contactMethodLabel[body.contactMethod] ?? body.contactMethod),
      ].join(''))}

      ${section('Service Requested', [
        row('Service', body.service),
      ].join(''))}

      ${isAutoTint ? section('Vehicle', [
        row('Vehicle', vehicleInfo),
        row('Has Tint', body.hasTint === 'yes' ? 'Yes' : body.hasTint === 'no' ? 'No' : '—'),
        ...(body.hasTint === 'yes' ? [
          row('Existing Tint On', labelWindows(body.windowsWithTint ?? [])),
        ] : []),
        row('Getting Tinted', labelWindows(body.windowsGettingTint ?? [])),
      ].join('')) : ''}

      ${body.notes ? section('Notes', [
        row('', body.notes),
      ].join('')) : ''}

      <!-- Reply CTA -->
      <div style="margin-top:24px;text-align:center;">
        <a href="mailto:${body.email}"
          style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#C8A84B,#E8C060);color:#0A0A0A;font-size:13px;font-weight:700;text-decoration:none;border-radius:10px;letter-spacing:0.05em;">
          Reply to ${body.name}
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:16px;font-size:11px;color:#4A4440;">
      Sent via westmiwindowtint.com
    </div>

  </div>
</body>
</html>
    `

    await resend.emails.send({
      from: 'West Michigan Window Tint <noreply@ngfsystems.com>',
      to: [process.env.QUOTE_RECIPIENT_EMAIL ?? 'zach@westmiwindowtint.com'],
      replyTo: body.email,
      subject: `New Quote — ${body.name} · ${body.service}`,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Quote submission error:', err)
    return NextResponse.json({ success: false, error: 'Failed to send' }, { status: 500 })
  }
}
