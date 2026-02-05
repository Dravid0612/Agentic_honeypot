import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Agentic Honeypot | AI Scam Detection',
  description: 'Advanced AI-powered scam detection and engagement platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950`}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <Navbar />
          <main className="relative">
            {/* Background effects */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
            {children}
          </main>
          <footer className="border-t border-gray-800/50 py-6">
            <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
              <p>Agentic Honeypot © {new Date().getFullYear()} | Advanced AI Scam Detection System</p>
              <p className="mt-2">API Documentation • Privacy Policy • Terms of Service</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}