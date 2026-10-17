import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import BottomNav from '../components/layout/BottomNav'; // নতুন বটম নেভ ইমপোর্ট

const MainLayout: React.FC = () => {
  const { pathname } = useLocation();

  // প্রতিবার পেজ পরিবর্তনের সময় স্মুথলি ওপর থেকে শুরু হওয়ার জন্য
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen selection:bg-brand-gold/30 selection:text-brand-dark">
      {/* ১. গ্লোবাল লাক্সারি হেডার */}
      <Header />

      {/* ২. মূল কন্টেন্ট এরিয়া */}
      <main className="flex-grow pb-16 lg:pb-0"> 
        {/* নোট: মোবাইলে বটম নেভের জন্য ১৬ পিক্সেল প্যাডিং দেওয়া হয়েছে */}
        <Outlet />
      </main>

      {/* ৩. মোবাইল ফিক্সড বটম নেভিগেশন (শুধুমাত্র মোবাইলে দেখা যাবে) */}
      <BottomNav />

      {/* ৪. গ্লোবাল লাক্সারি ফুটার */}
      <Footer />

      {/* ৫. আইফোন বা আধুনিক ফোনের সেফ এরিয়া প্যাডিং */}
      <div className="h-[env(safe-area-inset-bottom)] bg-brand-dark" />
    </div>
  );
};

export default MainLayout;