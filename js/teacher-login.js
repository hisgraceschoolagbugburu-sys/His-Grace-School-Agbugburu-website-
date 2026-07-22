/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Teacher Portal Login Controller
 */

import { HGS_AUTH } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('teacher-login-form');
  const staffIdInput = document.getElementById('staff-id');
  const passwordInput = document.getElementById('teacher-password');
  const alertBox = document.getElementById('teacher-login-alert');
  const submitBtn = document.getElementById('btn-teacher-submit');
  const btnNeedHelp = document.getElementById('btn-forgot-password');

  const showAlert = (msg, isError = true) => {
    if (!alertBox) return;
    alertBox.style.display = 'block';
    alertBox.className = `form-alert-box ${isError ? 'error' : 'success'}`;
    alertBox.innerHTML = `<strong>${isError ? 'Error:' : 'Notice:'}</strong> ${msg}`;
  };

  const hideAlert = () => {
    if (alertBox) alertBox.style.display = 'none';
  };

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert();

      const idVal = staffIdInput ? staffIdInput.value.trim() : '';
      const passVal = passwordInput ? passwordInput.value.trim() : '';

      if (!idVal) {
        showAlert('Please enter your Staff ID.');
        return;
      }

      if (!passVal) {
        showAlert('Please enter your password.');
        return;
      }

      const origText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Authenticating Staff...';

      try {
        const result = await HGS_AUTH.loginTeacher(idVal, passVal);
        showAlert(`Welcome ${result.user.displayName || 'Teacher'}! Redirecting to Teacher Dashboard...`, false);

        setTimeout(() => {
          window.location.href = 'teacher-portal.html';
        }, 800);
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
        showAlert(err.message || 'Invalid Staff ID or Password.');
      }
    });
  }

  if (btnNeedHelp) {
    btnNeedHelp.addEventListener('click', (e) => {
      e.preventDefault();
      showAlert('Password reset or Staff ID retrieval must be requested directly from the School IT Administration.', false);
    });
  }
});
