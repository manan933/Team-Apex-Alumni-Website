/**
 * ==========================================================================
 * PAGE LOGIC: ALUMNI PROFILE (profile.html)
 * Dual-Mode Engine:
 * 1. Public Editorial Profile Feature View (?id=alumni-xxx)
 * 2. Authenticated Self-Service Record Editor & Photo Uploader
 * ==========================================================================
 */

import { onAuthStateChange, getCurrentUser } from '../auth.js';
import { getAlumni, getAlumniById, saveAlumniProfile, uploadProfilePhoto, getSubmissions } from '../storage-service.js';
import { showToast } from '../nav.js';

let activeAlumnus = null;
let currentLoggedUser = null;
let currentPhotoURL = null;

function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const targetId = urlParams.get('id') || urlParams.get('uid');

  onAuthStateChange(async (user) => {
    currentLoggedUser = user;

    if (targetId) {
      // Direct public profile lookup
      await loadPublicProfile(targetId);
    } else if (user) {
      // Logged-in user viewing their own profile
      await loadPublicProfile(user.uid);
    } else {
      // Fallback to flagship alumnus (Dr. Elena Rostova) for unauthenticated visitors without an ID
      await loadPublicProfile('alumni-001');
    }

    initModeSwitchers();
    initFormListeners();
    initPhotoUpload();
  });
});

/**
 * ==========================================================================
 * 1. PUBLIC EDITORIAL PROFILE VIEW
 * ==========================================================================
 */
async function loadPublicProfile(uid) {
  try {
    activeAlumnus = await getAlumniById(uid);
    if (!activeAlumnus) {
      const all = await getAlumni();
      activeAlumnus = all.find(a => a.uid === uid) || all[0];
    }

    if (!activeAlumnus) return;

    // Set page title
    document.title = `${activeAlumnus.name} — Apex University Alumni`;

    // Populate Hero Section
    const avatar = document.getElementById('pub-avatar');
    const name = document.getElementById('pub-name');
    const headline = document.getElementById('pub-headline');
    const company = document.getElementById('pub-company');
    const badgeIndustry = document.getElementById('pub-badge-industry');
    const badgeBatch = document.getElementById('pub-badge-batch');
    const location = document.getElementById('pub-location');
    const degree = document.getElementById('pub-degree');
    const bio = document.getElementById('pub-bio');
    const linkedinLink = document.getElementById('pub-linkedin-link');
    const verifiedBadge = document.getElementById('pub-verified-badge');

    if (avatar) avatar.src = activeAlumnus.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';
    if (name) name.textContent = activeAlumnus.name;
    if (company) company.textContent = activeAlumnus.company || 'Distinguished Organization';
    if (headline) {
      headline.innerHTML = `${escapeHTML(activeAlumnus.jobTitle || 'Fellow')} at <strong>${escapeHTML(activeAlumnus.company || 'Alumni Network')}</strong>`;
    }
    if (badgeIndustry) badgeIndustry.textContent = activeAlumnus.industry || 'Academic Excellence';
    if (badgeBatch) badgeBatch.textContent = `Class of ${activeAlumnus.gradYear}`;
    if (location) location.textContent = [activeAlumnus.city, activeAlumnus.country].filter(Boolean).join(', ') || 'Global';
    if (degree) degree.textContent = activeAlumnus.degree || 'Degree of Apex University';
    if (bio) bio.textContent = `"${activeAlumnus.bio || 'Where legacy and discovery converge to transform society.'}"`;
    if (verifiedBadge) verifiedBadge.style.display = activeAlumnus.verified ? 'flex' : 'none';

    if (linkedinLink) {
      if (activeAlumnus.linkedin) {
        linkedinLink.href = activeAlumnus.linkedin;
        linkedinLink.style.display = 'inline-flex';
      } else {
        linkedinLink.style.display = 'none';
      }
    }

    // Populate Institutional Registry Box
    const recBatch = document.getElementById('rec-batch');
    const recDegree = document.getElementById('rec-degree');
    const recChapter = document.getElementById('rec-chapter');

    if (recBatch) recBatch.textContent = `Class of ${activeAlumnus.gradYear}`;
    if (recDegree) recDegree.textContent = activeAlumnus.degree || 'Official Credential';
    if (recChapter) recChapter.textContent = `${(activeAlumnus.city || 'Global').split(',')[0].trim()} Chapter`;

    // Populate Timeline
    const timelineTitle = document.getElementById('timeline-current-title');
    const timelineCompany = document.getElementById('timeline-current-company');
    const timelineDegree = document.getElementById('timeline-edu-degree');

    if (timelineTitle) timelineTitle.textContent = activeAlumnus.jobTitle || 'Executive Appointment';
    if (timelineCompany) timelineCompany.textContent = `Leading initiatives and global strategy at ${activeAlumnus.company || 'Enterprise'}.`;
    if (timelineDegree) timelineDegree.textContent = activeAlumnus.degree || 'Degree Program';

    // Check if the viewer owns this profile
    const ownerActions = document.getElementById('owner-toggle-actions');
    if (ownerActions) {
      if (currentLoggedUser && (currentLoggedUser.uid === activeAlumnus.uid || currentLoggedUser.isAdmin)) {
        ownerActions.style.display = 'block';
      } else {
        ownerActions.style.display = 'none';
      }
    }

    // Load Related Alumni
    await loadRelatedAlumni(activeAlumnus);

    // Load Author Stories
    await loadAuthorStories(activeAlumnus.uid);

  } catch (err) {
    console.error('Error loading public profile:', err);
  }
}

async function loadRelatedAlumni(target) {
  const container = document.getElementById('related-alumni-list');
  if (!container) return;

  const all = await getAlumni();
  const related = all.filter(a => a.uid !== target.uid && (a.gradYear === target.gradYear || a.industry === target.industry)).slice(0, 4);

  if (!related.length) {
    container.innerHTML = `<p style="font-size: var(--text-xs); color: var(--color-text-muted);">No related cohort alumni found.</p>`;
    return;
  }

  container.innerHTML = related.map(a => `
    <a href="profile.html?id=${a.uid}" class="related-alumnus-item">
      <img src="${a.photoURL}" alt="${escapeHTML(a.name)}" class="related-alumnus-avatar" />
      <div>
        <div class="related-alumnus-name">${escapeHTML(a.name)}</div>
        <div class="related-alumnus-role">${escapeHTML(a.jobTitle)} at ${escapeHTML(a.company)} &bull; '${String(a.gradYear).slice(-2)}</div>
      </div>
    </a>
  `).join('');
}

async function loadAuthorStories(uid) {
  const wrap = document.getElementById('pub-author-stories-wrap');
  const list = document.getElementById('pub-author-stories-list');
  if (!wrap || !list) return;

  try {
    const stories = await getSubmissions('approved', uid);
    if (!stories || !stories.length) {
      wrap.style.display = 'none';
      return;
    }

    wrap.style.display = 'block';
    list.innerHTML = stories.map(s => `
      <div style="padding: var(--space-4); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-sm); margin-bottom: var(--space-3);">
        <span class="badge badge-accent" style="margin-bottom: var(--space-2); display: inline-block;">${escapeHTML(s.category || 'Gazette Article')}</span>
        <h4 style="font-family: var(--font-heading); font-size: var(--text-base); margin-bottom: 2px;">
          <a href="news.html" style="color: inherit; text-decoration: none;">${escapeHTML(s.title)}</a>
        </h4>
        <p style="font-size: var(--text-xs); color: var(--color-text-secondary); margin-bottom: 0;">
          ${escapeHTML(s.excerpt || s.body.slice(0, 100) + '...')}
        </p>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error loading author stories:', err);
  }
}

/**
 * ==========================================================================
 * 2. MODE SWITCHERS (Public View vs Private Editor)
 * ==========================================================================
 */
function initModeSwitchers() {
  const publicView = document.getElementById('public-profile-view');
  const editView = document.getElementById('edit-profile-view');
  const switchToEditBtn = document.getElementById('switch-to-edit-btn');
  const switchToPublicBtn = document.getElementById('switch-to-public-btn');

  if (switchToEditBtn) {
    switchToEditBtn.addEventListener('click', () => {
      publicView.style.display = 'none';
      editView.style.display = 'block';
      populateEditForm(activeAlumnus);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (switchToPublicBtn) {
    switchToPublicBtn.addEventListener('click', () => {
      editView.style.display = 'none';
      publicView.style.display = 'block';
      loadPublicProfile(activeAlumnus.uid);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/**
 * ==========================================================================
 * 3. SELF-SERVICE FORM LOGIC
 * ==========================================================================
 */
function populateEditForm(profile) {
  if (!profile) return;

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

  currentPhotoURL = profile.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';
  
  const avatarImg = document.getElementById('avatar-preview-img');
  if (avatarImg) avatarImg.src = currentPhotoURL;

  updateLivePreview();
  loadMySubmissions(profile.uid);
}

function initFormListeners() {
  const form = document.getElementById('profile-form');
  if (!form) return;

  const liveInputs = [
    'profile-name', 'profile-jobtitle', 'profile-company',
    'profile-gradyear', 'profile-degree', 'profile-city', 'profile-country'
  ];

  liveInputs.forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateLivePreview);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById('save-profile-btn');
    if (!saveBtn) return;

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving Changes...';

    try {
      const updatedProfile = {
        name: document.getElementById('profile-name').value.trim(),
        gradYear: parseInt(document.getElementById('profile-gradyear').value, 10),
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

      await saveAlumniProfile(activeAlumnus.uid, updatedProfile);
      activeAlumnus = { ...activeAlumnus, ...updatedProfile };
      showToast('Profile updated successfully!', 'success');

      // Auto-switch back to public view after brief delay
      setTimeout(() => {
        document.getElementById('switch-to-public-btn')?.click();
      }, 700);

    } catch (err) {
      console.error(err);
      showToast('Error saving profile: ' + err.message, 'danger');
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Profile Changes';
    }
  });
}

function updateLivePreview() {
  const name = document.getElementById('profile-name')?.value || 'Your Name';
  const jobTitle = document.getElementById('profile-jobtitle')?.value || 'Job Title';
  const company = document.getElementById('profile-company')?.value || 'Company Name';
  const gradYear = document.getElementById('profile-gradyear')?.value || new Date().getFullYear();
  const city = document.getElementById('profile-city')?.value || 'City';
  const country = document.getElementById('profile-country')?.value || 'Country';

  const previewName = document.getElementById('preview-name');
  const previewRole = document.getElementById('preview-role');
  const previewMeta = document.getElementById('preview-meta');
  const previewLocation = document.getElementById('preview-location');
  const previewAvatar = document.getElementById('preview-avatar');

  if (previewName) previewName.textContent = name;
  if (previewRole) previewRole.innerHTML = `${escapeHTML(jobTitle)} at <strong>${escapeHTML(company)}</strong>`;
  if (previewMeta) previewMeta.textContent = `Class of ${gradYear}`;
  if (previewLocation) previewLocation.textContent = `${city}${country ? ', ' + country : ''}`;
  if (previewAvatar && currentPhotoURL) previewAvatar.src = currentPhotoURL;
}

function initPhotoUpload() {
  const fileInput = document.getElementById('avatar-file-input');
  const uploadBtn = document.getElementById('upload-photo-btn');

  uploadBtn?.addEventListener('click', () => fileInput?.click());

  fileInput?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      uploadBtn.disabled = true;
      uploadBtn.textContent = 'Uploading Portrait...';
      const uploadedURL = await uploadProfilePhoto(activeAlumnus.uid, file);
      currentPhotoURL = uploadedURL;

      const avatarImg = document.getElementById('avatar-preview-img');
      if (avatarImg) avatarImg.src = uploadedURL;
      updateLivePreview();
      showToast('Portrait photo updated!', 'success');
    } catch (err) {
      showToast('Photo upload failed: ' + err.message, 'danger');
    } finally {
      uploadBtn.disabled = false;
      uploadBtn.textContent = 'Upload Portrait Image';
    }
  });
}

async function loadMySubmissions(uid) {
  const list = document.getElementById('my-submissions-list');
  if (!list) return;

  try {
    const submissions = await getSubmissions(null, uid);
    if (!submissions || !submissions.length) {
      list.innerHTML = `
        <div class="empty-state" style="padding: var(--space-8);">
          <p class="empty-text">You have not submitted any Gazette stories yet.</p>
          <a href="news.html#submit" class="btn btn-primary btn-sm">Submit an Article</a>
        </div>
      `;
      return;
    }

    list.innerHTML = submissions.map(s => {
      const statusClass = s.status === 'approved' ? 'badge-success' : s.status === 'rejected' ? 'badge-danger' : 'badge-warning';
      return `
        <div class="submission-item">
          <div>
            <h4 style="font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--color-primary); margin-bottom: 2px;">${escapeHTML(s.title)}</h4>
            <span style="font-size: var(--text-xs); color: var(--color-text-muted);">${escapeHTML(s.category)} &bull; ${new Date(s.createdAt).toLocaleDateString()}</span>
          </div>
          <span class="badge ${statusClass}" style="text-transform: capitalize;">${escapeHTML(s.status)}</span>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error('Error loading submissions:', err);
  }
}
