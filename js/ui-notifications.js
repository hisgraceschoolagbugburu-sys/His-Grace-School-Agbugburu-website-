/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Reusable UI Notifications, Loading Overlays & Confirmation Dialogs (HGS_UI)
 * Provides project-wide feedback UI for success alerts, warnings, errors,
 * asynchronous loading spinners, and interactive modal dialogs.
 */

(function (global) {
  'use strict';

  /**
   * Helper to ensure Toast Container element exists on DOM
   */
  function _getOrCreateToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  /**
   * Helper to create styled SVG Icons
   */
  function _getNotificationIcon(type) {
    switch (type) {
      case 'success':
        return `<svg class="toast-icon" style="color: #059669;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      case 'warning':
        return `<svg class="toast-icon" style="color: #D97706;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
      case 'error':
        return `<svg class="toast-icon" style="color: #DC2626;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
      default:
        return `<svg class="toast-icon" style="color: #123E7C;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }
  }

  const HGS_UI = {

    /**
     * Displays a Success Notification Toast
     * @param {string} message - Feedback description
     * @param {string} [title] - Optional title
     */
    showSuccess: function (message, title) {
      this._createToast('success', message, title);
    },

    /**
     * Displays a Warning Notification Toast
     * @param {string} message - Warning text
     * @param {string} [title] - Optional title
     */
    showWarning: function (message, title) {
      this._createToast('warning', message, title);
    },

    /**
     * Displays an Error Notification Toast
     * @param {string} message - Error description
     * @param {string} [title] - Optional title
     */
    showError: function (message, title) {
      this._createToast('error', message, title);
    },

    /**
     * Creates and triggers a toast notification on screen
     * @private
     */
    _createToast: function (type, message, title) {
      const container = _getOrCreateToastContainer();
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      
      const icon = _getNotificationIcon(type);
      const titleHTML = title ? `<strong style="display: block; font-size: 0.85rem; margin-bottom: 2px;">${title}</strong>` : '';

      toast.innerHTML = `
        ${icon}
        <div>
          ${titleHTML}
          <span>${message}</span>
        </div>
      `;

      container.appendChild(toast);

      setTimeout(() => toast.classList.add('show'), 10);
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
      }, 4500);
    },

    /**
     * Shows a full-screen or container loading overlay for async tasks.
     * @param {string} [loadingText="Processing request..."] - Spinner message
     */
    showLoading: function (loadingText = "Processing request...") {
      let overlay = document.getElementById('hgs-global-loader');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'hgs-global-loader';
        overlay.style.cssText = `
          position: fixed;
          inset: 0;
          background-color: rgba(9, 33, 68, 0.75);
          backdrop-filter: blur(4px);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-family: inherit;
          opacity: 0;
          transition: opacity 0.3s ease;
        `;

        overlay.innerHTML = `
          <div style="
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.2);
            border-top: 4px solid #D4AF37;
            border-radius: 50%;
            animation: hgs-spin 0.8s linear infinite;
            margin-bottom: 1rem;
          "></div>
          <p id="hgs-loader-text" style="font-size: 1rem; font-weight: 600; letter-spacing: 0.5px; margin: 0;">${loadingText}</p>
          <style>
            @keyframes hgs-spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        `;
        document.body.appendChild(overlay);
      } else {
        const textEl = document.getElementById('hgs-loader-text');
        if (textEl) textEl.textContent = loadingText;
      }

      overlay.style.display = 'flex';
      setTimeout(() => { overlay.style.opacity = '1'; }, 10);
    },

    /**
     * Hides the active loading spinner overlay.
     */
    hideLoading: function () {
      const overlay = document.getElementById('hgs-global-loader');
      if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.style.display = 'none';
        }, 300);
      }
    },

    /**
     * Displays a reusable, promise-based Confirmation Dialog Modal.
     *
     * @param {Object} options
     * @param {string} [options.title="Confirmation Required"]
     * @param {string} options.message - Confirmation prompt message
     * @param {string} [options.confirmText="Confirm"]
     * @param {string} [options.cancelText="Cancel"]
     * @returns {Promise<boolean>} Resolves to true if user confirmed, false if cancelled.
     */
    showConfirmModal: function (options) {
      return new Promise((resolve) => {
        const title = options.title || "Confirmation Required";
        const message = options.message || "Are you sure you want to proceed?";
        const confirmText = options.confirmText || "Confirm";
        const cancelText = options.cancelText || "Cancel";

        let modalOverlay = document.getElementById('hgs-confirm-modal');
        if (modalOverlay) modalOverlay.remove();

        modalOverlay = document.createElement('div');
        modalOverlay.id = 'hgs-confirm-modal';
        modalOverlay.style.cssText = `
          position: fixed;
          inset: 0;
          background-color: rgba(9, 33, 68, 0.82);
          backdrop-filter: blur(6px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          opacity: 0;
          transition: opacity 0.25s ease;
        `;

        modalOverlay.innerHTML = `
          <div style="
            background: #FFFFFF;
            width: 100%;
            max-width: 440px;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
            border: 1px solid #E2E8F0;
            text-align: center;
            transform: translateY(20px);
            transition: transform 0.25s ease;
          ">
            <div style="
              width: 52px;
              height: 52px;
              border-radius: 50%;
              background: rgba(212, 175, 55, 0.15);
              color: #B48811;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 1rem auto;
              border: 1.5px solid #D4AF37;
            ">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            
            <h3 style="color: #123E7C; font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; font-family: inherit;">
              ${title}
            </h3>
            
            <p style="color: #475569; font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.5rem; font-family: inherit;">
              ${message}
            </p>

            <div style="display: flex; gap: 0.75rem; justify-content: center;">
              <button id="hgs-btn-modal-cancel" style="
                padding: 0.65rem 1.25rem;
                border-radius: 6px;
                border: 1px solid #CBD5E1;
                background: #FFFFFF;
                color: #334155;
                font-weight: 600;
                font-size: 0.875rem;
                cursor: pointer;
              ">${cancelText}</button>
              
              <button id="hgs-btn-modal-confirm" style="
                padding: 0.65rem 1.5rem;
                border-radius: 6px;
                border: none;
                background: #123E7C;
                color: #FFFFFF;
                font-weight: 700;
                font-size: 0.875rem;
                cursor: pointer;
              ">${confirmText}</button>
            </div>
          </div>
        `;

        document.body.appendChild(modalOverlay);

        setTimeout(() => {
          modalOverlay.style.opacity = '1';
          const card = modalOverlay.firstElementChild;
          if (card) card.style.transform = 'translateY(0)';
        }, 10);

        const cleanup = () => {
          modalOverlay.style.opacity = '0';
          setTimeout(() => modalOverlay.remove(), 250);
        };

        const btnCancel = document.getElementById('hgs-btn-modal-cancel');
        const btnConfirm = document.getElementById('hgs-btn-modal-confirm');

        if (btnCancel) {
          btnCancel.addEventListener('click', () => {
            cleanup();
            resolve(false);
          });
        }

        if (btnConfirm) {
          btnConfirm.addEventListener('click', () => {
            cleanup();
            resolve(true);
          });
        }
      });
    }
  };

  // Attach to global window object
  global.HGS_UI = Object.freeze(HGS_UI);

})(typeof window !== 'undefined' ? window : this);
