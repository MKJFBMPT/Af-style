import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles, Star, Award, Ticket, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useRewardStore from '../../store/useRewardStore';
import useLanguageStore from '../../store/useLanguageStore';

interface MaisonBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MaisonBoxModal: React.FC<MaisonBoxModalProps> = ({ isOpen, onClose }) => {
  const { claimDailyReward, isFirstTime, hasUnboxedToday } = useRewardStore();
  const { language } = useLanguageStore();
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [reward, setReward] = useState<{ type: 'discount' | 'points'; value: number } | null>(null);
  const [showResult, setShowResult] = useState(false);

  // এনিমেশন কার্ড লিস্ট
  const carouselItems = [
    { label: '10 Pts', icon: <Star size={16} /> },
    { label: '20% OFF', icon: <Ticket size={16} /> },
    { label: '5 Pts', icon: <Star size={16} /> },
    { label: '31% OFF', icon: <Ticket size={16} /> },
    { label: '15 Pts', icon: <Star size={16} /> },
    { label: '25% OFF', icon: <Ticket size={16} /> },
    { label: '50 Pts', icon: <Star size={16} /> },
  ];

  const handleStartUnboxing = async () => {
    if (hasUnboxedToday) {
      toast.error(language === 'en' ? "Your next piece awaits tomorrow." : "আগামীকাল আবার চেষ্টা করুন।");
      return;
    }

    setIsSpinning(true);
    
    try {
      // ৩.৫ সেকেন্ডের সিনেমাটিক স্পিন এনিমেশন
      setTimeout(() => {
        const result = claimDailyReward();
        setReward(result);
        setIsSpinning(false);
        setShowResult(true);
      }, 3500);

    } catch (error: any) {
      setIsSpinning(false);
      if (error.message === "ALREADY_CLAIMED") {
        toast.error(language === 'en' ? "Already unboxed today." : "আজকে একবার বক্স খোলা হয়েছে।");
        onClose();
      }
    }
  };

  const handleClose = () => {
    if (!isSpinning) {
      setShowResult(false);
      setReward(null);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Background Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-brand-dark/95 backdrop-blur-xl"
          />

          {/* Main Modal Container */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            className="relative w-full max-w-lg bg-white shadow-[0_0_50px_rgba(200,155,109,0.3)] overflow-hidden border border-brand-gold/20"
          >
            {/* Close Button */}
            {!isSpinning && (
              <button 
                onClick={handleClose} 
                className="absolute top-5 right-5 text-luxury-charcoal/30 hover:text-brand-gold z-20 transition-colors"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            )}

            <div className="p-8 md:p-12 text-center">
              {!showResult ? (
                /* --- Initial View --- */
                <div className="animate-fade-in">
                  <motion.div 
                    animate={isSpinning ? { 
                      rotate: [0, -10, 10, -10, 10, 0],
                      scale: [1, 1.1, 1]
                    } : { y: [0, -10, 0] }}
                    transition={isSpinning ? { repeat: Infinity, duration: 0.5 } : { repeat: Infinity, duration: 2 }}
                    className="w-24 h-24 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-brand-gold/30"
                  >
                    <Gift size={40} className="text-brand-gold" strokeWidth={1} />
                  </motion.div>

                  <h2 className="text-2xl font-serif italic text-luxury-charcoal mb-4">The Maison Box</h2>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-luxury-charcoal/40 mb-10 leading-relaxed">
                    {isFirstTime ? 'Your inaugural gift of excellence' : 'A daily curated reward for you'}
                  </p>

                  {/* Spinning Carousel */}
                  <div className="relative h-28 flex items-center justify-center overflow-hidden mb-12 bg-gray-50 border-y border-luxury-platinum/10">
                    <motion.div 
                      animate={isSpinning ? { x: [-1500, 0] } : {}}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      className="flex gap-4"
                    >
                      {[...carouselItems, ...carouselItems, ...carouselItems, ...carouselItems].map((item, i) => (
                        <div key={i} className="min-w-[110px] h-20 bg-white border border-brand-gold/10 flex flex-col items-center justify-center shadow-sm">
                          <div className="text-brand-gold mb-2">{item.icon}</div>
                          <span className="text-[9px] font-bold tracking-widest uppercase">{item.label}</span>
                        </div>
                      ))}
                    </motion.div>
                    <div className="absolute inset-y-0 w-0.5 bg-brand-gold z-10 flex items-center justify-center">
                       <div className="w-2 h-2 bg-brand-gold rotate-45" />
                    </div>
                  </div>

                  <button 
                    onClick={handleStartUnboxing}
                    disabled={isSpinning || hasUnboxedToday}
                    className="btn-premium w-full flex items-center justify-center gap-4 py-5 shadow-2xl disabled:opacity-50"
                  >
                    {isSpinning ? (
                      <><Loader2 size={18} className="animate-spin" /> Unveiling...</>
                    ) : (
                      <><Sparkles size={16} /> Open Maison Box</>
                    )}
                  </button>
                </div>
              ) : (
                /* --- Celebration Result View --- */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6"
                >
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <Award size={40} strokeWidth={1} />
                  </div>
                  <h2 className="text-3xl font-serif italic text-luxury-charcoal mb-2">Excellence Secured</h2>
                  <p className="text-[10px] tracking-[0.4em] uppercase text-luxury-charcoal/40 mb-10">You have been awarded</p>
                  
                  <div className="bg-brand-dark text-brand-cream p-12 mb-12 border-2 border-brand-gold relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full -mr-16 -mt-16 blur-3xl transition-all duration-1000" />
                    <h3 className="text-6xl font-display italic text-white relative z-10">
                      {reward?.type === 'discount' ? `${reward.value}%` : `+${reward?.value}`}
                    </h3>
                    <p className="text-xs tracking-[0.4em] uppercase mt-6 text-brand-gold font-bold relative z-10">
                      {reward?.type === 'discount' ? 'Boutique Discount' : 'Maison Tokens'}
                    </p>
                  </div>

                  <button 
                    onClick={handleClose}
                    className="text-[10px] font-bold tracking-[0.3em] uppercase border-b border-luxury-charcoal pb-1 hover:text-brand-gold transition-colors"
                  >
                    Continue the Journey
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MaisonBoxModal;