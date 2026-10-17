import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Star, ShieldCheck, Globe } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pt-20">
      <Helmet>
        <title>Our Heritage | AF STYLE Luxury Maison</title>
        <meta name="description" content="Discover the story, craftsmanship, and excellence behind AF STYLE." />
      </Helmet>

      {/* 1. Cinematic Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Workshop" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-dark/40" />
        <div className="relative text-center text-white px-4">
          <p className="text-[10px] tracking-[0.5em] uppercase mb-4 animate-slide-down">Since 2024</p>
          <h1 className="text-5xl md:text-7xl font-serif italic mb-6">The Maison's Story</h1>
          <div className="w-16 h-[1px] bg-brand-gold mx-auto" />
        </div>
      </section>

      {/* 2. Philosophy Section */}
      <section className="py-32 luxury-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-[10px] tracking-[0.4em] uppercase text-brand-gold mb-8">Our Essence</h2>
            <h3 className="text-3xl md:text-5xl font-serif italic leading-tight text-luxury-charcoal mb-8">
              Crafting Excellence for the <br /> Timeless Soul.
            </h3>
            <div className="space-y-6 text-sm font-light leading-relaxed text-luxury-charcoal/70">
              <p>
                AF STYLE was founded on the principle that fashion is not just about what you wear, but how you present your internal excellence to the world. Our journey began in Dhaka with a vision to redefine luxury for the modern connoisseur.
              </p>
              <p>
                Every stitch, every fabric, and every silhouette is meticulously curated to ensure that we don't just meet global standards—we set them.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/5] bg-luxury-platinum overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop" 
              alt="Craftsmanship" 
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-[3s]"
            />
          </div>
        </div>
      </section>

      {/* 3. Pillars of Excellence */}
      <section className="py-24 bg-gray-50 border-y border-luxury-platinum/10">
        <div className="luxury-container grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="text-center">
            <div className="flex justify-center mb-6 text-brand-gold">
              <Star size={32} strokeWidth={1} />
            </div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-4">Unrivaled Quality</h4>
            <p className="text-[11px] leading-relaxed text-luxury-charcoal/60 uppercase tracking-widest">
              Only the finest materials sourced from the world's most prestigious artisans.
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-6 text-brand-gold">
              <ShieldCheck size={32} strokeWidth={1} />
            </div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-4">Timeless Design</h4>
            <p className="text-[11px] leading-relaxed text-luxury-charcoal/60 uppercase tracking-widest">
              Silhouettes designed to transcend seasons and remain elegant for decades.
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-6 text-brand-gold">
              <Globe size={32} strokeWidth={1} />
            </div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-4">Global Reach</h4>
            <p className="text-[11px] leading-relaxed text-luxury-charcoal/60 uppercase tracking-widest">
              From our flagship boutique in Dhaka to luxury homes across the globe.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Contact Teaser */}
      <section className="py-32 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-serif italic text-3xl mb-8 text-luxury-charcoal">Experience the Excellence Firsthand</h2>
          <p className="text-xs tracking-widest uppercase text-luxury-charcoal/50 mb-12">Visit our boutiques or speak with our concierge.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="btn-premium">Boutique Finder</button>
            <button className="px-10 py-4 border border-luxury-platinum/30 text-[10px] font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors">Contact Concierge</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;