import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseConfigData from "../../firebase-applet-config.json";

const firebaseConfig = {
  apiKey: firebaseConfigData?.apiKey || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: firebaseConfigData?.authDomain || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: firebaseConfigData?.projectId || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: firebaseConfigData?.storageBucket || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: firebaseConfigData?.messagingSenderId || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: firebaseConfigData?.appId || process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfigData?.firestoreDatabaseId);
export const auth = getAuth(app);

