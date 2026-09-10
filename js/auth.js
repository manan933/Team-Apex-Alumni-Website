/**
 * ==========================================================================
 * AUTH SERVICE
 * Handles Firebase Authentication with Seamless Local Mock Session Support
 * ==========================================================================
 */

import { isMockMode, auth } from './firebase-config.js';
import { getAlumniById, saveAlumniProfile } from './storage-service.js';

const AUTH_USER_KEY = 'alumni_auth_current_user';
const authListeners = [];

/**
 * Register state change listener
 */
export function onAuthStateChange(callback) {
  authListeners.push(callback);

  if (isMockMode) {
    const user = getCurrentUser();
    setTimeout(() => callback(user), 50);
    return () => {
      const idx = authListeners.indexOf(callback);
      if (idx >= 0) authListeners.splice(idx, 1);
    };
  }

  // Live Firebase Auth listener
  import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js').then(({ onAuthStateChanged }) => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getAlumniById(firebaseUser.uid);
        const fullUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: profile?.name || firebaseUser.displayName || 'Alum',
          photoURL: profile?.photoURL || firebaseUser.photoURL || null,
          isAdmin: profile?.isAdmin || false,
          profileComplete: profile?.profileComplete || false,
          ...profile
        };
        callback(fullUser);
      } else {
        callback(null);
      }
    });
  });
}

function notifyAuthListeners(user) {
  authListeners.forEach(fn => fn(user));
}

/**
 * Get currently authenticated user synchronously from cache
 */
export function getCurrentUser() {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

/**
 * Log in with email & password
 */
export async function login(email, password) {
  if (isMockMode) {
    // In mock mode, check if email corresponds to any seeded mock alumni
    const rawList = localStorage.getItem('alumni_network_profiles');
    const list = rawList ? JSON.parse(rawList) : [];
    const matched = list.find(a => a.email.toLowerCase() === email.toLowerCase());

    const userObj = matched ? { ...matched } : {
      uid: 'user-' + Date.now(),
      email: email,
      name: email.split('@')[0].replace('.', ' '),
      gradYear: 2020,
      jobTitle: 'Alum',
      company: 'Independent',
      city: 'San Francisco, CA',
      country: 'United States',
      isAdmin: email.includes('admin'),
      profileComplete: false,
      verified: false
    };

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userObj));
    notifyAuthListeners(userObj);
    return userObj;
  }

  const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const profile = await getAlumniById(userCredential.user.uid);
  const userObj = {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    displayName: profile?.name || userCredential.user.displayName,
    isAdmin: profile?.isAdmin || false,
    ...profile
  };
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userObj));
  notifyAuthListeners(userObj);
  return userObj;
}

/**
 * Register a new alumni account
 */
export async function signup(email, password, { name, gradYear, degree }) {
  if (isMockMode) {
    const uid = 'alumni-' + Date.now();
    const newUser = {
      uid,
      email,
      name,
      gradYear: parseInt(gradYear, 10) || new Date().getFullYear(),
      degree: degree || 'Bachelor of Science',
      company: '',
      jobTitle: '',
      city: '',
      country: '',
      linkedin: '',
      bio: '',
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      verified: false,
      profileComplete: false,
      isAdmin: false,
      createdAt: new Date().toISOString()
    };

    await saveAlumniProfile(uid, newUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    notifyAuthListeners(newUser);
    return newUser;
  }

  const { createUserWithEmailAndPassword, updateProfile } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName: name });

  const initialProfile = {
    uid: userCredential.user.uid,
    email,
    name,
    gradYear: parseInt(gradYear, 10) || new Date().getFullYear(),
    degree: degree || 'Bachelor of Science',
    company: '',
    jobTitle: '',
    city: '',
    country: '',
    linkedin: '',
    bio: '',
    photoURL: null,
    verified: false,
    profileComplete: false,
    isAdmin: false
  };

  await saveAlumniProfile(userCredential.user.uid, initialProfile);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(initialProfile));
  notifyAuthListeners(initialProfile);
  return initialProfile;
}

/**
 * Log out
 */
export async function logout() {
  localStorage.removeItem(AUTH_USER_KEY);

  if (!isMockMode) {
    const { signOut } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
    await signOut(auth);
  }

  notifyAuthListeners(null);
  return true;
}

/**
 * Trigger password reset email
 */
export async function resetPassword(email) {
  if (isMockMode) {
    return { success: true, message: 'Password reset link simulated in demo mode.' };
  }

  const { sendPasswordResetEmail } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
  await sendPasswordResetEmail(auth, email);
  return { success: true };
}
