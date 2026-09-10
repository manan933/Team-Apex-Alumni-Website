/**
 * ==========================================================================
 * PAGE LOGIC: ALUMNI PROFILE (profile.html)
 * Self-service editor, photo upload, live interactive card preview, my submissions
 * ==========================================================================
 */

import { onAuthStateChange, getCurrentUser } from '../auth.js';
import { getAlumniById, saveAlumniProfile, uploadProfilePhoto, getSubmissions } from '../storage-service.js';
import { showToast } from '../nav.js';

let currentUser = null;
let currentPhotoURL = null;

document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChange(async (user) => {
    if (!user) {
      // Unauthenticated visitor -> redirect to login
      window.location.href = 'login.html';
      return;
    }

    currentUser = user;
    await loadUserProfile(user.uid);
    await loadMySubmissions(user.uid);
    initFormListeners();
    initPhotoUpload();
  });
});

/**
 * Populate form inputs with current profile data
 */
async function loadUserProfile(uid) {
  const profile = await getAlumniById(uid) || currentUser;

  document.getElementById('profile-name').value = profile.name || '';
  document.getElementById('profile-email').value = profile.email || '';
  document.getElementById('profile-gradyear').value = profile.gradYear || '';
  document.getElementById('profile-degree').value = profile.degree || '';
  document.getElementById('profile-company').value = profile.company || '';
  document.getElementById('profile-jobtitle').value = profile.jobTitle || '';
  document.getElementById('profile-city').value = profile.city || '';
  document.getElementById('profile-country').value = profile.country || '';
  document.getElementById('profile-industry').value = profile.industry || 'Technology & Engineering';
  document.getElementById('profile-linkedin').value = profile.linkedin || '';
  document.getElementById('profile-bio').value = profile.bio || '';

  currentPhotoURL = profile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name || 'Alum')}`;
  
  const avatarImg = document.getElementById('avatar-preview-img');
  if (avatarImg) avatarImg.src = currentPhotoURL;

  updateLivePreview();
}

/**
 * Sync form changes in real time to the Live Directory Preview Card
 */
function initFormListeners() {
  const form = document.getElementById('profile-form');
  if (!form) return;

  // Listen to all inputs to update the live preview on the right
  form.addEventListener('input', updateLivePreview);

  // Form submit -> save profile
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = form.querySelector('#save-profile-btn');

    try {
      saveBtn.disabled = true;
      saveBtn.innerHTML = `
        <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
        Saving Changes...
      `;

      const updatedProfile = {
        name: document.getElementById('profile-name').value.trim(),
        gradYear: parseInt(document.getElementById('profile-gradyear').value, 10) || new Date().getFullYear(),
        degree: document.getElementById('profile-degree').value.trim(),
        company: document.getElementById('profile-company').value.trim(),
        jobTitle: document.getElementById('profile-jobtitle').value.trim(),
        city: document.getElementById('profile-city').value.trim(),
        country: document.getElementById('profile-country').value.trim(),
        industry: document.getElementById('profile-industry').value,
        linkedin: document.getElementById('profile-linkedin').value.trim(),
        bio: document.getElementById('profile-bio').value.trim(),
        photoURL: currentPhotoURL,
        profileComplete: true
      };

      await saveAlumniProfile(currentUser.uid, updatedProfile);
      showToast('Profile updated successfully!', 'success');
      updateLivePreview();
    } catch (err) {
      console.error(err);
      showToast('Error saving profile: ' + err.message, 'danger');
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = `Save Profile Changes`;
    }
  });
}

function updateLivePreview() {
  const name = document.getElementById('profile-name')?.value || 'Your Name';
  const jobTitle = document.getElementById('profile-jobtitle')?.value || 'Job Title';
  const company = document.getElementById('profile-company')?.value || 'Company Name';
  const gradYear = document.getElementById('profile-gradyear')?.value || new Date().getFullYear();
  const degree = document.getElementById('profile-degree')?.value || 'Program of Study';
  const city = document.getElementById('profile-city')?.value || 'City';
  const country = document.getElementById('profile-country')?.value || 'Country';

  const previewName = document.getElementById('preview-name');
  const previewRole = document.getElementById('preview-role');
  const previewMeta = document.getElementById('preview-meta');
  const previewLocation = document.getElementById('preview-location');
  const previewAvatar = document.getElementById('preview-avatar');

  if (previewName) previewName.textContent = name;
  if (previewRole) previewRole.innerHTML = `${escapeHTML(jobTitle)} at <strong>${escapeHTML(company)}</strong>`;
  if (previewMeta) previewMeta.textContent = `Class of ${gradYear} · ${degree}`;
  if (previewLocation) previewLocation.textContent = `${city}${country ? ', ' + country : ''}`;
  if (previewAvatar && currentPhotoURL) previewAvatar.src = currentPhotoURL;
}

/**
 * Handle photo upload and preview
 */
function initPhotoUpload() {
  const fileInput = document.getElementById('avatar-file-input');
  const uploadBtn = document.getElementById('upload-photo-btn');

  uploadBtn?.addEventListener('click', () => fileInput?.click());

  fileInput?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file.', 'danger');
      return;
    }

    try {
      uploadBtn.disabled = true;
      uploadBtn.textContent = 'Uploading...';

      const photoURL = await uploadProfilePhoto(currentUser.uid, file);
      currentPhotoURL = photoURL;

      const avatarImg = document.getElementById('avatar-preview-img');
      if (avatarImg) avatarImg.src = photoURL;

      updateLivePreview();
      showToast('Photo uploaded! Click Save to apply.', 'info');
    } catch (err) {
      console.error(err);
      showToast('Failed to upload photo.', 'danger');
    } finally {
      uploadBtn.disabled = false;
      uploadBtn.textContent = 'Change Photo';
    }
  });
}

/**
 * Load logged-in alumni's submitted stories
 */
async function loadMySubmissions(uid) {
  const container = document.getElementById('my-submissions-list');
  if (!container) return;

  const submissions = await getSubmissions(null, uid);

  if (!submissions.length) {
    container.innerHTML = `
      <div class="empty-state" style="padding: var(--space-8);">
        <p style="margin-bottom: var(--space-3);">You haven't submitted any stories or updates yet.</p>
        <a href="news.html#submit" class="btn btn-primary btn-sm">Share Your Story &rarr;</a>
      </div>
    `;
    return;
  }

  container.innerHTML = submissions.map(sub => {
    let badgeClass = 'badge-warning';
    if (sub.status === 'approved') badgeClass = 'badge-success';
    if (sub.status === 'rejected') badgeClass = 'badge-danger';

    return `
      <div class="submission-item">
        <div class="submission-info">
          <h4>${escapeHTML(sub.title)}</h4>
          <div class="submission-meta">
            <span>Category: <strong>${escapeHTML(sub.category)}</strong></span>
            <span>Submitted: ${new Date(sub.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div>
          <span class="badge ${badgeClass}" style="text-transform: capitalize;">${escapeHTML(sub.status)}</span>
        </div>
      </div>
    `;
  }).join('');
}

function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
