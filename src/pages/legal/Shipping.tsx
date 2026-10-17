import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronRight, Truck, RefreshCw, ShieldCheck, Search, Loader2, Package } from 'lucide-react';
import toast from 'react-hot-toast';

// Firebase
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';

// Store
import useLanguageStore from '../../store/useLanguageStore';

const Shipping: React.FC = () => {
  const { language } = useLanguageStore();
  
  // States
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Tracking States
  const [trackingId, setTrackingId] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any>(null);

  // ডাটাবেস থেকে ডাইনামিক কন্টেন্ট আনা
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, 'legal_pages', 'shipping');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setContent(language === 'en' ? data.en : data.bn);
        }
      } catch (error) {
        console.error("Error fetching content", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [language]);

  // স্মার্ট অর্ডার ট্র্যাকিং ফাংশন (Smart Search Logic)
  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setIsTracking(true);
    setTrackingResult(null);

    try {
      // ইউজারের দেওয়া আইডি থেকে # বাদ দিয়ে এবং ছোট হাতের অক্ষরে রূপান্তর করা হচ্ছে
      const cleanId = trackingId.replace('#', '').trim().toLowerCase();
      
      // ডাটাবেস থেকে সব অর্ডার এনে ম্যাচ করা হচ্ছে (যেহেতু ইউজার শুধু প্রথম ৮ অক্ষর দেয়)
      const ordersSnap = await getDocs(collection(db, 'orders'));
      let foundOrder = null;

      ordersSnap.forEach((doc) => {
        // ডাটাবেসের আইডির শুরুটা ইউজারের আইডির সাথে মিলছে কি না চেক করা
        if (doc.id.toLowerCase().startsWith(cleanId)) {
          foundOrder = { id: doc.id, ...doc.data() };
        }
      });

      if (foundOrder) {
        setTrackingResult(foundOrder);
        toast.success(language === 'en' ? 'Order located.' : 'অর্ডার পাওয়া গেছে।');
      } else {
        toast.error(language === 'en' ? 'Order not found. Check your ID.' : 'কোনো অর্ডার পাওয়া যায়নি। আইডি চেক করুন।');
      }
    } catch (error) {
      toast.error('Failed to track order.');
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <Helmet>
        <title>{language === 'en' ? 'Shipping & Tracking | AF STYLE' : 'শিপিং এবং ট্র্যাকিং | AF STYLE'}</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-luxury-platinum mb-12">
          <Link to="/" className="hover:text-luxury-charcoal transition-colors">Home</Link>
          <ChevronRight size={10} />
          <span className="text-luxury-charcoal font-bold">Logistics</span>
        </nav>

        <div className="border-b border-luxury-platinum/20 pb-12 mb-12 text-center md:text-left">
          <p className="text-[10px] tracking-[0.4em] uppercase text-brand-gold mb-4">Client Care</p>
          <h1 className="text-4xl md:text-5xl font-serif italic text-luxury-charcoal mb-6">
            {language === 'en' ? 'Shipping & Tracking' : 'শিপিং এবং ট্র্যাকিং'}
          </h1>
        </div>

        {/* --- Order Tracking Section --- */}
        <div className="bg-gray-50 border border-luxury-platinum/20 p-8 md:p-12 mb-16 shadow-sm">
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-luxury-charcoal mb-6 text-center">
            {language === 'en' ? 'Track Your Excellence' : 'আপনার অর্ডার ট্র্যাক করুন'}
          </h2>
          <form onSubmit={handleTrackOrder} className="max-w-xl mx-auto relative flex items-center">
            <Search className="absolute left-4 text-luxury-platinum" size={18} />
            <input 
              type="text" 
              placeholder={language === 'en' ? "ENTER ORDER ID (e.g. QNHVKJI8)" : "অর্ডার আইডি লিখুন"} 
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="w-full bg-white border border-luxury-platinum/30 py-4 pl-12 pr-32 text-xs tracking-widest uppercase outline-none focus:border-brand-gold"
            />
            <button 
              type="submit" 
              disabled={isTracking}
              className="absolute right-2 top-2 bottom-2 bg-brand-dark text-brand-cream px-6 text-[9px] font-bold tracking-widest uppercase hover:bg-brand-gold hover:text-brand-dark transition-all flex items-center justify-center disabled:opacity-50"
            >
              {isTracking ? <Loader2 size={14} className="animate-spin" /> : (language === 'en' ? 'Track' : 'ট্র্যাক')}
            </button>
          </form>

          {/* Tracking Result View */}
          {trackingResult && (
            <div className="mt-10 p-6 bg-white border-t-4 border-brand-gold shadow-md animate-slide-up">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-luxury-platinum font-bold">
                    Order #{trackingResult.id.slice(0,8).toUpperCase()}
                  </p>
                  <p className="text-xl font-serif italic mt-1">{trackingResult.customerName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${trackingResult.status === 'Delivered' ? 'bg-emerald-500' : 'bg-brand-gold animate-pulse'}`} />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-brand-dark">
                    Status: {trackingResult.status}
                  </span>
                </div>
              </div>
              <div className="border-t border-luxury-platinum/10 pt-4 flex items-center gap-3">
                <Package size={16} className="text-brand-gold" />
                <p className="text-[10px] tracking-widest uppercase opacity-70 font-bold">
                  {trackingResult.items?.length} Items | Total: ৳{trackingResult.pricing?.total.toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* --- Highlights --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 bg-white border border-luxury-platinum/10 text-center shadow-sm">
            <Truck className="mx-auto mb-4 text-brand-gold" size={24} strokeWidth={1} />
            <h4 className="text-[10px] font-bold tracking-widest uppercase mb-2">Complimentary Shipping</h4>
            <p className="text-[9px] text-luxury-charcoal/60 uppercase">On all orders above ৳5,000</p>
          </div>
          <div className="p-6 bg-white border border-luxury-platinum/10 text-center shadow-sm">
            <RefreshCw className="mx-auto mb-4 text-brand-gold" size={24} strokeWidth={1} />
            <h4 className="text-[10px] font-bold tracking-widest uppercase mb-2">Seamless Returns</h4>
            <p className="text-[9px] text-luxury-charcoal/60 uppercase">7-day elegant return window</p>
          </div>
          <div className="p-6 bg-white border border-luxury-platinum/10 text-center shadow-sm">
            <ShieldCheck className="mx-auto mb-4 text-brand-gold" size={24} strokeWidth={1} />
            <h4 className="text-[10px] font-bold tracking-widest uppercase mb-2">Secure Delivery</h4>
            <p className="text-[9px] text-luxury-charcoal/60 uppercase">Fully insured boutique transit</p>
          </div>
        </div>

        {/* --- Dynamic Content from Admin --- */}
        <div className="prose prose-lg max-w-none text-luxury-charcoal/80 font-light leading-loose whitespace-pre-wrap">
          {isLoading ? (
             <div className="flex justify-center py-10"><Loader2 className="animate-spin text-brand-gold" /></div>
          ) : content ? (
             <p>{content}</p>
          ) : (
             <p className="text-center italic opacity-50">Logistics information will be updated soon.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Shipping;