import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Check, Printer, Trophy, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

// PDF Generation Libraries
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Firebase
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

// Stores
import useLanguageStore from '../../store/useLanguageStore';
import useSiteConfigStore from '../../store/useSiteConfigStore';

const OrderSuccess: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguageStore();
  const { config } = useSiteConfigStore();

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'orders', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
    window.scrollTo(0, 0);
  }, [id]);

  // --- সরাসরি PDF ডাউনলোড লজিক (Chrome Optimized) ---
  const handleDownloadPDF = async () => {
    if (!invoiceRef.current || !order) return;

    try {
      setIsDownloading(true);

      const element = invoiceRef.current;
      
      // ক্রোম ব্রাউজারের জন্য ইমেজ রেন্ডারিং অপ্টিমাইজেশন
      const canvas = await html2canvas(element, {
        scale: 2, // মোবাইল ও পিসির জন্য ব্যালেন্সড কোয়ালিটি
        useCORS: true, 
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: -window.scrollY, // স্ক্রল পজিশন ফিক্স
        onclone: (clonedDoc) => {
          // ক্লোন করা এলিমেন্টে ইমেজগুলো যেন লোড হয় তা নিশ্চিত করা
          const images = clonedDoc.getElementsByTagName('img');
          for (let i = 0; i < images.length; i++) {
            images[i].crossOrigin = "anonymous";
          }
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      
      const fileName = `AF_STYLE_INV_${order.id.slice(0, 8).toUpperCase()}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error("PDF Generation failed:", error);
      alert("Something went wrong. Please try again. If the issue persists, use the Print (Ctrl+P) option.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-brand-gold" size={40} />
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Authenticating Heritage...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-32 pb-20">
      <Helmet>
        <title>Invoice #{order.id.slice(0, 8).toUpperCase()} | AF STYLE</title>
      </Helmet>

      <div className="luxury-container max-w-4xl px-4">
        
        {/* Branding Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-100 shadow-sm">
            <Check size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif italic text-luxury-charcoal mb-4 uppercase tracking-tighter">
            {language === 'en' ? 'Acquisition Secured' : 'অর্ডার সম্পন্ন হয়েছে'}
          </h1>
          <p className="text-[11px] tracking-[0.5em] uppercase text-luxury-charcoal/40 font-bold">
            Order Ref: #{order.id.slice(0, 8).toUpperCase()}
          </p>
        </motion.div>

        {/* --- ACTUAL INVOICE AREA --- */}
        <div
          ref={invoiceRef}
          id="invoice-container"
          className="bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] border border-luxury-platinum/10 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#111111] p-12 flex flex-col md:flex-row justify-between items-center gap-8 border-b-4 border-[#C89B6D]">
            <div className="text-center md:text-left">
              {config.logoUrl ? (
                <img
                  src={config.logoUrl}
                  alt="AF STYLE"
                  className="h-12 mb-4 mx-auto md:mx-0 object-contain"
                  crossOrigin="anonymous"
                />
              ) : (
                <h2 className="text-3xl font-serif italic text-white uppercase mb-2">{config.logoText}</h2>
              )}
              <p className="text-[9px] tracking-[0.4em] uppercase text-[#C89B6D] font-bold opacity-80">Digital Boutique Receipt</p>
            </div>
            
            <div className="text-center md:text-right">
              <div className="bg-[#C89B6D10] border border-[#C89B6D30] px-8 py-3 mb-2">
                <p className="text-[9px] font-bold text-[#C89B6D] uppercase tracking-widest mb-1">Receipt No</p>
                <p className="text-sm font-display italic text-white uppercase">#{order.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <p className="text-[10px] text-white opacity-40 uppercase font-bold tracking-widest">
                {new Date(order.orderDate?.toDate()).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="p-12">
            {/* Identity Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 border-b border-gray-100 pb-12">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#C89B6D]">Client Identity</h4>
                <div>
                  <p className="text-sm font-bold text-gray-900 uppercase">{order.customerName}</p>
                  <p className="text-[11px] text-gray-500 mt-1 font-medium">{order.email}</p>
                  <p className="text-[11px] text-gray-500 font-medium">{order.shippingAddress.phone}</p>
                </div>
              </div>

              <div className="md:text-right space-y-4">
                <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#C89B6D]">Destination</h4>
                <div>
                  <p className="text-[11px] text-gray-700 leading-relaxed uppercase italic font-bold">
                    {order.shippingAddress.address}<br />
                    {order.shippingAddress.city}, Bangladesh
                  </p>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="mb-12">
              <div className="grid grid-cols-12 gap-4 border-b border-gray-200 pb-3 mb-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <div className="col-span-8">Curated Piece</div>
                <div className="col-span-4 text-right">Value (৳)</div>
              </div>
              
              <div className="space-y-8">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-8 flex gap-6">
                      <img
                        src={item.image}
                        alt=""
                        className="w-16 aspect-[3/4] object-cover border border-gray-100"
                        crossOrigin="anonymous"
                      />
                      <div className="flex flex-col justify-center">
                        <p className="text-sm font-serif font-bold text-gray-900 tracking-tight">{item.name}</p>
                        <p className="text-[9px] uppercase tracking-widest text-gray-400 mt-2 font-bold">
                          Size: {item.size} / {item.color} <span className="mx-2 text-gray-200">•</span> Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-4 text-right text-sm font-bold text-gray-900">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Loyalty & Summary */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 mt-16 pt-10 border-t border-gray-100">
              <div className="w-full md:max-w-sm">
                <div className="bg-[#F9F7F5] border-l-4 border-[#C89B6D] p-6">
                  <div className="flex items-center gap-3 mb-3 text-[#C89B6D]">
                    <Trophy size={16} />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Heritage Loyalty Reward</p>
                  </div>
                  {/* English Version */}
                  <p className="text-[10px] leading-relaxed text-gray-500 uppercase font-bold opacity-70 mb-4">
                    Your acquisition has been recorded. Collect 4 unique receipt IDs to secure a secret 15-31% discount on your next visit.
                  </p>
                  {/* Bengali Version - As requested by user */}
                  <p className="text-[11px] leading-relaxed text-gray-700 font-medium italic">
                    আপনাকে ধন্যবাদ AF STYLE থেকে কেনাকাটা করার জন্য। আমরা আপনাদের জন্য একটি Loyalty Program অ্যারেঞ্জ করেছি যেখানে আপনারা যদি যেকোনো ৪ টা ইনভয়েস এর কোড আমাদের দিতে পারেন তাহলে আপনাদের জন্য ১৫-৩১% (আর কোনো কোনো ক্ষেত্রে ৭৫% পর্যন্ত) অফ থাকবে যেকোনো প্রোডাক্ট এর উপর।
                  </p>
                </div>
              </div>

              <div className="w-full md:w-64 space-y-3">
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>৳{order.pricing.subtotal.toLocaleString()}</span>
                </div>
                
                {order.pricing.totalDiscountAmount > 0 && (
                  <div className="flex justify-between text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                    <span>Benefit Applied</span>
                    <span>-৳{order.pricing.totalDiscountAmount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>Logistics</span>
                  <span>{order.pricing.shipping === 0 ? 'Complimentary' : `৳${order.pricing.shipping}`}</span>
                </div>
                
                <div className="flex justify-between items-end pt-6 border-t border-gray-200">
                  <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-900">Total Value</span>
                  <span className="text-3xl font-serif italic text-gray-900">৳{order.pricing.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-20 text-center pt-10">
               <p className="text-base font-serif italic text-gray-700 mb-2 leading-none">Thank you for being part of our heritage.</p>
               <p className="text-[9px] tracking-[0.5em] uppercase text-gray-400 font-bold">AF STYLE Maison • Dhaka</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-16 flex flex-col items-center gap-8">
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="group bg-[#111111] text-white flex items-center justify-center gap-4 px-16 py-5 shadow-2xl transition-all hover:bg-brand-gold disabled:opacity-70 active:scale-95 w-full md:w-auto"
          >
            {isDownloading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Curating PDF...</span>
              </>
            ) : (
              <>
                <Printer size={20} className="transition-transform group-hover:scale-110" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                  {language === 'en' ? 'Download Official Receipt (PDF)' : 'অফিসিয়াল রশিদ ডাউনলোড করুন (PDF)'}
                </span>
              </>
            )}
          </button>

          <Link
            to="/"
            className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 hover:text-brand-gold transition-colors"
          >
            <ArrowLeft size={14} />
            Return to Boutique Maison
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;