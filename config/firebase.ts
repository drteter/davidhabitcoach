import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AlzaSyA-d332BcaL_Tqn3rEvOUHPUFml-vm_zaE",
  projectId: "davidhabitcoach",
  storageBucket: "davidhabitcoach.firebasestorage.app",
  messagingSenderId: "726948890484",
  appId: "1:726948890484:ios:37a00aeaa35fd5e8420e21",
  // Note: authDomain is typically projectId.firebaseapp.com
  authDomain: "davidhabitcoach.firebaseapp.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 