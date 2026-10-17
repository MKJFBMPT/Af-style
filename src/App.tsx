import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Firebase Config & Stores
import { auth, db } from "./services/firebase"; 
import useAuthStore from './store/useAuthStore';
import useRewardStore from './store/useRewardStore';
import useCartStore from './store/useCartStore';
import useWishlistStore from './store/useWishlistStore';
import useThemeStore from './store/useThemeStore'; // থিম স্টোর ইমপোর্ট

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './components/layout/AdminLayout'; 

// Public Pages
import Home from './pages/public/Home';
import Auth from './pages/auth/Auth';
import Shop from './pages/public/Shop';
import ProductDetails from './pages/public/ProductDetails';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Profile from './pages/public/Profile';
import BlogList from './pages/public/BlogList';
import BlogDetails from './pages/public/BlogDetails';
import Wishlist from './pages/public/Wishlist';
import AIStyleRoom from './pages/public/AIStyleRoom';

// Shopping Pages
import Cart from './pages/shop/Cart';
import Checkout from './pages/shop/Checkout';
import OrderSuccess from './pages/shop/OrderSuccess';

// Legal Pages
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import Terms from './pages/legal/Terms';
import Shipping from './pages/legal/Shipping';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProducts from './pages/admin/ManageProducts';
import AddProduct from './pages/admin/AddProduct';
import ManageOrders from './pages/admin/ManageOrders';
import ManageCustomers from './pages/admin/ManageCustomers';
import MaisonSettings from './pages/admin/MaisonSettings';
import ManageBlogs from './pages/admin/ManageBlogs';
import ManageLegalPages from './pages/admin/ManageLegalPages';
import MasterControl from './pages/admin/MasterControl';
import ManageCoupons from './pages/admin/ManageCoupons';

const App: React.FC = () => {
  const { user, setUser, setLoading, isLoading } = useAuthStore();
  const initUserRewards = useRewardStore((state) => state.initUserRewards);
  const initUserCart = useCartStore((state) => state.initUserCart);
  const initUserWishlist = useWishlistStore((state) => state.initUserWishlist);
  
  // থিম স্টেট নেওয়া হচ্ছে
  const theme = useThemeStore((state) => state.theme);

  // ১. থিম অবজারভার (পুরো ওয়েবসাইটের কালার মোড নিয়ন্ত্রণ করে)
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // ২. অথেনটিকেশন অবজারভার
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        initUserRewards(firebaseUser.uid);
        initUserCart(firebaseUser.uid);
        initUserWishlist(firebaseUser.uid);
        
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: userData.displayName || firebaseUser.displayName,
              photoURL: userData.photoURL || firebaseUser.photoURL,
              role: userData.role || 'user',
            });
          } else {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: 'user',
            });
          }
        } catch (error) {
          console.error("Auth sync error:", error);
          setUser(null);
        }
      } else {
        initUserCart(null);
        initUserWishlist(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading, initUserRewards, initUserCart, initUserWishlist]);

  // প্রিমিয়াম এনিমেটেড লোডিং স্ক্রিন
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-brand-dark transition-colors duration-500">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-display italic tracking-[0.3em] animate-pulse uppercase text-luxury-charcoal dark:text-brand-gold">
            AF Style
          </h1>
          <div className="w-12 h-[1px] bg-brand-gold animate-reveal"></div>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Router>
        <Toaster 
          position="top-center" 
          toastOptions={{
            duration: 4000,
            style: {
              background: theme === 'dark' ? '#C89B6D' : '#1A1A1A',
              color: theme === 'dark' ? '#2B1B12' : '#E8DCCF',
              borderRadius: '0px',
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              border: '1px solid #C89B6D',
              padding: '16px'
            },
          }}
        />

        <Routes>
          {/* --- Public Site (MainLayout) --- */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="auth" element={<Auth />} />
            <Route path="shop" element={<Shop />} />
            <Route path="collections" element={<Shop />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-success/:id" element={<OrderSuccess />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="legal/privacy" element={<PrivacyPolicy />} />
            <Route path="legal/terms" element={<Terms />} />
            <Route path="journal" element={<BlogList />} />
            <Route path="journal/:id" element={<BlogDetails />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="ai-style-room" element={<AIStyleRoom />} />
            
            <Route 
              path="profile" 
              element={user ? <Profile /> : <Navigate to="/auth" />} 
            />
          </Route>

          {/* --- Admin Management System (AdminLayout) --- */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="orders" element={<ManageOrders />} />
            <Route path="customers" element={<ManageCustomers />} />
            <Route path="blogs" element={<ManageBlogs />} />
            <Route path="settings" element={<MaisonSettings />} />
            <Route path="legal-pages" element={<ManageLegalPages />} />
            <Route path="master-control" element={<MasterControl />} />
            <Route path="coupons" element={<ManageCoupons />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
};

export default App;