import type { Metadata } from 'next'
import { Geist, Geist_Mono, Playfair_Display, Montserrat, Dancing_Script } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const dancingScript = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing" });

export const metadata: Metadata = {
  title: 'Lớp A1 - Khóa 2012-2016',
  description: 'Tuyên Truyền Lớp A1 - Nơi kết nối, chia sẻ và ghi lại những kỷ niệm đặc biệt của lớp chúng ta',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className="bg-white" style={{
      "--font-playfair": playfairDisplay.style.fontFamily,
      "--font-montserrat": montserrat.style.fontFamily,
      "--font-dancing": dancingScript.style.fontFamily,
    } as React.CSSProperties}>
      <body className="font-montserrat antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
