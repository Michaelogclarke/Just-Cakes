import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Clear existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.product.deleteMany()

  // Seed products
  const products = [
    {
      name: 'Chocolate Delight Cake',
      description: 'Rich chocolate cake with chocolate ganache',
      price: 45.99,
      image: '/cakes/chocolate-cake.jpg',
      category: 'chocolate',
      available: true,
    },
    {
      name: 'Vanilla Dream Cake',
      description: 'Classic vanilla sponge with buttercream frosting',
      price: 39.99,
      image: '/cakes/vanilla-cake.jpg',
      category: 'vanilla',
      available: true,
    },
    {
      name: 'Red Velvet Supreme',
      description: 'Red velvet cake with cream cheese frosting',
      price: 49.99,
      image: '/cakes/red-velvet.jpg',
      category: 'specialty',
      available: true,
    },
    {
      name: 'Lemon Bliss Cake',
      description: 'Light lemon cake with lemon curd filling',
      price: 42.99,
      image: '/cakes/lemon-cake.jpg',
      category: 'fruit',
      available: false,
    },
    {
      name: 'Strawberry Shortcake',
      description: 'Fluffy vanilla cake with fresh strawberries and whipped cream',
      price: 44.99,
      image: '/cakes/strawberry-cake.jpg',
      category: 'fruit',
      available: true,
    },
    {
      name: 'Carrot Cake',
      description: 'Moist carrot cake with cream cheese frosting and walnuts',
      price: 43.99,
      image: '/cakes/carrot-cake.jpg',
      category: 'specialty',
      available: true,
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
