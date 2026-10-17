import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar'; // এটি এখন সঠিক পাথ কারণ তারা একই ফোল্ডারে আছে
import useAuthStore from '../../store/useAuthStore';

const AdminLayout: React.FC = () => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white text-luxury-charcoal">
        <div className="w-10 h-10 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <div className="lg:hidden bg-brand-dark p-4 flex justify-between items-center border-b border-brand-gold/10">
          <h2 className="text-white font-display italic text-lg tracking-widest uppercase">AF Admin</h2>
        </div>
        <div className="flex-1 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;