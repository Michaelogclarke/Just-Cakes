import { Event } from '@/types/event'

const events: Event[] = [
  {
    id: 1,
    title: 'Cake Decorating Workshop',
    description: 'Learn the fundamentals of cake decorating in this hands-on workshop. You\'ll master smooth buttercream application, basic piping techniques, and simple fondant work. All materials provided — take home a decorated cake at the end!',
    date: '2026-03-22',
    time: '10:00 AM – 1:00 PM',
    location: 'Just Cakes Studio, Manchester',
    image: '/carousel/full-cake-display.jpeg',
    category: 'Workshop',
    price: 45,
    spotsLeft: 6,
    isFeatured: true,
  },
  {
    id: 2,
    title: 'Wedding Cake Tasting Evening',
    description: 'Planning your big day? Join us for an exclusive tasting evening where you can sample our most popular wedding cake flavours, explore design options, and chat with our bakers. Bring your partner — up to 2 guests per booking.',
    date: '2026-03-28',
    time: '6:00 PM – 8:30 PM',
    location: 'Just Cakes Studio, Manchester',
    image: '/carousel/Princess-cake.jpg',
    category: 'Tasting',
    price: 0,
    spotsLeft: 8,
    isFeatured: true,
  },
  {
    id: 3,
    title: 'Spring Market Pop-up',
    description: 'Find us at the Manchester Spring Market! We\'ll be selling freshly baked celebration cakes, cupcakes, and letterbox cake sets. Great opportunity to try before you order — no booking needed.',
    date: '2026-04-05',
    time: '9:00 AM – 4:00 PM',
    location: 'Manchester Piccadilly Gardens',
    image: '/carousel/barbie-cake.png',
    category: 'Pop-up',
    price: 0,
    spotsLeft: null,
  },
  {
    id: 4,
    title: 'Advanced Piping Masterclass',
    description: 'Take your piping skills to the next level. This class covers intricate rosette patterns, ruffles, lace effects, and lettering. Suitable for those who have already completed a beginner workshop or have some prior experience.',
    date: '2026-04-12',
    time: '11:00 AM – 2:00 PM',
    location: 'Just Cakes Studio, Manchester',
    image: '/carousel/Rian-cake.jpg',
    category: 'Class',
    price: 55,
    spotsLeft: 4,
  },
  {
    id: 5,
    title: 'Kids Birthday Cake Class',
    description: 'A fun, messy, and delicious session for kids aged 7–13! Children will decorate their own mini birthday cake to take home. Parents are welcome to stay and watch. Aprons and all supplies included.',
    date: '2026-04-19',
    time: '2:00 PM – 4:00 PM',
    location: 'Just Cakes Studio, Manchester',
    image: '/carousel/barbie-cake.png',
    category: 'Class',
    price: 25,
    spotsLeft: 10,
  },
  {
    id: 6,
    title: 'Seasonal Flavours Tasting',
    description: 'Discover our limited summer collection before it launches! Taste new flavours and give feedback that shapes our menu. Light refreshments included. Perfect for existing customers and newcomers alike.',
    date: '2026-05-02',
    time: '3:00 PM – 5:00 PM',
    location: 'Just Cakes Studio, Manchester',
    image: '/carousel/full-cake-display.jpeg',
    category: 'Tasting',
    price: 0,
    spotsLeft: 15,
  },
]

export async function getAllEvents(): Promise<Event[]> {
  return events
}

export async function getUpcomingEvents(): Promise<Event[]> {
  const today = new Date().toISOString().split('T')[0]
  return events.filter((event) => event.date >= today)
}

export async function getFeaturedEvents(): Promise<Event[]> {
  return events.filter((event) => event.isFeatured)
}

export async function getEventById(id: number): Promise<Event | undefined> {
  return events.find((event) => event.id === id)
}

export async function getEventsByCategory(category: Event['category']): Promise<Event[]> {
  return events.filter((event) => event.category === category)
}
