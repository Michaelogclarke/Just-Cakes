import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Navbar from '@/components/Navbar'
import Product from '@/components/Product'
import ProductPage from './store/[id]/page'
import Carousel from '../components/Carousel'

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
        <CartProvider>
         <Navbar />
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
