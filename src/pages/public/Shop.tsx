import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// Firebase
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';

// Components & Data
import ProductCard from '../../components/product/ProductCard';
import { mockProducts } from '../../data/mockProducts';
import type { Product } from '../../data/mockProducts';

const categories = ['All', 'Men', 'Women', 'Accessories'];
const sortOptions = [
  { label: 'Latest Arrivals', value: 'latest' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
];

const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('latest');
  
  // প্রোডাক্ট লোডিং স্টেট
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentCategory = searchParams.get('category') || 'All';

  // ফায়ারবেস থেকে লাইভ প্রোডাক্ট নিয়ে আসার লজিক
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const firebaseProducts: Product[] = [];
        
        querySnapshot.forEach((doc) => {
          firebaseProducts.push({ id: doc.id, ...doc.data() } as Product);
        });

        // ডেমো প্রোডাক্ট এবং নতুন আপলোড করা লাইভ প্রোডাক্ট একসাথে যুক্ত করা হলো
        setAllProducts([...firebaseProducts, ...mockProducts]);
      } catch (error) {
        console.error("Error fetching products: ", error);
        setAllProducts(mockProducts); // এরর হলে অন্তত ডেমো প্রোডাক্ট দেখাবে
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // প্রোডাক্ট ফিল্টারিং লজিক
  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    // ক্যাটাগরি ফিল্টার
    if (currentCategory !== 'All') {
      products = products.filter(p => p.category === currentCategory);
    }

    // সর্টিং লজিক
    if (sortBy === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    }

    return products;
  }, [currentCategory, sortBy, allProducts]);

  const handleCategoryChange = (cat: string) => {
    setSearchParams({ category: cat });
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <Helmet>
        <title>Shop Collection | AF STYLE Luxury Maison</title>
        <meta name="description" content="Explore the exclusive luxury collection of AF STYLE." />
      </Helmet>

      <div className="luxury-container">
        {/* Page Header */}
        <div className="mb-16 text-center">
          <h1 className="text-[10px] tracking-[0.5em] uppercase text-brand-gold mb-4 animate-slide-down">
            The Collection
          </h1>
          <h2 className="text-4xl md:text-6xl font-serif italic uppercase animate-fade-in">
            {currentCategory === 'All' ? 'Signature Excellence' : currentCategory}
          </h2>
        </div>

        {/* Toolbar: Filter & Sort */}
        <div className="flex flex-col md:flex-row justify-between items-center border-y border-luxury-platinum/20 py-6 mb-12 gap-6">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold hover:text-brand-gold transition-colors"
            >
              <SlidersHorizontal size={14} /> Filter
            </button>
            
            <div className="hidden md:flex gap-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${
                    currentCategory === cat ? 'text-brand-gold font-bold border-b border-brand-gold' : 'text-luxury-charcoal/50 hover:text-luxury-charcoal'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[9px] tracking-widest uppercase text-luxury-platinum">Sort By:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-[10px] tracking-widest uppercase outline-none bg-transparent cursor-pointer font-medium"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid / Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="animate-spin text-brand-gold mb-4" size={32} />
            <p className="font-serif italic text-luxury-charcoal/60 tracking-widest">Curating collection...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center">
            <p className="font-serif italic text-xl text-luxury-charcoal/40">
              No pieces found in this collection.
            </p>
          </div>
        )}
      </div>

      {/* Mobile Filter Sidebar */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-500 ${
          isFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsFilterOpen(false)}
      />
      <div 
        className={`fixed top-0 right-0 h-full w-[80%] max-w-xs bg-white z-[70] transition-transform duration-500 ease-luxury p-10 ${
          isFilterOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-16">
          <h3 className="text-xs tracking-[0.3em] uppercase font-bold">Filters</h3>
          <button onClick={() => setIsFilterOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="space-y-12">
          <div>
            <h4 className="text-[10px] tracking-[0.2em] uppercase font-bold text-brand-gold mb-6">Categories</h4>
            <div className="flex flex-col gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`text-left text-xs tracking-widest uppercase ${
                    currentCategory === cat ? 'text-luxury-charcoal font-bold' : 'text-luxury-charcoal/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;