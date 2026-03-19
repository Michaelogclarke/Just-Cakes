import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { LudmillaProvider } from '@/context/LudmillaContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartBubble from '@/components/CartBubble'
import Product from '@/components/Product'
import ProductPage from './store/[id]/page'
import NewsletterPopup from '@/components/NewsletterPopup'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

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
            __html: `(function(c,o,n,t,e,n,t){c[t]=c[t]||function(){(c[t].q=c[t].q||[]).push(arguments)};c[t].l=1*new Date();e=o.createElement(n);n=o.getElementsByTagName(n)[0];e.async=1;e.src='https://t.contentsquare.net/uxa/30720b587567d.js';n.parentNode.insertBefore(e,n)})(window,document,'script','_uxa');`
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
            <NewsletterPopup />
          </CartProvider>
        </LudmillaProvider>
      </body>
    </html>
  )
}
