import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import NgfEditBridge from '@/components/NgfEditBridge'
import './globals.css'

const outfit = Outfit({
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'West Michigan Window Tint',
  description:
    'Professional automotive tint, residential & commercial tint, vinyl wrap, and ambient lighting in West Michigan. Contact Zach today.',
  other: {
    'ngf-public-api': 'https://app.ngfsystems.com/api/public/content',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="antialiased" suppressHydrationWarning>
        <NgfEditBridge />
        {children}
      </body>
    </html>
  )
}
