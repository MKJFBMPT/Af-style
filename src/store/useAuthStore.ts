import { create } from 'zustand';

// ইউজারের ডেটার ধরন (TypeScript Interface)
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'user' | 'admin'; // Role-based access এর জন্য
}

// অথেনটিকেশন স্টেটের ধরন
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

// Zustand Store তৈরি করা হচ্ছে
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // শুরুতে true থাকবে কারণ ফায়ারবেস চেক করতে সময় নেয়

  // ইউজার সেট করার ফাংশন
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user, 
    isLoading: false 
  }),

  // লোডিং স্টেট পরিবর্তন করার ফাংশন
  setLoading: (isLoading) => set({ isLoading }),

  // লগআউট করার ফাংশন
  logout: () => set({ 
    user: null, 
    isAuthenticated: false, 
    isLoading: false 
  }),
}));

export default useAuthStore;