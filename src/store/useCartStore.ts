import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; 
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartState {
  activeUserId: string | 'guest'; // কার কার্ট সেটি ট্র্যাক করার জন্য
  carts: Record<string, CartItem[]>; // সব ইউজারের কার্ট আলাদা সেভ থাকবে
  items: CartItem[]; // বর্তমান ইউজারের কার্ট আইটেম
  
  initUserCart: (uid: string | null) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getRawTotal: () => number;
  getDiscountedTotal: (discountPercentage: number) => number;
  getTotalItems: () => number;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      activeUserId: 'guest',
      carts: { guest: [] },
      items: [],

      // লগইন/লগআউট করার সময় কার্ট পরিবর্তন হবে
      initUserCart: (uid) => set((state) => {
        const userId = uid || 'guest';
        const userCart = state.carts[userId] || [];
        return {
          activeUserId: userId,
          items: userCart, // শুধুমাত্র বর্তমান ইউজারের প্রোডাক্ট দেখাবে
          carts: { ...state.carts, [userId]: userCart }
        };
      }),

      addItem: (newItem) => set((state) => {
        const userId = state.activeUserId;
        const currentItems = state.items;
        const existingIndex = currentItems.findIndex((item) => item.id === newItem.id);
        
        let updatedItems;
        if (existingIndex !== -1) {
          updatedItems = [...currentItems];
          updatedItems[existingIndex].quantity += newItem.quantity;
        } else {
          updatedItems = [...currentItems, newItem];
        }

        return { 
          items: updatedItems, 
          carts: { ...state.carts, [userId]: updatedItems } 
        };
      }),

      removeItem: (id) => set((state) => {
        const userId = state.activeUserId;
        const updatedItems = state.items.filter((item) => item.id !== id);
        return {
          items: updatedItems,
          carts: { ...state.carts, [userId]: updatedItems }
        };
      }),

      updateQuantity: (id, quantity) => set((state) => {
        const userId = state.activeUserId;
        const updatedItems = state.items.map((item) => 
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        );
        return {
          items: updatedItems,
          carts: { ...state.carts, [userId]: updatedItems }
        };
      }),

      clearCart: () => set((state) => {
        const userId = state.activeUserId;
        return {
          items: [],
          carts: { ...state.carts, [userId]: [] }
        };
      }),

      getRawTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getDiscountedTotal: (discountPercentage) => {
        const subtotal = get().getRawTotal();
        if (discountPercentage <= 0) return subtotal;
        const discountAmount = (subtotal * discountPercentage) / 100;
        return subtotal - discountAmount;
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'af-style-cart-v2', // নতুন ভার্সন যাতে পুরোনো মিক্সড ডেটা মুছে যায়
    }
  )
);

export default useCartStore;