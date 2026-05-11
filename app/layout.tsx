import type { Metadata, Viewport } from 'next'
import { Outfit } from 'next/font/google'
import NgfEditBridge from '@/components/NgfEditBridge'
import './globals.css'

const outfit = Outfit({
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'West Michigan Window Tint | Auto Tint, Vinyl Wrap & More',
  description:
    "West Michigan's go-to shop for automotive window tint, vinyl wrap, ambient lighting, and residential & commercial window film. Professional installs by Zach — serving the greater Grand Rapids area.",
  other: {
    'ngf-public-api': 'https://app.ngfsystems.com/api/public/content',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={outfit.variable}>
    