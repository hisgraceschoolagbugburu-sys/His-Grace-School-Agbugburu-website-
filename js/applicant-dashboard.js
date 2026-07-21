/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Applicant Dashboard Script
 * Handles navigation, interactive sidebar links, quick link triggers, toasts, and logout workflow.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM ELEMENTS ---
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const portalDropdown = document.getElementById('portal-dropdown');
  const toastContainer = document.getElementById('toast-container');

  // Sidebar Links
  const sidebarLinks = document.querySelectorAll('.sidebar-nav-link[data-target]');
  const sidebarLogoutBtn = document.getElementById('btn-sidebar-logout');
  const quickLogoutBtn = document.getElementById('ql-logout');

  // Quick Action Links
  const qlProfile = document.getElementById('ql-profile');
  const qlStatus = document.getElementById('ql-status');
  const btnViewProfile = document.getElementById('btn-view-profile');
  const btnStartApplication = document.getElementById('btn-start-application');

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

  // --- SIDEBAR TAB SELECTION ---
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update active sidebar state
      sidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const targetId = link.getAttribute('data-target');
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }

      // Contextual toast feedback
      const checkIcon = `
        <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;

      if (targetId === 'section-profile') {
        showToast("Profile Status: Not Completed. Full details will be captured in the application form.", checkIcon);
      } else if (targetId === 'section-application') {
        showToast("Admission Application card highlighted.", checkIcon);
      } else if (targetId === 'section-status') {
        showToast("Current Application Status: Draft.", checkIcon);
      } else if (targetId === 'section-notifications') {
        showToast("Notifications: No unread administrative messages.", checkIcon);
      }
    });
  });

  // --- QUICK LINKS HANDLERS ---
  if (qlProfile) {
    qlProfile.addEventListener('click', (e) => {
      e.preventDefault();
      const profileCard = document.getElementById('card-profile');
      if (profileCard) {
        profileCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      showToast("Profile Status: Not Completed. You can complete full profile during form filling.");
    });
  }

  if (btnViewProfile) {
    btnViewProfile.addEventListener('click', (e) => {
      e.preventDefault();
      showToast("Account Profile: Samuel Adebayo (Applicant ID: HGS-2026-8942).");
    });
  }

  if (qlStatus) {
    qlStatus.addEventListener('click', (e) => {
      e.preventDefault();
      const statusCard = document.getElementById('card-status');
      if (statusCard) {
        statusCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      showToast("Application Status: Draft (Pending form completion).");
    });
  }

  // --- START APPLICATION FEEDBACK ---
  if (btnStartApplication) {
    btnStartApplication.addEventListener('click', (e) => {
      // Don't intercept completely so browser attempts navigation to admission-application.html as requested
      const infoIcon = `
        <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#123E7C" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      `;
      showToast("Initiating Admission Application Form...", infoIcon);
    });
  }

  // --- LOGOUT WORKFLOW ---
  const handleLogout = (e) => {
    e.preventDefault();
    
    const logoutIcon = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
    `;

    showToast("Signing out of applicant portal...", logoutIcon);

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  };

  if (sidebarLogoutBtn) {
    sidebarLogoutBtn.addEventListener('click', handleLogout);
  }

  if (quickLogoutBtn) {
    quickLogoutBtn.addEventListener('click', handleLogout);
  }
});
