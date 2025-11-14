import { BlogPost } from '@/types/blog'

// Mock blog database - replace with real database later
export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'How to Choose the Perfect Wedding Cake',
    excerpt: 'Your wedding cake is more than just dessert—it\'s a centerpiece and a reflection of your style. Here\'s everything you need to know to choose the perfect one.',
    content: `Your wedding cake is one of the most anticipated elements of your big day. It's not just a dessert; it's a centerpiece, a photo opportunity, and a reflection of your personal style. Here's our comprehensive guide to choosing the perfect wedding cake.

## Consider Your Guest Count

The first step is determining how many people you need to serve. A good rule of thumb is to plan for one slice per guest, though many couples order slightly less knowing not everyone will have cake.

## Choose Your Flavors

Popular wedding cake flavors include:
- Classic vanilla with buttercream
- Rich chocolate with ganache
- Red velvet with cream cheese frosting
- Lemon with raspberry filling
- Carrot cake with cream cheese frosting

Don't be afraid to mix flavors! Many couples choose different flavors for each tier.

## Design and Style

Your cake should complement your wedding theme and colors. Consider:
- Traditional tiered cakes for classic elegance
- Naked or semi-naked cakes for rustic charm
- Geometric designs for modern weddings
- Floral decorations for romantic themes

## Timing Your Cake Tasting

Book your cake tasting 3-6 months before your wedding. This gives you time to finalize details and ensures your baker can accommodate your date.

## Budget Considerations

Wedding cakes typically cost $3-$8 per slice, with elaborate designs costing more. Discuss your budget upfront with your baker to find the best options.

Ready to start planning your dream wedding cake? Contact us today to schedule your tasting!`,
    author: 'Sarah Johnson',
    date: '2024-01-15',
    image: '/carousel/Princess-cake.jpg',
    category: 'Wedding Cakes',
    readTime: '5 min read'
  },
  {
    id: 2,
    title: '10 Creative Birthday Cake Ideas for Kids',
    excerpt: 'Make your child\'s birthday extra special with these fun and creative cake ideas that will have them talking for weeks!',
    content: `Planning a birthday party for your little one? The cake is often the highlight of the celebration! Here are 10 creative ideas that will make your child's birthday unforgettable.

## 1. Character Cakes

From superheroes to Disney princesses, character cakes are always a hit. We can create detailed designs featuring your child's favorite characters.

## 2. Rainbow Layers

Cut into a cake to reveal vibrant rainbow layers! This surprise element adds excitement to the cake-cutting moment.

## 3. Number Cakes

Celebrate their age with a cake shaped like the number they're turning. Perfect for photo opportunities!

## 4. Unicorn Magic

Unicorn cakes with colorful manes, gold horns, and sparkles never go out of style.

## 5. Sports Themed

For the little athlete, create a cake shaped like their favorite ball, jersey, or sport.

## 6. Under the Sea

Mermaid tails, fish, and ocean creatures make for beautiful and whimsical designs.

## 7. Dinosaur Adventure

Roar! Dinosaur cakes are perfect for young paleontologists.

## 8. Space Explorer

Rockets, planets, and stars for kids who dream of the cosmos.

## 9. Garden Party

Butterflies, flowers, and ladybugs create a sweet garden theme.

## 10. LEGO Building Blocks

Perfectly stacked blocks that look just like the real thing!

Each design can be customized to your child's preferences and color scheme. Let's create something magical together!`,
    author: 'Mike Chen',
    date: '2024-01-10',
    image: '/carousel/barbie-cake.png',
    category: 'Birthday Cakes',
    readTime: '4 min read'
  },
  {
    id: 3,
    title: 'The Art of Cake Decorating: Tips from Our Bakers',
    excerpt: 'Ever wondered how professional bakers create those stunning designs? Our experts share their top decorating tips and tricks.',
    content: `Cake decorating is an art form that combines creativity, precision, and technique. Our professional bakers share their insider tips to help you create beautiful cakes at home.

## Essential Tools

Before you start, make sure you have:
- Offset spatulas for smooth frosting
- Piping bags and various tips
- Turntable for even decorating
- Bench scraper for clean edges
- Quality food coloring

## Mastering Buttercream

The foundation of great cake decorating is smooth, well-prepared buttercream:

1. **Temperature Matters**: Buttercream should be room temperature for best results
2. **Consistency**: Adjust with milk (thinner) or powdered sugar (thicker)
3. **Crumb Coat**: Always apply a thin first layer to trap crumbs

## Piping Techniques

Start with basic techniques:
- **Stars**: Use a star tip for classic rosettes and borders
- **Roses**: Master this with a flower nail and patience
- **Writing**: Practice on parchment paper first
- **Leaves**: Create realistic foliage with a leaf tip

## Color Theory

Understanding color helps create harmonious designs:
- Use gel food coloring for vibrant hues
- Mix colors gradually to achieve the perfect shade
- Create ombre effects by gradually lightening frosting
- Consider the occasion when choosing colors

## Working with Fondant

Fondant creates smooth, professional finishes:
- Knead until pliable
- Roll to 1/4 inch thickness
- Work quickly to prevent drying
- Use cornstarch to prevent sticking

## Practice Makes Perfect

Don't be discouraged if your first attempts aren't perfect. Every professional baker started as a beginner. Practice regularly, watch tutorials, and don't be afraid to experiment!

Want to learn more? Join our upcoming cake decorating workshop!`,
    author: 'Emily Rodriguez',
    date: '2024-01-05',
    image: '/carousel/full-cake-display.jpeg',
    category: 'Tutorials',
    readTime: '6 min read'
  },
  {
    id: 4,
    title: 'Seasonal Flavors: Spring Cake Inspiration',
    excerpt: 'Celebrate the season with fresh, light flavors and beautiful floral designs that capture the essence of spring.',
    content: `Spring is the perfect time to embrace fresh flavors and beautiful floral designs. Here's how to incorporate the season's best into your next celebration.

## Spring Flavor Profiles

### Lemon & Lavender
This sophisticated combination pairs bright citrus with subtle floral notes. Perfect for bridal showers and Easter celebrations.

### Strawberry & Cream
Fresh strawberries paired with vanilla cream capture the essence of spring. Light, refreshing, and always popular.

### Carrot Cake with Cream Cheese
A spring classic! Moist carrot cake with cream cheese frosting and a hint of cinnamon.

### Coconut & Lime
Transport yourself to tropical paradise with this refreshing combination.

## Floral Decorations

Spring is all about flowers:
- Fresh edible flowers like pansies and violets
- Buttercream flower gardens
- Fondant blossoms in pastel shades
- Minimalist single-flower toppers

## Color Palettes

Embrace soft, pastel colors:
- Mint green and blush pink
- Lavender and cream
- Butter yellow and white
- Sky blue and peach

## Design Trends

Popular spring designs include:
- Naked cakes with fresh berries
- Watercolor buttercream effects
- Garden-inspired tiered cakes
- Butterfly and bee accents

## Special Occasions

Spring is perfect for:
- Easter celebrations
- Mother's Day treats
- Spring weddings
- Baby showers
- Graduation parties

Let the season inspire your next cake order. Contact us to discuss your spring celebration!`,
    author: 'Sarah Johnson',
    date: '2024-01-01',
    image: '/carousel/Rian-cake.jpg',
    category: 'Seasonal',
    readTime: '4 min read'
  }
]

// Get all blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Get blog post by ID
export async function getBlogPostById(id: number): Promise<BlogPost | undefined> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return blogPosts.find(post => post.id === id)
}

// Get blog posts by category
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return blogPosts.filter(post => post.category === category)
}

// Get recent blog posts
export async function getRecentBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return blogPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}
