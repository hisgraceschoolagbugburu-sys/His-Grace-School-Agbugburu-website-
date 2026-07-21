/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Applicant Login Script
 * Handles form validation, password toggling, and Firebase Auth sign-in.
 */

import { HGS_AUTH } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM ELEMENTS ---
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const portalDropdown = document.getElementById('portal-dropdown');
  const toastContainer = document.getElementById('toast-container');
  const loginForm = document.getElementById('login-form');
  const loginAlert = document.getElementById('login-alert');

  // Form Inputs
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');

  // Eye Toggle
  const togglePasswordBtn = document.getElementById('toggle-password');

  // --- STICKY NAV ON SCROLL ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- MOBILE NAVIGATION DRAWER ---
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

  // --- TOAST SYSTEM ---
  const showToast = (message, iconSVG = null) => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const icon = iconSVG || `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    `;

    toast.innerHTML = `
      ${icon}
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4500);
  };

  // --- TOGGLE PASSWORD VISIBILITY ---
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      
      togglePasswordBtn.innerHTML = isPassword ? `
        <svg class="toggle-icon-eye" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      ` : `
        <svg class="toggle-icon-eye" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      `;
    });
  }

  // --- VALIDATION HELPER ---
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const showError = (inputEl, errorId, show = true) => {
    const errorEl = document.getElementById(errorId);
    if (!errorEl || !inputEl) return;

    if (show) {
      inputEl.classList.add('is-invalid');
      errorEl.style.display = 'flex';
    } else {
      inputEl.classList.remove('is-invalid');
      errorEl.style.display = 'none';
    }
  };

  const clearErrors = () => {
    const inputs = loginForm.querySelectorAll('.form-control');
    inputs.forEach(input => input.classList.remove('is-invalid'));

    const errorTexts = loginForm.querySelectorAll('.error-text');
    errorTexts.forEach(el => el.style.display = 'none');
  };

  // --- LOGIN FORM SUBMIT ---
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors();
      
      if (loginAlert) {
        loginAlert.style.display = 'none';
      }

      let isValid = true;
      let firstInvalidElement = null;

      const setInvalid = (inputEl, errorId) => {
        isValid = false;
        showError(inputEl, errorId, true);
        if (!firstInvalidElement) {
          firstInvalidElement = inputEl;
        }
      };

      const email = emailInput.value.trim();
      if (!email) {
        setInvalid(emailInput, 'error-email');
        const errorMsg = document.querySelector('#error-email span');
        if (errorMsg) errorMsg.textContent = 'Email address is required.';
      } else if (!validateEmail(email)) {
        setInvalid(emailInput, 'error-email');
        const errorMsg = document.querySelector('#error-email span');
        if (errorMsg) errorMsg.textContent = 'Please provide a valid email format.';
      }

      const password = passwordInput.value;
      if (!password) {
        setInvalid(passwordInput, 'error-password');
      }

      if (!isValid) {
        if (firstInvalidElement) {
          firstInvalidElement.focus();
        }
        showToast("Please correct the errors in the login form.");
        return;
      }

      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" style="animation: spin 1s linear infinite; width: 20px; height: 20px; margin-right: 8px; display: inline-block; vertical-align: middle;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <circle cx="12" cy="12" r="10" style="opacity: 0.25;"></circle>
          <path d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" style="opacity: 0.75;"></path>
        </svg>
        Authenticating with Firebase...
      `;

      try {
        const result = await HGS_AUTH.loginUser({ usernameOrEmail: email, password }, 'applicant');

        if (loginAlert) {
          loginAlert.className = "form-alert success";
          loginAlert.innerHTML = `
            <div style="display: flex; gap: 0.75rem; align-items: center; background-color: #D1FAE5; color: #065F46; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid #6EE7B7;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <div>
                <h4 style="color: #065F46; font-size: 1.05rem; font-weight: 700; margin-bottom: 0.15rem;">Authentication Successful</h4>
                <p style="font-size: 0.9rem; margin-bottom: 0;">Welcome back! Redirecting to your Applicant Dashboard...</p>
              </div>
            </div>
          `;
          loginAlert.style.display = "block";
          loginAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        const checkIcon = `
          <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        showToast(`Welcome back, ${result.user.displayName || result.user.surname || 'Applicant'}! Opening dashboard...`, checkIcon);

        setTimeout(() => {
          window.location.href = 'applicant-dashboard.html';
        }, 1000);

      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        let errorMsg = err.message || "Invalid credentials. Please check your email and password.";
        if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
          errorMsg = "Invalid email or password. Please verify your details or create an account.";
        }

        if (loginAlert) {
          loginAlert.className = "form-alert error";
          loginAlert.innerHTML = `
            <div style="display: flex; gap: 0.75rem; align-items: center; background-color: #FEE2E2; color: #991B1B; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid #FCA5A5;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span style="font-weight: 600;">${errorMsg}</span>
            </div>
          `;
          loginAlert.style.display = "block";
          loginAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }
});
