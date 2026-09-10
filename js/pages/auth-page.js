/**
 * ==========================================================================
 * PAGE LOGIC: AUTH (login.html, signup.html)
 * Form validation, error display, redirection to profile, forgot password
 * ==========================================================================
 */

import { login, signup, resetPassword, getCurrentUser, onAuthStateChange } from '../auth.js';
import { showToast } from '../nav.js';

document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, redirect to profile
  onAuthStateChange((user) => {
    if (user && !window.location.search.includes('redirect=false')) {
      // If coming to login while already authenticated, redirect to profile
      // Allow user to stay if they explicitly want to
      if (document.referrer.includes('login.html') || document.referrer.includes('signup.html')) {
        window.location.href = 'profile.html';
      }
    }
  });

  initLoginForm();
  initSignupForm();
  initForgotPasswordModal();
});

function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  const alertBox = document.getElementById('auth-alert');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!email || !password) {
      showAlert(alertBox, 'Please provide both email and password.', 'error');
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Authenticating...';
      showAlert(alertBox, '', 'hidden');

      const user = await login(email, password);
      showToast(`Welcome back, ${user.name || 'Alum'}!`, 'success');
      
      setTimeout(() => {
        window.location.href = 'profile.html';
      }, 600);
    } catch (err) {
      console.error(err);
      showAlert(alertBox, err.message || 'Invalid email or password. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In to Network';
    }
  });
}

function initSignupForm() {
  const form = document.getElementById('signup-form');
  if (!form) return;

  const alertBox = document.getElementById('auth-alert');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const gradYear = document.getElementById('signup-gradyear').value;
    const degree = document.getElementById('signup-degree')?.value || 'Bachelor of Science';
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password')?.value;
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!name || !email || !gradYear || !password) {
      showAlert(alertBox, 'Please complete all required fields.', 'error');
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      showAlert(alertBox, 'Passwords do not match.', 'error');
      return;
    }

    if (password.length < 6) {
      showAlert(alertBox, 'Password should be at least 6 characters long.', 'error');
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating Account...';
      showAlert(alertBox, '', 'hidden');

      await signup(email, password, { name, gradYear, degree });
      showToast('Account created successfully! Welcome to the network.', 'success');

      setTimeout(() => {
        window.location.href = 'profile.html';
      }, 600);
    } catch (err) {
      console.error(err);
      showAlert(alertBox, err.message || 'Could not register account. Email may already be in use.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Alumni Profile';
    }
  });
}

function initForgotPasswordModal() {
  const trigger = document.getElementById('forgot-password-trigger');
  const modal = document.getElementById('forgot-password-modal');
  const closeBtn = document.getElementById('close-forgot-modal');
  const form = document.getElementById('forgot-password-form');

  if (!trigger || !modal) return;

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('open');
  });

  closeBtn?.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value.trim();
    if (!email) return;

    try {
      await resetPassword(email);
      modal.classList.remove('open');
      showToast('Password reset instructions sent to your email.', 'info');
    } catch (err) {
      showToast(err.message || 'Error sending reset email.', 'danger');
    }
  });
}

function showAlert(alertEl, message, type = 'error') {
  if (!alertEl) return;
  if (type === 'hidden' || !message) {
    alertEl.className = 'auth-alert';
    alertEl.textContent = '';
    return;
  }
  alertEl.className = `auth-alert show auth-alert-${type}`;
  alertEl.textContent = message;
}
