import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ModalProvider } from '@/components/model-provider'
import ToasterProvider from '@/components/toaster-provider'
// import { CrispProvider } from '@/components/crisp-provider'
import GoogleAnalytics from '@/components/google-analytics'
import { Analytics } from '@vercel/analytics/react';
import {ptBR} from '@clerk/localizations'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Acompanha.app',
  description: 'Sua Ficha de Acompanhamento Online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider localization={ptBR}>
      <html lang="en">
      <meta name="apple-mobile-web-app-capable" content="yes"></meta>
      <GoogleAnalytics GA_MEASUREMENT_ID={process.env.GA_MEASUREMENT_ID!}/>
        {/* <CrispProvider /> */}
        <body className={inter.className}>
          <ModalProvider />
          <ToasterProvider />
          {children}
          <Analytics />
          </body>
      </html>
    </ClerkProvider>
  )
}
