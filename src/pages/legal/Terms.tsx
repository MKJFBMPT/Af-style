import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <Helmet>
        <title>Terms of Use | AF STYLE Luxury Maison</title>
        <meta name="description" content="Read the terms of use for AF STYLE. Discover our guidelines and shopping policies." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-luxury-platinum mb-12">
          <Link to="/" className="hover:text-luxury-charcoal transition-colors">Home</Link>
          <ChevronRight size={10} />
          <span className="text-luxury-charcoal font-bold">Terms of Use</span>
        </nav>

        {/* Page Header */}
        <div className="border-b border-luxury-platinum/20 pb-12 mb-12">
          <p className="text-[10px] tracking-[0.4em] uppercase text-brand-gold mb-4">Legal Information</p>
          <h1 className="text-4xl md:text-5xl font-serif italic text-luxury-charcoal mb-6">Terms of Use</h1>
          <p className="text-[10px] tracking-widest uppercase text-luxury-platinum">Last Updated: May 2026</p>
        </div>

        {/* Terms Content */}
        <div className="space-y-12 text-luxury-charcoal/80 font-light leading-relaxed">
          
          <section>
            <h2 className="text-xl font-serif italic text-luxury-charcoal mb-4">1. Acceptance of Terms</h2>
            <p className="text-sm">
              Welcome to AF STYLE. By accessing or using our digital boutique, you agree to be bound by these Terms of Use. If you do not agree to all the terms and conditions, please do not use our platform. These terms apply to all visitors, users, and others who access our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-luxury-charcoal mb-4">2. Intellectual Property Rights</h2>
            <p className="text-sm mb-4">
              All content present on this website, including but not limited to, typography, design, texts, graphics, logos, images, audio clips, digital downloads, and software, is the exclusive property of AF STYLE and is protected by international copyright laws.
            </p>
            <p className="text-sm">
              You may not reproduce, duplicate, copy, sell, resell, or otherwise exploit any portion of this website without express written consent from our Maison.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-luxury-charcoal mb-4">3. Purchases & Payments</h2>
            <p className="text-sm mb-4">
              When you purchase a piece from our collection, you represent and warrant that:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>All payment information provided is true, correct, and complete.</li>
              <li>You are the person whose name appears on the credit card or payment account.</li>
              <li>You will pay charges incurred by you at the posted prices, including any applicable taxes.</li>
            </ul>
            <p className="text-sm mt-4">
              We reserve the right to refuse or cancel any order if fraud or an unauthorized or illegal transaction is suspected.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-luxury-charcoal mb-4">4. Shipping & Returns</h2>
            <p className="text-sm">
              We take pride in our craftsmanship. If a piece does not meet your expectations, returns are accepted within 30 days of delivery, provided the item is in its original, unworn condition with all AF STYLE tags attached. For details, please consult our dedicated Shipping & Returns guide.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-luxury-charcoal mb-4">5. Limitation of Liability</h2>
            <p className="text-sm">
              To the fullest extent permitted by applicable law, AF STYLE shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-luxury-charcoal mb-4">6. Governing Law</h2>
            <p className="text-sm">
              These terms and conditions are governed by and construed in accordance with the laws of Bangladesh. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Terms;