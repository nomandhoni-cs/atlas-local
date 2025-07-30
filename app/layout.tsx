import type { Metadata } from 'next'
import { Urbanist } from 'next/font/google' // 1. Import Urbanist from next/font/google
import './globals.css'

// 2. Configure the Urbanist font
const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], 
})


export const metadata: Metadata = {
  title: "Atlas Local",
  description: "Charting our shared future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${urbanist.variable}`}>
      {/* 4. The <head> is now cleaner. Next.js handles the font injection. */}
      <head />
      <body>{children}</body>
    </html>
  )
}