import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from "../firebase"

// ইউজারের ডেটাবেস ইন্টারফেস
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'user' | 'admin';
  createdAt?: any;
}

const googleProvider = new GoogleAuthProvider();

// ১. ইমেইল ও পাসওয়ার্ড দিয়ে নতুন অ্যাকাউন্ট তৈরি (Registration)
export const registerWithEmail = async (email: string, password: string, name: string): Promise<UserProfile> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Firebase Auth প্রোফাইলে নাম আপডেট করা
    await updateProfile(user, { displayName: name });

    // Firestore ডাটাবেসে ইউজারের তথ্য সেভ করা (ডিফল্ট রোল: 'user')
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: name,
      photoURL: user.photoURL,
      role: 'user',
    };

    await setDoc(doc(db, 'users', user.uid), {
      ...userProfile,
      createdAt: serverTimestamp(),
    });

    return userProfile;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// ২. ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করা
export const loginWithEmail = async (email: string, password: string): Promise<UserProfile> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Firestore থেকে ইউজারের রোল এবং অন্যান্য তথ্য নিয়ে আসা
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    } else {
      // যদি কোনো কারণে ডাটাবেসে তথ্য না থাকে
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: 'user',
      };
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// ৩. গুগল দিয়ে লগইন বা সাইন আপ করা
export const loginWithGoogle = async (): Promise<UserProfile> => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;

    // চেক করা ইউজারটি আগে থেকেই ডাটাবেসে আছে কি না
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // পুরোনো ইউজার হলে ডাটাবেস থেকে তথ্য রিটার্ন করবে
      return userDoc.data() as UserProfile;
    } else {
      // নতুন ইউজার হলে ডাটাবেসে সেভ করবে
      const newUserProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: 'user',
      };

      await setDoc(userDocRef, {
        ...newUserProfile,
        createdAt: serverTimestamp(),
      });

      return newUserProfile;
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// ৪. লগআউট করা
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};