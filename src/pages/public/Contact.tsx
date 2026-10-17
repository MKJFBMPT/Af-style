import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, ArrowRight, Send, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // কন্টাক্ট ফর্ম লজিক (সিমুলেশন)
    setTimeout(() => {
      toast.success('Your message has been sent to our concierge.');
      setIsLoading(false);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <Helmet>
        <title>Contact Concierge | AF STYLE Luxury Maison</title>
        <meta name="description" content="Get in touch with the AF STYLE luxury concierge for inquiries and assistance." />
      </Helmet>

      {/* 1. Page Header */}
      <section className="py-24 bg-gray-50 border-b border-luxury-platinum/10">
        <div className="luxury-container text-center">
          <p className="text-[10px] tracking-[0.5em] uppercase text-brand-gold mb-4 animate-slide-down">Client Services</p>
          <h1 className="text-4xl md:text-6xl font-serif italic text-luxury-charcoal mb-6">Contact Us</h1>
          <div className="w-16 h-[1px] bg-brand-gold mx-auto" />
        </div>
      </section>

      {/* 2. Main Contact Section */}
      <section className="py-32">
        <div className="luxury-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            
            {/* Left: Contact Information (5 Columns) */}
            <div className="lg:col-span-5 space-y-16">
              <div>
                <h2 className="text-[10px] tracking-[0.4em] uppercase font-bold text-luxury-charcoal mb-10">Maison Headquarters</h2>
                <div className="space-y-8">
                  <div className="flex gap-6 items-start">
                    <div className="w-10 h-10 bg-brand-cream/20 flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-brand-gold" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-widest uppercase font-bold mb-2">Visit Us</p>
                      <p className="text-sm font-light text-luxury-charcoal/70 leading-relaxed">
                        AF STYLE Tower, Gulshan Avenue<br />
                        Dhaka 1212, Bangladesh
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6 items-start">
                    <div className="w-10 h-10 bg-brand-cream/20 flex items-center justify-center shrink-0">
                      <Mail size={18} className="text-brand-gold" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-widest uppercase font-bold mb-2">Email Inquiries</p>
                      <p className="text-sm font-light text-luxury-charcoal/70">concierge@afstyle.com</p>
                    </div>
                  </div>

                  <div className="flex gap-6 items-start">
                    <div className="w-10 h-10 bg-brand-cream/20 flex items-center justify-center shrink-0">
                      <Phone size={18} className="text-brand-gold" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-widest uppercase font-bold mb-2">Private Assistance</p>
                      <p className="text-sm font-light text-luxury-charcoal/70">+880 1234 567890</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border border-brand-gold/10 bg-brand-cream/5">
                <div className="flex items-center gap-4 mb-6">
                  <Clock size={18} className="text-brand-gold" />
                  <h3 className="text-[10px] tracking-[0.3em] uppercase font-bold">Boutique Hours</h3>
                </div>
                <div className="space-y-3 text-xs font-light text-luxury-charcoal/70 uppercase tracking-widest">
                  <div className="flex justify-between"><span>Mon - Thu</span> <span>10:00 - 20:00</span></div>
                  <div className="flex justify-between"><span>Fri - Sat</span> <span>11:00 - 22:00</span></div>
                  <div className="flex justify-between text-brand-gold font-bold"><span>Sunday</span> <span>Closed</span></div>
                </div>
              </div>
            </div>

            {/* Right: Contact Form (7 Columns) */}
            <div className="lg:col-span-7 bg-white p-8 md:p-12 border border-luxury-platinum/20 shadow-sm">
              <h2 className="text-[10px] tracking-[0.4em] uppercase font-bold text-luxury-charcoal mb-10 text-center lg:text-left">Send an Inquiry</h2>
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <label className="text-[9px] tracking-widest uppercase text-luxury-platinum font-bold">Full Name</label>
                    <input type="text" required className="luxury-input" placeholder="Enter your name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] tracking-widest uppercase text-luxury-platinum font-bold">Email Address</label>
                    <input type="email" required className="luxury-input" placeholder="email@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] tracking-widest uppercase text-luxury-platinum font-bold">Subject</label>
                  <select className="luxury-input bg-transparent cursor-pointer">
                    <option>General Inquiry</option>
                    <option>Order Assistance</option>
                    <option>Private Viewing</option>
                    <option>Heritage Inquiry</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] tracking-widest uppercase text-luxury-platinum font-bold">Message</label>
                  <textarea required rows={4} className="luxury-input resize-none" placeholder="How can our concierge assist you today?"></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="btn-premium w-full flex items-center justify-center gap-4 group disabled:opacity-50"
                >
                  {isLoading ? 'Sending Inquiry...' : 'Submit Inquiry'}
                  <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Map Placeholder */}
      <section className="h-[400px] w-full bg-gray-100 relative grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[10px] tracking-[0.5em] uppercase text-luxury-charcoal font-bold">Interactive Map Experience</p>
        </div>
      </section>
    </div>
  );
};

export default Contact;