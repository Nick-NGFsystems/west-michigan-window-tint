import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

/**
 * GET /api/revalidate?secret=<WEBSITE_REVALIDATION_SECRET>
 *
 * Called by the NGF portal's push handler immediately after a publish. Busts
 * this site's content cache so the client sees their change right away instead
 * of waiting out the 60s ISR window in lib/ngf.ts.
 *
 * revalidatePath('/', 'layout') is version-agnostic and busts every page under
 * the root layout — i.e. every page that calls getNgfContent().
 */
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  const expected = process.env.WEBSITE_REVALIDATION_SECRET

  // Fail closed: without a configured secret this would be an open cache-bust endpoint.
  if (!expected) {
    return NextResponse.json({ error: 'WEBSITE_REVALIDATION_SECRET is not set' }, { status: 503 })
  }
  if (secret !== expected) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  revalidatePath('/', 'layout')
  return NextResponse.json({ ok: true, revalidated: true, at: new Date().toISOString() })
}
