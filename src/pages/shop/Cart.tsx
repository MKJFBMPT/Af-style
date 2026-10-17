import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Minus, Plus, X, ArrowRight, ShoppingBag, Tag, Clock, Sparkles } from 'lucide-react';

// Stores
import useCartStore from '../../store/useCartStore';
import useRewardStore from '../../store/useRewardStore';
import useLanguageStore from '../../store/useLanguageStore';
import { translations } from '../../data/translations';

const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, getRawTotal, getDiscountedTotal } = useCartStore();
  const { isDiscountValid, activeDiscount, resetDailyStatus } = useRewardStore();
  const { language } = useLanguageStore();
  const t = translations[language];

  // প্রতিদিনের স্ট্যাটাস এবং ডিসকাউন্ট এক্সপায়ারি চেক করা
  useEffect(() => {
    resetDailyStatus();
  }, [resetDailyStatus]);

  const subtotal = getRawTotal();
  const hasValidDiscount = isDiscountValid();
  const discountPercent = hasValidDiscount ? (activeDiscount || 0) : 0;
  
  // ডিসকাউন্ট বাদে মূল দাম
  const discountedSubtotal = getDiscountedTotal(discountPercent);
  const discountAmount = subtotal - discountedSubtotal;

  const shipping = subtotal > 5000 ? 0 : 100; // ৫০০০ টাকার ওপরে ডেলিভারি ফ্রি, নাহলে ১০০ টাকা
  const total = discountedSubtotal > 0 ? discountedSubtotal + shipping : 0;

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <Helmet>
        <title>Shopping Bag | AF STYLE Luxury Maison</title>
      </Helmet>

      <div className="luxury-container">
        <h1 className="text-3xl md:text-5xl font-serif italic mb-2">Your Collection</h1>
        <p className="text-[10px] tracking-[0.3em] uppercase text-luxury-platinum mb-12">
          {items.length} {items.length === 1 ? 'Item' : 'Items'}
        </p>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-y border-luxury-platinum/20">
            <ShoppingBag size={48} strokeWidth={1} className="text-luxury-platinum mb-6" />
            <h2 className="text-2xl font-serif italic mb-4">Your bag is empty</h2>
            <Link to="/shop" className="btn-premium flex items-center gap-4 group">
              Explore Boutique <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Side: Items List */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Discount Urgency Banner */}
              {hasValidDiscount && (
                <div className="bg-brand-dark text-brand-cream p-4 flex items-center justify-between border-l-4 border-brand-gold animate-fade-in shadow-xl">
                  <div className="flex items-center gap-3">
                    <Sparkles size={18} className="text-brand-gold animate-pulse" />
                    <p className="text-[10px] md:text-xs tracking-[0.15em] uppercase font-bold">
                      Maison Privilege: <span className="text-brand-gold">{activeDiscount}% OFF</span> Applied
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-brand-gold/60">
                    <Clock size={14} />
                    <span className="text-[9px] font-bold tracking-widest uppercase italic">Expires at Midnight</span>
                  </div>
                </div>
              )}

              <div className="hidden md:grid grid-cols-12 gap-4 text-[9px] tracking-[0.2em] uppercase text-luxury-platinum border-b border-luxury-platinum/20 pb-4">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1"></div>
              </div>

              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-luxury-platinum/10 pb-8">
                  <div className="col-span-1 md:col-span-6 flex gap-6">
                    <Link to={`/product/${item.productId}`} className="w-24 aspect-[3/4] bg-luxury-platinum shrink-0 overflow-hidden group shadow-sm">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </Link>
                    <div className="flex flex-col justify-center">
                      <Link to={`/product/${item.productId}`} className="text-sm font-serif italic hover:text-brand-gold transition-colors mb-2">
                        {item.name}
                      </Link>
                      <p className="text-[9px] tracking-[0.2em] uppercase text-luxury-charcoal/40 mb-1">{item.color} / {item.size}</p>
                      <p className="text-xs font-bold mt-2">৳{Number(item.price).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-3 flex md:justify-center">
                    <div className="flex items-center border border-luxury-platinum/40">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2.5 hover:text-brand-gold transition-colors"><Minus size={12} /></button>
                      <span className="w-8 text-center text-[10px] font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2.5 hover:text-brand-gold transition-colors"><Plus size={12} /></button>
                    </div>
                  </div>

                  <div className="hidden md:block col-span-2 text-right">
                    <p className="text-sm font-medium">৳{(item.price * item.quantity).toLocaleString()}</p>
                  </div>

                  <div className="absolute right-0 top-0 md:relative md:col-span-1 flex justify-end">
                    <button onClick={() => removeItem(item.id)} className="text-luxury-platinum hover:text-red-500 transition-colors p-2"><X size={16} /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Side: Summary */}
            <div className="lg:col-span-4">
              <div className="bg-brand-cream/10 border border-brand-cream/30 p-8 sticky top-32">
                <h3 className="text-lg font-serif italic mb-8 border-b border-brand-cream/30 pb-4">{t.order_summary}</h3>
                
                <div className="space-y-4 text-[10px] tracking-[0.2em] uppercase mb-8">
                  <div className="flex justify-between">
                    <span className="text-luxury-charcoal/60">Subtotal</span>
                    <span>৳{subtotal.toLocaleString()}</span>
                  </div>

                  {/* ডিসকাউন্ট যদি থাকে তবে এখানে দেখাবে */}
                  {hasValidDiscount && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <div className="flex items-center gap-2">
                        <Tag size={12} />
                        <span>Maison Discount ({activeDiscount}%)</span>
                      </div>
                      <span>-৳{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between border-t border-brand-cream/30 pt-4">
                    <span className="text-luxury-charcoal/60">{t.shipping}</span>
                    <span>{shipping === 0 ? 'Complimentary' : `৳${shipping.toLocaleString()}`}</span>
                  </div>
                </div>

                <div className="border-t border-luxury-platinum/20 pt-6 mb-10 flex justify-between items-end">
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase">Grand Total</span>
                  <span className="text-3xl font-serif italic text-brand-dark">৳{total.toLocaleString()}</span>
                </div>

                <Link to="/checkout" className="btn-premium w-full flex items-center justify-center gap-4 group shadow-xl">
                  {t.checkout_btn} <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </Link>

                {hasValidDiscount && (
                  <p className="text-[8px] text-center text-brand-gold mt-6 uppercase tracking-[0.2em] font-medium animate-pulse">
                    Complete acquisition before midnight to secure your reward
                  </p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;