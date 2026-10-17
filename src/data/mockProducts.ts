// Product টাইপ স্পষ্টভাবে এক্সপোর্ট করা হচ্ছে
export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  images: string[];
  colors: string[];
  sizes: string[];
  isNew?: boolean;
  isTrending?: boolean;
};

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Silk Midnight Evening Gown',
    price: 1250,
    category: 'Women',
    description: 'A masterpiece of Italian silk.',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: ['Midnight Blue'],
    sizes: ['XS', 'S', 'M'],
    isNew: true,
    isTrending: true
  },
  {
    id: '2',
    name: 'Heritage Wool Overcoat',
    price: 890,
    category: 'Men',
    description: 'Finest virgin wool.',
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: ['Camel'],
    sizes: ['S', 'M', 'L'],
    isNew: true
  }
];