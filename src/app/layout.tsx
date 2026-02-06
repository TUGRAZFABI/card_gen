import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from './components/navigation'
import LandingPage from './components/landingPage'
import './globals.css'
import { JSX } from 'react'

const inter = Inter({ subsets: ['latin'], display: 'swap',variable: '--font-inter' })


export const data : Metadata = 
{
  title : 'Card gen'
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element { //must return a specific structure since next 13+
  return (
    <html lang="en">
      <body>
          {children}
      </body>
    </html>
  )
}