import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { LudmillaProvider } from '@/context/LudmillaContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartBubble from '@/components/CartBubble'
import NewsletterPopup from '@/components/NewsletterPopup'
import CookieBanner from '@/components/CookieBanner'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from 'react'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Just Cakes - Delicious Custom Cakes',
  description: 'Premium custom cakes for all occasions',
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        <Analytics />
        <SpeedInsights />
        <LudmillaProvider>
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
            <CartBubble />
            <Suspense fallback={null}>
              <NewsletterPopup />
            </Suspense>
            <CookieBanner />
          </CartProvider>
        </LudmillaProvider>
      </body>
    </html>
  )
}
