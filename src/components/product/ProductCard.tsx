import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

// Stores & Types
import type { Product } from '../../data/mockProducts';
import useCartStore from '../../store/useCartStore';
import useWishlistStore from '../../store/useWishlistStore'; // উইশলিস্ট স্টোর
import useLanguageStore from '../../store/useLanguageStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Stores
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { language } = useLanguageStore();

  // চেক করা যে এই প্রোডাক্টটি উইশলিস্টে আছে কি না
  const isFavourite = isInWishlist(product.id);

  // কুইক অ্যাড ফাংশন
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Free Size';
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : 'Standard';

    const cartItem = {
      id: `${product.id}-${defaultSize}-${defaultColor}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: defaultSize,
      color: defaultColor,
      quantity: 1,
    };

    addItem(cartItem);
    toast.success(language === 'en' ? `${product.name} added to bag.` : `${product.name} ব্যাগে যোগ করা হয়েছে।`);
  };

  // উইশলিস্ট টগল ফাংশন
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggleWishlist(product);
    
    if (!isFavourite) {
      toast.success(language === 'en' ? 'Added to Wishlist' : 'পছন্দের তালিকায় যুক্ত হলো');
    } else {
      toast.error(language === 'en' ? 'Removed from Wishlist' : 'তালিকা থেকে বাদ দেওয়া হলো');
    }
  };

  return (
    <div 
      className="group relative flex flex-col animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 shadow-sm border border-luxury-platinum/5">
        <Link to={`/product/${product.id}`} className="block h-full w-full">
          <img 
            src={(isHovered && product.images[1]) ? product.images[1] : product.images[0]} 
            alt={product.name}
            className="h-full w-full object-cover transition-all duration-1000 ease-in-out group-hover:scale-110"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
          {product.isNew && (
            <span className="bg-white/90 backdrop-blur-sm text-luxury-charcoal px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest shadow-sm border border-luxury-platinum/10">
              New Arrival
            </span>
          )}
        </div>

        {/* Floating Icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-luxury">
          {/* Wishlist Button */}
          <button 
            onClick={handleWishlist}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border
              ${isFavourite 
                ? 'bg-brand-dark text-brand-gold border-brand-gold' 
                : 'bg-white text-luxury-charcoal border-transparent hover:bg-brand-dark hover:text-white'
              }`}
          >
            <Heart size={16} fill={isFavourite ? "currentColor" : "none"} strokeWidth={1.5} />
          </button>
          
          <Link 
            to={`/product/${product.id}`} 
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-luxury-charcoal hover:bg-brand-dark hover:text-white transition-all duration-300 shadow-xl"
          >
            <Eye size={16} strokeWidth={1.5} />
          </Link>
        </div>

        {/* Quick Add Button */}
        <button 
          onClick={handleQuickAdd}
          className="absolute bottom-0 left-0 w-full bg-brand-dark/95 backdrop-blur-md text-brand-cream py-4 text-[9px] font-bold tracking-[0.3em] uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex items-center justify-center gap-2 hover:bg-black"
        >
          <ShoppingBag size={14} />
          Add to Cart
        </button>
      </div>
      
      {/* Details */}
      <div className="mt-5 text-center">
        <p className="text-[8px] tracking-[0.3em] uppercase text-luxury-platinum mb-2 font-bold">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-serif italic text-sm text-luxury-charcoal hover:text-brand-gold transition-colors duration-300 line-clamp-1 px-4">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs font-bold mt-2 text-brand-dark tracking-widest">
          ৳{Number(product.price).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;