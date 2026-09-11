/**
 * ==========================================================================
 * PAGE LOGIC: EVENTS (events.html)
 * Features:
 * - Dynamic event card interactions
 * - Interactive RSVP modal with input validation
 * - Toast confirmation & localStorage persistence
 * ==========================================================================
 */

import { showToast } from '../nav.js';
import { getCurrentUser } from '../auth.js';

document.addEventListener('DOMContentLoaded', () => {
  initRSVPFlow();
});

function initRSVPFlow() {
  // 1. Inject RSVP Modal into DOM
  let rsvpModal = document.getElementById('rsvp-modal');
  if (!rsvpModal) {
    rsvpModal = document.createElement('div');
    rsvpModal.id = 'rsvp-modal';
    rsvpModal.className = 'modal-overlay';
    rsvpModal.setAttribute('role', 'dialog');
    rsvpModal.setAttribute('aria-modal', 'true');
    rsvpModal.innerHTML = `
      <div class="modal-content" style="max-width: 500px;">
        <div class="modal-header">
          <h3 class="modal-title" id="rsvp-modal-title">RSVP for Event</h3>
          <button id="close-rsvp-modal" class="modal-close-btn" aria-label="Close dialog">&times;</button>
        </div>
        <form id="rsvp-form">
          <div class="modal-body">
            <div style="background: var(--color-cream); border-left: 3px solid var(--color-accent); padding: var(--space-3) var(--space-4); margin-bottom: var(--space-5); border-radius: var(--radius-xs);">
              <span id="rsvp-event-name" style="font-weight: var(--font-bold); color: var(--color-primary); display: block;">Annual Homecoming &amp; Innovation Gala</span>
              <span id="rsvp-event-loc" style="font-size: var(--text-xs); color: var(--color-text-muted);">Campus Quadrangle &bull; Boston, MA</span>
            </div>

            <div class="form-group">
              <label for="rsvp-name" class="form-label">Full Name <span class="required">*</span></label>
              <input type="text" id="rsvp-name" class="form-control" placeholder="Your full name" required />
            </div>

            <div class="form-group">
              <label for="rsvp-email" class="form-label">Email Address <span class="required">*</span></label>
              <input type="email" id="rsvp-email" class="form-control" placeholder="you@alumni.org" required />
            </div>

            <div class="form-group">
              <label for="rsvp-batch" class="form-label">Class Year</label>
              <input type="number" id="rsvp-batch" class="form-control" placeholder="e.g. 2018" min="1950" max="2030" />
            </div>

            <div class="form-group">
              <label for="rsvp-guests" class="form-label">Attending Guests</label>
              <select id="rsvp-guests" class="form-control">
                <option value="1">1 (Just myself)</option>
                <option value="2">2 (Alumnus + 1 Guest)</option>
                <option value="3">3 (Alumnus + 2 Guests)</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline btn-sm" id="cancel-rsvp-btn">Cancel</button>
            <button type="submit" class="btn btn-accent btn-sm">Confirm My Attendance</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(rsvpModal);
  }

  // 2. Enable RSVP buttons on event cards
  const rsvpButtons = document.querySelectorAll('.event-stub-card button');
  let selectedEventTitle = 'Annual Homecoming Gala';
  let selectedEventLocation = 'Campus Quadrangle • Boston, MA';

  rsvpButtons.forEach(btn => {
    btn.removeAttribute('disabled');
    btn.textContent = 'Reserve Place &rarr;';
    btn.classList.remove('btn-outline');
    btn.classList.add('btn-primary');

    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.event-stub-card');
      if (card) {
        selectedEventTitle = card.querySelector('h3')?.textContent || 'Alumni Gathering';
        selectedEventLocation = card.querySelector('p')?.textContent || 'Apex University';
      }

      const eventNameEl = document.getElementById('rsvp-event-name');
      const eventLocEl = document.getElementById('rsvp-event-loc');
      if (eventNameEl) eventNameEl.textContent = selectedEventTitle;
      if (eventLocEl) eventLocEl.textContent = selectedEventLocation;

      // Prepopulate if logged in
      const user = getCurrentUser();
      if (user) {
        const nameInput = document.getElementById('rsvp-name');
        const emailInput = document.getElementById('rsvp-email');
        const batchInput = document.getElementById('rsvp-batch');
        if (nameInput && user.name) nameInput.value = user.name;
        if (emailInput && user.email) emailInput.value = user.email;
        if (batchInput && user.gradYear) batchInput.value = user.gradYear;
      }

      rsvpModal.classList.add('open');
    });
  });

  const closeModal = () => rsvpModal.classList.remove('open');
  document.getElementById('close-rsvp-modal')?.addEventListener('click', closeModal);
  document.getElementById('cancel-rsvp-btn')?.addEventListener('click', closeModal);
  rsvpModal.addEventListener('click', (e) => {
    if (e.target === rsvpModal) closeModal();
  });

  // 3. Handle RSVP Form Submission
  const form = document.getElementById('rsvp-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('rsvp-name').value.trim();
    const email = document.getElementById('rsvp-email').value.trim();

    const rsvps = JSON.parse(localStorage.getItem('alumni_network_rsvps') || '[]');
    rsvps.push({
      event: selectedEventTitle,
      name,
      email,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('alumni_network_rsvps', JSON.stringify(rsvps));

    closeModal();
    showToast(`RSVP Confirmed for ${selectedEventTitle}! We have reserved your place.`, 'success');
  });
}
