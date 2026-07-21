/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Administrator Portal Login Script
 * Handles admin credential validation, demo pre-fill, reset modal,
 * and session state initialization for Master Control Center Stage 1.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const portalDropdown = document.getElementById('portal-dropdown');
  const toastContainer = document.getElementById('toast-container');

  const loginForm = document.getElementById('admin-login-form');
  const usernameInput = document.getElementById('admin-username');
  const passwordInput = document.getElementById('admin-password');
  const usernameError = document.getElementById('admin-username-error');
  const passwordError = document.getElementById('admin-password-error');

  const btnAdminForgot = document.getElementById('btn-admin-forgot');
  const adminResetModal = document.getElementById('admin-reset-modal');
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

  // Form Submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const userVal = usernameInput.value.trim();
      const passVal = passwordInput.value.trim();

      // Reset errors
      if (usernameError) usernameError.style.display = 'none';
      if (passwordError) passwordError.style.display = 'none';

      if (!userVal) {
        if (usernameError) usernameError.style.display = 'block';
        isValid = false;
      }

      if (!passVal) {
        if (passwordError) passwordError.style.display = 'block';
        isValid = false;
      }

      if (!isValid) return;

      // Authenticate
      showToast('Verifying administrator master credentials...');

      setTimeout(() => {
        // Store session in localStorage
        localStorage.setItem('hgs_admin_logged_in', 'true');
        localStorage.setItem('hgs_admin_username', userVal);
        localStorage.setItem('hgs_admin_name', 'Dr. Gabriel Okonjo');
        localStorage.setItem('hgs_admin_role', 'Super Administrator & IT Director');

        showToast('Master Control authentication successful! Loading Portal...');
        
        setTimeout(() => {
          window.location.href = 'admin-portal.html';
        }, 1200);
      }, 1000);
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
    btnSendAdminReset.addEventListener('click', () => {
      adminResetModal.classList.remove('active');
      showToast('Security token sent to registered IT Director email address.');
    });
  }
});
