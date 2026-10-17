import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <Helmet>
        <title>Privacy Policy | AF STYLE Luxury Maison</title>
        <meta name="description" content="Read the privacy policy of AF STYLE to understand how we protect your data." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-luxury-platinum mb-12">
          <Link to="/" className="hover:text-luxury-charcoal transition-colors">Home</Link>
          <ChevronRight size={10} />
          <span className="text-luxury-charcoal font-bold">Privacy Policy</span>
        </nav>

        {/* Page Header */}
        <div className="border-b border-luxury-platinum/20 pb-12 mb-12">
          <p className="text-[10px] tracking-[0.4em] uppercase text-brand-gold mb-4">Legal Information</p>
          <h1 className="text-4xl md:text-5xl font-serif italic text-luxury-charcoal mb-6">Privacy Policy</h1>
          <p className="text-[10px] tracking-widest uppercase text-luxury-platinum">Last Updated: May 2026</p>
        </div>

        {/* Policy Content */}
        <div className="space-y-12 text-luxury-charcoal/80 font-light leading-relaxed">
          
          <section>
            <h2 className="text-xl font-serif italic text-luxury-charcoal mb-4">1. Introduction to Our Maison</h2>
            <p className="text-sm">
              At AF STYLE ("we," "our," or "us"), we are committed to protecting the privacy and security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you visit our website, purchase our luxury pieces, or interact with our boutique services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-luxury-charcoal mb-4">2. Information We Curate</h2>
            <p className="text-sm mb-4">
              To provide you with an unparalleled shopping experience, we may collect the following information:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li><strong>Personal Identity:</strong> Your name, email address, phone number, and billing/shipping addresses.</li>
              <li><strong>Transaction Details:</strong> Payment information, order history, and preferences.</li>
              <li><strong>Digital Footprint:</strong> IP address, browser type, device information, and interaction with our platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-luxury-charcoal mb-4">3. How We Use Your Information</h2>
            <p className="text-sm mb-4">
              The information we collect is exclusively used to elevate your experience with our brand:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>To process your orders securely and deliver your pieces promptly.</li>
              <li>To personalize your digital boutique experience.</li>
              <li>To invite you to private sales, exclusive events, and share our latest collections (only with your consent).</li>
              <li>To improve our digital platform and customer concierge services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-luxury-charcoal mb-4">4. Data Protection & Security</h2>
            <p className="text-sm">
              We employ enterprise-grade, state-of-the-art security measures to protect your personal information from unauthorized access. Our payment gateways use strict encryption protocols to ensure that your financial data remains completely confidential.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-luxury-charcoal mb-4">5. Your Rights & Choices</h2>
            <p className="text-sm">
              As a valued client, you hold complete authority over your data. You may request access to, correction of, or deletion of your personal information at any time. You may also unsubscribe from our exclusive newsletters via the link provided in our emails or by contacting our concierge.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-luxury-charcoal mb-4">6. Contact Our Concierge</h2>
            <p className="text-sm">
              If you have any questions or concerns regarding this Privacy Policy, please contact our dedicated client services team:
            </p>
            <div className="mt-4 p-6 bg-gray-50 border border-luxury-platinum/20">
              <p className="text-sm font-medium">Email: <a href="mailto:privacy@afstyle.com" className="text-brand-gold hover:underline">privacy@afstyle.com</a></p>
              <p className="text-sm font-medium mt-2">Address: AF STYLE Luxury Headquarters, Dhaka, Bangladesh.</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;