import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { UploadCloud, X, Save, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Firebase
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form States
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Women');
  const [description, setDescription] = useState('');
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isNew, setIsNew] = useState(true);
  const [isTrending, setIsTrending] = useState(false);

  // Temporary input states
  const [sizeInput, setSizeInput] = useState('');
  const [colorInput, setColorInput] = useState('');

  // Cloudinary Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      toast.error('Cloudinary configuration is missing in .env.local');
      return;
    }

    setIsUploading(true);
    
    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        formData.append('upload_preset', uploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      }

      setImages((prev) => [...prev, ...uploadedUrls]);
      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload images');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleAddItem = (e: React.KeyboardEvent, type: 'size' | 'color') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'size' && sizeInput.trim()) {
        if (!sizes.includes(sizeInput.trim().toUpperCase())) {
          setSizes([...sizes, sizeInput.trim().toUpperCase()]);
        }
        setSizeInput('');
      } else if (type === 'color' && colorInput.trim()) {
        if (!colors.includes(colorInput.trim())) {
          setColors([...colors, colorInput.trim()]);
        }
        setColorInput('');
      }
    }
  };

  const removeItem = (itemToRemove: string, type: 'size' | 'color') => {
    if (type === 'size') {
      setSizes(sizes.filter(s => s !== itemToRemove));
    } else {
      setColors(colors.filter(c => c !== itemToRemove));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    if (sizes.length === 0 || colors.length === 0) {
      toast.error('Please add at least one size and one color');
      return;
    }

    setIsLoading(true);

    try {
      const productData = {
        name,
        price: Number(price),
        category,
        description,
        sizes,
        colors,
        images,
        isNew,
        isTrending,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'products'), productData);
      
      toast.success('Product created successfully!');
      navigate('/admin/products');
    } catch (error) {
      toast.error('Failed to create product');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-20">
      <Helmet>
        <title>Add New Product | AF STYLE Admin</title>
      </Helmet>

      <div className="luxury-container max-w-4xl">
        <div className="flex items-center gap-4 mb-10">
          <Link to="/admin/products" className="w-10 h-10 flex items-center justify-center border border-luxury-platinum/30 hover:bg-white hover:text-brand-gold transition-colors bg-transparent">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-serif italic text-luxury-charcoal">Add New Piece</h1>
            <p className="text-[10px] tracking-[0.2em] uppercase text-luxury-platinum mt-1">Expand your collection</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* General Info */}
          <div className="bg-white p-8 border border-luxury-platinum/20 shadow-sm">
            <h2 className="text-sm font-bold tracking-widest uppercase mb-6">General Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] tracking-widest uppercase font-bold text-luxury-charcoal/70">Product Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-luxury-platinum/30 p-3 text-sm outline-none focus:border-brand-gold" placeholder="e.g. Silk Midnight Evening Gown" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest uppercase font-bold text-luxury-charcoal/70">Price (USD)</label>
                <input type="number" required min="1" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border border-luxury-platinum/30 p-3 text-sm outline-none focus:border-brand-gold" placeholder="e.g. 1250" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest uppercase font-bold text-luxury-charcoal/70">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-luxury-platinum/30 p-3 text-sm outline-none focus:border-brand-gold bg-transparent">
                  <option value="Men">Men's Universe</option>
                  <option value="Women">Women's Universe</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              
              {/* Description (Textarea replacing ReactQuill) */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] tracking-widest uppercase font-bold text-luxury-charcoal/70">Description</label>
                <textarea 
                  required
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="w-full border border-luxury-platinum/30 p-4 text-sm outline-none focus:border-brand-gold h-40 resize-none" 
                  placeholder="Craft a compelling story for this piece..." 
                />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white p-8 border border-luxury-platinum/20 shadow-sm">
            <h2 className="text-sm font-bold tracking-widest uppercase mb-6">Variants & Inventory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] tracking-widest uppercase font-bold text-luxury-charcoal/70">Available Sizes (Press Enter to add)</label>
                <input type="text" value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} onKeyDown={(e) => handleAddItem(e, 'size')} className="w-full border border-luxury-platinum/30 p-3 text-sm outline-none focus:border-brand-gold" placeholder="e.g. S, M, L, XL" />
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <span key={size} className="flex items-center gap-2 bg-gray-100 px-3 py-1 text-xs font-bold">
                      {size} <button type="button" onClick={() => removeItem(size, 'size')}><X size={12} className="text-red-500" /></button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] tracking-widest uppercase font-bold text-luxury-charcoal/70">Available Colors (Press Enter to add)</label>
                <input type="text" value={colorInput} onChange={(e) => setColorInput(e.target.value)} onKeyDown={(e) => handleAddItem(e, 'color')} className="w-full border border-luxury-platinum/30 p-3 text-sm outline-none focus:border-brand-gold" placeholder="e.g. Midnight Blue" />
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <span key={color} className="flex items-center gap-2 bg-gray-100 px-3 py-1 text-xs font-medium">
                      {color} <button type="button" onClick={() => removeItem(color, 'color')}><X size={12} className="text-red-500" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Media & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 border border-luxury-platinum/20 shadow-sm">
              <h2 className="text-sm font-bold tracking-widest uppercase mb-6">Product Images</h2>
              <div className="space-y-4">
                <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-luxury-platinum/50 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isUploading ? <Loader2 className="animate-spin text-brand-gold mb-2" size={24} /> : <UploadCloud className="text-luxury-platinum mb-2" size={24} />}
                    <p className="text-[10px] text-luxury-charcoal/50 uppercase tracking-widest">{isUploading ? 'Uploading to Cloudinary...' : 'Click to upload'}</p>
                  </div>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                </label>

                <div className="grid grid-cols-4 gap-4 mt-4">
                  {images.map((url, idx) => (
                    <div key={idx} className="relative aspect-[3/4] bg-gray-100 border border-luxury-platinum/20 group overflow-hidden">
                      <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-white p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-8 border border-luxury-platinum/20 shadow-sm">
              <h2 className="text-sm font-bold tracking-widest uppercase mb-6">Product Tags</h2>
              <div className="space-y-6">
                <label className="flex items-center gap-4 cursor-pointer">
                  <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} className="w-4 h-4 accent-brand-gold" />
                  <span className="text-xs font-bold tracking-widest uppercase">Mark as New Arrival</span>
                </label>
                <label className="flex items-center gap-4 cursor-pointer">
                  <input type="checkbox" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} className="w-4 h-4 accent-brand-gold" />
                  <span className="text-xs font-bold tracking-widest uppercase text-emerald-600">Mark as Trending</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isLoading || isUploading} className="btn-premium flex items-center justify-center gap-3 w-full md:w-auto disabled:opacity-50">
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isLoading ? 'Saving Product...' : 'Publish Product'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProduct;