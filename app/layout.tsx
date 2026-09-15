import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Amiri, Cairo } from 'next/font/google'
import './globals.css'
import { FullscreenTrigger } from '@/components/fullscreen-trigger'

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
})

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cairo',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://invitation-mariage-chi.vercel.app'),  // ← AJOUTER CECI

  title: 'أيمن و إيناس — دعوة زفاف',
  description: 'يسرّنا دعوتكم للاحتفال بزفاف أيمن وإيناس يوم 3 أكتوبر 2026.',
  generator: 'v0.app',
  manifest: '/manifest.json',

  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'دعوة زفاف',
  },

  other: {
    'mobile-web-app-capable': 'yes',
  },

  icons: {
    icon: '/wedding-envelope.png',
    apple: '/wedding-envelope.png',
  },

  openGraph: {
    title: 'أيمن و إيناس — دعوة زفاف',
    description: 'يسرّنا دعوتكم للاحتفال بزفاف أيمن وإيناس يوم 3 أكتوبر 2026.',
    url: 'https://invitation-mariage-chi.vercel.app',
    siteName: 'دعوة زفاف أيمن و إيناس',
    locale: 'ar_TN',
    type: 'website',
    images: [
      {
        url: '/wedding-envelope.png',   // ← grâce à metadataBase, devient absolu automatiquement
        width: 1200,
        height: 630,
        alt: 'دعوة زفاف أيمن و إيناس',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'أيمن و إيناس — دعوة زفاف',
    description: 'يسرّنا دعوتكم للاحتفال بزفاف أيمن وإيناس يوم 3 أكتوبر 2026.',  // ← CORRIGÉ (2026666 → 2026)
    images: ['/wedding-envelope.png'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f2ecdf',
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${amiri.variable} ${cairo.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}

        <FullscreenTrigger />

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}