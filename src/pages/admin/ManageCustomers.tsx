import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Search, User, Award, Mail, 
  Loader2, Gift, X, Send, 
  PlusCircle, Edit3
} from 'lucide-react';
import toast from 'react-hot-toast';

// Firebase
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface Customer {
  uid: string;
  displayName: string;
  email: string;
  role: string;
  photoURL?: string;
  createdAt?: any;
}

const ManageCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Gift Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [giftType, setGiftType] = useState('Exclusive AF Scarf');
  const [customGiftName, setCustomGiftName] = useState(''); // নিজের মতো গিফট লেখার জন্য
  const [isCustom, setIsCustom] = useState(false); // কাস্টম গিফট মুড কি না
  const [isSending, setIsSending] = useState(false);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'users'), orderBy('displayName', 'asc'));
      const querySnapshot = await getDocs(q);
      const list: Customer[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ uid: doc.id, ...doc.data() } as Customer);
      });
      setCustomers(list);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load registry.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSendGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      toast.error("Please select a recipient.");
      return;
    }

    // চূড়ান্ত গিফটের নাম নির্ধারণ করা
    const finalGiftName = isCustom ? customGiftName : giftType;

    if (isCustom && !customGiftName.trim()) {
      toast.error("Please enter the custom gift name.");
      return;
    }

    setIsSending(true);
    try {
      await addDoc(collection(db, 'vip_gifts'), {
        recipientId: selectedUser,
        recipientName: customers.find(c => c.uid === selectedUser)?.displayName,
        giftItem: finalGiftName,
        status: 'Sent',
        sentAt: serverTimestamp()
      });

      toast.success(`Excellence Shared! "${finalGiftName}" sent.`);
      setIsModalOpen(false);
      setCustomGiftName('');
      setIsCustom(false);
    } catch (error) {
      toast.error("Failed to send gift.");
    } finally {
      setIsSending(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-10">
      <Helmet><title>Customer Registry | AF STYLE</title></Helmet>

      <div className="luxury-container">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-serif italic text-luxury-charcoal">Customer Registry</h1>
            <p className="text-[10px] tracking-[0.2em] uppercase text-luxury-platinum mt-1">Maison Membership Management</p>
          </div>
          <button 
            onClick={() => { setIsCustom(false); setIsModalOpen(true); }}
            className="bg-brand-dark text-brand-cream px-6 py-2.5 text-[10px] font-bold tracking-widest uppercase hover:bg-black transition-all flex items-center gap-2"
          >
            <Gift size={14} /> Send VIP Gift
          </button>
        </div>

        <div className="bg-white border border-luxury-platinum/20 p-4 mb-6 shadow-sm">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-platinum" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full bg-gray-50 border-none py-2.5 pl-10 pr-4 text-xs tracking-wider outline-none focus:ring-1 focus:ring-brand-gold/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white border border-luxury-platinum/20 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="py-40 flex justify-center"><Loader2 className="animate-spin text-brand-gold" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-[9px] tracking-[0.2em] uppercase text-luxury-platinum font-bold">
                    <th className="px-6 py-5">Identity</th>
                    <th className="px-6 py-5">VIP Status</th>
                    <th className="px-6 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxury-platinum/10">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.uid} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center text-brand-cream text-xs font-bold border border-brand-gold/20 overflow-hidden">
                            {customer.photoURL ? <img src={customer.photoURL} alt="" className="w-full h-full object-cover" /> : customer.displayName?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[11px] font-bold uppercase">{customer.displayName}</p>
                            <p className="text-[10px] text-luxury-charcoal/40 lowercase">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${customer.role === 'admin' ? 'text-brand-gold' : 'text-luxury-charcoal/40'}`}>
                          {customer.role === 'admin' ? 'Maison Admin' : 'Active Member'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => { setSelectedUser(customer.uid); setIsCustom(false); setIsModalOpen(true); }}
                          className="p-2 text-luxury-platinum hover:text-brand-gold transition-colors"
                        >
                          <Gift size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* --- Advanced Gift Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white w-full max-w-md shadow-2xl animate-slide-up overflow-hidden">
            <div className="p-6 border-b border-luxury-platinum/20 flex justify-between items-center bg-gray-50">
              <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-luxury-charcoal">Curate Excellence Gift</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-luxury-platinum hover:text-luxury-charcoal"><X size={20} /></button>
            </div>

            <form onSubmit={handleSendGift} className="p-8 space-y-8">
              <div className="space-y-2">
                <label className="text-[9px] tracking-widest uppercase text-luxury-platinum font-bold">Recipient</label>
                <select 
                  value={selectedUser} 
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full border-b border-luxury-platinum py-2 text-xs outline-none focus:border-brand-gold bg-transparent"
                  required
                >
                  <option value="">Choose a member...</option>
                  {customers.map(c => <option key={c.uid} value={c.uid}>{c.displayName}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[9px] tracking-widest uppercase text-luxury-platinum font-bold">Select or Write Gift</label>
                  <button 
                    type="button"
                    onClick={() => setIsCustom(!isCustom)}
                    className="text-[9px] font-bold text-brand-gold uppercase border-b border-brand-gold/30"
                  >
                    {isCustom ? "Choose from List" : "Write Custom Gift"}
                  </button>
                </div>

                {isCustom ? (
                  <div className="relative animate-fade-in">
                    <Edit3 size={14} className="absolute left-0 top-3 text-brand-gold" />
                    <input 
                      type="text" 
                      value={customGiftName}
                      onChange={(e) => setCustomGiftName(e.target.value)}
                      className="w-full border-b border-brand-gold py-2 pl-6 text-xs outline-none uppercase tracking-widest"
                      placeholder="ENTER GIFT NAME (E.G. GOLDEN WATCH)"
                      autoFocus
                    />
                  </div>
                ) : (
                  <select 
                    value={giftType} 
                    onChange={(e) => setGiftType(e.target.value)}
                    className="w-full border-b border-luxury-platinum py-2 text-xs outline-none focus:border-brand-gold bg-transparent"
                  >
                    <option value="Exclusive AF Scarf">Exclusive AF Scarf</option>
                    <option value="Signature Maison Perfume">Signature Maison Perfume</option>
                    <option value="Platinum Membership Card">Platinum Membership Card</option>
                    <option value="Limited Edition Tote Bag">Limited Edition Tote Bag</option>
                    <option value="Bespoke Suit Consultation">Bespoke Suit Consultation</option>
                  </select>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isSending}
                className="btn-premium w-full flex items-center justify-center gap-4 disabled:opacity-50 mt-4"
              >
                {isSending ? <Loader2 size={16} className="animate-spin" /> : <><Send size={14} /> Dispatch Gift</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCustomers;