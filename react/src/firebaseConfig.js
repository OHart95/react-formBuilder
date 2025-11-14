import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZRYS-BONMQxY6u1XBCVHpOoKXV1s0GMQ",
  authDomain: "formbuilder-a85e4.firebaseapp.com",
  projectId: "formbuilder-a85e4",
  storageBucket: "formbuilder-a85e4.firebasestorage.app",
  messagingSenderId: "629752865292",
  appId: "1:629752865292:web:8dd4aab4df0688f472c429"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Export Firestore instance
export const db = getFirestore(app);

export const auth = getAuth(app);