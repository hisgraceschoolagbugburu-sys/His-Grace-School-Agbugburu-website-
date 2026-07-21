/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Applicant Login Script
 * Handles form validation, password toggling, visual loading indicators, and future Firebase notification banner.
 */

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
  const rememberCheckbox = document.getElementById('login-remember');

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

  // Handle mobile portal dropdown toggle
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

  // --- INTERCEPT PORTALS ---
  const portalLinks = document.querySelectorAll('.portal-link');
  portalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const portalName = link.textContent.trim();
      
      const calendarIcon = `
        <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      `;

      showToast(`${portalName} will be available in a future phase! (Administrator system preparation underway)`, calendarIcon);
    });
  });

  // --- TOGGLE PASSWORD VISIBILITY ---
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      
      // Update eye icon simple visual state
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

  // Clear all error states
  const clearErrors = () => {
    const inputs = loginForm.querySelectorAll('.form-control');
    inputs.forEach(input => input.classList.remove('is-invalid'));

    const errorTexts = loginForm.querySelectorAll('.error-text');
    errorTexts.forEach(el => el.style.display = 'none');
  };

  // --- LOGIN FORM SUBMIT ---
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();
      
      // Hide previous alert
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

      // 1. Email (Required & Format)
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

      // 2. Password (Required)
      const password = passwordInput.value;
      if (!password) {
        setInvalid(passwordInput, 'error-password');
      }

      // --- HANDLE ERROR FLOW ---
      if (!isValid) {
        if (firstInvalidElement) {
          firstInvalidElement.focus();
        }

        const alertIcon = `
          <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        `;
        showToast("Please correct the errors in the login form.", alertIcon);
        return;
      }

      // --- HANDLE SUCCESS FLOW (FUTURE FIREBASE NOTIFICATION) ---
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      
      // Show loading spinner state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" style="animation: spin 1s linear infinite; width: 20px; height: 20px; margin-right: 8px; display: inline-block; vertical-align: middle;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <circle cx="12" cy="12" r="10" style="opacity: 0.25;"></circle>
          <path d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" style="opacity: 0.75;"></path>
        </svg>
        Authenticating Profile...
      `;

      setTimeout(() => {
        // Display Success Banner stating service will be activated after backend integration
        if (loginAlert) {
          loginAlert.className = "form-alert success";
          loginAlert.innerHTML = `
            <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
              <div style="background-color: var(--accent); color: var(--primary); width: 36px; height: 36px; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 10px rgba(212, 175, 55, 0.25);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <div>
                <h4 style="color: var(--primary); font-size: 1.05rem; font-weight: 700; margin-bottom: 0.25rem;">Validation Successful</h4>
                <p style="color: var(--text-dark); font-size: 0.9rem; line-height: 1.5; margin-bottom: 0; font-weight: 500;">
                  Login service will be activated after backend integration.
                </p>
                <p style="color: var(--text-muted); font-size: 0.82rem; line-height: 1.4; margin-top: 0.4rem; margin-bottom: 0;">
                  Your inputs are correct. This page is prepared to link with Firebase Authentication. Security modules will be activated once backend resources are deployed.
                </p>
              </div>
            </div>
          `;
          loginAlert.style.display = "block";
          loginAlert.style.padding = "1.5rem";
          loginAlert.style.borderRadius = "var(--radius-md)";
          loginAlert.style.marginBottom = "1.5rem";
        }

        // Restore button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        // Reset form fields
        loginForm.reset();

        // Scroll to success banner smoothly
        loginAlert.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

        // Toast feedback
        const checkIcon = `
          <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        showToast("Inputs verified successfully. Awaiting backend deployment phase.", checkIcon);

      }, 1500);

    });
  }
});
