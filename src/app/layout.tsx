import type { Metadata } from 'next'
import { Playfair_Display, Source_Sans_3, Alegreya } from 'next/font/google'
import '../styles/globals.css'
import Layout from '@/components/Layout'

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-sans',
})

const alegreya = Alegreya({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-alegreya',
  weight: ['400', '500', '700', '900'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Robofy - AI-Powered Digital Marketing Automation',
  description: 'Transform your business with AI-driven digital marketing solutions tailored for beauty, dental, healthcare, retail, fitness, and solar industries.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      
      <body className={`${playfair.variable} ${sourceSans.variable} ${alegreya.variable} font-sans`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}