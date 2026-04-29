import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      name: string
      email: string
      phone: string
      vehicleYear: string
      vehicleMake: string
      vehicleModel: string
      service: string
      hasTint: string
      contactMethod: string
      notes: string
    }

    const vehicleInfo = [body.vehicleYear, body.vehicleMake, body.vehicleModel]
      .filter(Boolean)
      .join(' ')

    const html = `
      <h2>New Quote Request — West Michigan Window Tint</h2>

      <h3>Contact Info</h3>
      <p><strong>Name:</strong> ${body.name}</p>
      <p><strong>Phone:</strong> ${body.phone}</p>
      <p><strong>Email:</strong> ${body.email}</p>
      <p><strong>Best way to reach:</strong> ${body.contactMethod}</p>

      <h3>Vehicle</h3>
      <p><strong>Vehicle:</strong> ${vehicleInfo || 'N/A (residential/commercial)'}</p>
      <p><strong>Already has tint:</strong> ${body.hasTint || 'Not specified'}</p>

      <h3>Service</h3>
      <p><strong>Interested in:</strong> ${body.service}</p>

      ${body.notes ? `<h3>Notes</h3><p>${body.notes}</p>` : ''}
    `

    await resend.emails.send({
      from: 'West Michigan Window Tint <noreply@ngfsystems.com>',
      to: [process.env.QUOTE_RECIPIENT_EMAIL ?? 'zach@westmiwindowtint.com'],
      replyTo: body.email,
      subject: `New Quote Request from ${body.name}`,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Quote submission error:', err)
    return NextResponse.json({ success: false, error: 'Failed to send' }, { status: 500 })
  }
}
