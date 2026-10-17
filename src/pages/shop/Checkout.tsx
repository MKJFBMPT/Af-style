import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, Lock, ChevronRight, CreditCard, 
  Truck, Smartphone, Loader2, Tag, Clock, Coins, Ticket, Check, X, Trophy, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Firebase
import { collection, addDoc, serverTimestamp, doc, getDoc, query, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { sendOrderConfirmationSMS } from '../../services/notifications/smsService';

// Stores
import useCartStore from '../../store/useCartStore';
import useAuthStore from '../../store/useAuthStore';
import useLanguageStore from '../../store/useLanguageStore';
import useRewardStore from '../../store/useRewardStore';
import { translations } from '../../data/translations';

type PaymentMethod = 'cod' | 'card' | 'mobile' | 'crypto';
type Region = 'inside' | 'outside';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  
  const { items, getRawTotal, getDiscountedTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { language } = useLanguageStore();
  const { isDiscountValid, activeDiscount, resetDailyStatus } = useRewardStore();
  const t = translations[language];

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [isOrderFinished, setIsOrderFinished] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('cod');
  const [shippingRates, setShippingRates] = useState({ insideDhaka: 100, outsideDhaka: 150, freeThreshold: 5000 });

  // --- Heritage Loyalty States ---
  const [isHeritageOpen, setIsHeritageOpen] = useState(false);
  const [receiptIds, setReceiptIds] = useState(['', '', '', '']);
  const [isVerifyingReceipts, setIsVerifyingReceipts] = useState(false);
  const [loyaltyDiscount, setLoyaltyDiscount] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ')[1] || '',
    email: user?.email || '',
    address: '',
    region: 'inside' as Region,
    phone: '',
  });

  useEffect(() => {
    const fetchShippingRates = async () => {
      try {
        const docRef = doc(db, 'settings', 'logistics');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setShippingRates(docSnap.data() as any);
      } catch (error) { console.log("Using default rates."); }
    };
    fetchShippingRates();
    resetDailyStatus();
    if (items.length === 0 && !isOrderFinished) navigate('/cart');
  }, [items.length, navigate, resetDailyStatus, isOrderFinished]);

  // --- Heritage Verification Logic ---
  const handleVerifyReceipts = async () => {
    if (receiptIds.some(id => id.trim().length < 5)) {
      toast.error(language === 'en' ? "Enter 4 valid receipt IDs." : "দয়া করে ৪টি সঠিক রসিদ আইডি দিন।");
      return;
    }
    setIsVerifyingReceipts(true);
    try {
      let validCount = 0;
      const ordersSnap = await getDocs(collection(db, 'orders'));
      for (const id of receiptIds) {
        const cleanId = id.replace('#', '').trim().toLowerCase();
        let found = false;
        ordersSnap.forEach((doc) => { if (doc.id.toLowerCase().startsWith(cleanId)) found = true; });
        if (found) validCount++;
      }
      if (validCount === 4) {
        const randomDiscount = Math.floor(Math.random() * (31 - 15 + 1)) + 15;
        setLoyaltyDiscount(randomDiscount);
        toast.success(`Heritage Privilege Unlocked: ${randomDiscount}% OFF!`);
      } else {
        toast.error(`Only ${validCount} IDs verified.`);
      }
    } catch (error) { toast.error("Verification failed."); } finally { setIsVerifyingReceipts(false); }
  };

  const subtotal = getRawTotal();
  const totalDiscountPercent = (isDiscountValid() ? (activeDiscount || 0) : 0) + (loyaltyDiscount || 0);
  const discountedSubtotal = getDiscountedTotal(totalDiscountPercent);
  const totalDiscountAmount = subtotal - discountedSubtotal;
  const baseShipping = formData.region === 'inside' ? shippingRates.insideDhaka : shippingRates.outsideDhaka;
  const shippingCost = discountedSubtotal >= shippingRates.freeThreshold ? 0 : baseShipping;
  const total = discountedSubtotal + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate('/auth'); return; }
    setIsLoading(true);
    try {
      const orderData = {
        userId: user.uid,
        customerName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        shippingAddress: {
          address: formData.address,
          city: formData.region === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka',
          phone: formData.phone
        },
        items,
        pricing: { subtotal, totalDiscountPercent, totalDiscountAmount, shipping: shippingCost, total },
        paymentMethod: selectedMethod,
        status: 'Pending',
        orderDate: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      try { await sendOrderConfirmationSMS(formData.phone, docRef.id, formData.firstName); } catch (err) {}
      setIsOrderFinished(true);
      clearCart();
      navigate(`/order-success/${docRef.id}`);
    } catch (error) { toast.error('Order failed.'); } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 text-luxury-charcoal">
      <Helmet><title>Checkout | AF STYLE</title></Helmet>

      <div className="luxury-container">
        <div className="flex justify-between items-center mb-16">
          <Link to="/cart" className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-all"><ArrowLeft size={14} /> Back to Bag</Link>
          <div className="flex items-center gap-2 text-brand-gold"><Lock size={14} /><span className="text-[10px] tracking-[0.3em] uppercase font-bold">Secure Checkout</span></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-7">
            <form onSubmit={handlePlaceOrder} className="space-y-12">
              
              {/* 01. Shipping */}
              <section className="animate-fade-in">
                <h3 className="text-xs tracking-[0.3em] uppercase font-bold border-b border-luxury-platinum/20 pb-4 mb-8">01. Shipping Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-luxury-charcoal opacity-80">First Name</label><input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="luxury-input text-sm font-medium" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-luxury-charcoal opacity-80">Last Name</label><input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="luxury-input text-sm font-medium" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-luxury-charcoal opacity-80">Region</label><select name="region" value={formData.region} onChange={handleChange} className="luxury-input bg-transparent text-sm font-medium"><option value="inside">Inside Dhaka (৳{shippingRates.insideDhaka})</option><option value="outside">Outside Dhaka (৳{shippingRates.outsideDhaka})</option></select></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-luxury-charcoal opacity-80">Phone</label><input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="luxury-input text-sm font-medium" placeholder="017XXXXXXXX" /></div>
                  <div className="md:col-span-2 space-y-1"><label className="text-[10px] font-bold uppercase text-luxury-charcoal opacity-80">Full Address</label><input type="text" name="address" required value={formData.address} onChange={handleChange} className="luxury-input text-sm font-medium" /></div>
                </div>
              </section>

              {/* 02. Payment Methods */}
              <section className="animate-fade-in">
                <h3 className="text-xs tracking-[0.3em] uppercase font-bold border-b border-luxury-platinum/20 pb-4 mb-8">02. {t.payment_method}</h3>
                <div className="grid grid-cols-1 gap-4">
                  {/* COD */}
                  <div onClick={() => setSelectedMethod('cod')} className={`p-6 border transition-all cursor-pointer ${selectedMethod === 'cod' ? 'border-brand-gold bg-brand-cream/5 shadow-sm' : 'border-luxury-platinum/20 hover:border-luxury-charcoal'}`}>
                    <div className="flex items-center justify-between"><div className="flex items-center gap-4"><div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedMethod === 'cod' ? 'border-brand-gold' : 'border-luxury-platinum'}`}>{selectedMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-brand-gold" />}</div><p className="text-[10px] font-bold tracking-widest uppercase">{t.cash_on_delivery}</p></div><Truck size={20} strokeWidth={1.5} /></div>
                  </div>
                  {/* Mobile Banking */}
                  <div onClick={() => setSelectedMethod('mobile')} className={`p-6 border transition-all cursor-pointer ${selectedMethod === 'mobile' ? 'border-brand-gold bg-brand-cream/5 shadow-sm' : 'border-luxury-platinum/20 hover:border-luxury-charcoal'}`}>
                    <div className="flex items-center justify-between"><div className="flex items-center gap-4"><div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedMethod === 'mobile' ? 'border-brand-gold' : 'border-luxury-platinum'}`}>{selectedMethod === 'mobile' && <div className="w-2 h-2 rounded-full bg-brand-gold" />}</div><p className="text-[10px] font-bold tracking-widest uppercase">Mobile Banking (bKash/Nagad)</p></div><Smartphone size={20} strokeWidth={1.5} /></div>
                  </div>
                  {/* Card Payment */}
                  <div onClick={() => setSelectedMethod('card')} className={`p-6 border transition-all cursor-pointer ${selectedMethod === 'card' ? 'border-brand-gold bg-brand-cream/5 shadow-sm' : 'border-luxury-platinum/20 hover:border-luxury-charcoal'}`}>
                    <div className="flex items-center justify-between"><div className="flex items-center gap-4"><div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedMethod === 'card' ? 'border-brand-gold' : 'border-luxury-platinum'}`}>{selectedMethod === 'card' && <div className="w-2 h-2 rounded-full bg-brand-gold" />}</div><p className="text-[10px] font-bold tracking-widest uppercase">Credit / Debit Card</p></div><CreditCard size={20} strokeWidth={1.5} /></div>
                  </div>
                  {/* Crypto Currency */}
                  <div onClick={() => setSelectedMethod('crypto')} className={`p-6 border transition-all cursor-pointer ${selectedMethod === 'crypto' ? 'border-brand-gold bg-brand-cream/5 shadow-sm' : 'border-luxury-platinum/20 hover:border-luxury-charcoal'}`}>
                    <div className="flex items-center justify-between"><div className="flex items-center gap-4"><div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedMethod === 'crypto' ? 'border-brand-gold' : 'border-luxury-platinum'}`}>{selectedMethod === 'crypto' && <div className="w-2 h-2 rounded-full bg-brand-gold" />}</div><p className="text-[10px] font-bold tracking-widest uppercase">Crypto Currency (BTC, ETH, USDT)</p></div><Coins size={20} strokeWidth={1.5} /></div>
                  </div>
                </div>
              </section>

              {/* --- 03. COLLAPSED HERITAGE SYSTEM (AT BOTTOM) --- */}
              <section className="bg-brand-dark border border-brand-gold/10 shadow-2xl overflow-hidden group">
                <button type="button" onClick={() => setIsHeritageOpen(!isHeritageOpen)} className="w-full p-6 md:p-8 flex justify-between items-center text-left hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-4">
                    <Trophy size={18} className="text-brand-gold" />
                    <div><h3 className="text-[10px] tracking-[0.2em] uppercase font-bold text-white">Maison Heritage Offer</h3><p className="text-[8px] text-brand-cream/30 uppercase mt-1 tracking-widest">{loyaltyDiscount ? `Reward Activated: ${loyaltyDiscount}% OFF` : 'Submit 4 Receipt IDs'}</p></div>
                  </div>
                  <motion.div animate={{ rotate: isHeritageOpen ? 180 : 0 }}><ChevronDown size={18} className="text-brand-gold" /></motion.div>
                </button>
                <AnimatePresence>
                  {isHeritageOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-8 pb-8">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {receiptIds.map((id, idx) => (
                          <input key={idx} type="text" maxLength={8} placeholder={`ID #${idx + 1}`} value={id} onChange={(e) => { const newIds = [...receiptIds]; newIds[idx] = e.target.value.toUpperCase(); setReceiptIds(newIds); }} className="bg-white/5 border-b border-brand-gold/20 p-2.5 text-[9px] text-white outline-none focus:border-brand-gold text-center tracking-widest placeholder:opacity-20" />
                        ))}
                      </div>
                      <button type="button" onClick={handleVerifyReceipts} disabled={isVerifyingReceipts || loyaltyDiscount !== null} className="w-full py-3 border border-brand-gold/40 text-[9px] font-bold uppercase tracking-widest text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-all flex items-center justify-center gap-2">{isVerifyingReceipts ? <Loader2 size={12} className="animate-spin" /> : loyaltyDiscount ? 'Privilege Applied' : 'Verify Maison Records'}</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              <button type="submit" disabled={isLoading} className="btn-premium w-full py-5 flex items-center justify-center gap-4 shadow-2xl disabled:opacity-50">
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : t.confirm_order}
                <ChevronRight size={16} />
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-luxury-platinum/10 p-8 md:p-10 sticky top-32 shadow-xl">
              <h3 className="text-xs tracking-[0.3em] uppercase font-bold mb-8">{t.order_summary}</h3>
              <div className="space-y-6 mb-8 max-h-64 overflow-y-auto no-scrollbar border-b border-luxury-platinum/10 pb-8">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image} alt="" className="w-16 aspect-[3/4] object-cover bg-luxury-platinum shrink-0" />
                    <div className="flex-1"><h4 className="text-[11px] font-serif italic line-clamp-1">{item.name}</h4><p className="text-[9px] tracking-widest uppercase opacity-40 mt-1">{item.size} / {item.color} x {item.quantity}</p></div>
                    <p className="text-[11px] font-bold text-luxury-charcoal">৳{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-4 text-[10px] tracking-widest uppercase">
                <div className="flex justify-between opacity-50"><span>Subtotal</span><span>৳{subtotal.toLocaleString()}</span></div>
                {totalDiscountPercent > 0 && <div className="flex justify-between text-emerald-600 font-bold"><span>Benefit Applied ({totalDiscountPercent}%)</span><span>-৳{totalDiscountAmount.toLocaleString()}</span></div>}
                <div className="flex justify-between opacity-50 border-t border-luxury-platinum/10 pt-4"><span>Shipping</span><span>{shippingCost === 0 ? 'Complimentary' : `৳${shippingCost.toLocaleString()}`}</span></div>
                <div className="flex justify-between items-end pt-6 border-t border-luxury-platinum/10"><span className="text-xs font-bold tracking-[0.2em]">Total Value</span><span className="text-2xl font-serif italic text-brand-dark">৳{total.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;