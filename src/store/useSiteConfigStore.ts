import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

// ওয়েবসাইটের যাবতীয় ডায়নামিক তথ্যের টাইপ
interface SiteConfig {
  logoUrl: string; // নতুন লোগো লিঙ্ক যুক্ত করা হলো
  heroImageUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  philosophyTitle: string;
  philosophyText: string;
  maintenanceMode: boolean;
  announcementBar: string;
  logoText: string;
}

interface SiteConfigState {
  config: SiteConfig;
  isLoading: boolean;
  fetchConfig: () => Promise<void>;
}

// ডিফল্ট ভ্যালু (যদি ডাটাবেসে কিছু না থাকে তবে এগুলো দেখাবে)
const defaultConfig: SiteConfig = {
  logoUrl: '', // শুরুতে লোগো খালি থাকবে
  heroImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070',
  heroTitle: 'Elegance is the only beauty that',
  heroSubtitle: 'Summer - Spring 2024 Collection',
  heroCtaText: 'Explore Collection',
  philosophyTitle: "The Maison's Philosophy",
  philosophyText: '"We don\'t just create fashion; we curate timeless statements of excellence for the modern connoisseur."',
  maintenanceMode: false,
  announcementBar: 'Complimentary shipping on orders above ৳5,000',
  logoText: 'AF Style'
};

const useSiteConfigStore = create<SiteConfigState>()(
  persist(
    (set) => ({
      config: defaultConfig,
      isLoading: true,

      fetchConfig: async () => {
        set({ isLoading: true });
        try {
          const docRef = doc(db, 'settings', 'site_config');
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            // ডাটাবেসে যা আছে তার সাথে ডিফল্ট ডাটা মার্জ করা হচ্ছে
            set({ config: { ...defaultConfig, ...docSnap.data() } });
          }
        } catch (error) {
          console.error("Failed to fetch site configuration:", error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'af-style-config', // লোকাল স্টোরেজে ক্যাশ থাকবে
    }
  )
);

export default useSiteConfigStore;