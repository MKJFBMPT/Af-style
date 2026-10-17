import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import useLanguageStore from '../../store/useLanguageStore';
import { translations } from '../../data/translations';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { language } = useLanguageStore();
  const t = translations[language];

  const [socials, setSocials] = useState<any>(null);

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const docRef = doc(db, 'settings', 'mains'); 
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSocials(docSnap.data());
        }
      } catch (error) {
        console.log("Firestore settings data not found yet.");
      }
    };
    fetchSocials();
  }, []);

  const SocialIcon = ({ href, label, svgPath }: { href: string, label: string, svgPath: string }) => {
    if (!href) return null;
    return (
      <a 
        href={label === 'whatsapp' ? `https://wa.me/${href}` : href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-brand-cream/60 hover:text-brand-gold transition-all duration-500 transform hover:-translate-y-1"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d={svgPath}></path>
          {label === 'instagram' && <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>}
          {label === 'instagram' && <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>}
        </svg>
      </a>
    );
  };

  return (
    <footer className="bg-brand-dark text-brand-cream pt-20 pb-10 border-t border-brand-gold/5">
      <div className="luxury-container">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <div>
            <h2 className="font-display italic text-3xl md:text-4xl tracking-widest mb-6 uppercase text-white">
              {language === 'en' ? 'Join the Excellence' : 'শ্রেষ্ঠত্বের সাথে যুক্ত হোন'}
            </h2>
            <p className="font-light text-sm tracking-widest mb-8 max-w-md opacity-80 leading-relaxed">
              {language === 'en' ? 'Subscribe to receive updates on new collections and private sales.' : 'নতুন কালেকশন এবং প্রাইভেট সেল সম্পর্কে আপডেট পেতে সাবস্ক্রাইব করুন।'}
            </p>
            <form className="flex items-center border-b border-brand-gold/30 py-2 group focus-within:border-brand-gold transition-colors duration-500">
              <input 
                type="email" 
                placeholder="ENTER EMAIL ADDRESS" 
                className="bg-transparent w-full outline-none text-[10px] tracking-[0.2em] uppercase placeholder:text-brand-cream/30"
              />
              <button type="submit" className="text-brand-cream group-hover:text-brand-gold transition-colors">
                <ArrowRight size={20} strokeWidth={1} />
              </button>
            </form>
          </div>
          
          <div className="flex flex-col justify-center items-start lg:items-end">
            <Link to="/" className="mb-8">
              <h1 className="text-4xl md:text-5xl font-display font-light tracking-[0.4em] uppercase italic text-white">
                AF <span className="not-italic font-medium text-brand-gold">Style</span>
              </h1>
            </Link>

            <div className="flex flex-wrap gap-6 mt-2">
              <SocialIcon label="instagram" href={socials?.instagram} svgPath="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <SocialIcon label="facebook" href={socials?.facebook} svgPath="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              <SocialIcon label="tiktok" href={socials?.tiktok} svgPath="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              <SocialIcon label="threads" href={socials?.threads} svgPath="M12 12a3 3 0 1 0 3 3M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />
              <SocialIcon label="telegram" href={socials?.telegram} svgPath="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              <SocialIcon label="snapchat" href={socials?.snapchat} svgPath="M12 3c-4.62 0-3.5 3-3.5 4.5S8 11 7 12c-1 1-1 3 1 3s2 1 2 3c0 2 1.5 3 2 3s2-2 1-3c-1-1-1.5-3-1.5-4.5S16.62 3 12 3Z" />
              <SocialIcon label="whatsapp" href={socials?.whatsapp} svgPath="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-brand-cream/10 pt-16 mb-16 text-white">
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase mb-8 text-brand-gold">The Maison</h4>
            <nav className="flex flex-col gap-4 text-xs font-light tracking-widest opacity-70">
              <Link to="/about" className="hover:text-brand-gold transition-colors">Our Heritage</Link>
              {/* Maison Journal লিঙ্কটি এখানে যুক্ত করা হলো */}
              <Link to="/journal" className="hover:text-brand-gold transition-colors">Maison Journal</Link>
              <Link to="/shipping" className="hover:text-brand-gold transition-colors">Logistics</Link>
            </nav>
          </div>
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase mb-8 text-brand-gold">Services</h4>
            <nav className="flex flex-col gap-4 text-xs font-light tracking-widest opacity-70">
              <Link to="/contact" className="hover:text-brand-gold transition-colors">Contact Us</Link>
              <Link to="/contact" className="hover:text-brand-gold transition-colors">FAQs</Link>
            </nav>
          </div>
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase mb-8 text-brand-gold">Universe</h4>
            <nav className="flex flex-col gap-4 text-xs font-light tracking-widest opacity-70">
              <Link to="/shop" className="hover:text-brand-gold transition-colors">{t.nav_new}</Link>
              <Link to="/shop?category=Men" className="hover:text-brand-gold transition-colors">Men's Universe</Link>
            </nav>
          </div>
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase mb-8 text-brand-gold">Legal</h4>
            <nav className="flex flex-col gap-4 text-xs font-light tracking-widest opacity-70">
              <Link to="/legal/privacy" className="hover:text-brand-gold transition-colors">Privacy Policy</Link>
              <Link to="/legal/terms" className="hover:text-brand-gold transition-colors">Terms of Use</Link>
            </nav>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-brand-cream/10 pt-10 opacity-40 text-[9px] tracking-[0.3em] uppercase text-white">
          <p>© {currentYear} AF STYLE LUXURY MAISON. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;