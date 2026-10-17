import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type VIPTier = 'Silver' | 'Gold' | 'Platinum';

interface UserRewardData {
  points: number;
  tier: VIPTier;
  lastUnboxingDate: string | null;
  isFirstTime: boolean;
  activeDiscount: number | null;
  discountExpiry: number | null;
}

interface RewardState {
  activeUserId: string | null;
  users: Record<string, UserRewardData>;
  
  // বর্তমান ইউজারের লাইভ স্টেট
  points: number;
  tier: VIPTier;
  lastUnboxingDate: string | null;
  hasUnboxedToday: boolean; // এটি গুরুত্বপূর্ণ
  isFirstTime: boolean;
  activeDiscount: number | null;
  discountExpiry: number | null;
  
  // ফাংশনসমূহ
  initUserRewards: (uid: string) => void;
  addPoints: (amount: number) => void;
  claimDailyReward: () => { type: 'discount' | 'points'; value: number };
  isDiscountValid: () => boolean;
  resetDailyStatus: () => void;
}

const useRewardStore = create<RewardState>()(
  persist(
    (set, get) => ({
      activeUserId: null,
      users: {},
      points: 0,
      tier: 'Silver',
      lastUnboxingDate: null,
      hasUnboxedToday: false,
      isFirstTime: true,
      activeDiscount: null,
      discountExpiry: null,

      initUserRewards: (uid: string) => {
        const state = get();
        const today = new Date().toDateString();
        const allUsers = { ...state.users };

        // ১. যদি বর্তমান কোনো ইউজার থাকে, তার ডাটা আগে মেইন অবজেক্টে সেভ করি
        if (state.activeUserId) {
          allUsers[state.activeUserId] = {
            points: state.points,
            tier: state.tier,
            lastUnboxingDate: state.lastUnboxingDate,
            isFirstTime: state.isFirstTime,
            activeDiscount: state.activeDiscount,
            discountExpiry: state.discountExpiry,
          };
        }

        // ২. নতুন ইউজারের ডাটা লোড করি
        const userData = allUsers[uid] || {
          points: 0,
          tier: 'Silver',
          lastUnboxingDate: null,
          isFirstTime: true,
          activeDiscount: null,
          discountExpiry: null,
        };

        // ৩. সরাসরি স্টেট আপডেট করি
        set({
          activeUserId: uid,
          users: allUsers,
          ...userData,
          hasUnboxedToday: userData.lastUnboxingDate === today // আজ বক্স খোলা হয়েছে কি না চেক
        });
      },

      addPoints: (amount) => set((state) => {
        const newPoints = state.points + amount;
        let newTier: VIPTier = 'Silver';
        if (newPoints >= 1500) newTier = 'Platinum';
        else if (newPoints >= 500) newTier = 'Gold';
        
        const updates = { points: newPoints, tier: newTier };
        const newUsers = { ...state.users };
        if (state.activeUserId) {
          newUsers[state.activeUserId] = { ...newUsers[state.activeUserId], ...updates };
        }
        return { ...updates, users: newUsers };
      }),

      claimDailyReward: () => {
        const state = get();
        const today = new Date().toDateString();

        // **কঠোর সুরক্ষা:** যদি ডেট মিলে যায়, তবে এরর থ্রো করবে
        if (state.lastUnboxingDate === today) {
          throw new Error("ALREADY_CLAIMED");
        }

        let rewardValue = 0;
        let rewardType: 'discount' | 'points' = 'points';
        let updates: any = {};

        if (state.isFirstTime) {
          rewardValue = Math.floor(Math.random() * (31 - 15 + 1)) + 15;
          rewardType = 'discount';
          const midnight = new Date();
          midnight.setHours(23, 59, 59, 999);
          
          updates = { 
            isFirstTime: false, 
            activeDiscount: rewardValue,
            discountExpiry: midnight.getTime(),
            lastUnboxingDate: today,
            hasUnboxedToday: true 
          };
        } else {
          rewardValue = Math.floor(Math.random() * (15 - 5 + 1)) + 5;
          rewardType = 'points';
          const newPoints = state.points + rewardValue;
          let newTier = state.tier;
          if (newPoints >= 1500) newTier = 'Platinum';
          else if (newPoints >= 500) newTier = 'Gold';

          updates = { 
            points: newPoints, 
            tier: newTier,
            lastUnboxingDate: today,
            hasUnboxedToday: true 
          };
        }

        // গ্লোবাল ইউজার লিস্ট আপডেট করা
        const newUsers = { ...state.users };
        if (state.activeUserId) {
          newUsers[state.activeUserId] = {
             ...state.users[state.activeUserId],
             ...updates
          };
        }

        set({ ...updates, users: newUsers });
        return { type: rewardType, value: rewardValue };
      },

      isDiscountValid: () => {
        const { activeDiscount, discountExpiry } = get();
        if (!activeDiscount || !discountExpiry) return false;
        return new Date().getTime() < discountExpiry;
      },

      resetDailyStatus: () => {
        const state = get();
        const today = new Date().toDateString();
        const now = new Date().getTime();
        
        if (state.lastUnboxingDate !== today) {
          set({ hasUnboxedToday: false });
        }
        
        if (state.discountExpiry && now > state.discountExpiry) {
          set({ activeDiscount: null, discountExpiry: null });
        }
      }
    }),
    {
      name: 'af-style-rewards-vfinal', // নতুন ভার্সন যাতে পুরোনো ভুল ক্যাশ ক্লিন হয়
    }
  )
);

export default useRewardStore;