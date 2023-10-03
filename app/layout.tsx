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
import Head from 'next/head'

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
        <meta name="viewport" content="initial-scale=1, viewport-fit=cover, width=device-width"></meta>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"></meta>
        <link href="../public/splashscreens/iphone5_splash.png" sizes='320x568' rel="apple-touch-startup-image" />
        <link href="../public/splashscreens/iphone6_splash.png" sizes='375x667' rel="apple-touch-startup-image" />
        <link href="../public/splashscreens/iphoneplus_splash.png" sizes='621x1104' rel="apple-touch-startup-image" />
        <link href="../public/splashscreens/iphonex_splash.png" sizes='375x812' rel="apple-touch-startup-image" />
        <link href="../public/splashscreens/iphonexr_splash.png" sizes='414x896' rel="apple-touch-startup-image" />
        <link href="../public/splashscreens/iphonexsmax_splash.png" sizes='414x869' rel="apple-touch-startup-image" />
        <link href="../public/splashscreens/ipad_splash.png" sizes='768x1024' rel="apple-touch-startup-image" />
        <link href="../public/splashscreens/ipadpro1_splash.png" sizes='834x1112' rel="apple-touch-startup-image" />
        <link href="../public/splashscreens/ipadpro3_splash.png" sizes='834x1194' rel="apple-touch-startup-image" />
        <link href="../public/splashscreens/ipadpro2_splash.png" sizes='1024x1366' rel="apple-touch-startup-image" />
        {/* <link href="../public/splashscreens/iphone5_splash.png" sizes='320x568' media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
          <link href="../public/splashscreens/iphone6_splash.png" sizes='375x667' media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
          <link href="../public/splashscreens/iphoneplus_splash.png" sizes='621x1104' media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
          <link href="../public/splashscreens/iphonex_splash.png" sizes='375x812' media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
          <link href="../public/splashscreens/iphonexr_splash.png" sizes='414x896' media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
          <link href="../public/splashscreens/iphonexsmax_splash.png" sizes='414x869' media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
          <link href="../public/splashscreens/ipad_splash.png" sizes='768x1024' media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
          <link href="../public/splashscreens/ipadpro1_splash.png" sizes='834x1112' media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
          <link href="../public/splashscreens/ipadpro3_splash.png" sizes='834x1194' media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
          <link href="../public/splashscreens/ipadpro2_splash.png" sizes='1024x1366' media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" /> */}
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.GA_MEASUREMENT_ID!} />
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
