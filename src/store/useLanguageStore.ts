import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// সমর্থিত ভাষাগুলোর টাইপ
export type Language = 'en' | 'bn';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      // ডিফল্ট ভাষা হিসেবে 'en' (ইংরেজি) থাকবে
      language: 'en', 

      // ভাষা পরিবর্তন করার ফাংশন
      setLanguage: (lang: Language) => set({ language: lang }),
    }),
    {
      name: 'af-style-language', // লোকাল স্টোরেজে সেভ থাকবে যাতে রিলোড দিলে ভাষা পরিবর্তন না হয়
    }
  )
);

export default useLanguageStore;