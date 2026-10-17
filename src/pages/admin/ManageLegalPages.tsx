import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Save, Loader2, ShieldCheck, FileText, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

// Firebase
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';

type PageType = 'shipping' | 'privacy' | 'terms';

const ManageLegalPages: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PageType>('shipping');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // কন্টেন্ট স্টেট (ইংরেজি এবং বাংলা)
  const [content, setContent] = useState({
    en: '',
    bn: ''
  });

  // ডাটাবেস থেকে নির্দিষ্ট পেজের ডেটা নিয়ে আসা
  useEffect(() => {
    const fetchPageContent = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, 'legal_pages', activeTab);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setContent(docSnap.data() as { en: string, bn: string });
        } else {
          // ডেটা না থাকলে বক্স খালি করে দিবে
          setContent({ en: '', bn: '' });
        }
      } catch (error) {
        console.error("Error fetching legal content:", error);
        toast.error("Failed to load content.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageContent();
  }, [activeTab]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent({ ...content, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // 'legal_pages' কালেকশনে পেজের নাম অনুযায়ী সেভ হবে
      await setDoc(doc(db, 'legal_pages', activeTab), {
        ...content,
        updatedAt: serverTimestamp()
      });
      toast.success('Legal page updated successfully.');
    } catch (error) {
      toast.error('Failed to update page.');
    } finally {
      setIsSaving(false);
    }
  };

  const getPageTitle = () => {
    if (activeTab === 'shipping') return 'Shipping & Returns';
    if (activeTab === 'privacy') return 'Privacy Policy';
    return 'Terms of Use';
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-20">
      <Helmet><title>Manage Legal Pages | AF STYLE Admin</title></Helmet>

      <div className="luxury-container max-w-5xl">
        <div className="mb-10 text-center lg:text-left">
          <h1 className="text-2xl font-serif italic text-luxury-charcoal">Legal & Policies</h1>
          <p className="text-[10px] tracking-[0.2em] uppercase text-luxury-platinum mt-1">Manage Maison Guidelines</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('shipping')}
            className={`flex items-center gap-2 px-6 py-3 text-[10px] tracking-widest uppercase font-bold transition-all ${activeTab === 'shipping' ? 'bg-brand-dark text-brand-cream shadow-lg' : 'bg-white border border-luxury-platinum/30 text-luxury-charcoal hover:border-brand-gold'}`}
          >
            <Truck size={14} /> Shipping Info
          </button>
          <button 
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-6 py-3 text-[10px] tracking-widest uppercase font-bold transition-all ${activeTab === 'privacy' ? 'bg-brand-dark text-brand-cream shadow-lg' : 'bg-white border border-luxury-platinum/30 text-luxury-charcoal hover:border-brand-gold'}`}
          >
            <ShieldCheck size={14} /> Privacy Policy
          </button>
          <button 
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 px-6 py-3 text-[10px] tracking-widest uppercase font-bold transition-all ${activeTab === 'terms' ? 'bg-brand-dark text-brand-cream shadow-lg' : 'bg-white border border-luxury-platinum/30 text-luxury-charcoal hover:border-brand-gold'}`}
          >
            <FileText size={14} /> Terms of Use
          </button>
        </div>

        {/* Editor Form */}
        <form onSubmit={handleSave} className="bg-white p-8 border border-luxury-platinum/20 shadow-sm animate-fade-in">
          <h2 className="text-xl font-serif italic text-luxury-charcoal mb-8 border-b border-luxury-platinum/20 pb-4">
            Editing: {getPageTitle()}
          </h2>

          {isLoading ? (
            <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-brand-gold" size={32} /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* English Version */}
              <div className="space-y-4">
                <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-brand-gold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-gold" /> English Version
                </label>
                <textarea 
                  name="en"
                  required 
                  value={content.en}
                  onChange={handleChange}
                  className="w-full h-[500px] border border-luxury-platinum/30 p-5 text-sm font-light leading-relaxed outline-none focus:border-brand-gold bg-gray-50/30 resize-none"
                  placeholder="Write the English content here... You can use standard text formatting."
                />
              </div>

              {/* Bengali Version */}
              <div className="space-y-4">
                <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-emerald-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" /> Bengali Version
                </label>
                <textarea 
                  name="bn"
                  required 
                  value={content.bn}
                  onChange={handleChange}
                  className="w-full h-[500px] border border-luxury-platinum/30 p-5 text-sm font-light leading-relaxed outline-none focus:border-brand-gold bg-gray-50/30 resize-none"
                  placeholder="এখানে বাংলা কন্টেন্ট লিখুন..."
                />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-8 mt-8 border-t border-luxury-platinum/10">
            <button 
              type="submit" 
              disabled={isSaving || isLoading}
              className="btn-premium flex items-center justify-center gap-3 px-12 disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isSaving ? 'Publishing...' : 'Publish Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageLegalPages;