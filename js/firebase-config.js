/**
 * ==========================================================================
 * FIREBASE CONFIGURATION & INITIALIZATION
 * University Alumni Network
 * ==========================================================================
 * 
 * NOTE FOR DEVELOPERS:
 * 1. Create a Firebase project at https://console.firebase.google.com/
 * 2. Enable Firebase Authentication (Email/Password), Cloud Firestore, and Firebase Storage.
 * 3. Replace the placeholder config object below with your actual project keys.
 * 
 * AUTOMATIC DEMO/MOCK MODE:
 * When apiKey is left as "YOUR_API_KEY_HERE" (or if Firebase fails to load),
 * the website automatically operates in ZERO-SETUP DEMO MODE using
 * mock data and browser storage. This allows immediate testing of search,
 * filters, profile editing, and moderation workflows without waiting for cloud setup!
 */

// TODO: Replace with your official Firebase project credentials:
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-alumni-app.firebaseapp.com",
  projectId: "your-alumni-app",
  storageBucket: "your-alumni-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// Check if developer has replaced placeholder keys
export const isMockMode = (
  !firebaseConfig.apiKey || 
  firebaseConfig.apiKey.includes("YOUR_API_KEY") || 
  firebaseConfig.projectId.includes("your-alumni-app")
);

let app = null;
let auth = null;
let db = null;
let storage = null;

if (!isMockMode) {
  try {
    // Dynamic import of Firebase Modular SDK via official CDN
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
    const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
    const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const { getStorage } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js');

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    console.info("⚡ [Firebase] Connected to live Firebase project:", firebaseConfig.projectId);
  } catch (err) {
    console.warn("⚠️ [Firebase] Failed to initialize live SDK. Falling back to local mock mode:", err);
  }
} else {
  console.info("ℹ️ [Alumni Platform] Running in Offline Demo Mode with mock data & local storage. To connect live cloud backend, update js/firebase-config.js.");
}

export { app, auth, db, storage };
