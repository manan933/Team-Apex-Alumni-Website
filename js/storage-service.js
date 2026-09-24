/**
 * ==========================================================================
 * STORAGE SERVICE (DATA REPOSITORY LAYER)
 * Unified asynchronous API bridging Firebase Firestore & Local Mock Storage
 * ==========================================================================
 */

import { isMockMode, db, storage } from './firebase-config.js';
import { INITIAL_ALUMNI, INITIAL_SUBMISSIONS, INITIAL_VIDEOS, INITIAL_STATS } from './mock-data.js';

const STORAGE_KEYS = {
  ALUMNI: 'alumni_network_profiles',
  SUBMISSIONS: 'alumni_network_submissions',
  VIDEOS: 'alumni_network_videos',
  SUBSCRIBERS: 'alumni_network_subscribers'
};

// Initialize LocalStorage with mock seeds if in mock mode
function initLocalMockDB() {
  if (!localStorage.getItem(STORAGE_KEYS.ALUMNI)) {
    localStorage.setItem(STORAGE_KEYS.ALUMNI, JSON.stringify(INITIAL_ALUMNI));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
  }
  const storedVideos = localStorage.getItem(STORAGE_KEYS.VIDEOS);
  if (!storedVideos) {
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(INITIAL_VIDEOS));
  } else if (storedVideos.includes('dQw4w9WgXcQ')) {
    // Automatically sanitize and migrate any existing Rick Astley placeholder in localStorage
    try {
      const parsed = JSON.parse(storedVideos);
      const migrated = parsed.map(v => v.youtubeId === 'dQw4w9WgXcQ' ? { ...v, youtubeId: 'vpW2sGlCtaE' } : v);
      localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(migrated));
    } catch (_) {
      localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(INITIAL_VIDEOS));
    }
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS)) {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify([]));
  }
}

if (isMockMode) {
  initLocalMockDB();
}

/**
 * Fetch all alumni profiles
 */
export async function getAlumni() {
  if (isMockMode) {
    const raw = localStorage.getItem(STORAGE_KEYS.ALUMNI);
    return raw ? JSON.parse(raw) : INITIAL_ALUMNI;
  }

  // Live Firestore integration
  const { collection, getDocs, query, orderBy } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
  const q = query(collection(db, 'alumni'), orderBy('name', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
}

/**
 * Fetch a single alumni profile by UID
 */
export async function getAlumniById(uid) {
  if (isMockMode) {
    const list = await getAlumni();
    return list.find(a => a.uid === uid) || null;
  }

  const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
  const ref = doc(db, 'alumni', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? { uid: snap.id, ...snap.data() } : null;
}

/**
 * Save or update alumni profile
 */
export async function saveAlumniProfile(uid, profileData) {
  const updatedData = {
    ...profileData,
    profileComplete: true,
    updatedAt: new Date().toISOString()
  };

  if (isMockMode) {
    const list = await getAlumni();
    const idx = list.findIndex(a => a.uid === uid);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updatedData };
    } else {
      list.push({ uid, ...updatedData, createdAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEYS.ALUMNI, JSON.stringify(list));
    return { uid, ...updatedData };
  }

  const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
  const ref = doc(db, 'alumni', uid);
  await setDoc(ref, updatedData, { merge: true });
  return { uid, ...updatedData };
}

/**
 * Upload profile photo (returns download URL)
 */
export async function uploadProfilePhoto(uid, file) {
  if (isMockMode) {
    // In mock mode, convert image file to base64 Data URL so it persists locally
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Live Firebase Storage
  const { ref, uploadBytes, getDownloadURL } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js');
  const storageRef = ref(storage, `alumni_photos/${uid}_${Date.now()}`);
  const snap = await uploadBytes(storageRef, file);
  return await getDownloadURL(snap.ref);
}

/**
 * Fetch stories/news submissions
 * @param {string|null} statusFilter 'approved' | 'pending' | 'rejected' | null (all)
 * @param {string|null} authorUid filter for a specific alumni's submissions
 */
export async function getSubmissions(statusFilter = null, authorUid = null) {
  if (isMockMode) {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    let list = raw ? JSON.parse(raw) : INITIAL_SUBMISSIONS;
    if (statusFilter) {
      list = list.filter(item => item.status === statusFilter);
    }
    if (authorUid) {
      list = list.filter(item => item.authorUid === authorUid);
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const { collection, getDocs, query, where, orderBy } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
  let q;
  if (statusFilter && authorUid) {
    q = query(collection(db, 'submissions'), where('status', '==', statusFilter), where('authorUid', '==', authorUid));
  } else if (statusFilter) {
    q = query(collection(db, 'submissions'), where('status', '==', statusFilter));
  } else if (authorUid) {
    q = query(collection(db, 'submissions'), where('authorUid', '==', authorUid));
  } else {
    q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
  }
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Create a new story submission (default status: "pending")
 */
export async function createSubmission(submission) {
  const newRecord = {
    ...submission,
    status: 'pending',
    createdAt: new Date().toISOString(),
    reviewedAt: null
  };

  if (isMockMode) {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    const list = raw ? JSON.parse(raw) : [];
    const id = 'story-' + Date.now();
    const created = { id, ...newRecord };
    list.unshift(created);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(list));
    return created;
  }

  const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
  const docRef = await addDoc(collection(db, 'submissions'), newRecord);
  return { id: docRef.id, ...newRecord };
}

/**
 * Admin action: approve or reject submission
 */
export async function updateSubmissionStatus(id, newStatus) {
  if (isMockMode) {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    const list = raw ? JSON.parse(raw) : [];
    const item = list.find(s => s.id === id);
    if (item) {
      item.status = newStatus;
      item.reviewedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(list));
    }
    return item;
  }

  const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
  const ref = doc(db, 'submissions', id);
  await updateDoc(ref, {
    status: newStatus,
    reviewedAt: new Date().toISOString()
  });
}

/**
 * Fetch video gallery
 */
export async function getVideos(category = null) {
  if (isMockMode) {
    const raw = localStorage.getItem(STORAGE_KEYS.VIDEOS);
    let list = raw ? JSON.parse(raw) : INITIAL_VIDEOS;
    if (list && Array.isArray(list)) {
      list = list.map(v => v.youtubeId === 'dQw4w9WgXcQ' ? { ...v, youtubeId: 'vpW2sGlCtaE' } : v);
    }
    if (category && category !== 'All') {
      list = list.filter(v => v.category === category);
    }
    return list;
  }

  const { collection, getDocs, query, where } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
  let q = collection(db, 'videos');
  if (category && category !== 'All') {
    q = query(q, where('category', '==', category));
  }
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Subscribe email to newsletter
 */
export async function subscribeNewsletter(email) {
  if (isMockMode) {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS);
    const list = raw ? JSON.parse(raw) : [];
    if (!list.includes(email)) {
      list.push(email);
      localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(list));
    }
    return { success: true };
  }

  const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
  await addDoc(collection(db, 'subscribers'), {
    email,
    subscribedAt: new Date().toISOString()
  });
  return { success: true };
}

/**
 * Get impact stats
 */
export async function getStats() {
  return INITIAL_STATS;
}
