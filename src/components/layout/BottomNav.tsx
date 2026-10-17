import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';

// Stores
import useCartStore from '../../store/useCartStore';
import useWishlistStore from '../../store/useWishlistStore';
import useAuthStore from '../../store/useAuthStore';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Stores থেকে ডেটা নেওয়া
  const cartCount = useCartStore((state) => state.getTotalItems)();
  const wishlistCount = useWishlistStore((state) => state.items).length;
  const { user } = useAuthStore();

  // মেনু আইটেমসমূহ
  const navItems = [
    { label: 'Home', path: '/', icon: <Home size={20} /> },
    { label: 'Shop', path: '/shop', icon: <Search size={20} /> },
    { label: 'Wishlist', path: '/wishlist', icon: <Heart size={20} />, count: wishlistCount },
    { label: 'Bag', path: '/cart', icon: <ShoppingBag size={20} />, count: cartCount },
    { label: 'Account', path: user ? '/profile' : '/auth', icon: <User size={20} /> },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-lg border-t border-luxury-platinum/20 z-[60] pb-[env(safe-area-inset-bottom)] shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
                isActive ? 'text-brand-gold' : 'text-luxury-charcoal/40'
              }`}
            >
              {/* Icon */}
              <div className={`transition-transform duration-300 ${isActive ? '-translate-y-1 scale-110' : ''}`}>
                {item.icon}
              </div>

              {/* Label */}
              <span className={`text-[8px] font-bold uppercase tracking-[0.1em] mt-1 transition-all ${
                isActive ? 'opacity-100' : 'opacity-60'
              }`}>
                {item.label}
              </span>

              {/* Badges (Cart & Wishlist Count) */}
              {item.count !== undefined && item.count > 0 && (
                <span className="absolute top-2 right-[25%] bg-brand-dark text-white text-[7px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">
                  {item.count}
                </span>
              )}

              {/* Active Indicator Line */}
              {isActive && (
                <div className="absolute top-0 w-8 h-[2px] bg-brand-gold rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;