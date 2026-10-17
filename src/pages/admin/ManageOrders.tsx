import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Search, Eye, Trash2, Loader2, Truck, CreditCard, 
  Smartphone, Coins, MapPin, X, Package, User, Mail, Phone, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

// Firebase
import { collection, getDocs, updateDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface Order {
  id: string;
  customerName: string;
  email: string;
  shippingAddress: {
    address: string;
    city: string;
    phone: string;
  };
  items: any[];
  pricing: {
    subtotal: number;
    shipping: number;
    total: number;
  };
  paymentMethod: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: any;
}

const ManageOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('orderDate', 'desc'));
      const querySnapshot = await getDocs(q);
      const ordersList: Order[] = [];
      querySnapshot.forEach((doc) => {
        ordersList.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(ordersList);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load acquisitions.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus as any } : order));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any });
      }
      toast.success(`Acquisition status: ${newStatus}`);
    } catch (error) {
      toast.error("Status update failed.");
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (window.confirm("Delete this permanent record?")) {
      try {
        await deleteDoc(doc(db, 'orders', id));
        setOrders(orders.filter(order => order.id !== id));
        setSelectedOrder(null);
        toast.success("Record deleted.");
      } catch (error) {
        toast.error("Action failed.");
      }
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'mobile': return <Smartphone size={14} className="text-pink-500" />;
      case 'card': return <CreditCard size={14} className="text-blue-500" />;
      case 'crypto': return <Coins size={14} className="text-orange-500" />;
      default: return <Truck size={14} className="text-gray-500" />;
    }
  };

  const filteredOrders = orders.filter(order => 
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.shippingAddress.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-10">
      <Helmet><title>Acquisitions | AF STYLE Admin</title></Helmet>

      <div className="luxury-container">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-serif italic text-luxury-charcoal">Acquisition Intelligence</h1>
            <p className="text-[10px] tracking-[0.2em] uppercase text-luxury-platinum mt-1">Maison Sales Registry</p>
          </div>
          <button onClick={fetchOrders} className="bg-white border border-luxury-platinum/30 px-6 py-2 text-[10px] font-bold tracking-widest uppercase hover:bg-gray-100 transition-all">
            Refresh
          </button>
        </div>

        <div className="bg-white border border-luxury-platinum/20 p-4 mb-6 shadow-sm">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-platinum" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, ID or phone..." 
              className="w-full bg-gray-50 border-none py-2.5 pl-10 pr-4 text-xs tracking-wider outline-none focus:ring-1 focus:ring-brand-gold/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* --- Orders Table --- */}
        <div className="bg-white border border-luxury-platinum/20 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="py-40 flex justify-center"><Loader2 className="animate-spin text-brand-gold" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-[9px] tracking-[0.2em] uppercase text-luxury-platinum font-bold">
                    <th className="px-6 py-5">Acquisition</th>
                    <th className="px-6 py-5">Customer & Location</th>
                    <th className="px-6 py-5">Payment</th>
                    <th className="px-6 py-5">Total Value</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxury-platinum/10">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedOrder(order)}>
                      <td className="px-6 py-4 text-luxury-charcoal">
                        <p className="text-[10px] font-bold uppercase tracking-widest">#{order.id.slice(0, 8)}</p>
                        <p className="text-[9px] opacity-40 mt-1 uppercase">{order.orderDate?.toDate().toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[11px] font-bold text-luxury-charcoal">{order.customerName}</p>
                        <div className="flex items-center gap-1 mt-1 opacity-60">
                           <MapPin size={10} className="text-brand-gold" />
                           <p className="text-[9px] uppercase italic">{order.shippingAddress.city}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getPaymentIcon(order.paymentMethod)}
                          <span className="text-[9px] font-bold tracking-widest uppercase opacity-60">{order.paymentMethod === 'mobile' ? 'bKash/Nagad' : order.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {/* টাকা ৳ চিহ্ন যুক্ত করা হলো */}
                        <p className="text-[11px] font-bold text-brand-dark">৳{order.pricing.total.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[8px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-gold/10 text-brand-gold'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setSelectedOrder(order)} className="p-2 hover:text-brand-gold transition-colors"><Eye size={16} /></button>
                          <button onClick={() => handleDeleteOrder(order.id)} className="p-2 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* --- Details Modal --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white w-full max-w-5xl max-h-[90vh] shadow-2xl animate-slide-up overflow-hidden flex flex-col">
            
            <div className="p-6 border-b border-luxury-platinum/10 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-luxury-charcoal">Acquisition Intelligence</h2>
                <p className="text-[9px] text-luxury-platinum mt-1 uppercase font-medium">Record ID: {selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white transition-colors"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* 1. Client & Logistics */}
                <div className="lg:col-span-1 space-y-10">
                  <section>
                    <h3 className="text-[9px] font-bold tracking-widest uppercase text-brand-gold mb-6 border-b border-brand-gold/10 pb-2">Client Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <User size={14} className="text-luxury-platinum mt-0.5" />
                        <div><p className="text-[9px] text-luxury-platinum uppercase">Name</p><p className="text-xs font-bold">{selectedOrder.customerName}</p></div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Phone size={14} className="text-luxury-platinum mt-0.5" />
                        <div><p className="text-[9px] text-luxury-platinum uppercase">Contact</p><p className="text-xs font-bold">{selectedOrder.shippingAddress.phone}</p></div>
                      </div>
                      <div className="flex items-start gap-4">
                        <MapPin size={14} className="text-luxury-platinum mt-0.5" />
                        <div><p className="text-[9px] text-luxury-platinum uppercase">Destination</p><p className="text-xs font-bold italic">{selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}</p></div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-[9px] font-bold tracking-widest uppercase text-brand-gold mb-6 border-b border-brand-gold/10 pb-2">Logistics Control</h3>
                    <select 
                      value={selectedOrder.status}
                      onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                      className="w-full bg-brand-cream/5 border border-luxury-platinum/20 p-3 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-brand-gold"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </section>
                </div>

                {/* 2. Curated Pieces */}
                <div className="lg:col-span-2 space-y-10">
                  <section>
                    <h3 className="text-[9px] font-bold tracking-widest uppercase text-brand-gold mb-6 border-b border-brand-gold/10 pb-2">Curated Pieces ({selectedOrder.items.length})</h3>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-6 p-4 border border-luxury-platinum/5 bg-gray-50/50">
                          <img src={item.image} alt="" className="w-16 aspect-[3/4] object-cover bg-luxury-platinum" />
                          <div className="flex-1 flex flex-col justify-center">
                            <p className="text-xs font-serif italic text-luxury-charcoal mb-1">{item.name}</p>
                            <p className="text-[9px] uppercase tracking-widest opacity-50">{item.size} / {item.color} x {item.quantity}</p>
                            <p className="text-[11px] font-bold mt-3 text-brand-dark">৳{item.price.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* 3. Final Value */}
                  <section className="bg-brand-dark text-brand-cream p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                      <p className="text-[9px] uppercase tracking-widest font-bold opacity-60">Settlement: {selectedOrder.paymentMethod}</p>
                      <p className="text-[9px] uppercase tracking-widest font-bold opacity-60">{selectedOrder.orderDate?.toDate().toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-3 text-[10px] uppercase tracking-widest opacity-60">
                      <div className="flex justify-between"><span>Subtotal</span> <span>৳{selectedOrder.pricing.subtotal.toLocaleString()}</span></div>
                      <div className="flex justify-between text-emerald-400"><span>Reward Applied</span> <span>-৳{selectedOrder.pricing.discountAmount?.toLocaleString() || 0}</span></div>
                      <div className="flex justify-between"><span>Logistics</span> <span>{selectedOrder.pricing.shipping === 0 ? 'Complimentary' : `৳${selectedOrder.pricing.shipping}`}</span></div>
                    </div>
                    <div className="flex justify-between items-end mt-10">
                      <p className="text-xs font-bold uppercase tracking-[0.4em]">Acquisition Value</p>
                      <p className="text-4xl font-serif italic text-brand-gold">৳{selectedOrder.pricing.total.toLocaleString()}</p>
                    </div>
                  </section>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;