import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Plus, Search, Trash2, ExternalLink, 
  Loader2, X, Image as ImageIcon, Save 
} from 'lucide-react';
import toast from 'react-hot-toast';

// Firebase
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface Blog {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  content: string;
  category: string;
  createdAt: any;
}

const ManageBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form States
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    content: '',
    category: 'Fashion'
  });

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const blogList: Blog[] = [];
      querySnapshot.forEach((doc) => {
        blogList.push({ id: doc.id, ...doc.data() } as Blog);
      });
      setBlogs(blogList);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: data,
      });
      const fileData = await res.json();
      setFormData({ ...formData, image: fileData.secure_url });
      toast.success('Cover image ready.');
    } catch (err) {
      toast.error('Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error("Please upload a cover image.");
      return;
    }

    setIsSaving(true);
    try {
      await addDoc(collection(db, 'blogs'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      toast.success('Story published to Maison Journal.');
      setIsModalOpen(false);
      setFormData({ title: '', subtitle: '', image: '', content: '', category: 'Fashion' });
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to publish.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Remove this story from the journal?")) {
      try {
        await deleteDoc(doc(db, 'blogs', id));
        setBlogs(blogs.filter(b => b.id !== id));
        toast.success("Story removed.");
      } catch (error) {
        toast.error("Failed to delete.");
      }
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-10">
      <Helmet><title>Maison Journal | AF STYLE Admin</title></Helmet>

      <div className="luxury-container">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-serif italic text-luxury-charcoal">Maison Journal</h1>
            <p className="text-[10px] tracking-[0.2em] uppercase text-luxury-platinum mt-1">Editorial Management</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-dark text-brand-cream px-6 py-2.5 text-[10px] font-bold tracking-widest uppercase hover:bg-black transition-all flex items-center gap-2"
          >
            <Plus size={16} /> Write New Story
          </button>
        </div>

        <div className="bg-white border border-luxury-platinum/20 p-4 mb-6 shadow-sm">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-platinum" size={16} />
            <input 
              type="text" 
              placeholder="Search stories..." 
              className="w-full bg-gray-50 border-none py-2.5 pl-10 pr-4 text-xs tracking-wider outline-none focus:ring-1 focus:ring-brand-gold/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Blog Table */}
        <div className="bg-white border border-luxury-platinum/20 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="py-40 flex justify-center"><Loader2 className="animate-spin text-brand-gold" /></div>
          ) : filteredBlogs.length === 0 ? (
            <div className="py-40 text-center font-serif italic text-luxury-charcoal/30">The journal is currently empty.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-[9px] tracking-[0.2em] uppercase text-luxury-platinum font-bold">
                    <th className="px-6 py-5">Article</th>
                    <th className="px-6 py-5">Category</th>
                    <th className="px-6 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxury-platinum/10">
                  {filteredBlogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 bg-gray-100 overflow-hidden shrink-0">
                            <img src={blog.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-luxury-charcoal uppercase line-clamp-1">{blog.title}</p>
                            <p className="text-[9px] text-luxury-platinum uppercase tracking-tighter line-clamp-1">{blog.subtitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[9px] font-bold bg-brand-cream/20 text-brand-dark px-2 py-0.5 rounded uppercase">{blog.category}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleDelete(blog.id)} className="p-2 text-luxury-platinum hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                          <button className="p-2 text-luxury-platinum hover:text-brand-gold transition-colors"><ExternalLink size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* --- Write Story Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/95 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] shadow-2xl animate-slide-up overflow-hidden flex flex-col">
            <div className="p-6 border-b border-luxury-platinum/20 flex justify-between items-center bg-gray-50">
              <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-luxury-charcoal">Compose Maison Story</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] tracking-widest uppercase font-bold text-luxury-charcoal/60">Story Title</label>
                    <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="luxury-input" placeholder="The Art of Italian Silk" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] tracking-widest uppercase font-bold text-luxury-charcoal/60">Subtitle</label>
                    <input type="text" required value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="luxury-input" placeholder="A journey through heritage" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] tracking-widest uppercase font-bold text-luxury-charcoal/60">Category</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="luxury-input bg-transparent">
                      <option value="Fashion">Fashion</option>
                      <option value="Heritage">Heritage</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Events">Events</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] tracking-widest uppercase font-bold text-luxury-charcoal/60">Featured Image</label>
                  <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-luxury-platinum/40 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all">
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4">
                        {isUploading ? <Loader2 className="animate-spin text-brand-gold mx-auto" /> : <ImageIcon className="text-luxury-platinum mx-auto mb-2" size={32} />}
                        <p className="text-[8px] uppercase tracking-widest text-luxury-platinum">Click to upload editorial image</p>
                      </div>
                    )}
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] tracking-widest uppercase font-bold text-luxury-charcoal/60">Story Content</label>
                {/* নিরাপদ Textarea ব্যবহার করা হয়েছে */}
                <textarea 
                  required 
                  rows={8} 
                  value={formData.content} 
                  onChange={(e) => setFormData({...formData, content: e.target.value})} 
                  className="w-full border border-luxury-platinum/20 p-5 text-sm font-light leading-relaxed outline-none focus:border-brand-gold bg-gray-50/30 resize-none" 
                  placeholder="Tell your story here..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-4 border-t border-luxury-platinum/10 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 text-[10px] font-bold uppercase tracking-widest">Discard</button>
                <button 
                  type="submit" 
                  disabled={isSaving || isUploading}
                  className="btn-premium flex items-center gap-3 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Publish Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBlogs;