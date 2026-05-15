import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get a Free Quote | West Michigan Window Tint',
  description:
    'Request a free window tinting quote in Grand Rapids, MI. Auto tint, vinyl wrap, ambient lighting, and residential window film. Fast response, competitive pricing.',
  alternates: {
    canonical: 'https://www.westmiwindowtint.com/quote',
  },
  openGraph: {
    title: 'Get a Free Quote | West Michigan Window Tint',
    description:
      'Request a free quote for auto window tint, vinyl wrap, ambient lighting, or window film in Grand Rapids and West Michigan.',
    url: 'https://www.westmiwindowtint.com/quote',
  },
}

export default function QuoteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
