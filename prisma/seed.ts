import { PrismaClient } from '../lib/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Clear existing data
  await prisma.product.deleteMany()
  console.log('Cleared existing products')

  // Seed products
  const products = [
    // Cakes
    {
      id: 'cake-1',
      name: 'Chocolate Delight Cake',
      description: 'Rich chocolate cake with chocolate ganache',
      price: 45.99,
      image: '/cakes/chocolate-cake.jpg',
      category: 'chocolate',
      occasion: 'birthday',
      type: 'cake',
      available: true
    },
    {
      id: 'cake-2',
      name: 'Vanilla Dream Cake',
      description: 'Classic vanilla sponge with buttercream frosting',
      price: 39.99,
      image: '/cakes/vanilla-cake.jpg',
      category: 'vanilla',
      occasion: 'celebration',
      type: 'cake',
      available: true
    },
    {
      id: 'cake-3',
      name: 'Red Velvet Supreme',
      description: 'Red velvet cake with cream cheese frosting',
      price: 49.99,
      image: '/cakes/red-velvet.jpg',
      category: 'specialty',
      occasion: 'anniversary',
      type: 'cake',
      available: true
    },
    {
      id: 'cake-4',
      name: 'Lemon Bliss Cake',
      description: 'Light lemon cake with lemon curd filling',
      price: 42.99,
      image: '/cakes/lemon-cake.jpg',
      category: 'fruit',
      occasion: 'celebration',
      type: 'cake',
      available: false
    },
    {
      id: 'cake-5',
      name: 'Strawberry Shortcake',
      description: 'Fluffy vanilla cake with fresh strawberries and whipped cream',
      price: 44.99,
      image: '/cakes/strawberry-cake.jpg',
      category: 'fruit',
      occasion: 'birthday',
      type: 'cake',
      available: true
    },
    {
      id: 'cake-6',
      name: 'Carrot Cake',
      description: 'Moist carrot cake with cream cheese frosting and walnuts',
      price: 43.99,
      image: '/cakes/carrot-cake.jpg',
      category: 'specialty',
      occasion: 'celebration',
      type: 'cake',
      available: true
    },
    {
      id: 'cake-7',
      name: 'Wedding Elegance Cake',
      description: 'Three-tier vanilla cake with white fondant and delicate floral details',
      price: 189.99,
      image: '/cakes/wedding-cake(stock).jpg',
      category: 'vanilla',
      occasion: 'wedding',
      type: 'cake',
      available: true
    },
    {
      id: 'cake-8',
      name: 'Anniversary Rose Cake',
      description: 'Champagne-infused cake with raspberry filling and rose buttercream',
      price: 65.99,
      image: '/cakes/anniversary-cake(stock).jpg',
      category: 'specialty',
      occasion: 'anniversary',
      type: 'cake',
      available: true
    },
    {
      id: 'cake-9',
      name: 'Black Forest Cake',
      description: 'German chocolate cake with cherries, whipped cream, and chocolate shavings',
      price: 52.99,
      image: '/cakes/black-forest-cake.jpg',
      category: 'chocolate',
      occasion: 'celebration',
      type: 'cake',
      available: true
    },
    {
      id: 'cake-10',
      name: 'Tiramisu Cake',
      description: 'Coffee-infused Italian cake with mascarpone layers and cocoa dusting',
      price: 54.99,
      image: '/cakes/tiramisu-cake.jpg',
      category: 'specialty',
      occasion: 'celebration',
      type: 'cake',
      available: true
    },
    // Cupcakes
    {
      id: 'cupcake-1',
      name: 'Classic Chocolate Cupcakes',
      description: 'Rich chocolate cupcakes with chocolate buttercream (6 pack)',
      price: 18.99,
      image: '/cupcakes/chocolate-cupcakes(stock).jpg',
      category: 'chocolate',
      occasion: 'birthday',
      type: 'cupcake',
      available: true
    },
    {
      id: 'cupcake-2',
      name: 'Vanilla Bean Cupcakes',
      description: 'Light vanilla cupcakes with vanilla bean frosting (6 pack)',
      price: 16.99,
      image: '/cupcakes/vanilla-cupcakes(stock).jpg',
      category: 'vanilla',
      occasion: 'celebration',
      type: 'cupcake',
      available: true
    },
    {
      id: 'cupcake-3',
      name: 'Red Velvet Cupcakes',
      description: 'Mini red velvet cupcakes with cream cheese frosting (6 pack)',
      price: 19.99,
      image: '/cupcakes/red-velvet-cupcakes(stock).jpg',
      category: 'specialty',
      occasion: 'anniversary',
      type: 'cupcake',
      available: true
    },
    {
      id: 'cupcake-4',
      name: 'Lemon Zest Cupcakes',
      description: 'Tangy lemon cupcakes with lemon curd filling (6 pack)',
      price: 17.99,
      image: '/cupcakes/lemon-cupcakes(stock).jpg',
      category: 'fruit',
      occasion: 'celebration',
      type: 'cupcake',
      available: true
    },
    {
      id: 'cupcake-5',
      name: 'Birthday Sprinkle Cupcakes',
      description: 'Funfetti cupcakes with rainbow sprinkles (12 pack)',
      price: 24.99,
      image: '/cupcakes/birthday-cupcakes(stock).jpg',
      category: 'vanilla',
      occasion: 'birthday',
      type: 'cupcake',
      available: true
    },
    {
      id: 'cupcake-6',
      name: 'Wedding Elegant Cupcakes',
      description: 'White cupcakes with pearl decorations (24 pack)',
      price: 54.99,
      image: '/cupcakes/wedding-cupcakes(stock).jpg',
      category: 'vanilla',
      occasion: 'wedding',
      type: 'cupcake',
      available: true
    },
    {
      id: 'cupcake-7',
      name: 'Salted Caramel Cupcakes',
      description: 'Vanilla cupcakes with salted caramel filling and frosting (6 pack)',
      price: 20.99,
      image: '/cupcakes/caramel-cupcakes.jpg',
      category: 'specialty',
      occasion: 'celebration',
      type: 'cupcake',
      available: true
    },
    {
      id: 'cupcake-8',
      name: 'Cookies & Cream Cupcakes',
      description: 'Chocolate cupcakes with crushed Oreos and cream cheese frosting (6 pack)',
      price: 19.99,
      image: '/cupcakes/cookies-cream-cupcakes.jpg',
      category: 'chocolate',
      occasion: 'birthday',
      type: 'cupcake',
      available: true
    },
    // Cake Slices
    {
      id: 'slice-1',
      name: 'Chocolate Fudge Slice',
      description: 'Rich chocolate cake slice with layers of chocolate fudge frosting',
      price: 6.99,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
      category: 'chocolate',
      occasion: 'celebration',
      type: 'slice',
      available: true
    },
    
    // Digital Products
    {
      id: 'digital-1',
      name: 'The Ultimate Cake Baking Guide',
      description: 'A comprehensive e-book with 50+ cake recipes, decorating tips, and professional techniques. Perfect for beginners and experienced bakers alike.',
      price: 14.99,
      image: '/digital/cake-cookbook(stock).jpg',
      category: 'cookbook',
      occasion: 'learning',
      type: 'digital',
      available: true
    },
    {
      id: 'digital-2',
      name: 'Cupcake Creations Cookbook',
      description: 'Master the art of cupcakes with 40 unique recipes, frosting techniques, and stunning decoration ideas. Includes video tutorial links.',
      price: 12.99,
      image: '/digital/cupcake-cookbook(stock).jpg',
      category: 'cookbook',
      occasion: 'learning',
      type: 'digital',
      available: true
    },
    {
      id: 'digital-3',
      name: 'Advanced Cake Decorating Masterclass',
      description: 'Professional video course covering fondant work, sugar flowers, piping techniques, and multi-tier construction. 8 hours of content.',
      price: 29.99,
      image: '/digital/decorating-course.jpg',
      category: 'cookbook',
      occasion: 'learning',
      type: 'digital',
      available: true
    },
    {
      id: 'digital-4',
      name: 'Gluten-Free Baking Bible',
      description: 'Complete guide to gluten-free cake and cupcake recipes with substitution charts and troubleshooting tips. 35+ recipes included.',
      price: 16.99,
      image: '/digital/gluten-free-guide.jpg',
      category: 'cookbook',
      occasion: 'learning',
      type: 'digital',
      available: true
    },
    {
      id: 'digital-5',
      name: 'Wedding Cake Planning Kit',
      description: 'Downloadable PDF package with tier sizing guides, flavor pairing charts, design templates, and timeline checklists for wedding cakes.',
      price: 9.99,
      image: '/digital/wedding-planning-kit.jpg',
      category: 'cookbook',
      occasion: 'learning',
      type: 'digital',
      available: true
    }
  ]

  console.log(`Creating ${products.length} products...`)

  for (const product of products) {
    await prisma.product.create({
      data: product
    })
  }

  console.log('Database seed completed successfully!')
  console.log(`Created ${products.length} products:`)
  console.log(`- ${products.filter(p => p.type === 'cake').length} Cakes`)
  console.log(`- ${products.filter(p => p.type === 'cupcake').length} Cupcakes`)
  console.log(`- ${products.filter(p => p.type === 'slice').length} Slices`)
  console.log(`- ${products.filter(p => p.type === 'digital').length} Digital Products`)
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
