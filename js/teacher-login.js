/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Teacher Portal Login Script
 * Handles teacher login authentication demo, form validation, forgot password modal,
 * and session state setup for Teacher Portal Stage 1.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const portalDropdown = document.getElementById('portal-dropdown');
  const toastContainer = document.getElementById('toast-container');

  const loginForm = document.getElementById('teacher-login-form');
  const staffIdInput = document.getElementById('staff-id');
  const passwordInput = document.getElementById('teacher-password');
  const staffIdError = document.getElementById('staff-id-error');
  const passwordError = document.getElementById('teacher-password-error');

  const btnForgotPassword = document.getElementById('btn-forgot-password');
  const forgotModal = document.getElementById('forgot-password-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnSendReset = document.getElementById('btn-send-reset');

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

  // Mobile Dropdown
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
    }, 4000);
  };

  // Form Validation & Login Submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const idVal = staffIdInput.value.trim();
      const passVal = passwordInput.value.trim();

      // Reset errors
      if (staffIdError) staffIdError.style.display = 'none';
      if (passwordError) passwordError.style.display = 'none';

      if (!idVal) {
        if (staffIdError) staffIdError.style.display = 'block';
        isValid = false;
      }

      if (!passVal) {
        if (passwordError) passwordError.style.display = 'block';
        isValid = false;
      }

      if (!isValid) return;

      // Simulate teacher portal login state
      showToast('Authenticating Staff ID credentials...');

      setTimeout(() => {
        // Save dummy session state to localStorage
        localStorage.setItem('hgs_teacher_logged_in', 'true');
        localStorage.setItem('hgs_staff_id', idVal);
        localStorage.setItem('hgs_teacher_name', 'Mr. Emmanuel Adebayo');

        showToast('Login successful! Redirecting to Teacher Dashboard...');
        
        setTimeout(() => {
          window.location.href = 'teacher-portal.html';
        }, 1200);
      }, 1000);
    });
  }

  // Forgot Password Modal Handlers
  if (btnForgotPassword && forgotModal) {
    btnForgotPassword.addEventListener('click', (e) => {
      e.preventDefault();
      forgotModal.classList.add('active');
    });
  }

  if (btnCloseModal && forgotModal) {
    btnCloseModal.addEventListener('click', () => {
      forgotModal.classList.remove('active');
    });
  }

  if (btnSendReset && forgotModal) {
    btnSendReset.addEventListener('click', () => {
      forgotModal.classList.remove('active');
      showToast('Staff password reset request logged. IT administrator will contact you shortly.');
    });
  }
});
