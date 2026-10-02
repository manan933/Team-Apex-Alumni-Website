/**
 * ==========================================================================
 * PWA CLIENT MANAGER (`js/pwa.js`)
 * Service Worker Registration, Install App Banner & Network Status Alerts
 * ==========================================================================
 */

let deferredPrompt = null;

// Register Service Worker on page load
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((registration) => {
        console.log('[PWA] Service Worker registered with scope:', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[PWA] New version available! Content will update on next refresh.');
              }
            });
          }
        });
      })
      .catch((error) => {
        console.warn('[PWA] Service Worker registration failed:', error);
      });
  });
}

// Handle PWA Install Prompt Banner
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent immediate default prompt
  e.preventDefault();
  deferredPrompt = e;

  // Check if previously dismissed recently
  const dismissedTime = localStorage.getItem('giet_pwa_dismissed');
  if (dismissedTime && Date.now() - parseInt(dismissedTime, 10) < 5 * 24 * 60 * 60 * 1000) {
    return; // Don't annoy user if dismissed within 5 days
  }

  showInstallBanner();
});

function showInstallBanner() {
  if (document.getElementById('pwa-install-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'pwa-install-banner';
  banner.className = 'pwa-banner';
  banner.setAttribute('role', 'alert');
  banner.innerHTML = `
    <div class="pwa-banner-inner">
      <div class="pwa-banner-icon">
        <img src="icons/icon-96x96.png" alt="GIET App Icon" width="40" height="40" />
      </div>
      <div class="pwa-banner-text">
        <div class="pwa-banner-title">Install GIET Alumni App</div>
        <div class="pwa-banner-desc">Fast, offline-ready access to directory and alumni events.</div>
      </div>
      <div class="pwa-banner-actions">
        <button id="pwa-install-action" class="btn btn-primary btn-sm">Install</button>
        <button id="pwa-dismiss-action" class="pwa-close-btn" aria-label="Dismiss installation prompt">&times;</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

  // Trigger animation after append
  requestAnimationFrame(() => {
    banner.classList.add('is-visible');
  });

  // Action listeners
  document.getElementById('pwa-install-action')?.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[PWA] Install prompt outcome: ${outcome}`);
      deferredPrompt = null;
      hideInstallBanner(banner);
    }
  });

  document.getElementById('pwa-dismiss-action')?.addEventListener('click', () => {
    localStorage.setItem('giet_pwa_dismissed', Date.now().toString());
    hideInstallBanner(banner);
  });
}

function hideInstallBanner(banner) {
  if (!banner) return;
  banner.classList.remove('is-visible');
  setTimeout(() => banner.remove(), 400);
}

// App successfully installed
window.addEventListener('appinstalled', () => {
  console.log('[PWA] GIET University Alumni App installed successfully!');
  deferredPrompt = null;
  const banner = document.getElementById('pwa-install-banner');
  if (banner) banner.remove();
});

// Network Connectivity Alerts
window.addEventListener('online', () => {
  showNetworkToast('You are back online.', 'success');
});

window.addEventListener('offline', () => {
  showNetworkToast('You are currently offline. Viewing cached content.', 'warning');
});

function showNetworkToast(message, type = 'info') {
  let toast = document.getElementById('pwa-network-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'pwa-network-toast';
    toast.className = 'pwa-toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className = `pwa-toast is-visible pwa-toast-${type}`;

  setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 4000);
}
