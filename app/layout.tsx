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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://justcakesbakery.com'
const gscVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION

export const metadata: Metadata = {
  title: 'Just Cakes | Allergy-Free Cakes — Delivery & Pickup Available',
  description: 'Delicious allergy-free cakes available for delivery and pickup. Custom cakes for everyone, no matter your dietary needs.',
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: 'website',
    siteName: 'Just Cakes',
    title: 'Just Cakes | Allergy-Free Cakes — Delivery & Pickup Available',
    description: 'Delicious allergy-free cakes available for delivery and pickup. Custom cakes for everyone, no matter your dietary needs.',
    url: baseUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Just Cakes | Allergy-Free Cakes — Delivery & Pickup Available',
    description: 'Delicious allergy-free cakes available for delivery and pickup. Custom cakes for everyone, no matter your dietary needs.',
  },
  ...(gscVerification && {
    verification: { google: gscVerification },
  }),
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
