import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { LudmillaProvider } from '@/context/LudmillaContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartBubble from '@/components/CartBubble'
import NewsletterPopup from '@/components/NewsletterPopup'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import ContentSquareTracker from '@/components/ContentSquareTracker'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Just Cakes - Delicious Custom Cakes',
  description: 'Premium custom cakes for all occasions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,n,e,el){w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)};w[n].l=1*new Date();e=d.createElement(s);el=d.getElementsByTagName(s)[0];e.async=1;e.src='https://t.contentsquare.net/uxa/30720b587567d.js';el.parentNode.insertBefore(e,el)})(window,document,'script','_uxa');`
          }}
        />
        <Analytics />
        <SpeedInsights />
      </head>
      <body>
        <LudmillaProvider>
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
            <CartBubble />
            <NewsletterPopup />
            <Suspense fallback={null}>
              <ContentSquareTracker />
            </Suspense>
          </CartProvider>
        </LudmillaProvider>
      </body>
    </html>
  )
}
