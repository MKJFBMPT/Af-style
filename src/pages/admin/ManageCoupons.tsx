import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Plus, Ticket, Trash2, Search, 
  Loader2, X, Calendar, Percent, 
  CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

// Firebase
import { 
  collection, getDocs, addDoc, 
  deleteDoc, doc, query, orderBy, serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../services/firebase';

interface Coupon {
  id: string;
  code: string;
  discount: number;
  expiryDate: string;
  isActive: boolean;
  createdAt: any;
}

const ManageCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // নতুন কুপন ফর্ম স্টেট
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    expiryDate: ''
  });

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'coupons'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const list: Coupon[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Coupon);
      });
      setCoupons(list);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // কোডটি বড় হাতের অক্ষরে রূপান্তর
    const cleanCode = formData.code.trim().toUpperCase();
    
    if (cleanCode.length < 3) {
      toast.error("Code must be at least 3 characters.");
      return;
    }

    setIsSaving(true);
    try {
      await addDoc(collection(db, 'coupons'), {
        code: cleanCode,
        discount: Number(formData.discount),
        expiryDate: formData.expiryDate,
        isActive: true,
        createdAt: serverTimestamp()
      });

      toast.success(`Coupon ${cleanCode} is now active.`);
      setIsModalOpen(false);
      setFormData({ code: '', discount: '', expiryDate: '' });
      fetchCoupons();
    } catch (error) {
      toast.error("Failed to create coupon.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (window.confirm(`Are you sure you want to deactivate ${code}?`)) {
      try {
        await deleteDoc(doc(db, 'coupons', id));
        setCoupons(coupons.filter(c => c.id !== id));
        toast.success("Coupon removed.");
      } catch (error) {
        toast.error("Failed to delete.");
      }
    }
  };

  // চেক করা যে কুপনটির মেয়াদ আছে কি না
  const isExpired = (date: string) => {
    return new Date(date) < new Date();
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-10">
      <Helmet><title>Maison Rewards | AF STYLE Admin</title></Helmet>

      <div className="luxury-container max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-2xl font-serif italic text-luxury-charcoal uppercase tracking-widest">Promotion Control</h1>
            <p className="text-[10px] tracking-[0.2em] uppercase text-luxury-platinum mt-1">Curate exclusive offers & codes</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-dark text-brand-cream px-8 py-3 text-[10px] font-bold tracking-widest uppercase hover:bg-black transition-all flex items-center gap-3 shadow-xl"
          >
            <Plus size={16} /> Create New Code
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-luxury-platinum/10 p-4 mb-8 shadow-sm">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-platinum" size={16} />
            <input 
              type="text" 
              placeholder="Search active codes..." 
              className="w-full bg-gray-50 border-none py-2.5 pl-10 pr-4 text-[10px] tracking-widest uppercase outline-none focus:ring-1 focus:ring-brand-gold/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Coupons Table */}
        <div className="bg-white border border-luxury-platinum/10 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="py-40 flex justify-center"><Loader2 className="animate-spin text-brand-gold" /></div>
          ) : filteredCoupons.length === 0 ? (
            <div className="py-40 text-center">
              <Ticket size={40} className="mx-auto mb-4 text-luxury-platinum opacity-30" />
              <p className="font-serif italic text-luxury-charcoal/30">No active promotions found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-[9px] tracking-[0.2em] uppercase text-luxury-platinum font-bold">
                    <th className="px-6 py-5">Promo Code</th>
                    <th className="px-6 py-5">Benefit</th>
                    <th className="px-6 py-5">Expiry Status</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxury-platinum/5">
                  {filteredCoupons.map((coupon) => {
                    const expired = isExpired(coupon.expiryDate);
                    return (
                      <tr key={coupon.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-brand-gold/10 rounded flex items-center justify-center text-brand-gold">
                              <Ticket size={14} />
                            </div>
                            <span className="text-[11px] font-bold tracking-widest text-luxury-charcoal">{coupon.code}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-xs font-bold text-emerald-600">{coupon.discount}% OFF</span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            {expired ? (
                              <XCircle className="text-red-400" size={14} />
                            ) : (
                              <CheckCircle2 className="text-emerald-500" size={14} />
                            )}
                            <span className={`text-[10px] font-medium tracking-wide uppercase ${expired ? 'text-red-400' : 'text-luxury-charcoal/60'}`}>
                              {expired ? 'Expired' : `Valid until ${new Date(coupon.expiryDate).toLocaleDateString()}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button 
                            onClick={() => handleDelete(coupon.id, coupon.code)}
                            className="p-2 text-luxury-charcoal/30 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* --- Create Coupon Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white w-full max-w-md shadow-2xl animate-slide-up">
            <div className="p-6 border-b border-luxury-platinum/20 flex justify-between items-center bg-gray-50">
              <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-luxury-charcoal">New Promotion</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-8 space-y-8">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-luxury-charcoal/40">Promo Code</label>
                <input 
                  type="text" 
                  required 
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  className="luxury-input uppercase" 
                  placeholder="e.g. LUXURY2026" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-luxury-charcoal/40">Discount Percentage (%)</label>
                <div className="relative">
                  <Percent size={14} className="absolute left-0 top-3 text-brand-gold" />
                  <input 
                    type="number" 
                    required 
                    min="1" 
                    max="99"
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: e.target.value})}
                    className="luxury-input pl-6" 
                    placeholder="15" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-luxury-charcoal/40">Expiration Date</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-0 top-3 text-brand-gold" />
                  <input 
                    type="date" 
                    required 
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    className="luxury-input pl-6" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSaving}
                className="btn-premium w-full flex items-center justify-center gap-4 disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Activate Promotion'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ছোট হেল্পার আইকন
const XCircle = ({ className, size }: { className?: string, size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
);

export default ManageCoupons;