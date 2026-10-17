import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// থিমের ধরন: লাইট অথবা ডার্ক
type ThemeMode = 'light' | 'dark';

interface ThemeState {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light', // ডিফল্ট থিম লাইট থাকবে

      // থিম পরিবর্তন করার ফাংশন (Light <-> Dark)
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),

      // সরাসরি কোনো নির্দিষ্ট থিম সেট করার ফাংশন
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'af-style-theme', // ব্রাউজারের মেমরিতে এটি সেভ থাকবে
    }
  )
);

export default useThemeStore;