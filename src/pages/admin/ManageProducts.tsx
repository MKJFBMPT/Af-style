import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Plus, Search, Edit3, Trash2, ExternalLink, 
  Filter, ChevronLeft, ChevronRight, Loader2 
} from 'lucide-react';
import toast from 'react-hot-toast';

// Firebase
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';

const ManageProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const list: any[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setProducts(list);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load inventory.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Remove "${name}" from the maison?`)) {
      try {
        await deleteDoc(doc(db, 'products', id));
        setProducts(products.filter(p => p.id !== id));
        toast.success('Product removed.');
      } catch (error) {
        toast.error('Failed to delete.');
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-10">
      <Helmet><title>Inventory | AF STYLE Admin</title></Helmet>

      <div className="luxury-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-2xl font-serif italic text-luxury-charcoal">Inventory Management</h1>
            <p className="text-[10px] tracking-[0.2em] uppercase text-luxury-platinum mt-1">Curate your collection</p>
          </div>
          <Link to="/admin/add-product" className="btn-premium flex items-center gap-3">
            <Plus size={16} /> Add New Piece
          </Link>
        </div>

        <div className="bg-white border border-luxury-platinum/20 p-4 mb-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-platinum" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or category..." 
              className="w-full bg-gray-50 border-none py-2.5 pl-10 pr-4 text-xs tracking-wider outline-none focus:ring-1 focus:ring-brand-gold/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white border border-luxury-platinum/20 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="py-40 flex justify-center"><Loader2 className="animate-spin text-brand-gold" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-[9px] tracking-[0.2em] uppercase text-luxury-platinum font-bold">
                    <th className="px-6 py-5">Product Details</th>
                    <th className="px-6 py-5">Category</th>
                    <th className="px-6 py-5">Price</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxury-platinum/10">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-16 bg-gray-100 shrink-0 overflow-hidden shadow-sm">
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-luxury-charcoal uppercase">{product.name}</p>
                            <p className="text-[9px] text-luxury-platinum mt-1 uppercase">ID: {product.id.slice(0,6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[10px] tracking-widest uppercase text-luxury-charcoal/70">{product.category}</td>
                      <td className="px-6 py-4">
                        {/* টাকা ৳ আপডেট করা হলো */}
                        <p className="text-[11px] font-bold text-brand-dark">৳{Number(product.price).toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 hover:text-brand-gold transition-colors"><Edit3 size={16} /></button>
                          <button onClick={() => handleDelete(product.id, product.name)} className="p-2 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                          <Link to={`/product/${product.id}`} className="p-2 hover:text-blue-600 transition-colors"><ExternalLink size={16} /></Link>
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
    </div>
  );
};

export default ManageProducts;