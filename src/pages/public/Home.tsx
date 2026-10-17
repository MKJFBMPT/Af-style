import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, X, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Firebase
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

// Components & Data
import ProductCard from '../../components/product/ProductCard';
import SEO from '../../components/common/SEO';
import type { Product } from '../../data/mockProducts';
import { mockProducts } from '../../data/mockProducts';

// Stores & Translations
import useLanguageStore from '../../store/useLanguageStore';
import useSiteConfigStore from '../../store/useSiteConfigStore';
import { translations } from '../../data/translations';

const Home: React.FC = () => {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true); // ফাংশন নাম ঠিক করা হলো
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoLoading, setVideoLoading] = useState(true);

  const { language } = useLanguageStore();
  const { config, fetchConfig, isLoading: isConfigLoading } = useSiteConfigStore();
  const t = translations[language];

  // ইউটিউব আইডি বের করার ফাংশন
  const getYoutubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // ডেটা ফেচ করার ফাংশন
  const initHome = useCallback(async () => {
    setIsLoadingProducts(true); // এখন এটি সঠিকভাবে কাজ করবে
    try {
      // ১. মাস্টার কনফিগারেশন লোড করা
      await fetchConfig();

      // ২. ভিডিও সেটিংস নিয়ে আসা
      const settingsRef = doc(db, 'settings', 'mains');
      const settingsSnap = await getDoc(settingsRef);
      if (settingsSnap.exists()) {
        setVideoUrl(settingsSnap.data().campaignVideoUrl || '');
      }

      // ৩. প্রোডাক্ট ডাটা নিয়ে আসা
      const querySnapshot = await getDocs(collection(db, 'products'));
      const firebaseProducts: Product[] = [];
      
      querySnapshot.forEach((doc) => {
        firebaseProducts.push({ id: doc.id, ...doc.data() } as Product);
      });

      const allProducts = [...firebaseProducts, ...mockProducts];
      const newProductsOnly = allProducts
        .filter(product => product.isNew)
        .slice(0, 4);
      
      setNewArrivals(newProductsOnly);
    } catch (error) {
      console.error("Home initialization error:", error);
      setNewArrivals(mockProducts.filter(p => p.isNew).slice(0, 4));
    } finally {
      setIsLoadingProducts(false); // লোডিং বন্ধ করা নিশ্চিত
    }
  }, [fetchConfig]);

  useEffect(() => {
    initHome();
  }, [initHome]);

  const youtubeId = getYoutubeID(videoUrl);

  if (isConfigLoading || isLoadingProducts) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-brand-dark">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="animate-spin text-brand-gold" size={40} />
          <p className="font-display italic tracking-[0.3em] uppercase text-xs animate-pulse">AF STYLE</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative bg-white">
      <SEO 
        title={language === 'en' ? "Timeless Luxury Fashion" : "কালজয়ী আভিজাত্য"}
        description="Experience AF STYLE, the ultimate destination for luxury fashion."
        image={config.heroImageUrl}
      />

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden bg-luxury-charcoal">
        <div className="absolute inset-0">
          <img 
            src={config.heroImageUrl || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070'} 
            alt="Maison Hero" 
            className="w-full h-full object-cover opacity-60 scale-105 animate-reveal"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-luxury-charcoal/90" />
        </div>

        <div className="relative h-full luxury-container flex flex-col justify-center items-start text-white pt-20">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} className="text-[10px] md:text-xs tracking-[0.5em] uppercase mb-6">
            {config.heroSubtitle}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-8xl font-serif italic mb-8 max-w-4xl leading-[1.1]">
            {config.heroTitle}
          </motion.h1>
          
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <Link to="/shop" className="group flex items-center gap-4 bg-brand-cream text-brand-dark px-10 py-4 text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-white transition-all duration-500 shadow-2xl">
              {config.heroCtaText} <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <button onClick={() => videoUrl ? setIsVideoOpen(true) : toast.error("Curating film...")} className="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase hover:text-brand-gold transition-colors group">
              <span className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:border-brand-gold transition-colors"><Play size={12} fill="currentColor" /></span>
              {t.hero_video}
            </button>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-32 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-[10px] tracking-[0.4em] uppercase text-brand-gold mb-12">{config.philosophyTitle}</h2>
          <p className="font-serif italic leading-relaxed text-luxury-charcoal text-2xl md:text-4xl">{config.philosophyText}</p>
          <div className="mt-12 h-16 w-[1px] bg-luxury-platinum mx-auto" />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-32 bg-white border-t border-luxury-platinum/10">
        <div className="luxury-container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div><p className="text-[10px] tracking-[0.3em] uppercase text-luxury-platinum mb-4">Curated Selection</p><h2 className="text-4xl font-serif italic uppercase">{t.new_arrivals_title}</h2></div>
            <Link to="/shop" className="text-[10px] tracking-[0.3em] uppercase border-b border-brand-gold pb-1 hover:text-brand-gold transition-colors font-bold">{t.view_all}</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {newArrivals.map((product) => (<ProductCard key={product.id} product={product} />))}
          </div>
        </div>
      </section>

      {/* Announcement Bar */}
      {config.announcementBar && (
        <section className="py-12 bg-brand-dark text-brand-cream border-y border-brand-gold/10 overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee items-center gap-20">
             {[1,2,3,4].map(i => (<span key={i} className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-80">{config.announcementBar}</span>))}
          </div>
        </section>
      )}

      {/* VIDEO MODAL */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-brand-dark flex items-center justify-center p-4">
            <button onClick={() => { setIsVideoOpen(false); setVideoLoading(true); }} className="absolute top-10 right-10 text-white hover:text-brand-gold z-[110] transition-colors"><X size={32} /></button>
            <div className="w-full max-w-6xl aspect-video relative bg-black shadow-2xl border border-white/5">
              {videoLoading && <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-dark z-10"><Loader2 className="animate-spin text-brand-gold mb-4" size={40} /><p className="text-[10px] tracking-[0.4em] uppercase text-white/40">Opening Cinema Archives...</p></div>}
              {youtubeId ? (
                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&loop=1&playlist=${youtubeId}`} title="Maison Film" onLoad={() => setVideoLoading(false)} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              ) : (
                <video src={videoUrl} className="w-full h-full object-contain" controls autoPlay onCanPlay={() => setVideoLoading(false)} playsInline />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;