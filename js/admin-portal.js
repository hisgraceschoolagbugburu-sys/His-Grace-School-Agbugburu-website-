/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Administrator Portal Controller
 */

import { HGS_SESSION } from './session.js';
import { HGS_AUTH } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Verify Authentication Security
  const currentUser = HGS_SESSION.getCurrentUser();
  if (!currentUser || currentUser.role !== 'administrator') {
    window.location.href = 'admin-login.html';
    return;
  }

  // Populate Header User Info
  const adminNameEl = document.getElementById('admin-user-name');
  const adminIdEl = document.getElementById('admin-user-id');
  if (adminNameEl) adminNameEl.textContent = currentUser.fullName || currentUser.displayName || 'Dr. Gabriel Okonjo';
  if (adminIdEl) adminIdEl.textContent = currentUser.adminId || 'HGS/ADM/2026';

  // 2. Navigation Tabs
  const navButtons = document.querySelectorAll('.admin-nav-item button');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const panelTitle = document.getElementById('panel-title');
  const panelSubtitle = document.getElementById('panel-subtitle');

  const tabTitles = {
    overview: { title: 'Dashboard Overview', sub: 'Master System Monitoring & Operations' },
    admissions: { title: 'Admission Application Review', sub: 'Review, Approve & Process Student Applications' },
    students: { title: 'Students Directory', sub: 'Enrolled Students & Class Rosters' },
    teachers: { title: 'Academic Staff & Teachers', sub: 'Teacher Records & Subject Assignments' },
    homepage: { title: 'Homepage Customization', sub: 'Hero Banner & Motto Controls' },
    gallery: { title: 'Gallery Manager', sub: 'School Events & Campus Photo Albums' },
    news: { title: 'News & Announcements', sub: 'Publish Updates & Term Events' },
    downloads: { title: 'Downloadable Forms', sub: 'Manage Prospectus & Forms' },
    settings: { title: 'School Settings', sub: 'System Security & School Information' },
    logs: { title: 'Activity Audit Logs', sub: 'Security & System Operations History' }
  };

  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      navButtons.forEach(b => b.parentElement.classList.remove('active'));
      btn.parentElement.classList.add('active');

      tabPanels.forEach(p => p.classList.remove('active'));
      const targetPanel = document.getElementById(`panel-${targetTab}`);
      if (targetPanel) targetPanel.classList.add('active');

      if (tabTitles[targetTab]) {
        if (panelTitle) panelTitle.textContent = tabTitles[targetTab].title;
        if (panelSubtitle) panelSubtitle.textContent = tabTitles[targetTab].sub;
      }
    });
  });

  // Quick switch from Overview button
  const btnQuickAdmission = document.getElementById('btn-quick-admission');
  if (btnQuickAdmission) {
    btnQuickAdmission.addEventListener('click', () => {
      const admissionsBtn = document.querySelector('button[data-tab="admissions"]');
      if (admissionsBtn) admissionsBtn.click();
    });
  }

  // 3. Logout
  const btnLogout = document.getElementById('btn-admin-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      await HGS_AUTH.logoutUser();
      localStorage.removeItem('hgs_admin_logged_in');
      window.location.href = 'admin-login.html';
    });
  }

  // 4. Populate Sample / Firestore Data for Tables
  const sampleAdmissions = [
    { id: 'APP-2026-1042', name: 'Adebayo Oluwaseun', class: 'Primary 1', phone: '08023456789', email: 'parent1@gmail.com', status: 'Pending' },
    { id: 'APP-2026-1088', name: 'Okonkwo Chinedu', class: 'JSS 1', phone: '08034567890', email: 'parent2@gmail.com', status: 'Approved' },
    { id: 'APP-2026-1102', name: 'Eze Miriam', class: 'Primary 3', phone: '08045678901', email: 'parent3@gmail.com', status: 'Draft' }
  ];

  const sampleStudents = [
    { id: 'HGS/2026/001', name: 'Oluwaseun Adebayo', class: 'Primary 1', gender: 'Male', phone: '08023456789', status: 'Active' },
    { id: 'HGS/2026/002', name: 'Chinedu Okonkwo', class: 'JSS 1', gender: 'Male', phone: '08034567890', status: 'Active' },
    { id: 'HGS/2026/003', name: 'Miriam Eze', class: 'Primary 3', gender: 'Female', phone: '08045678901', status: 'Active' }
  ];

  const sampleTeachers = [
    { id: 'HGS/STAFF/001', name: 'Mr. Emmanuel Adebayo', subject: 'Mathematics & Science', class: 'Primary 5 Gold', status: 'Active' },
    { id: 'HGS/STAFF/002', name: 'Mrs. Grace Okonjo', subject: 'English Language', class: 'JSS 2 Diamond', status: 'Active' }
  ];

  // Render Admissions Tables
  const renderAdmissions = () => {
    const tableOverview = document.getElementById('table-overview-admissions');
    const tableAdmissions = document.getElementById('table-admissions');

    const html = sampleAdmissions.map(item => `
      <tr>
        <td style="font-family: monospace; font-weight: 700; color: var(--admin-primary);">${item.id}</td>
        <td style="font-weight: 600;">${item.name}</td>
        <td>${item.class}</td>
        <td>${item.phone}</td>
        <td><span class="status-badge ${item.status.toLowerCase()}">${item.status}</span></td>
        <td>
          <button class="btn-action-sm btn-primary-sm">Review</button>
        </td>
      </tr>
    `).join('');

    if (tableOverview) tableOverview.innerHTML = html;
    if (tableAdmissions) tableAdmissions.innerHTML = sampleAdmissions.map(item => `
      <tr>
        <td style="font-family: monospace; font-weight: 700; color: var(--admin-primary);">${item.id}</td>
        <td style="font-weight: 600;">${item.name}</td>
        <td>${item.class}</td>
        <td>${item.email}</td>
        <td><span class="status-badge ${item.status.toLowerCase()}">${item.status}</span></td>
        <td>
          <button class="btn-action-sm btn-success-sm" style="margin-right: 4px;">Approve</button>
          <button class="btn-action-sm btn-danger-sm">Reject</button>
        </td>
      </tr>
    `).join('');
  };

  // Render Students Table
  const renderStudents = () => {
    const tableStudents = document.getElementById('table-students');
    if (!tableStudents) return;

    tableStudents.innerHTML = sampleStudents.map(s => `
      <tr>
        <td style="font-family: monospace; font-weight: 700; color: var(--admin-primary);">${s.id}</td>
        <td style="font-weight: 600;">${s.name}</td>
        <td>${s.class}</td>
        <td>${s.gender}</td>
        <td>${s.phone}</td>
        <td><span class="status-badge active">${s.status}</span></td>
      </tr>
    `).join('');
  };

  // Render Teachers Table
  const renderTeachers = () => {
    const tableTeachers = document.getElementById('table-teachers');
    if (!tableTeachers) return;

    tableTeachers.innerHTML = sampleTeachers.map(t => `
      <tr>
        <td style="font-family: monospace; font-weight: 700; color: var(--admin-primary);">${t.id}</td>
        <td style="font-weight: 600;">${t.name}</td>
        <td>${t.subject}</td>
        <td>${t.class}</td>
        <td><span class="status-badge active">${t.status}</span></td>
      </tr>
    `).join('');
  };

  renderAdmissions();
  renderStudents();
  renderTeachers();
});
