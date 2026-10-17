import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  ShoppingBag, Users, Loader2, RefreshCcw, 
  Package, DollarSign, TrendingUp, Clock, CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';

// Firebase
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../services/firebase';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const ordersSnap = await getDocs(collection(db, 'orders'));
      let totalRev = 0;
      ordersSnap.forEach(doc => {
        const data = doc.data();
        totalRev += data.pricing?.total || 0;
      });

      const productsSnap = await getDocs(collection(db, 'products'));
      const usersSnap = await getDocs(collection(db, 'users'));

      const q = query(collection(db, 'orders'), orderBy('orderDate', 'desc'), limit(4));
      const recentSnap = await getDocs(q);
      const recentList: any[] = [];
      recentSnap.forEach(doc => {
        recentList.push({ id: doc.id, ...doc.data() });
      });

      setStats({
        revenue: totalRev,
        orders: ordersSnap.size,
        products: productsSnap.size,
        customers: usersSnap.size
      });
      setRecentOrders(recentList);

    } catch (error) {
      console.error("Error syncing data:", error);
      toast.error("Failed to sync live data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statsCards = [
    { label: 'Total Revenue', value: `৳${stats.revenue.toLocaleString()}`, icon: <TrendingUp size={20} />, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Total Orders', value: stats.orders.toString(), icon: <ShoppingBag size={20} />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Pieces', value: stats.products.toString(), icon: <Package size={20} />, color: 'bg-amber-50 text-amber-600' },
    { label: 'Customer Base', value: stats.customers.toString(), icon: <Users size={20} />, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-10">
      <Helmet><title>Dashboard | AF STYLE Admin</title></Helmet>

      <div className="luxury-container">
        <div className="flex justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-2xl font-serif italic text-luxury-charcoal">Maison Intelligence</h1>
            <p className="text-[10px] tracking-[0.2em] uppercase text-luxury-platinum mt-1">Real-time Performance Analytics</p>
          </div>
          <button onClick={fetchDashboardData} disabled={isLoading} className="flex items-center gap-2 bg-white border border-luxury-platinum/30 px-6 py-2.5 text-[10px] font-bold tracking-widest uppercase hover:bg-gray-100 transition-all">
            <RefreshCcw size={14} className={isLoading ? 'animate-spin' : ''} /> Sync Data
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white p-8 border border-luxury-platinum/10 shadow-sm animate-fade-in">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-6`}>{stat.icon}</div>
              <p className="text-[9px] tracking-[0.3em] uppercase text-luxury-platinum font-bold mb-1">{stat.label}</p>
              <h3 className="text-3xl font-medium text-luxury-charcoal leading-none">{isLoading ? '...' : stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white border border-luxury-platinum/10 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-luxury-platinum/5 bg-gray-50/50">
              <h3 className="text-[10px] tracking-[0.2em] uppercase font-bold">Recent Acquisitions</h3>
            </div>
            {isLoading ? (
               <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-brand-gold" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 text-[8px] tracking-[0.2em] uppercase text-luxury-platinum font-bold">
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-luxury-platinum/5">
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 text-[10px] font-bold uppercase">#{order.id.slice(0, 8)}</td>
                        <td className="px-6 py-4 text-[11px] text-luxury-charcoal/80">{order.customerName}</td>
                        {/* টাকা ৳ আপডেট করা হলো */}
                        <td className="px-6 py-4 text-[11px] font-bold">৳{order.pricing?.total?.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-gold/10 text-brand-gold'}`}>{order.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-brand-dark text-brand-cream p-8 shadow-2xl relative overflow-hidden">
            <h3 className="text-[10px] tracking-[0.3em] uppercase font-bold mb-10 text-brand-gold">Maison Activity</h3>
            <div className="space-y-10">
              <div className="flex gap-4"><Clock size={14} className="text-brand-gold shrink-0" /><div><p className="text-[11px] leading-relaxed opacity-80">Inventory sync completed.</p></div></div>
              <div className="flex gap-4"><CheckCircle2 size={14} className="text-brand-gold shrink-0" /><div><p className="text-[11px] leading-relaxed opacity-80">Security protocols optimized.</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;