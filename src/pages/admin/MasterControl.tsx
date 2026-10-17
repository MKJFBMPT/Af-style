import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Save, Loader2, Image as ImageIcon, Type, 
  Megaphone, ShieldAlert, Layout, UploadCloud, X, Camera 
} from 'lucide-react';
import toast from 'react-hot-toast';

// Firebase
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

const MasterControl: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingType, setUploadingType] = useState<'logo' | 'hero' | null>(null);

  // সব ডায়নামিক সেটিং স্টেট
  const [config, setConfig] = useState({
    logoUrl: '',
    logoText: 'AF STYLE',
    announcementBar: '',
    heroImageUrl: '',
    heroTitle: '',
    heroSubtitle: '',
    heroCtaText: 'Explore Collection',
    philosophyTitle: '',
    philosophyText: '',
    maintenanceMode: false
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const docRef = doc(db, 'settings', 'site_config');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setConfig(docSnap.data() as any);
        }
      } catch (error) {
        console.error("Failed to load maison config:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
  };

  const handleToggle = () => {
    setConfig({ ...config, maintenanceMode: !config.maintenanceMode });
  };

  // ক্লাউডিনারি ইমেজ আপলোড হ্যান্ডলার
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'hero') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingType(type);
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (type === 'logo') {
        setConfig({ ...config, logoUrl: data.secure_url });
        toast.success('Maison Logo updated.');
      } else {
        setConfig({ ...config, heroImageUrl: data.secure_url });
        toast.success('Hero visual updated.');
      }
    } catch (err) {
      toast.error('Upload failed.');
    } finally {
      setUploadingType(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'site_config'), config);
      toast.success('Maison Master Control synchronized.');
    } catch (error) {
      toast.error('Failed to save configurations.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-brand-gold" size={32} />
          <p className="text-[10px] tracking-widest uppercase opacity-40">Opening Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-20">
      <Helmet><title>Master Control | AF STYLE Owner</title></Helmet>

      <div className="luxury-container max-w-5xl">
        <div className="mb-12">
          <h1 className="text-3xl font-serif italic text-luxury-charcoal uppercase tracking-tighter">Master Control</h1>
          <p className="text-[10px] tracking-[0.4em] uppercase text-luxury-platinum mt-1 font-bold">The Owner's Digital Command Center</p>
        </div>

        <form onSubmit={handleSave} className="space-y-10 animate-fade-in">
          
          {/* --- Section 1: Maison Branding (লোগো আপলোড) --- */}
          <div className="bg-white p-8 border border-luxury-platinum/10 shadow-sm">
            <h2 className="text-xs font-bold tracking-widest uppercase mb-8 flex items-center gap-2 text-brand-gold">
              <Camera size={16} /> Maison Branding
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <label className="text-[9px] font-bold uppercase opacity-40 tracking-widest">Official Maison Logo</label>
                <div className="relative w-48 h-48 bg-gray-50 border border-dashed border-luxury-platinum/30 flex items-center justify-center overflow-hidden group">
                  {config.logoUrl ? (
                    <>
                      <img src={config.logoUrl} alt="Logo" className="w-full h-full object-contain p-6" />
                      <button 
                        type="button" 
                        onClick={() => setConfig({...config, logoUrl: ''})} 
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={24} className="text-white" />
                      </button>
                    </>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all">
                      {uploadingType === 'logo' ? <Loader2 className="animate-spin text-brand-gold" /> : <UploadCloud className="text-luxury-platinum" size={32} />}
                      <span className="text-[9px] uppercase mt-4 tracking-widest font-bold">Upload Logo</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} />
                    </label>
                  )}
                </div>
                <p className="text-[8px] text-luxury-platinum uppercase italic tracking-wider leading-relaxed">
                  Recommended: Transparent PNG. This will appear on official invoices and the website header.
                </p>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase opacity-40 tracking-widest">Maison Identity (Logo Text)</label>
                  <input type="text" name="logoText" value={config.logoText} onChange={handleChange} className="luxury-input text-lg font-display" placeholder="AF STYLE" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase opacity-40 tracking-widest">Announcement Header</label>
                  <input type="text" name="announcementBar" value={config.announcementBar} onChange={handleChange} className="luxury-input text-xs" placeholder="e.g. Free delivery on orders above ৳5,000" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Cinematic Hero Control */}
          <div className="bg-white p-8 border border-luxury-platinum/10 shadow-sm">
            <h2 className="text-xs font-bold tracking-widest uppercase mb-8 flex items-center gap-2 text-brand-gold">
              <ImageIcon size={16} /> Hero Experience
            </h2>
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[9px] font-bold uppercase opacity-40 tracking-widest">Hero Background Visual</label>
                <div className="flex flex-col md:flex-row gap-10">
                  <div className="w-full md:w-1/2 aspect-video bg-gray-50 border border-luxury-platinum/20 overflow-hidden relative shadow-lg">
                    {config.heroImageUrl ? (
                      <>
                        <img src={config.heroImageUrl} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setConfig({...config, heroImageUrl: ''})} className="absolute top-4 right-4 bg-black/50 p-1.5 rounded-full text-white hover:bg-red-500 transition-all"><X size={16} /></button>
                      </>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all">
                        {uploadingType === 'hero' ? <Loader2 className="animate-spin text-brand-gold" /> : <UploadCloud className="text-luxury-platinum" size={32} />}
                        <span className="text-[9px] uppercase mt-4 tracking-widest">Upload Hero Image</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero')} />
                      </label>
                    )}
                  </div>
                  <div className="flex-1 space-y-6">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase opacity-40 tracking-widest">Master Title</label>
                      <input type="text" name="heroTitle" value={config.heroTitle} onChange={handleChange} className="luxury-input font-serif italic text-lg" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase opacity-40 tracking-widest">Collection Headline</label>
                      <input type="text" name="heroSubtitle" value={config.heroSubtitle} onChange={handleChange} className="luxury-input text-xs" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Brand Philosophy */}
          <div className="bg-white p-8 border border-luxury-platinum/10 shadow-sm">
            <h2 className="text-xs font-bold tracking-widest uppercase mb-8 flex items-center gap-2 text-brand-gold">
              <Type size={16} /> Core Philosophy
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase opacity-40 tracking-widest">Philosophy Section Title</label>
                <input type="text" name="philosophyTitle" value={config.philosophyTitle} onChange={handleChange} className="luxury-input" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase opacity-40 tracking-widest">The Maison's Statement</label>
                <textarea name="philosophyText" value={config.philosophyText} onChange={handleChange} rows={4} className="luxury-input text-sm font-light leading-relaxed resize-none" />
              </div>
            </div>
          </div>

          {/* Section 4: System Safeguard */}
          <div className="bg-brand-dark p-8 shadow-2xl flex items-center justify-between border border-brand-gold/10">
            <div className="flex items-center gap-4 text-brand-cream">
              <ShieldAlert className="text-brand-gold" />
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase">Maison Maintenance Mode</p>
                <p className="text-[8px] opacity-50 uppercase mt-1">Temporarily take the boutique offline for updates</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={handleToggle}
              className={`w-14 h-6 rounded-full transition-all relative p-1 ${config.maintenanceMode ? 'bg-brand-gold' : 'bg-white/10'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-all duration-500 ${config.maintenanceMode ? 'translate-x-8' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={isSaving || uploadingType !== null}
              className="btn-premium flex items-center justify-center gap-4 px-20 disabled:opacity-50 shadow-2xl"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Apply Master Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MasterControl;