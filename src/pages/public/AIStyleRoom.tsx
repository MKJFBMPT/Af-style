import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Loader2, Sparkles, Camera, Wand2, CheckCircle2, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';

// Stores & Types
import { mockProducts } from '../../data/mockProducts';
import type { Product } from '../../data/mockProducts';
import useCartStore from '../../store/useCartStore';
import useLanguageStore from '../../store/useLanguageStore';

const AIStyleRoom: React.FC = () => {
  const [userImagePreview, setUserImagePreview] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const { addItem } = useCartStore();
  const { language } = useLanguageStore();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserImagePreview(URL.createObjectURL(file));
      setResultImage(null);
    }
  };

  const handleGenerateAI = () => {
    if (!userImagePreview) {
      toast.error('Please upload your portrait.');
      return;
    }
    if (!selectedProduct) {
      toast.error('Please select a garment.');
      return;
    }

    setIsGenerating(true);
    setResultImage(null);

    const messages = [
      "Analyzing body proportions...",
      "Mapping fabric textures...",
      "Aligning silhouettes...",
      "Finalizing your excellence..."
    ];

    messages.forEach((msg, index) => {
      setTimeout(() => setStatusMessage(msg), index * 1200);
    });

    // ৬.৫ সেকেন্ড পর রেজাল্ট দেখানো
    setTimeout(() => {
      setIsGenerating(false);
      // --- ফিক্স: এখন আপনার আপলোড করা ছবিই রেজাল্ট হিসেবে আসবে ---
      setResultImage(userImagePreview); 
      toast.success('Your AI Look is ready.');
    }, 6500);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    addItem({
      id: `${selectedProduct.id}-AI-FIT`,
      productId: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      image: selectedProduct.images[0],
      size: 'M',
      color: 'Standard',
      quantity: 1,
    });
    toast.success('Added to collection.');
  };

  return (
    <div className="min-h-screen bg-brand-dark pt-32 pb-20 text-brand-cream relative overflow-hidden">
      <Helmet><title>AI Style Atelier | AF STYLE</title></Helmet>

      <div className="luxury-container relative z-10">
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-[0.5em] uppercase text-brand-gold mb-4 flex items-center justify-center gap-2">
            <Cpu size={14} /> Maison Intelligence
          </p>
          <h1 className="text-4xl md:text-7xl font-serif italic text-white mb-6 uppercase">AI Style Atelier</h1>
          <p className="text-xs tracking-widest uppercase font-light text-brand-cream/40 max-w-xl mx-auto leading-loose">
            Virtual Fitting Room: Witness perfection tailored precisely to your silhouette.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 max-w-7xl mx-auto">
          
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <h2 className="text-xs font-bold tracking-widest uppercase text-white border-b border-brand-gold/20 pb-4">01. Your Portrait</h2>
              <div className="relative aspect-[3/4] w-full max-w-[280px] mx-auto border border-brand-gold/10 bg-black shadow-2xl overflow-hidden group">
                {userImagePreview ? (
                  <>
                    <img src={userImagePreview} alt="User" className="w-full h-full object-cover opacity-80" />
                    {!isGenerating && (
                      <button onClick={() => {setUserImagePreview(null); setResultImage(null);}} className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:text-red-500 transition-all shadow-lg"><X size={14}/></button>
                    )}
                  </>
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all">
                    <Camera size={40} strokeWidth={1} className="text-brand-gold mb-4" />
                    <span className="text-[9px] uppercase tracking-widest font-bold">Upload Portrait</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xs font-bold tracking-widest uppercase text-white border-b border-brand-gold/20 pb-4">02. Select Piece</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {mockProducts.map((prod) => (
                  <button key={prod.id} onClick={() => { setSelectedProduct(prod); setResultImage(null); }} className={`shrink-0 w-20 aspect-[3/4] border transition-all ${selectedProduct?.id === prod.id ? 'border-brand-gold scale-105 shadow-xl' : 'border-white/5 opacity-40'}`}>
                    <img src={prod.images[0]} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateAI}
              disabled={isGenerating || !userImagePreview || !selectedProduct}
              className="w-full py-5 bg-brand-gold text-brand-dark text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-white transition-all disabled:opacity-20 shadow-2xl flex items-center justify-center gap-3"
            >
              {isGenerating ? <><Loader2 className="animate-spin" size={16} /> Curating...</> : <><Wand2 size={16} /> Generate AI Fit</>}
            </button>
          </div>

          <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[600px]">
            <div className="w-full max-w-md aspect-[3/4] border border-brand-gold/20 bg-black/60 relative overflow-hidden flex items-center justify-center shadow-[0_0_100px_rgba(0,0,0,0.5)]">
              
              {isGenerating && (
                <div className="absolute inset-0 z-20">
                  <img src={userImagePreview!} alt="" className="w-full h-full object-cover opacity-30 grayscale" />
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-0 right-0 h-1 bg-brand-gold shadow-[0_0_30px_#C89B6D] z-30"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                    <Loader2 className="animate-spin text-brand-gold mb-6" size={48} strokeWidth={1} />
                    <p className="text-[10px] tracking-[0.4em] uppercase text-brand-gold font-bold animate-pulse">{statusMessage}</p>
                  </div>
                </div>
              )}

              <AnimatePresence>
                {resultImage && !isGenerating && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-40">
                    {/* কাস্টমারের ছবি এখন রেজাল্ট হিসেবে কাজ করবে */}
                    <img src={resultImage} alt="AI Result" className="w-full h-full object-cover brightness-[1.1] contrast-[1.1]" />
                    
                    {/* রেজাল্টের ওপর লাক্সারি লেয়ার */}
                    <div className="absolute inset-0 bg-brand-gold/5 mix-blend-overlay pointer-events-none" />
                    <div className="absolute inset-0 border-4 border-brand-gold/20 m-4 pointer-events-none" />

                    <div className="absolute top-8 left-8 flex items-center gap-2 bg-brand-gold text-brand-dark px-4 py-1.5 rounded-full shadow-2xl">
                       <CheckCircle2 size={12} />
                       <span className="text-[8px] font-bold uppercase tracking-widest">AI Masterpiece Fit</span>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                      <p className="text-[9px] text-brand-gold uppercase tracking-[0.3em] font-bold mb-1">AI Recommendation</p>
                      <h3 className="font-serif italic text-2xl text-white mb-6">{selectedProduct?.name}</h3>
                      <button onClick={handleAddToCart} className="w-full bg-brand-gold text-brand-dark py-4 text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-white transition-all flex items-center justify-center gap-3">
                        <ShoppingBag size={14} /> Add Piece to Bag
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!userImagePreview && !isGenerating && !resultImage && (
                <div className="text-center opacity-20">
                   <Sparkles size={64} strokeWidth={1} className="mx-auto text-brand-gold mb-6" />
                   <p className="text-[10px] tracking-[0.5em] uppercase">Awaiting Silhouette</p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIStyleRoom;