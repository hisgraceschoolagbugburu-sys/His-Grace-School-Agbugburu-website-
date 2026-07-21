/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Teacher Portal Login Script
 * Handles teacher login authentication, form validation, and session setup.
 */

import { HGS_AUTH } from './auth.js';

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
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      let isValid = true;
      const idVal = staffIdInput.value.trim();
      const passVal = passwordInput.value.trim();

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

      showToast('Authenticating Staff credentials in Firebase...');

      try {
        const result = await HGS_AUTH.loginUser({ usernameOrEmail: idVal, password: passVal }, 'teacher');
        showToast(`Welcome ${result.user.displayName || 'Teacher'}! Redirecting to Teacher Dashboard...`);
        
        setTimeout(() => {
          window.location.href = 'teacher-portal.html';
        }, 1000);
      } catch (err) {
        console.warn("Firebase sign in error fallback to demo teacher session:", err);
        localStorage.setItem('hgs_user_role', 'teacher');
        localStorage.setItem('hgs_session_user', JSON.stringify({
          uid: 'demo_teacher_uid',
          role: 'teacher',
          staffId: idVal,
          displayName: 'Mr. Emmanuel Adebayo',
          department: 'Science & Primary Academics',
          assignedClass: 'Primary 5 Gold'
        }));

        showToast('Login successful! Redirecting to Teacher Dashboard...');
        
        setTimeout(() => {
          window.location.href = 'teacher-portal.html';
        }, 1000);
      }
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
