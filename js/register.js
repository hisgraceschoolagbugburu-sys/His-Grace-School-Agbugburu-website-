/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Applicant Registration Script
 * Handles form validation, password toggling, strength meter, and Firebase registration.
 */

import { HGS_AUTH } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM ELEMENTS ---
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const portalDropdown = document.getElementById('portal-dropdown');
  const toastContainer = document.getElementById('toast-container');
  const registrationForm = document.getElementById('registration-form');
  const registrationAlert = document.getElementById('registration-alert');

  // Form Inputs
  const surnameInput = document.getElementById('reg-surname');
  const firstnameInput = document.getElementById('reg-firstname');
  const othernameInput = document.getElementById('reg-othername');
  const genderInput = document.getElementById('reg-gender');
  const dobInput = document.getElementById('reg-dob');
  const classInput = document.getElementById('reg-class');
  const guardianInput = document.getElementById('reg-guardian');
  const guardianPhoneInput = document.getElementById('reg-guardian-phone');
  const addressInput = document.getElementById('reg-address');
  const emailInput = document.getElementById('reg-email');
  const phoneInput = document.getElementById('reg-phone');
  const passwordInput = document.getElementById('reg-password');
  const confirmPasswordInput = document.getElementById('reg-confirm-password');

  // Eye Toggles
  const togglePasswordBtn = document.getElementById('toggle-password');
  const toggleConfirmPasswordBtn = document.getElementById('toggle-confirm-password');

  // Strength Meter
  const strengthMeter = document.getElementById('strength-meter');
  const strengthBar = document.getElementById('strength-bar');
  const strengthLabel = document.getElementById('strength-label');

  // Steps
  const stepNode1 = document.getElementById('step-node-1');
  const stepNode2 = document.getElementById('step-node-2');

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

  // --- TOGGLE PASSWORD VISIBILITY ---
  const initPasswordToggle = (btn, input) => {
    if (!btn || !input) return;
    btn.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      
      btn.innerHTML = isPassword ? `
        <svg class="toggle-icon-eye" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      ` : `
        <svg class="toggle-icon-eye" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      `;
    });
  };

  initPasswordToggle(togglePasswordBtn, passwordInput);
  initPasswordToggle(toggleConfirmPasswordBtn, confirmPasswordInput);

  // --- PASSWORD STRENGTH MONITOR ---
  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      const password = passwordInput.value;
      if (!password) {
        strengthMeter.style.display = 'none';
        strengthLabel.style.display = 'none';
        return;
      }

      strengthMeter.style.display = 'block';
      strengthLabel.style.display = 'block';

      let score = 0;
      if (password.length >= 8) score += 20;
      if (password.length >= 12) score += 10;
      if (/[A-Z]/.test(password)) score += 20;
      if (/[a-z]/.test(password)) score += 15;
      if (/[0-9]/.test(password)) score += 15;
      if (/[^A-Za-z0-9]/.test(password)) score += 20;

      let color = '#EF4444';
      let label = 'Strength: Weak';

      if (score >= 80) {
        color = '#10B981';
        label = 'Strength: Excellent (Strong)';
      } else if (score >= 50) {
        color = '#F59E0B';
        label = 'Strength: Good (Medium)';
      } else if (password.length > 0 && password.length < 8) {
        label = 'Strength: Too Short (Min 8)';
      }

      strengthBar.style.width = `${score}%`;
      strengthBar.style.backgroundColor = color;
      strengthLabel.textContent = label;
      strengthLabel.style.color = color;
    });
  }

  // --- VALIDATION HELPER FUNCTIONS ---
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
  };

  const showError = (inputEl, errorId, show = true) => {
    const errorEl = document.getElementById(errorId);
    if (!errorEl || !inputEl) return;

    if (show) {
      inputEl.classList.add('is-invalid');
      errorEl.style.display = 'flex';
    } else {
      inputEl.classList.remove('is-invalid');
      errorEl.style.display = 'none';
    }
  };

  const clearErrors = () => {
    const inputs = registrationForm.querySelectorAll('.form-control');
    inputs.forEach(input => input.classList.remove('is-invalid'));

    const errorTexts = registrationForm.querySelectorAll('.error-text');
    errorTexts.forEach(el => el.style.display = 'none');
  };

  // --- REGISTRATION FORM SUBMIT ---
  if (registrationForm) {
    registrationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors();

      let isValid = true;
      let firstInvalidElement = null;

      const setInvalid = (inputEl, errorId) => {
        isValid = false;
        showError(inputEl, errorId, true);
        if (!firstInvalidElement) {
          firstInvalidElement = inputEl;
        }
      };

      const surname = surnameInput.value.trim();
      if (!surname) setInvalid(surnameInput, 'error-surname');

      const firstname = firstnameInput.value.trim();
      if (!firstname) setInvalid(firstnameInput, 'error-firstname');

      const othername = othernameInput ? othernameInput.value.trim() : '';

      const gender = genderInput.value;
      if (!gender) setInvalid(genderInput, 'error-gender');

      const dob = dobInput.value;
      if (!dob) {
        setInvalid(dobInput, 'error-dob');
      } else {
        const dobDate = new Date(dob);
        if (dobDate >= new Date()) setInvalid(dobInput, 'error-dob');
      }

      const desiredClass = classInput.value;
      if (!desiredClass) setInvalid(classInput, 'error-class');

      const guardian = guardianInput.value.trim();
      if (!guardian) setInvalid(guardianInput, 'error-guardian');

      const guardianPhone = guardianPhoneInput.value.trim();
      if (!guardianPhone || !validatePhone(guardianPhone)) setInvalid(guardianPhoneInput, 'error-guardian-phone');

      const address = addressInput.value.trim();
      if (!address) setInvalid(addressInput, 'error-address');

      const email = emailInput.value.trim();
      if (!email || !validateEmail(email)) setInvalid(emailInput, 'error-email');

      const phone = phoneInput.value.trim();
      if (!phone || !validatePhone(phone)) setInvalid(phoneInput, 'error-phone');

      const password = passwordInput.value;
      if (!password || password.length < 8) setInvalid(passwordInput, 'error-password');

      const confirmPassword = confirmPasswordInput.value;
      if (!confirmPassword || confirmPassword !== password) setInvalid(confirmPasswordInput, 'error-confirm-password');

      if (!isValid) {
        if (firstInvalidElement) {
          firstInvalidElement.focus();
          firstInvalidElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        showToast("Please correct the errors in the registration form.");
        return;
      }

      const submitBtn = registrationForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" style="animation: spin 1s linear infinite; width: 20px; height: 20px; margin-right: 8px; display: inline-block; vertical-align: middle;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <circle cx="12" cy="12" r="10" style="opacity: 0.25;"></circle>
          <path d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" style="opacity: 0.75;"></path>
        </svg>
        Registering Account in Firebase...
      `;

      try {
        const result = await HGS_AUTH.registerApplicant({
          email,
          password,
          surname,
          firstname,
          othername,
          gender,
          dob,
          desiredClass,
          guardian,
          guardianPhone,
          address,
          phone
        });

        if (stepNode1) {
          stepNode1.classList.remove('active');
          stepNode1.classList.add('completed');
        }
        if (stepNode2) {
          stepNode2.classList.add('active');
        }

        if (registrationAlert) {
          registrationAlert.className = "form-alert success";
          registrationAlert.innerHTML = `
            <div style="display: flex; gap: 1rem; align-items: flex-start;">
              <div style="background-color: #31C783; color: white; width: 44px; height: 44px; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 10px rgba(49, 199, 131, 0.3);">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div>
                <h4 style="color: #03543F; font-size: 1.15rem; font-weight: 700; margin-bottom: 0.25rem;">Admission Profile Registered!</h4>
                <p style="color: #046A4F; font-size: 0.95rem; line-height: 1.5; margin-bottom: 0.5rem; font-weight: 500;">
                  Admission profile for <strong>${firstname} ${surname}</strong> (ID: <strong>${result.user.applicantId}</strong>) has been saved to Firebase Firestore.
                </p>
                <p style="color: #046A4F; font-size: 0.9rem; line-height: 1.5; margin-bottom: 0;">
                  Redirecting to your Applicant Dashboard...
                </p>
              </div>
            </div>
          `;
          registrationAlert.style.display = "block";
          registrationAlert.style.padding = "2rem";
          registrationAlert.style.borderRadius = "var(--radius-md)";
          registrationAlert.style.marginBottom = "2rem";
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        const checkIcon = `
          <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        showToast("Profile registered successfully! Opening dashboard...", checkIcon);

        setTimeout(() => {
          window.location.href = 'applicant-dashboard.html';
        }, 1200);

      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        let errorMsg = err.message || "Failed to create account. Please try again.";
        if (err.code === "auth/email-already-in-use") {
          errorMsg = "An account with this email address already exists. Please log in instead.";
        } else if (err.code === "auth/weak-password") {
          errorMsg = "Password is too weak. Minimum 8 characters required.";
        } else if (err.code === "auth/invalid-email") {
          errorMsg = "Invalid email format.";
        }

        if (registrationAlert) {
          registrationAlert.className = "form-alert error";
          registrationAlert.innerHTML = `
            <div style="display: flex; gap: 1rem; align-items: center; background-color: #FEE2E2; color: #991B1B; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid #FCA5A5;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span style="font-weight: 600;">${errorMsg}</span>
            </div>
          `;
          registrationAlert.style.display = "block";
          registrationAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }
});
