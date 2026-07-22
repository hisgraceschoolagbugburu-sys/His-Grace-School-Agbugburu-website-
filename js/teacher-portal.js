/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Teacher Portal Controller
 */

import { HGS_SESSION } from './session.js';
import { HGS_AUTH } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Verify Authentication Security
  const currentUser = HGS_SESSION.getCurrentUser();
  if (!currentUser || currentUser.role !== 'teacher') {
    window.location.href = 'teacher-login.html';
    return;
  }

  // Header Info
  const tchNameEl = document.getElementById('tch-user-name');
  const tchIdEl = document.getElementById('tch-user-id');
  const badgeClassEl = document.getElementById('badge-teacher-class');

  if (tchNameEl) tchNameEl.textContent = currentUser.fullName || currentUser.displayName || 'Mr. Emmanuel Adebayo';
  if (tchIdEl) tchIdEl.textContent = currentUser.staffId || 'HGS/STAFF/001';
  if (badgeClassEl) badgeClassEl.textContent = `Assigned: ${currentUser.assignedClass || 'Primary 5 Gold'}`;

  // 2. Navigation Tabs
  const navButtons = document.querySelectorAll('.tch-nav-item button');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const panelTitle = document.getElementById('tch-panel-title');
  const panelSubtitle = document.getElementById('tch-panel-subtitle');

  const tabTitles = {
    dashboard: { title: 'Teacher Dashboard', sub: 'Class Overview & Daily Teaching Schedule' },
    attendance: { title: 'Daily Attendance Register', sub: 'Record & Monitor Student Class Attendance' },
    students: { title: 'Assigned Class Roster', sub: 'Student Profiles & Guardian Contact Directory' },
    results: { title: 'Result & Grade Upload', sub: 'Input Continuous Assessment & Examination Scores' },
    classes: { title: 'Class Management', sub: 'Subject Syllabus & Parent Announcements' },
    timetable: { title: 'Weekly Timetable', sub: 'Subject Schedule Grid' }
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

  // 3. Logout
  const btnLogout = document.getElementById('btn-tch-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      await HGS_AUTH.logoutUser();
      localStorage.removeItem('hgs_teacher_logged_in');
      window.location.href = 'teacher-login.html';
    });
  }

  // 4. Sample Students for Attendance & Roster
  const sampleRoster = [
    { id: 'HGS/2026/001', name: 'Oluwaseun Adebayo', gender: 'Male', phone: '08023456789' },
    { id: 'HGS/2026/002', name: 'Chinedu Okonkwo', gender: 'Male', phone: '08034567890' },
    { id: 'HGS/2026/003', name: 'Miriam Eze', gender: 'Female', phone: '08045678901' },
    { id: 'HGS/2026/004', name: 'Kenechukwu Nnamdi', gender: 'Male', phone: '08056789012' }
  ];

  // Render Attendance List
  const renderAttendance = () => {
    const tableAttendance = document.getElementById('table-attendance-list');
    if (!tableAttendance) return;

    tableAttendance.innerHTML = sampleRoster.map(s => `
      <tr>
        <td style="font-family: monospace; font-weight: 700; color: var(--tch-primary);">${s.id}</td>
        <td style="font-weight: 600;">${s.name}</td>
        <td>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn-att present active" onclick="this.parentNode.querySelectorAll('button').forEach(b=>b.classList.remove('active')); this.classList.add('active');">Present</button>
            <button class="btn-att absent" onclick="this.parentNode.querySelectorAll('button').forEach(b=>b.classList.remove('active')); this.classList.add('active');">Absent</button>
            <button class="btn-att late" onclick="this.parentNode.querySelectorAll('button').forEach(b=>b.classList.remove('active')); this.classList.add('active');">Late</button>
          </div>
        </td>
      </tr>
    `).join('');
  };

  // Render Student Roster
  const renderRoster = () => {
    const tableRoster = document.getElementById('table-tch-students');
    if (!tableRoster) return;

    tableRoster.innerHTML = sampleRoster.map(s => `
      <tr>
        <td style="font-family: monospace; font-weight: 700; color: var(--tch-primary);">${s.id}</td>
        <td style="font-weight: 600;">${s.name}</td>
        <td>${s.gender}</td>
        <td>${s.phone}</td>
      </tr>
    `).join('');
  };

  renderAttendance();
  renderRoster();

  // Handle Result Upload Submission
  const resultForm = document.getElementById('form-upload-result');
  if (resultForm) {
    resultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const ca = parseInt(document.getElementById('result-ca').value || '0', 10);
      const exam = parseInt(document.getElementById('result-exam').value || '0', 10);
      const total = ca + exam;

      let grade = 'F';
      if (total >= 70) grade = 'A';
      else if (total >= 60) grade = 'B';
      else if (total >= 50) grade = 'C';
      else if (total >= 45) grade = 'D';

      alert(`Grade computed successfully!\nTotal Score: ${total}/100\nGrade: ${grade}\nResult record saved.`);
      resultForm.reset();
    });
  }
});
