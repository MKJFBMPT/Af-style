import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Loader2, BookOpen } from 'lucide-react';

// Firebase
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
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

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        console.error("Error fetching journal stories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <Helmet>
        <title>Maison Journal | AF STYLE</title>
        <meta name="description" content="Read the latest stories, editorial pieces, and brand heritage from AF STYLE." />
      </Helmet>

      <div className="luxury-container">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-luxury-platinum mb-12">
          <Link to="/" className="hover:text-luxury-charcoal transition-colors">Home</Link>
          <ChevronRight size={10} />
          <span className="text-luxury-charcoal font-bold">Journal</span>
        </nav>

        {/* Page Header */}
        <div className="border-b border-luxury-platinum/20 pb-12 mb-16 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-brand-gold mb-4 animate-slide-down">Editorial Collection</p>
            <h1 className="text-4xl md:text-6xl font-serif italic text-luxury-charcoal animate-slide-up">Maison Journal</h1>
          </div>
          <p className="text-xs font-light tracking-widest uppercase text-luxury-charcoal/50 max-w-sm text-center md:text-right">
            Discover the stories, craftsmanship, and inspirations behind our timeless excellence.
          </p>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="py-40 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-brand-gold mb-4" size={32} />
            <p className="font-serif italic text-luxury-charcoal/40 tracking-widest text-lg">Curating stories...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center border border-dashed border-luxury-platinum/30 bg-gray-50/30">
            <BookOpen size={48} strokeWidth={1} className="text-luxury-platinum mb-6" />
            <h2 className="text-2xl font-serif italic text-luxury-charcoal mb-4">No Stories Published Yet</h2>
            <p className="text-[10px] tracking-[0.2em] uppercase text-luxury-charcoal/40">The journal is awaiting its first entry.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {blogs.map((blog, index) => (
              <article 
                key={blog.id} 
                className="group flex flex-col animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Blog Image */}
                <Link to={`/journal/${blog.id}`} className="relative aspect-[4/5] overflow-hidden bg-luxury-platinum mb-6 block">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur text-luxury-charcoal px-3 py-1 text-[8px] font-bold tracking-[0.2em] uppercase shadow-sm">
                      {blog.category}
                    </span>
                  </div>
                </Link>

                {/* Blog Info */}
                <div className="flex flex-col flex-1">
                  <p className="text-[9px] tracking-widest uppercase text-luxury-platinum mb-3">
                    {blog.createdAt?.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <Link to={`/journal/${blog.id}`} className="group-hover:text-brand-gold transition-colors">
                    <h3 className="text-2xl font-serif italic text-luxury-charcoal mb-3 leading-snug line-clamp-2">
                      {blog.title}
                    </h3>
                  </Link>
                  <p className="text-xs font-light text-luxury-charcoal/70 leading-relaxed mb-6 line-clamp-2 flex-1">
                    {blog.subtitle}
                  </p>
                  
                  <Link 
                    to={`/journal/${blog.id}`} 
                    className="mt-auto inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-brand-dark hover:text-brand-gold transition-colors w-fit border-b border-brand-dark hover:border-brand-gold pb-1"
                  >
                    Read Story <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogList;