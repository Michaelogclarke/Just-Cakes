import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { AdminProvider } from '@/context/AdminContext'
import Navbar from '@/components/Navbar'
import CartBubble from '@/components/CartBubble'
import Product from '@/components/Product'
import ProductPage from './store/[id]/page'

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
      <body>
        <AdminProvider>
          <CartProvider>
            <Navbar />
            {children}
            <CartBubble />
          </CartProvider>
        </AdminProvider>
      </body>
    </html>
  )
}
