import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Package, Gift, Award, Share2, ChevronRight, Loader2, 
  Copy, Camera, Edit2, Check, X, Mail, Lock, User as UserIcon, LogOut 
} from 'lucide-react';
import { updateProfile, updateEmail, sendPasswordResetEmail } from 'firebase/auth';
import { doc, updateDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';

// Firebase & Stores
import { auth, db } from '../../services/firebase';
import useAuthStore from '../../store/useAuthStore';
import useLanguageStore from '../../store/useLanguageStore';
import useRewardStore from '../../store/useRewardStore';
import { translations } from '../../data/translations';

// Components
import MaisonBoxModal from '../../components/animations/MaisonBoxModal';

const Profile: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const { language } = useLanguageStore();
  const t = translations[language];
  const { points, tier, lastUnboxingDate, initUserRewards } = useRewardStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // States for Profile Editing
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user?.uid) initUserRewards(user.uid);
  }, [user?.uid, initUserRewards]);

  const hasUnboxedToday = lastUnboxingDate === new Date().toDateString();

  // ১. প্রোফাইল ফটো আপলোড (Cloudinary)
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      const photoURL = data.secure_url;

      // Firebase Auth & Firestore আপডেট
      await updateProfile(auth.currentUser!, { photoURL });
      await updateDoc(doc(db, 'users', user.uid), { photoURL });
      
      setUser({ ...user, photoURL });
      toast.success(language === 'en' ? 'Portrait updated.' : 'প্রোফাইল ছবি আপডেট হয়েছে।');
    } catch (err) {
      toast.error('Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  // ২. নাম এবং ইমেইল আপডেট
  const handleUpdateInfo = async () => {
    if (!user || !auth.currentUser) return;
    setIsSaving(true);
    try {
      // নাম পরিবর্তন
      if (displayName !== user.displayName) {
        await updateProfile(auth.currentUser, { displayName });
        await updateDoc(doc(db, 'users', user.uid), { displayName });
      }
      
      // ইমেইল পরিবর্তন (Re-authentication প্রয়োজন হতে পারে)
      if (email !== user.email) {
        await updateEmail(auth.currentUser, email);
        await updateDoc(doc(db, 'users', user.uid), { email });
      }

      setUser({ ...user, displayName, email });
      setIsEditing(false);
      toast.success('Information updated.');
    } catch (err: any) {
      toast.error(err.message || 'Verification required for email change.');
    } finally {
      setIsSaving(false);
    }
  };

  // ৩. পাসওয়ার্ড রিসেট ইমেইল পাঠানো
  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success('Security link sent to your email.');
    } catch (err) {
      toast.error('Failed to send reset link.');
    }
  };

  // অর্ডার লোড করা
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'orders'), where('userId', '==', user.uid), orderBy('orderDate', 'desc'));
        const snap = await getDocs(q);
        const list: any[] = [];
        snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
        setOrders(list);
      } catch (e) {
        const fallbackQ = query(collection(db, 'orders'), where('userId', '==', user.uid));
        const fallbackSnap = await getDocs(fallbackQ);
        const fallbackList: any[] = [];
        fallbackSnap.forEach((doc) => fallbackList.push({ id: doc.id, ...doc.data() }));
        setOrders(fallbackList);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserOrders();
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <Helmet><title>Account | AF STYLE</title></Helmet>

      <div className="luxury-container">
        {/* Profile Identity Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20 items-center">
          <div className="lg:col-span-2 flex flex-col md:flex-row items-center gap-10">
            {/* Avatar with Upload */}
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-brand-dark overflow-hidden border-4 border-brand-gold/20 shadow-2xl">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl font-display italic text-brand-cream">
                    {user.displayName?.charAt(0)}
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="animate-spin text-brand-gold" />
                  </div>
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-luxury-charcoal hover:text-brand-gold transition-all"
              >
                <Camera size={18} />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
            </div>

            {/* Editable Info */}
            <div className="text-center md:text-left flex-1">
              {!isEditing ? (
                <>
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <h1 className="text-3xl md:text-5xl font-serif italic text-luxury-charcoal">{user.displayName}</h1>
                    <button onClick={() => setIsEditing(true)} className="p-2 text-luxury-platinum hover:text-brand-gold"><Edit2 size={18} /></button>
                  </div>
                  <p className="text-xs text-luxury-charcoal/50 mt-2 font-light tracking-[0.2em] uppercase">{user.email}</p>
                </>
              ) : (
                <div className="flex flex-col gap-4 animate-fade-in">
                  <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="luxury-input text-2xl font-serif italic" placeholder="Enter Full Name" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} className="luxury-input text-xs tracking-widest lowercase" placeholder="Enter Email" />
                  <div className="flex gap-4 mt-2">
                    <button onClick={handleUpdateInfo} disabled={isSaving} className="bg-brand-gold text-brand-dark px-6 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                      {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Save Changes
                    </button>
                    <button onClick={() => setIsEditing(false)} className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest border border-red-100 text-red-500">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* VIP Status Card */}
          <div className="bg-brand-dark p-8 relative overflow-hidden shadow-2xl border border-brand-gold/10">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <Award className="text-brand-gold" size={24} strokeWidth={1} />
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-gold">VIP {tier}</span>
              </div>
              <p className="text-brand-cream text-[10px] tracking-[0.2em] uppercase opacity-60 mb-2">Maison Points</p>
              <h3 className="text-3xl font-serif italic text-white mb-6">{points}</h3>
              <div className="w-full h-[1px] bg-white/10 mb-4">
                <div className="h-full bg-brand-gold transition-all duration-1000" style={{ width: `${(points / 1500) * 100}%` }} />
              </div>
              <button onClick={handlePasswordReset} className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-brand-gold/60 hover:text-brand-gold transition-colors">
                <Lock size={12} /> Reset Security Password
              </button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase border-b border-luxury-platinum/20 pb-6 mb-10">Acquisition History</h2>
            {isLoadingOrders ? (
              <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-brand-gold" /></div>
            ) : orders.length === 0 ? (
              <div className="py-24 text-center border border-dashed border-luxury-platinum/20 text-luxury-charcoal/40 font-serif italic">
                Your collection is waiting for its first piece.
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-gray-50/50 border border-luxury-platinum/10 p-6 flex justify-between items-center hover:border-brand-gold/30 transition-all">
                    <div className="flex gap-6">
                      <img src={order.items[0]?.image} alt="" className="w-16 aspect-[3/4] object-cover" />
                      <div className="flex flex-col justify-center">
                        <p className="text-[10px] font-bold uppercase">#{order.id.slice(0, 8)}</p>
                        <p className="text-[11px] font-serif italic mt-1">{order.items[0]?.name}</p>
                        <p className="text-[9px] font-bold text-brand-gold mt-4 uppercase tracking-widest">{order.status}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold">${order.pricing.total.toLocaleString()}.00</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar: Game & Referral */}
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-brand-dark p-10 text-center relative overflow-hidden shadow-2xl">
              <div className="relative z-10 flex flex-col items-center">
                <Gift size={32} className={`text-brand-gold mb-6 ${!hasUnboxedToday ? 'animate-bounce' : 'opacity-20'}`} />
                <h3 className="text-xl font-serif italic text-white mb-4">The Maison Box</h3>
                <p className="text-[10px] text-brand-cream/60 leading-relaxed uppercase tracking-widest mb-10">Unbox elegance and exclusive rewards.</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  disabled={hasUnboxedToday}
                  className={`w-full py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${hasUnboxedToday ? 'bg-white/5 text-white/20 border border-white/10' : 'bg-brand-gold text-brand-dark hover:bg-white'}`}
                >
                  {hasUnboxedToday ? 'Claimed Today' : 'Unveil Now'}
                </button>
              </div>
            </div>

            <div className="bg-white border border-luxury-platinum/20 p-8 shadow-sm">
              <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-gold mb-6 flex items-center gap-2"><Share2 size={14} /> Referral Circle</h3>
              <div className="flex items-center gap-2 bg-gray-50 p-3 border border-luxury-platinum/10">
                <p className="text-[9px] truncate flex-1 opacity-50 uppercase">afstyle.com/join?ref={user.uid.slice(0, 6)}</p>
                <button onClick={() => {navigator.clipboard.writeText(`afstyle.com/join?ref=${user.uid.slice(0, 6)}`); toast.success('Copied.');}} className="p-2 hover:text-brand-gold"><Copy size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MaisonBoxModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Profile;