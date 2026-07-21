/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Global Firebase Initialization Module
 * Exports: app, auth, db, storage
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyCljGMCsHPzp9OEQg49gdjL0ATb5SXK1bk",
  authDomain: "his-grace-school-agbugburu-1.firebaseapp.com",
  projectId: "his-grace-school-agbugburu-1",
  storageBucket: "his-grace-school-agbugburu-1.firebasestorage.app",
  messagingSenderId: "25103292992",
  appId: "1:25103292992:web:2daf78000423a063611da5"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

/**
 * Standard Firestore Error Handler required for security rule diagnostics
 */
export function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error("Firestore Operation Error:", JSON.stringify(errInfo));
  return errInfo;
}

/**
 * Validate Connection to Firestore on startup
 */
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "settings", "global_config"));
    console.log("Firebase Firestore Connection Verified.");
  } catch (error) {
    if (error instanceof Error && error.message.includes("offline")) {
      console.warn("Firestore client is operating offline.");
    }
  }
}
testConnection();

// Expose globally on window for non-module script compatibility
if (typeof window !== "undefined") {
  window.HGS_FIREBASE = {
    app,
    auth,
    db,
    storage,
    handleFirestoreError,
    firebaseConfig
  };
}
