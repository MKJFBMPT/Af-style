import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, ShoppingBag, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Stores & Components
import useWishlistStore from '../../store/useWishlistStore';
import useLanguageStore from '../../store/useLanguageStore';
import ProductCard from '../../components/product/ProductCard';

const Wishlist: React.FC = () => {
  const { items, clearWishlist } = useWishlistStore();
  const { language } = useLanguageStore();

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <Helmet>
        <title>{language === 'en' ? 'My Wishlist | AF STYLE' : 'পছন্দের তালিকা | AF STYLE'}</title>
        <meta name="description" content="Your curated collection of excellence." />
      </Helmet>

      <div className="luxury-container">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-luxury-platinum mb-12">
          <Link to="/" className="hover:text-luxury-charcoal transition-colors">Home</Link>
          <ChevronRight size={10} />
          <span className="text-luxury-charcoal font-bold">Wishlist</span>
        </nav>

        {/* Page Header */}
        <div className="border-b border-luxury-platinum/20 pb-12 mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-brand-gold mb-4 animate-slide-down">Your Selection</p>
            <h1 className="text-4xl md:text-6xl font-serif italic text-luxury-charcoal animate-slide-up">
              {language === 'en' ? 'The Wishlist' : 'পছন্দের তালিকা'}
            </h1>
          </div>
          
          {items.length > 0 && (
            <button 
              onClick={clearWishlist}
              className="text-[9px] tracking-[0.2em] uppercase text-red-400 hover:text-red-600 transition-colors border-b border-transparent hover:border-red-600 pb-1"
            >
              {language === 'en' ? 'Clear All' : 'সব মুছে ফেলুন'}
            </button>
          )}
        </div>

        {/* Content Area */}
        {items.length === 0 ? (
          /* Empty State */
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-8 border border-luxury-platinum/10">
              <Heart size={32} strokeWidth={1} className="text-luxury-platinum" />
            </div>
            <h2 className="text-2xl font-serif italic text-luxury-charcoal mb-4">
              {language === 'en' ? 'Your wishlist is empty' : 'আপনার পছন্দের তালিকাটি খালি'}
            </h2>
            <p className="text-xs font-light text-luxury-charcoal/50 tracking-widest uppercase mb-12 max-w-sm leading-relaxed">
              {language === 'en' 
                ? 'Begin your journey of excellence by curating your favorite pieces.' 
                : 'আপনার পছন্দের পিসগুলো যোগ করে আপনার আভিজাত্যের যাত্রা শুরু করুন।'}
            </p>
            <Link to="/shop" className="btn-premium flex items-center gap-4 group">
              {language === 'en' ? 'Explore Collection' : 'কালেকশন দেখুন'} 
              <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        ) : (
          /* Wishlist Items Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {items.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Wishlist;