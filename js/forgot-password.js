/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Forgot Password Script
 * Handles email validation, visual loading states, toast notifications, and backend integration preparation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM ELEMENTS ---
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const portalDropdown = document.getElementById('portal-dropdown');
  const toastContainer = document.getElementById('toast-container');
  const forgotForm = document.getElementById('forgot-form');
  const forgotAlert = document.getElementById('forgot-alert');

  // Form Inputs
  const emailInput = document.getElementById('forgot-email');

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

  // --- VALIDATION HELPER ---
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const showError = (inputEl, errorId, message, show = true) => {
    const errorEl = document.getElementById(errorId);
    const msgSpan = document.getElementById('error-email-msg');
    if (!errorEl || !inputEl) return;

    if (show) {
      if (msgSpan && message) msgSpan.textContent = message;
      inputEl.classList.add('is-invalid');
      errorEl.style.display = 'flex';
    } else {
      inputEl.classList.remove('is-invalid');
      errorEl.style.display = 'none';
    }
  };

  // Clear all error states
  const clearErrors = () => {
    if (emailInput) emailInput.classList.remove('is-invalid');
    const errorEl = document.getElementById('error-email');
    if (errorEl) errorEl.style.display = 'none';
  };

  // --- FORGOT PASSWORD FORM SUBMIT ---
  if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();
      
      // Hide previous alert
      if (forgotAlert) {
        forgotAlert.style.display = 'none';
      }

      // Email validation
      const email = emailInput.value.trim();
      let isValid = true;

      if (!email) {
        isValid = false;
        showError(emailInput, 'error-email', 'Email address is required.', true);
      } else if (!validateEmail(email)) {
        isValid = false;
        showError(emailInput, 'error-email', 'Please provide a valid email format.', true);
      }

      // --- HANDLE ERROR FLOW ---
      if (!isValid) {
        emailInput.focus();

        const alertIcon = `
          <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        `;
        showToast("Please enter a valid email address.", alertIcon);
        return;
      }

      // --- HANDLE SUCCESS FLOW (BACKEND PREPARATION) ---
      const submitBtn = forgotForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      
      // Show loading spinner state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" style="animation: spin 1s linear infinite; width: 20px; height: 20px; margin-right: 8px; display: inline-block; vertical-align: middle;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <circle cx="12" cy="12" r="10" style="opacity: 0.25;"></circle>
          <path d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" style="opacity: 0.75;"></path>
        </svg>
        Sending Reset Link...
      `;

      setTimeout(() => {
        // Display Success Banner stating password reset service will be activated after backend integration
        if (forgotAlert) {
          forgotAlert.className = "form-alert success";
          forgotAlert.innerHTML = `
            <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
              <div style="background-color: var(--accent); color: var(--primary); width: 36px; height: 36px; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 10px rgba(212, 175, 55, 0.25);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <div>
                <h4 style="color: var(--primary); font-size: 1.05rem; font-weight: 700; margin-bottom: 0.25rem;">Reset Request Received</h4>
                <p style="color: var(--text-dark); font-size: 0.9rem; line-height: 1.5; margin-bottom: 0; font-weight: 500;">
                  A password reset service will be activated after backend integration.
                </p>
                <p style="color: var(--text-muted); font-size: 0.82rem; line-height: 1.4; margin-top: 0.4rem; margin-bottom: 0;">
                  Target Email: <strong>${email}</strong>. Once Firebase/EmailJS backend integration is connected, an automated password recovery link will be sent to this email address.
                </p>
              </div>
            </div>
          `;
          forgotAlert.style.display = "block";
          forgotAlert.style.padding = "1.5rem";
          forgotAlert.style.borderRadius = "var(--radius-md)";
          forgotAlert.style.marginBottom = "1.5rem";
        }

        // Restore button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        // Reset form fields
        forgotForm.reset();

        // Scroll to alert banner smoothly
        forgotAlert.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

        // Toast feedback
        const checkIcon = `
          <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        showToast("Password reset request verified. Awaiting backend activation.", checkIcon);

      }, 1500);

    });
  }
});
