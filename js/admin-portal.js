/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Administrator Portal Dashboard Script
 * Controls Master Control Center tab views, homepage management, quick actions,
 * coming soon overlays, file dropzones, and session authentication / logout.
 */

import { HGS_SESSION } from './session.js';
import { HGS_AUTH } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Session Guard Check - Ensure active Administrator session exists
  const currentUser = HGS_SESSION.requireAuthentication(['administrator'], 'admin-login.html');
  if (!currentUser) return;

  // DOM Elements
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const portalDropdown = document.getElementById('portal-dropdown');
  const toastContainer = document.getElementById('toast-container');

  const sidebarButtons = document.querySelectorAll('.admin-nav-btn[data-tab]');
  const sidebarLogoutBtn = document.getElementById('sidebar-admin-logout');

  const paneDashboard = document.getElementById('pane-admin-dashboard');
  const paneHomepage = document.getElementById('pane-admin-homepage');
  const paneCS = document.getElementById('pane-admin-cs');

  const csModuleHeading = document.getElementById('cs-module-heading');
  const csModuleNameText = document.getElementById('cs-module-name-text');
  const returnDashBtns = document.querySelectorAll('.btn-return-dash');

  // Quick Action Buttons
  const qaManageHomepage = document.getElementById('qa-manage-homepage');
  const qaReviewAdmissions = document.getElementById('qa-review-admissions');
  const qaViewStudents = document.getElementById('qa-view-students');
  const qaManageTeachers = document.getElementById('qa-manage-teachers');
  const qaAdminLogout = document.getElementById('qa-admin-logout');

  // Module Cards
  const moduleCards = document.querySelectorAll('.module-card-item');

  // Homepage Config Form & Dropzones
  const homepageConfigForm = document.getElementById('homepage-config-form');
  const dzSchoolLogo = document.getElementById('dz-school-logo');
  const dzHeroBg = document.getElementById('dz-hero-bg');
  const inputLogoFile = document.getElementById('input-logo-file');
  const inputHeroFile = document.getElementById('input-hero-file');

  // Update Welcome Banner User Info if element exists
  const adminDisplayNameEl = document.getElementById('admin-display-name');
  if (adminDisplayNameEl && currentUser.fullName) {
    adminDisplayNameEl.textContent = currentUser.fullName;
  }

  // Sticky Header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Drawer Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Mobile Portal Dropdown
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
  const showToast = (message) => {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  };

  // Titles mapping
  const getModuleTitle = (key) => {
    const map = {
      homepage: 'Homepage Management',
      admissions: 'Admission Management',
      students: 'Student Management',
      teachers: 'Teacher Management',
      gallery: 'Gallery Management',
      news: 'News & Notice Board',
      'admission-letters': 'Admission Letters & Certificates',
      qrcodes: 'QR Code Management',
      results: 'Results Management',
      timetable: 'Timetable Management',
      fees: 'School Fees Management',
      settings: 'Website Settings',
      profile: 'Administrator Profile'
    };
    return map[key] || 'Master Control Module';
  };

  // Switch Pane View Function
  const switchAdminPane = (targetTab) => {
    // Hide all panes
    if (paneDashboard) paneDashboard.style.display = 'none';
    if (paneHomepage) paneHomepage.style.display = 'none';
    if (paneCS) paneCS.style.display = 'none';

    // Update sidebar buttons active state
    sidebarButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === targetTab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (targetTab === 'dashboard') {
      if (paneDashboard) paneDashboard.style.display = 'block';
    } else if (targetTab === 'homepage') {
      if (paneHomepage) paneHomepage.style.display = 'block';
    } else {
      // Coming Soon View
      const title = getModuleTitle(targetTab);
      if (csModuleHeading) csModuleHeading.textContent = title;
      if (csModuleNameText) csModuleNameText.textContent = title;
      if (paneCS) paneCS.style.display = 'block';
    }

    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sidebar Buttons Event Handlers
  sidebarButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      switchAdminPane(tab);
    });
  });

  // Return to Dashboard Buttons
  returnDashBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchAdminPane('dashboard');
    });
  });

  // Module Cards Click Handlers
  moduleCards.forEach(card => {
    card.addEventListener('click', () => {
      const target = card.getAttribute('data-tab-target');
      if (target) {
        switchAdminPane(target);
      }
    });
  });

  // Quick Action Buttons Handlers
  if (qaManageHomepage) {
    qaManageHomepage.addEventListener('click', () => switchAdminPane('homepage'));
  }

  if (qaReviewAdmissions) {
    qaReviewAdmissions.addEventListener('click', () => switchAdminPane('admissions'));
  }

  if (qaViewStudents) {
    qaViewStudents.addEventListener('click', () => switchAdminPane('students'));
  }

  if (qaManageTeachers) {
    qaManageTeachers.addEventListener('click', () => switchAdminPane('teachers'));
  }

  // File Dropzone Handlers
  if (dzSchoolLogo && inputLogoFile) {
    dzSchoolLogo.addEventListener('click', () => inputLogoFile.click());
    inputLogoFile.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        showToast(`Selected logo file: ${e.target.files[0].name} (Ready for Firebase Storage)`);
      }
    });
  }

  if (dzHeroBg && inputHeroFile) {
    dzHeroBg.addEventListener('click', () => inputHeroFile.click());
    inputHeroFile.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        showToast(`Selected background: ${e.target.files[0].name} (Ready for Firebase Storage)`);
      }
    });
  }

  // Homepage Config Form Submit
  if (homepageConfigForm) {
    homepageConfigForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Homepage configuration updated successfully! Prepared for Firebase Storage & Firestore.');
    });
  }

  // Logout Handler (destroys Administrator session and redirects to index.html)
  const handleAdminLogout = async (e) => {
    if (e) e.preventDefault();
    showToast('Signing out of Master Control Center...');
    try {
      await HGS_AUTH.logoutUser();
    } catch (err) {
      console.warn('Logout error:', err);
    }
    localStorage.removeItem('hgs_admin_logged_in');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);
  };

  if (qaAdminLogout) qaAdminLogout.addEventListener('click', handleAdminLogout);
  if (sidebarLogoutBtn) sidebarLogoutBtn.addEventListener('click', handleAdminLogout);
});
