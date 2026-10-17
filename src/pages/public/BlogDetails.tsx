import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Share2, Loader2, Link2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Firebase
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

// Components & SEO
import SEO from '../../components/common/SEO'; // এসইও ইঞ্জিন ইমপোর্ট

// Stores
import useLanguageStore from '../../store/useLanguageStore';

interface Blog {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  content: string;
  category: string;
  createdAt: any;
}

const BlogDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguageStore();

  useEffect(() => {
    const fetchBlogDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const docRef = doc(db, 'blogs', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setBlog({ id: docSnap.id, ...docSnap.data() } as Blog);
        } else {
          toast.error("Story not found.");
        }
      } catch (error) {
        console.error("Error fetching blog details:", error);
        toast.error("Failed to load the story.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success(language === 'en' ? "Link copied to clipboard." : "লিঙ্ক কপি করা হয়েছে।");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brand-gold mb-4" size={32} />
        <p className="font-serif italic text-luxury-charcoal/40 tracking-widest text-lg uppercase">Curating story...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20 flex flex-col items-center justify-center text-center">
        <h2 className="text-4xl font-serif italic text-luxury-charcoal mb-4">Story Not Found</h2>
        <Link to="/journal" className="btn-premium">Return to Journal</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      {/* --- DYNAMIC SEO FOR BLOG --- */}
      <SEO 
        title={blog.title}
        description={blog.subtitle}
        image={blog.image}
        type="article"
      />

      <div className="luxury-container max-w-4xl mx-auto">
        
        {/* Navigation */}
        <Link 
          to="/journal" 
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-luxury-platinum hover:text-brand-gold transition-colors mb-12"
        >
          <ChevronLeft size={14} /> Back to Journal
        </Link>

        {/* Article Header */}
        <header className="text-center mb-16 animate-slide-down">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-brand-gold bg-brand-gold/10 px-3 py-1">
              {blog.category}
            </span>
            <span className="text-[10px] tracking-widest uppercase text-luxury-platinum font-medium">
              {blog.createdAt?.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-serif italic text-luxury-charcoal mb-8 leading-tight">
            {blog.title}
          </h1>
          <p className="text-sm md:text-base font-light tracking-[0.2em] text-luxury-charcoal/60 uppercase max-w-2xl mx-auto">
            {blog.subtitle}
          </p>
        </header>

      </div>

      {/* Featured Image (Full Width Cinematic) */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 animate-fade-in">
        <div className="relative aspect-video w-full bg-luxury-platinum overflow-hidden shadow-2xl">
          <img 
            src={blog.image} 
            alt={blog.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-dark/5" />
        </div>
      </div>

      {/* Article Content */}
      <div className="luxury-container max-w-3xl mx-auto">
        <article className="prose prose-lg md:prose-xl max-w-none text-luxury-charcoal font-light leading-[2] whitespace-pre-wrap animate-slide-up">
          {/* Magazine style Drop Cap */}
          <p className="first-letter:text-7xl first-letter:font-serif first-letter:italic first-letter:text-brand-gold first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8] mb-8">
            {blog.content}
          </p>
        </article>

        {/* Article Footer & Share */}
        <div className="mt-24 pt-12 border-t border-luxury-platinum/20 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-luxury-charcoal/40 font-bold mb-1">Maison Journal Editorial</p>
            <p className="text-[10px] tracking-[0.1em] uppercase text-brand-gold italic">Handcrafted Storytelling</p>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-[9px] tracking-[0.3em] uppercase text-luxury-platinum font-bold">Share Narrative:</span>
            <div className="flex items-center gap-4">
              {/* Facebook Icon (Safe SVG) */}
              <button className="text-luxury-charcoal/40 hover:text-brand-gold transition-all transform hover:-translate-y-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </button>
              {/* Twitter Icon (Safe SVG) */}
              <button className="text-luxury-charcoal/40 hover:text-brand-gold transition-all transform hover:-translate-y-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-1 2.17-2 2.51c.01.03.01.07.01.1 0 2.67-2.33 4.83-5.21 4.83-1.4 0-2.67-.52-3.64-1.39A6.01 6.01 0 0 1 6 12.6c-1.34 0-2.6-.45-3.6-1.22 1.34 0 2.6-.45 3.6-1.22A6 6 0 0 1 2 4.41C2.96 4.96 4.09 5.3 5.3 5.34A6 6 0 0 1 7.23 2.05c1.1-.33 2.27-.08 3.16.64.9-.17 1.76-.5 2.54-.97a3.02 3.02 0 0 1-1.33 1.66c.8-.1 1.57-.3 2.3-.61a6.05 6.01 0 0 1-2.14 1.83z"></path></svg>
              </button>
              {/* Copy Link Icon */}
              <button onClick={handleShare} className="text-luxury-charcoal/40 hover:text-brand-gold transition-all transform hover:-translate-y-1">
                <Link2 size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlogDetails;