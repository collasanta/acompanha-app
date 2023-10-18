import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ModalProvider } from '@/components/model-provider'
import ToasterProvider from '@/components/toaster-provider'
// import { CrispProvider } from '@/components/crisp-provider'
import GoogleAnalytics from '@/components/google-analytics'
import { Analytics } from '@vercel/analytics/react';
import { ptBR } from '@clerk/localizations'
import { Suspense } from 'react'
import Loading from './loading'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Diário.Fit',
  description: 'Acompanhamento diário de hábitos saudáveis',
  // manifest: '/manifest.json',
  icons: { apple: '/icon.png' },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Diário.Fit',
    startupImage: [
      { media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)', url: '/iphone5_splash.png' },
      { media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)', url: '/iphone6_splash.png' },
      { media: '(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)', url: '/iphoneplus_splash.png' },
      { media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)', url: '/iphonex_splash.png' },
      { media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)', url: '/iphonexr_splash.png' },
      { media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)', url: '/iphonexsmax_splash.png' },
      { media: '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)', url: '/ipadpro1_splash.png' },
      { media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)', url: '/ipadpro3_splash.png' },
      { media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)', url: '/ipadpro2_splash.png' },
    ],
  },
  themeColor: '#f1f5f9',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider localization={ptBR}>
      <html lang="en">
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.GA_MEASUREMENT_ID!} />
        {/* <CrispProvider /> */}
        <body className={inter.className}>
          <Suspense fallback={<Loading />}>
            <ModalProvider />
            <ToasterProvider />
            {children}
            <Analytics />
          </Suspense>
        </body>
      </html>
    </ClerkProvider>
  )
}
