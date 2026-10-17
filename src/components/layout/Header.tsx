import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingBag, User, Menu, X, ArrowRight, 
  LogOut, LayoutDashboard, UserCircle, Gift, MapPin, Heart, Wand2 
} from 'lucide-react';
import toast from 'react-hot-toast';

// Store & Services
import useAuthStore from '../../store/useAuthStore';
import useCartStore from '../../store/useCartStore';
import useWishlistStore from '../../store/useWishlistStore';
import useLanguageStore from '../../store/useLanguageStore';
import useRewardStore from '../../store/useRewardStore';
import { translations } from '../../data/translations';
import { logoutUser } from '../../services/auth/authService';

// Components
import MaisonBoxModal from '../animations/MaisonBoxModal';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const { user, logout } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();
  const { hasUnboxedToday } = useRewardStore();
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const totalItems = getTotalItems();
  const wishlistCount = useWishlistStore((state) => state.items).length;

  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
      toast.success(language === 'en' ? 'Signed out safely' : 'সফলভাবে লগআউট হয়েছে');
      navigate('/');
      setIsUserMenuOpen(false);
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-lg border-b border-luxury-platinum/30 py-3 shadow-luxury' : 'bg-transparent py-6'}`}>
        <div className="luxury-container flex items-center justify-between">
          
          {/* Left Side: Navigation */}
          <div className="flex items-center gap-6 flex-1">
            <button className="lg:hidden text-luxury-charcoal" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={22} />
            </button>
            <nav className="hidden lg:flex items-center gap-6 text-[10px] font-bold tracking-[0.25em] uppercase text-luxury-charcoal">
              <Link to="/shop" className="hover:text-brand-gold transition-colors">{t.nav_new}</Link>
              <Link to="/collections" className="hover:text-brand-gold transition-colors">{t.nav_collections}</Link>
              {/* AI Style Room Menu */}
              <Link to="/ai-style-room" className="flex items-center gap-2 text-brand-gold hover:text-brand-dark transition-colors border border-brand-gold/30 px-3 py-1.5 rounded-full bg-brand-gold/5">
                <Wand2 size={12} />
                {language === 'en' ? 'AI Room' : 'এআই রুম'}
              </Link>
            </nav>
          </div>

          {/* Center: Brand Logo */}
          <div className="flex-1 text-center">
            <Link to="/" className="inline-block">
              <h1 className="text-2xl md:text-3xl font-display font-light tracking-[0.35em] text-luxury-charcoal uppercase italic">
                AF <span className="not-italic font-medium">Style</span>
              </h1>
            </Link>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center justify-end gap-4 md:gap-6 flex-1">
            
            <div className="hidden md:flex items-center gap-1 text-[9px] font-bold tracking-widest text-luxury-charcoal/40 uppercase border border-luxury-platinum/30 rounded-full px-2 py-1">
              <button onClick={() => setLanguage('en')} className={`hover:text-brand-gold transition-colors ${language === 'en' ? 'text-brand-gold' : ''}`}>EN</button>
              <span className="text-luxury-platinum">|</span>
              <button onClick={() => setLanguage('bn')} className={`hover:text-brand-gold transition-colors ${language === 'bn' ? 'text-brand-gold' : ''}`}>BN</button>
            </div>

            <div className="relative flex items-center">
              <form onSubmit={handleSearch} className={`absolute right-0 flex items-center transition-all duration-500 ease-in-out ${isSearchOpen ? 'w-[150px] md:w-[220px] opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}>
                <input type="text" placeholder={t.search_placeholder} className="w-full bg-white/90 border-b border-luxury-charcoal py-1 px-1 text-[10px] tracking-widest outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <button type="submit" className="absolute right-0 text-luxury-charcoal"><ArrowRight size={14} /></button>
              </form>
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className={`text-luxury-charcoal hover:text-brand-gold transition-colors ${isSearchOpen ? 'opacity-0' : 'opacity-100'}`}>
                <Search size={18} strokeWidth={1.5} />
              </button>
            </div>

            <button onClick={() => setIsGiftModalOpen(true)} className="text-luxury-charcoal hover:text-brand-gold transition-colors relative group">
              <Gift size={18} strokeWidth={1.5} className={!hasUnboxedToday ? 'text-brand-gold animate-bounce' : ''} />
              {!hasUnboxedToday && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
            </button>

            <Link to="/shipping" className="hidden md:block text-luxury-charcoal hover:text-brand-gold transition-colors">
              <MapPin size={18} strokeWidth={1.5} />
            </Link>

            <Link to="/wishlist" className="text-luxury-charcoal hover:text-brand-gold transition-colors relative group">
              <Heart size={18} strokeWidth={1.5} className={wishlistCount > 0 ? "fill-brand-dark/10" : ""} />
              {wishlistCount > 0 && <span className="absolute -top-1.5 -right-2 bg-brand-dark text-[8px] text-white font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale-in">{wishlistCount}</span>}
            </Link>

            <Link to="/cart" className="text-luxury-charcoal hover:text-brand-gold transition-colors relative group">
              <ShoppingBag size={18} strokeWidth={1.5} />
              {totalItems > 0 && <span className="absolute -top-1.5 -right-2 bg-brand-gold text-[8px] text-luxury-charcoal font-black w-4 h-4 rounded-full flex items-center justify-center animate-scale-in">{totalItems}</span>}
            </Link>

            <div className="relative hidden md:block" ref={userMenuRef}>
              {user ? (
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="w-7 h-7 rounded-full bg-brand-dark text-brand-cream flex items-center justify-center text-[9px] font-bold border border-brand-gold/30 hover:bg-luxury-charcoal transition-all overflow-hidden">
                  {user.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : user.displayName?.charAt(0).toUpperCase()}
                </button>
              ) : (
                <Link to="/auth" className="text-luxury-charcoal hover:text-brand-gold transition-colors">
                  <User size={18} strokeWidth={1.5} />
                </Link>
              )}

              {isUserMenuOpen && user && (
                <div className="absolute right-0 mt-4 w-52 bg-white shadow-2xl border border-luxury-platinum/30 py-4 animate-scale-in origin-top-right">
                  <div className="px-6 py-2 border-b border-luxury-platinum/20 mb-2">
                    <p className="text-[9px] tracking-[0.2em] text-luxury-platinum uppercase">Signed in as</p>
                    <p className="text-xs font-semibold truncate">{user.displayName}</p>
                  </div>
                  <div className="flex flex-col">
                    <Link to="/profile" className="flex items-center gap-3 px-6 py-3 text-[10px] tracking-[0.1em] uppercase hover:bg-brand-cream/30 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                      <UserCircle size={16} strokeWidth={1.5} /> {language === 'en' ? 'My Profile' : 'আমার প্রোফাইল'}
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-3 px-6 py-3 text-[10px] tracking-[0.1em] uppercase text-brand-gold hover:bg-brand-cream/30 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                        <LayoutDashboard size={16} strokeWidth={1.5} /> {language === 'en' ? 'Admin Dashboard' : 'অ্যাডমিন ড্যাশবোর্ড'}
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-3 px-6 py-3 text-[10px] tracking-[0.1em] uppercase text-red-500 hover:bg-red-50 transition-colors mt-2">
                      <LogOut size={16} strokeWidth={1.5} /> {language === 'en' ? 'Sign Out' : 'লগআউট'}
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`fixed inset-0 bg-luxury-charcoal/40 backdrop-blur-sm z-[60] transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-[70] transition-transform duration-500 p-8 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-display italic text-xl tracking-widest uppercase">AF Style</h2>
            <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} className="text-luxury-charcoal" /></button>
          </div>
          
          <nav className="flex flex-col gap-6 text-[11px] font-bold tracking-[0.25em] uppercase mb-8">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>{language === 'en' ? 'Home' : 'হোম'}</Link>
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>{t.nav_new}</Link>
            <Link to="/collections" onClick={() => setIsMobileMenuOpen(false)}>{t.nav_collections}</Link>
            
            {/* Mobile AI Room Link */}
            <Link to="/ai-style-room" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-brand-gold">
              <Wand2 size={16} /> {language === 'en' ? 'AI Style Room' : 'এআই স্টাইল রুম'}
            </Link>

            <div className="h-[1px] bg-luxury-platinum/30 w-full my-2" />
            
            <Link to="/shipping" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-luxury-charcoal"><MapPin size={16} /> {language === 'en' ? 'Track Order' : 'অর্ডার ট্র্যাক'}</Link>
            <button onClick={() => { setIsMobileMenuOpen(false); setIsGiftModalOpen(true); }} className="flex items-center gap-3 text-brand-gold text-left"><Gift size={16} /> {language === 'en' ? 'The Maison Box' : 'ম্যাঁজো বক্স'}</button>
            <div className="h-[1px] bg-luxury-platinum/30 w-full my-2" />

            {user ? (
              <>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>{language === 'en' ? 'My Profile' : 'আমার প্রোফাইল'}</Link>
                {user.role === 'admin' && <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-brand-gold">{language === 'en' ? 'Admin Dashboard' : 'অ্যাডমিন ড্যাশবোর্ড'}</Link>}
                <button onClick={handleLogout} className="text-left text-red-500 font-bold mt-2">{language === 'en' ? 'Sign Out' : 'লগআউট'}</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>{language === 'en' ? 'Sign In' : 'লগইন'}</Link>
            )}
          </nav>
        </div>
      </header>

      <MaisonBoxModal isOpen={isGiftModalOpen} onClose={() => setIsGiftModalOpen(false)} />
    </>
  );
};

export default Header;