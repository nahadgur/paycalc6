import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/kit/token'
import { stampedKitPdf } from '@/lib/kit/stamp'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? ''
  const payload = verifyToken(token)
  if (!payload) {
    return new NextResponse(
      'This download link is invalid or has expired. Reply to your purchase email and we will send a fresh one.',
      { status: 403, headers: { 'Content-Type': 'text/plain' } },
    )
  }
  try {
    const pdf = await stampedKitPdf(payload.e, payload.r)
    return new NextResponse(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Broke-After-Payday-Kenya-Kit-2026.pdf"',
        'Cache-Control': 'no-store',
      },
    })
  } catch (e) {
    console.error('[kit] stamping failed', e)
    return new NextResponse('Could not prepare your PDF. Please try again in a minute.', { status: 500 })
  }
}
