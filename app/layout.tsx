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
  metadataBase: new URL('https://www.westmiwindowtint.com'),
  title: {
    default: 'West Michigan Window Tint | Auto Tint, Vinyl Wrap & Ambient Lighting — Grand Rapids, MI',
    template: '%s | West Michigan Window Tint',
  },
  description:
    "Grand Rapids' #1 window tinting shop. Professional auto window tint, vinyl wrap, ambient lighting, and residential & commercial window film. Fast turnaround, premium film, clean installs. Serving Grand Rapids, Kentwood, Wyoming, Grandville & all of West Michigan.",
  keywords: [
    'window tinting Grand Rapids',
    'window tint Grand Rapids MI',
    'auto window tint West Michigan',
    'car window tinting Grand Rapids',
    'vinyl wrap Grand Rapids',
    'vehicle wrap West Michigan',
    'ambient lighting installation Grand Rapids',
    'residential window film Grand Rapids',
    'commercial window tint West Michigan',
    'window tinting near me',
    'car tint near me Grand Rapids',
    'West Michigan Window Tint',
    'ceramic tint Grand Rapids',
    'window tint Kentwood',
    'window tint Wyoming MI',
  ],
  authors: [{ name: 'West Michigan Window Tint' }],
  creator: 'West Michigan Window Tint',
  publisher: 'West Michigan Window Tint',
  alternates: {
    canonical: 'https://www.westmiwindowtint.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.westmiwindowtint.com',
    siteName: 'West Michigan Window Tint',
    title: 'West Michigan Window Tint | Auto Tint, Vinyl Wrap & More — Grand Rapids, MI',
    description:
      "Grand Rapids' go-to shop for auto window tint, vinyl wrap, ambient lighting, and residential & commercial window film. Professional installs by Zach.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'West Michigan Window Tint | Grand Rapids, MI',
    description:
      "Auto tint, vinyl wrap, ambient lighting & window film. Professional installs serving Grand Rapids and all of West Michigan.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  other: {
    'ngf-public-api': 'https://app.ngfsystems.com/api/public/content',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://www.westmiwindowtint.com',
  name: 'West Michigan Window Tint',
  description:
    'Professional auto window tint, vinyl wrap, ambient lighting, and residential & commercial window film serving Grand Rapids and West Michigan.',
  url: 'https://www.westmiwindowtint.com',
  telephone: '+16165403107',
  priceRange: '$$',
  image: 'https://www.westmiwindowtint.com/images/Tint/BlueBMWFR.jpeg',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Grand Rapids',
    addressRegion: 'MI',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 42.9634,
    longitude: -85.6681,
  },
  areaServed: [
    { '@type': 'City', name: 'Grand Rapids' },
    { '@type': 'City', name: 'Kentwood' },
    { '@type': 'City', name: 'Wyoming' },
    { '@type': 'City', name: 'Grandville' },
    { '@type': 'City', name: 'Jenison' },
    { '@type': 'City', name: 'Caledonia' },
    { '@type': 'City', name: 'Ada' },
    { '@type': 'City', name: 'Rockford' },
    { '@type': 'AdministrativeArea', name: 'West Michigan' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Window Tinting & Wrap Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Automobile Window Tinting' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Residential Window Film' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Commercial Window Film' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Vinyl Wrap' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Ambient Lighting Installation' } },
    ],
  },
  sameAs: [
    'https://www.facebook.com/profile.php?id=61586828482179',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={outfit.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <NgfEditBridge />
        {children}
      </body>
    </html>
  )
}
