import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../data/mockProducts';

interface WishlistState {
  activeUserId: string | 'guest';
  wishlists: Record<string, Product[]>; // সব ইউজারের উইশলিস্ট আলাদা সেভ থাকবে
  items: Product[]; // বর্তমান ইউজারের পছন্দের প্রোডাক্টগুলো
  
  // অ্যাকশনসমূহ
  initUserWishlist: (uid: string | null) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      activeUserId: 'guest',
      wishlists: { guest: [] },
      items: [],

      // লগইন বা একাউন্ট পরিবর্তনের সময় উইশলিস্ট সিঙ্ক করা
      initUserWishlist: (uid) => set((state) => {
        const userId = uid || 'guest';
        const userWishlist = state.wishlists[userId] || [];
        return {
          activeUserId: userId,
          items: userWishlist,
          wishlists: { ...state.wishlists, [userId]: userWishlist }
        };
      }),

      // উইশলিস্টে যোগ করা বা বাদ দেওয়া (Toggle)
      toggleWishlist: (product) => set((state) => {
        const userId = state.activeUserId;
        const currentItems = state.items;
        const isExist = currentItems.some((item) => item.id === product.id);

        let updatedItems;
        if (isExist) {
          // যদি আগে থেকেই থাকে তবে রিমুভ করবে
          updatedItems = currentItems.filter((item) => item.id !== product.id);
        } else {
          // না থাকলে যোগ করবে
          updatedItems = [...currentItems, product];
        }

        return {
          items: updatedItems,
          wishlists: { ...state.wishlists, [userId]: updatedItems }
        };
      }),

      // কোনো প্রোডাক্ট উইশলিস্টে আছে কি না চেক করা
      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      // পুরো উইশলিস্ট খালি করা
      clearWishlist: () => set((state) => {
        const userId = state.activeUserId;
        return {
          items: [],
          wishlists: { ...state.wishlists, [userId]: [] }
        };
      }),
    }),
    {
      name: 'af-style-wishlist', // ব্রাউজারে এই নামে ডাটা সেভ থাকবে
    }
  )
);

export default useWishlistStore;