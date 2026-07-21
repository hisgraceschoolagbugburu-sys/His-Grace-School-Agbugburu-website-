/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Applicant Dashboard Script
 * Handles live applicant profile fetching from Cloud Firestore, UI updates, navigation, and logout workflow.
 */

import { HGS_SESSION } from './session.js';
import { HGS_AUTH } from './auth.js';
import { HGS_DB } from './database.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Check session / route guard
  const user = HGS_SESSION.requireAuthentication(['applicant', 'administrator'], 'applicant-login.html');
  if (!user) return; // Redirecting

  // --- DOM ELEMENTS ---
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const portalDropdown = document.getElementById('portal-dropdown');
  const toastContainer = document.getElementById('toast-container');

  // Sidebar Elements
  const sidebarAvatar = document.getElementById('profile-avatar');
  const userDisplayName = document.getElementById('user-display-name');
  const userIdEl = document.querySelector('.user-info .user-id');
  const welcomeUserName = document.getElementById('welcome-user-name');

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
    if (!toastContainer) return;
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

  // --- FETCH & POPULATE APPLICANT DATA FROM FIRESTORE ---
  try {
    let applicantData = await HGS_DB.dbGetDoc('applicants', user.uid);
    if (!applicantData) {
      applicantData = user; // Fallback to session data
    }

    const fullName = `${applicantData.firstName || ''} ${applicantData.surname || ''}`.trim() || applicantData.displayName || 'Applicant User';
    const initials = (applicantData.firstName ? applicantData.firstName[0] : 'A') + (applicantData.surname ? applicantData.surname[0] : 'P');
    const applicantId = applicantData.applicantId || `HGS-2026-${user.uid.slice(0, 4).toUpperCase()}`;

    if (userDisplayName) userDisplayName.textContent = fullName;
    if (welcomeUserName) welcomeUserName.textContent = fullName;
    if (sidebarAvatar) sidebarAvatar.textContent = initials.toUpperCase();
    if (userIdEl) userIdEl.textContent = `ID: ${applicantId}`;

    // Update target class badge if element present
    const targetClassEl = document.querySelector('#card-status strong');
    if (targetClassEl && applicantData.applyingForClass) {
      targetClassEl.textContent = applicantData.applyingForClass;
    }

    // Update status badge if element present
    const statusBadge = document.querySelector('#card-status .badge-status');
    if (statusBadge && applicantData.status) {
      statusBadge.textContent = applicantData.status;
      statusBadge.className = `badge-status ${applicantData.status.toLowerCase()}`;
    }

  } catch (err) {
    console.error("Error loading applicant profile:", err);
  }

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

      showToast(`${portalName} navigation. Access granted based on current role permissions.`, calendarIcon);
    });
  });

  // --- SIDEBAR TAB SELECTION ---
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
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

      const checkIcon = `
        <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;

      if (targetId === 'section-profile') {
        showToast("Profile Status: Active. Complete full details in the application form.", checkIcon);
      } else if (targetId === 'section-application') {
        showToast("Admission Application card highlighted.", checkIcon);
      } else if (targetId === 'section-status') {
        showToast("Current Application Status loaded.", checkIcon);
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
    });
  }

  if (btnViewProfile) {
    btnViewProfile.addEventListener('click', (e) => {
      e.preventDefault();
      showToast(`Account Profile loaded for ${userDisplayName ? userDisplayName.textContent : 'Applicant'}.`);
    });
  }

  if (qlStatus) {
    qlStatus.addEventListener('click', (e) => {
      e.preventDefault();
      const statusCard = document.getElementById('card-status');
      if (statusCard) {
        statusCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  if (btnStartApplication) {
    btnStartApplication.addEventListener('click', (e) => {
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
  const handleLogout = async (e) => {
    e.preventDefault();
    
    const logoutIcon = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
    `;

    showToast("Signing out of Firebase Auth & Applicant Portal...", logoutIcon);

    try {
      await HGS_AUTH.logoutUser();
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 800);
    } catch (err) {
      console.error("Logout error:", err);
      window.location.href = 'index.html';
    }
  };

  if (sidebarLogoutBtn) {
    sidebarLogoutBtn.addEventListener('click', handleLogout);
  }

  if (quickLogoutBtn) {
    quickLogoutBtn.addEventListener('click', handleLogout);
  }
});
