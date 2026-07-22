/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Administrator Login Controller
 */

import { HGS_AUTH } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('admin-login-form');
  const adminIdInput = document.getElementById('admin-id');
  const passwordInput = document.getElementById('admin-password');
  const loginAlert = document.getElementById('admin-login-alert');
  const submitBtn = document.getElementById('btn-admin-submit');

  const btnForgot = document.getElementById('btn-admin-forgot');
  const resetModal = document.getElementById('admin-reset-modal');
  const btnCloseModal = document.getElementById('btn-close-admin-modal');
  const btnSendReset = document.getElementById('btn-send-admin-reset');
  const resetAdminInput = document.getElementById('reset-admin-id');
  const resetAlert = document.getElementById('reset-alert');

  const showAlert = (el, msg, isError = true) => {
    if (!el) return;
    el.style.display = 'block';
    el.className = `form-alert-box ${isError ? 'error' : 'success'}`;
    el.innerHTML = `<strong>${isError ? 'Error:' : 'Notice:'}</strong> ${msg}`;
  };

  const hideAlert = (el) => {
    if (el) el.style.display = 'none';
  };

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert(loginAlert);

      const adminIdVal = adminIdInput ? adminIdInput.value.trim() : '';
      const passVal = passwordInput ? passwordInput.value.trim() : '';

      if (!adminIdVal) {
        showAlert(loginAlert, 'Please enter your Administrator ID.');
        return;
      }

      if (!passVal) {
        showAlert(loginAlert, 'Please enter your password.');
        return;
      }

      const origBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Authenticating Administrator...`;

      try {
        const result = await HGS_AUTH.loginAdministrator(adminIdVal, passVal);
        showAlert(loginAlert, `Access granted for ${result.user.displayName || 'Administrator'}. Redirecting to Administrator Portal...`, false);
        
        setTimeout(() => {
          window.location.href = 'admin-portal.html';
        }, 800);
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnText;
        showAlert(loginAlert, err.message || 'Invalid Administrator ID or Password.');
      }
    });
  }

  // Forgot Password Modal
  if (btnForgot && resetModal) {
    btnForgot.addEventListener('click', () => {
      hideAlert(resetAlert);
      if (resetAdminInput) resetAdminInput.value = adminIdInput ? adminIdInput.value : '';
      resetModal.classList.add('active');
    });
  }

  if (btnCloseModal && resetModal) {
    btnCloseModal.addEventListener('click', () => {
      resetModal.classList.remove('active');
    });
  }

  if (btnSendReset && resetModal) {
    btnSendReset.addEventListener('click', async () => {
      hideAlert(resetAlert);
      const resetIdVal = resetAdminInput ? resetAdminInput.value.trim() : '';

      if (!resetIdVal) {
        showAlert(resetAlert, 'Please enter your Administrator ID.');
        return;
      }

      btnSendReset.disabled = true;
      btnSendReset.textContent = 'Submitting Request...';

      try {
        await HGS_AUTH.requestAdminPasswordReset(resetIdVal);
        btnSendReset.disabled = false;
        btnSendReset.textContent = 'Submit Reset';
        showAlert(resetAlert, 'Your password reset request has been forwarded to the official school administration for verification.', false);
      } catch (err) {
        btnSendReset.disabled = false;
        btnSendReset.textContent = 'Submit Reset';
        showAlert(resetAlert, err.message || 'Failed to submit reset request.');
      }
    });
  }
});
