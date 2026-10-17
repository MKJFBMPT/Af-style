import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  ArrowLeft,
  ChevronRight,
  Settings,
  FileText,
  ShieldCheck,
  Zap,
  Ticket // কুপনের জন্য আইকন ইমপোর্ট করা হলো
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // নেভিগেশন মেনু আইটেমসমূহ
  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Inventory', path: '/admin/products', icon: <Package size={18} /> },
    { label: 'Acquisitions', path: '/admin/orders', icon: <ShoppingBag size={18} /> },
    { label: 'Customers', path: '/admin/customers', icon: <Users size={18} /> },
    { label: 'Maison Journal', path: '/admin/blogs', icon: <FileText size={18} /> },
    { label: 'Promotions', path: '/admin/coupons', icon: <Ticket size={18} /> }, // কুপন লিঙ্ক যুক্ত করা হলো
    { label: 'Legal & Policies', path: '/admin/legal-pages', icon: <ShieldCheck size={18} /> },
    { label: 'Master Control', path: '/admin/master-control', icon: <Zap size={18} className="text-brand-gold" /> },
    { label: 'Maison Settings', path: '/admin/settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-brand-dark text-brand-cream hidden lg:flex flex-col z-[60] border-r border-brand-gold/10 shadow-2xl">
      
      {/* অ্যাডমিন ব্র্যান্ডিং */}
      <div className="p-8 border-b border-white/5">
        <h2 className="text-xl font-display italic tracking-[0.2em] uppercase text-white">
          AF <span className="text-brand-gold">Admin</span>
        </h2>
        <p className="text-[8px] tracking-[0.3em] uppercase opacity-40 mt-2">Maison Management</p>
      </div>

      {/* নেভিগেশন লিঙ্কসমূহ */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-4 py-4 transition-all duration-500 group ${
                isActive 
                ? 'bg-brand-gold text-brand-dark font-bold shadow-lg' 
                : 'hover:bg-white/5 text-brand-cream/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      {/* মেইন সাইটে ফেরত যাওয়ার বাটন */}
      <div className="p-6 border-t border-white/5">
        <Link 
          to="/" 
          className="flex items-center gap-3 px-4 py-4 text-[10px] tracking-[0.2em] uppercase text-brand-gold hover:text-white transition-colors border border-brand-gold/20 hover:border-white"
        >
          <ArrowLeft size={16} />
          <span>Exit to Maison</span>
        </Link>
      </div>

    </aside>
  );
};

export default AdminSidebar;