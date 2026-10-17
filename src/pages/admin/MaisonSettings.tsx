import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Save, Loader2, Globe, MessageCircle, Video, Truck, UploadCloud, X, Link2 
} from 'lucide-react';
import toast from 'react-hot-toast';

// Firebase
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

const MaisonSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [settings, setSettings] = useState({
    instagram: '',
    facebook: '',
    tiktok: '',
    whatsapp: '',
    campaignVideoUrl: '' // এই ঘরটি ক্লাউডিনারি বা ড্রাইভ—উভয় লিঙ্কই গ্রহণ করবে
  });

  const [logistics, setLogistics] = useState({
    insideDhaka: 100,
    outsideDhaka: 150,
    freeThreshold: 5000
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'mains');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setSettings(docSnap.data() as any);

        const logRef = doc(db, 'settings', 'logistics');
        const logSnap = await getDoc(logRef);
        if (logSnap.exists()) setLogistics(logSnap.data() as any);
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
       toast.error("File exceeds Cloudinary free limit (100MB). Use Google Drive link below for larger files.");
       return;
    }
    // ... (ছোট ফাইল হলে আপলোড হবে)
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'mains'), settings);
      await setDoc(doc(db, 'settings', 'logistics'), logistics);
      toast.success('Maison systems synchronized.');
    } catch (error) {
      toast.error('Save failed.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-brand-gold" size={32} /></div>;

  return (
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-20">
      <Helmet><title>Maison Settings | AF STYLE</title></Helmet>

      <div className="luxury-container max-w-5xl">
        <div className="mb-10">
          <h1 className="text-2xl font-serif italic text-luxury-charcoal uppercase tracking-widest">Maison Settings</h1>
          <p className="text-[10px] tracking-[0.2em] uppercase text-luxury-platinum mt-1">Infrastructure Control</p>
        </div>

        <form onSubmit={handleSaveAll} className="space-y-10 animate-fade-in">
          
          {/* Video Section */}
          <div className="bg-white p-8 border border-luxury-platinum/10 shadow-sm">
            <h2 className="text-xs font-bold tracking-widest uppercase mb-8 flex items-center gap-2 text-brand-gold">
              <Video size={16} /> Campaign Visuals
            </h2>
            
            <div className="space-y-8">
              {/* Option A: Direct Link (Drive/Dropbox/YouTube) */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase text-luxury-charcoal/40 flex items-center gap-2">
                  <Link2 size={14} /> Direct Video URL (Recommended for 1GB+ Files)
                </label>
                <input 
                  type="url" 
                  name="campaignVideoUrl" 
                  value={settings.campaignVideoUrl} 
                  onChange={handleInputChange} 
                  className="luxury-input" 
                  placeholder="Paste your Google Drive direct link here..." 
                />
                <p className="text-[8px] text-luxury-platinum uppercase mt-2 italic">
                  Note: If you paste a YouTube link, the player will auto-switch to YouTube mode.
                </p>
              </div>

              <div className="flex items-center gap-4 py-4">
                <div className="h-[1px] bg-luxury-platinum/20 flex-1" />
                <span className="text-[9px] text-luxury-platinum uppercase font-bold tracking-widest">Or Upload Small File</span>
                <div className="h-[1px] bg-luxury-platinum/20 flex-1" />
              </div>

              {/* Option B: Cloudinary Upload (Max 100MB) */}
              {!settings.campaignVideoUrl && (
                <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-luxury-platinum/30 bg-gray-50/50 cursor-pointer hover:bg-gray-100 transition-all">
                  <div className="text-center p-4">
                    <UploadCloud className="text-luxury-platinum mx-auto mb-2" size={32} />
                    <p className="text-[10px] uppercase tracking-widest text-luxury-charcoal/50">Upload to Cloudinary (Max 100MB)</p>
                  </div>
                  <input type="file" className="hidden" accept="video/*" onChange={handleVideoUpload} />
                </label>
              )}
            </div>
          </div>

          {/* Socials & Logistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-8 border border-luxury-platinum/10 shadow-sm space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-gold">Social Architecture</h2>
              <div className="grid grid-cols-1 gap-4">
                <input type="url" name="instagram" value={settings.instagram} onChange={handleInputChange} className="luxury-input" placeholder="Instagram URL" />
                <input type="url" name="facebook" value={settings.facebook} onChange={handleInputChange} className="luxury-input" placeholder="Facebook URL" />
                <input type="url" name="tiktok" value={settings.tiktok} onChange={handleInputChange} className="luxury-input" placeholder="TikTok URL" />
                <input type="text" name="whatsapp" value={settings.whatsapp} onChange={handleInputChange} className="luxury-input" placeholder="WhatsApp Number" />
              </div>
            </div>
            <div className="bg-white p-8 border border-luxury-platinum/10 shadow-sm space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-gold">Logistics Infrastructure</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1"><label className="text-[9px] font-bold uppercase opacity-40">Inside Dhaka (৳)</label><input type="number" name="insideDhaka" value={logistics.insideDhaka} onChange={(e) => setLogistics({...logistics, insideDhaka: Number(e.target.value)})} className="luxury-input font-bold" /></div>
                <div className="space-y-1"><label className="text-[9px] font-bold uppercase opacity-40">Outside Dhaka (৳)</label><input type="number" name="outsideDhaka" value={logistics.outsideDhaka} onChange={(e) => setLogistics({...logistics, outsideDhaka: Number(e.target.value)})} className="luxury-input font-bold" /></div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isSaving} className="btn-premium flex items-center justify-center gap-4 px-16 disabled:opacity-50 shadow-2xl">
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Synchronize All Systems
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaisonSettings;