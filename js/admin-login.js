/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Administrator Portal Login Script
 * Handles Administrator ID authentication, Firestore verification, account status checks,
 * and secure password recovery workflow.
 */

import { HGS_AUTH } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const portalDropdown = document.getElementById('portal-dropdown');
  const toastContainer = document.getElementById('toast-container');

  const loginForm = document.getElementById('admin-login-form');
  const adminIdInput = document.getElementById('admin-username');
  const passwordInput = document.getElementById('admin-password');
  const adminIdError = document.getElementById('admin-username-error');
  const passwordError = document.getElementById('admin-password-error');
  const adminLoginAlert = document.getElementById('admin-login-alert');

  const btnAdminForgot = document.getElementById('btn-admin-forgot');
  const adminResetModal = document.getElementById('admin-reset-modal');
  const resetAdminInput = document.getElementById('reset-admin-user');
  const btnCloseAdminModal = document.getElementById('btn-close-admin-modal');
  const btnSendAdminReset = document.getElementById('btn-send-admin-reset');

  // Sticky Nav
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Drawer
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  if (portalDropdown) {
    const portalToggle = portalDropdown.querySelector('.dropdown-toggle');
    if (portalToggle) {
      portalToggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          portalDropdown.classList.toggle('active');
        }
      });
    }
  }

  // Toast Function
  const showToast = (message, isError = false) => {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const icon = isError 
      ? `<svg class="toast-icon" style="color: #EF4444;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
      : `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

    toast.innerHTML = `${icon}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 5000);
  };

  const showAlert = (message, isError = true) => {
    if (!adminLoginAlert) return;
    adminLoginAlert.style.display = 'block';
    adminLoginAlert.className = `form-alert ${isError ? 'error' : 'success'}`;
    adminLoginAlert.innerHTML = `
      <div style="display: flex; gap: 0.75rem; align-items: center; background-color: ${isError ? '#FEE2E2' : '#D1FAE5'}; color: ${isError ? '#991B1B' : '#065F46'}; padding: 1rem 1.25rem; border-radius: var(--radius-md); border: 1px solid ${isError ? '#FCA5A5' : '#6EE7B7'};">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${isError ? '#DC2626' : '#059669'}" stroke-width="2.5">
          ${isError 
            ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>' 
            : '<polyline points="20 6 9 17 4 12"></polyline>'}
        </svg>
        <span style="font-weight: 600; font-size: 0.9rem;">${message}</span>
      </div>
    `;
    adminLoginAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const hideAlert = () => {
    if (adminLoginAlert) adminLoginAlert.style.display = 'none';
  };

  // Form Submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert();

      let isValid = true;
      const adminIdVal = adminIdInput.value.trim();
      const passVal = passwordInput.value.trim();

      if (adminIdError) adminIdError.style.display = 'none';
      if (passwordError) passwordError.style.display = 'none';

      if (!adminIdVal) {
        if (adminIdError) {
          adminIdError.textContent = 'Please enter Administrator ID.';
          adminIdError.style.display = 'block';
        }
        isValid = false;
      }

      if (!passVal) {
        if (passwordError) {
          passwordError.textContent = 'Please enter password.';
          passwordError.style.display = 'block';
        }
        isValid = false;
      }

      if (!isValid) return;

      const submitBtn = document.getElementById('btn-admin-submit');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin" style="animation: spin 1s linear infinite; width: 18px; height: 18px; margin-right: 8px; display: inline-block; vertical-align: middle;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <circle cx="12" cy="12" r="10" style="opacity: 0.25;"></circle>
            <path d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" style="opacity: 0.75;"></path>
          </svg>
          Authenticating Master Credentials...
        `;
      }

      try {
        const result = await HGS_AUTH.loginAdministrator(adminIdVal, passVal);
        showAlert(`Welcome, ${result.user.fullName || 'Master Administrator'}! Redirecting to Dashboard...`, false);
        showToast(`Master Control authentication successful! Redirecting...`);
        
        setTimeout(() => {
          window.location.href = 'admin-portal.html';
        }, 1000);
      } catch (err) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }

        let errorMessage = err.message || "Invalid Administrator ID or Password.";
        showAlert(errorMessage, true);
        showToast(errorMessage, true);
      }
    });
  }

  // Security Modal Handlers
  if (btnAdminForgot && adminResetModal) {
    btnAdminForgot.addEventListener('click', (e) => {
      e.preventDefault();
      adminResetModal.classList.add('active');
    });
  }

  if (btnCloseAdminModal && adminResetModal) {
    btnCloseAdminModal.addEventListener('click', () => {
      adminResetModal.classList.remove('active');
    });
  }

  if (btnSendAdminReset && adminResetModal) {
    btnSendAdminReset.addEventListener('click', async () => {
      const resetIdVal = resetAdminInput ? resetAdminInput.value.trim() : '';
      if (!resetIdVal) {
        showToast("Please enter your Administrator ID.", true);
        return;
      }

      btnSendAdminReset.disabled = true;
      btnSendAdminReset.textContent = "Forwarding Request...";

      try {
        const message = await HGS_AUTH.requestAdminPasswordReset(resetIdVal);
        adminResetModal.classList.remove('active');
        btnSendAdminReset.disabled = false;
        btnSendAdminReset.textContent = "Submit Reset Request";

        showAlert(message, false);
        showToast(message, false);
      } catch (err) {
        btnSendAdminReset.disabled = false;
        btnSendAdminReset.textContent = "Submit Reset Request";
        showToast(err.message || "Failed to submit reset request.", true);
      }
    });
  }
});
