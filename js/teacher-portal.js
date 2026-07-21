/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Teacher Portal Dashboard Script (Stage 1)
 * Handles tab navigation, module views, quick actions, coming soon overlays,
 * and session logout handler.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const portalDropdown = document.getElementById('portal-dropdown');
  const toastContainer = document.getElementById('toast-container');

  const sidebarButtons = document.querySelectorAll('.sidebar-item-btn[data-tab]');
  const sidebarLogoutBtn = document.getElementById('sidebar-logout-btn');

  const paneDashboard = document.getElementById('pane-dashboard');
  const paneProfile = document.getElementById('pane-profile');
  const paneAnnouncements = document.getElementById('pane-announcements');
  const paneComingSoon = document.getElementById('pane-coming-soon');

  const csPaneTitle = document.getElementById('cs-pane-title');
  const csFeatureName = document.getElementById('cs-feature-name');
  const backDashboardBtns = document.querySelectorAll('.btn-back-dashboard');

  const qaMyProfile = document.getElementById('qa-my-profile');
  const qaMyTimetable = document.getElementById('qa-my-timetable');
  const qaStudentResults = document.getElementById('qa-student-results');
  const qaAttendance = document.getElementById('qa-attendance');
  const qaLogout = document.getElementById('qa-logout');

  const moduleCards = document.querySelectorAll('.module-card');

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
    }, 3500);
  };

  // Function to switch active view pane
  const switchPane = (targetTab, featureName = '') => {
    // Hide all panes
    if (paneDashboard) paneDashboard.style.display = 'none';
    if (paneProfile) paneProfile.style.display = 'none';
    if (paneAnnouncements) paneAnnouncements.style.display = 'none';
    if (paneComingSoon) paneComingSoon.style.display = 'none';

    // Update sidebar active buttons
    sidebarButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === targetTab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Show appropriate pane
    if (targetTab === 'dashboard') {
      if (paneDashboard) paneDashboard.style.display = 'block';
    } else if (targetTab === 'profile') {
      if (paneProfile) paneProfile.style.display = 'block';
    } else if (targetTab === 'announcements') {
      if (paneAnnouncements) paneAnnouncements.style.display = 'block';
    } else {
      // Coming soon pane for other tabs
      const title = featureName || getFeatureTitle(targetTab);
      if (csPaneTitle) csPaneTitle.textContent = title;
      if (csFeatureName) csFeatureName.textContent = title;
      if (paneComingSoon) paneComingSoon.style.display = 'block';
    }

    // Scroll to top of main content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper map for feature titles
  const getFeatureTitle = (key) => {
    const titles = {
      classes: 'My Classes & Subject Rosters',
      attendance: 'Student Attendance Register',
      results: 'Student Assessment Results',
      assignments: 'Homework & Assignments',
      'lesson-notes': 'Weekly Lesson Notes',
      timetable: 'Teaching & Exam Timetable',
      messages: 'Internal Staff Messages',
      downloads: 'Staff Resource Downloads'
    };
    return titles[key] || 'Teacher Module';
  };

  // Sidebar Buttons Click Handler
  sidebarButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      switchPane(tab);
    });
  });

  // Back to Dashboard Buttons
  backDashboardBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchPane('dashboard');
    });
  });

  // Module Cards Click Handlers
  moduleCards.forEach(card => {
    card.addEventListener('click', () => {
      const action = card.getAttribute('data-action');
      if (action) {
        switchPane(action);
      }
    });
  });

  // Quick Action Buttons Handlers
  if (qaMyProfile) {
    qaMyProfile.addEventListener('click', () => switchPane('profile'));
  }

  if (qaMyTimetable) {
    qaMyTimetable.addEventListener('click', () => switchPane('timetable', 'Teaching & Exam Timetable'));
  }

  if (qaStudentResults) {
    qaStudentResults.addEventListener('click', () => switchPane('results', 'Student Assessment Results'));
  }

  if (qaAttendance) {
    qaAttendance.addEventListener('click', () => switchPane('attendance', 'Student Attendance Register'));
  }

  // Logout Handler (returns to homepage)
  const handleLogout = () => {
    showToast('Logging out of Teacher Portal...');
    localStorage.removeItem('hgs_teacher_logged_in');
    setTimeout(() => {
      window.location.href = 'index.html#/home';
    }, 1000);
  };

  if (qaLogout) qaLogout.addEventListener('click', handleLogout);
  if (sidebarLogoutBtn) sidebarLogoutBtn.addEventListener('click', handleLogout);
});
