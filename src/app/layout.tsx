import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import Layout from '@/components/Layout'



const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
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
      
      <body className={`${inter.variable} font-sans`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}