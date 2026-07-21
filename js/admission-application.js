/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Admission Application Form Script
 * Handles multi-step form navigation, validation, draft saving, file dropzone interactions, and success modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM ELEMENTS ---
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const portalDropdown = document.getElementById('portal-dropdown');
  const toastContainer = document.getElementById('toast-container');

  // Form & Stepper Elements
  const form = document.getElementById('admission-application-form');
  const stepperItems = document.querySelectorAll('.step-item');
  const stepperProgress = document.getElementById('stepper-progress');
  const stepPanels = document.querySelectorAll('.form-step-panel');
  
  // Navigation Buttons
  const btnPrev = document.getElementById('btn-prev-step');
  const btnNext = document.getElementById('btn-next-step');
  const btnSubmit = document.getElementById('btn-submit-app');
  const btnSaveDraft = document.getElementById('btn-save-draft');

  // Review Elements
  const reviewName = document.getElementById('review-name');
  const reviewClass = document.getElementById('review-class');
  const reviewGuardian = document.getElementById('review-guardian');

  // Modal
  const successModal = document.getElementById('success-modal');
  const modalAppName = document.getElementById('modal-app-name');

  // Current Step State (1 to 6)
  let currentStep = 1;
  const totalSteps = 6;

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
      showToast(`${portalName} will be available in a future phase!`);
    });
  });

  // --- FILE DROPZONE PREVIEWS ---
  const dropzones = document.querySelectorAll('.file-dropzone');
  dropzones.forEach(dz => {
    const fileInput = dz.querySelector('input[type="file"]');
    const statusTag = dz.querySelector('.file-status-tag');
    const fileNameText = dz.querySelector('.file-name-text');

    if (!fileInput) return;

    ['dragenter', 'dragover'].forEach(eventName => {
      dz.addEventListener(eventName, (e) => {
        e.preventDefault();
        dz.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dz.addEventListener(eventName, (e) => {
        e.preventDefault();
        dz.classList.remove('dragover');
      }, false);
    });

    dz.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files.length > 0) {
        fileInput.files = files;
        updateFileStatus(files[0].name);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        updateFileStatus(fileInput.files[0].name);
      }
    });

    function updateFileStatus(fileName) {
      if (statusTag && fileNameText) {
        fileNameText.textContent = `${fileName} (Ready)`;
        statusTag.style.display = 'inline-flex';
        dz.style.borderColor = '#10B981';
        dz.style.backgroundColor = '#ECFDF5';
      }
      showToast(`Selected file: ${fileName}`);
    }
  });

  // --- VALIDATION LOGIC ---
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^[\d\s\+\-\(\)]{10,15}$/.test(phone);
  };

  const validateStep = (stepNumber) => {
    let isValid = true;

    // Clear previous invalid indicators in this step
    const currentPanel = document.getElementById(`step-panel-${stepNumber}`);
    if (!currentPanel) return true;

    const errorTexts = currentPanel.querySelectorAll('.error-text');
    errorTexts.forEach(el => el.style.display = 'none');

    const inputs = currentPanel.querySelectorAll('.form-control');
    inputs.forEach(input => input.classList.remove('is-invalid'));

    if (stepNumber === 1) {
      // Surname
      const surname = document.getElementById('app-surname');
      if (!surname.value.trim()) {
        showFieldError(surname, 'error-app-surname');
        isValid = false;
      }

      // Firstname
      const firstname = document.getElementById('app-firstname');
      if (!firstname.value.trim()) {
        showFieldError(firstname, 'error-app-firstname');
        isValid = false;
      }

      // Gender
      const gender = document.getElementById('app-gender');
      if (!gender.value) {
        showFieldError(gender, 'error-app-gender');
        isValid = false;
      }

      // DOB
      const dob = document.getElementById('app-dob');
      if (!dob.value) {
        showFieldError(dob, 'error-app-dob');
        isValid = false;
      }

      // Nationality
      const nationality = document.getElementById('app-nationality');
      if (!nationality.value.trim()) {
        showFieldError(nationality, 'error-app-nationality');
        isValid = false;
      }

      // State
      const state = document.getElementById('app-state');
      if (!state.value.trim()) {
        showFieldError(state, 'error-app-state');
        isValid = false;
      }

      // LGA
      const lga = document.getElementById('app-lga');
      if (!lga.value.trim()) {
        showFieldError(lga, 'error-app-lga');
        isValid = false;
      }

    } else if (stepNumber === 2) {
      // Email
      const email = document.getElementById('app-email');
      if (!email.value.trim() || !validateEmail(email.value.trim())) {
        showFieldError(email, 'error-app-email');
        isValid = false;
      }

      // Phone
      const phone = document.getElementById('app-phone');
      if (!phone.value.trim() || !validatePhone(phone.value.trim())) {
        showFieldError(phone, 'error-app-phone');
        isValid = false;
      }

      // Address
      const address = document.getElementById('app-address');
      if (!address.value.trim()) {
        showFieldError(address, 'error-app-address');
        isValid = false;
      }

    } else if (stepNumber === 3) {
      // Guardian Name
      const gName = document.getElementById('guardian-name');
      if (!gName.value.trim()) {
        showFieldError(gName, 'error-guardian-name');
        isValid = false;
      }

      // Guardian Relation
      const gRel = document.getElementById('guardian-relation');
      if (!gRel.value) {
        showFieldError(gRel, 'error-guardian-relation');
        isValid = false;
      }

      // Occupation
      const gOcc = document.getElementById('guardian-occupation');
      if (!gOcc.value.trim()) {
        showFieldError(gOcc, 'error-guardian-occupation');
        isValid = false;
      }

      // Phone
      const gPhone = document.getElementById('guardian-phone');
      if (!gPhone.value.trim() || !validatePhone(gPhone.value.trim())) {
        showFieldError(gPhone, 'error-guardian-phone');
        isValid = false;
      }

      // Email
      const gEmail = document.getElementById('guardian-email');
      if (!gEmail.value.trim() || !validateEmail(gEmail.value.trim())) {
        showFieldError(gEmail, 'error-guardian-email');
        isValid = false;
      }

      // Address
      const gAddress = document.getElementById('guardian-address');
      if (!gAddress.value.trim()) {
        showFieldError(gAddress, 'error-guardian-address');
        isValid = false;
      }

    } else if (stepNumber === 4) {
      // Previous school
      const prevSchool = document.getElementById('acad-prev-school');
      if (!prevSchool.value.trim()) {
        showFieldError(prevSchool, 'error-acad-prev-school');
        isValid = false;
      }

      // Last class
      const lastClass = document.getElementById('acad-last-class');
      if (!lastClass.value.trim()) {
        showFieldError(lastClass, 'error-acad-last-class');
        isValid = false;
      }

      // Desired class
      const desiredClass = document.getElementById('acad-desired-class');
      if (!desiredClass.value) {
        showFieldError(desiredClass, 'error-acad-desired-class');
        isValid = false;
      }

    } else if (stepNumber === 6) {
      // Declaration check
      const declCheck = document.getElementById('declaration-check');
      const errDecl = document.getElementById('error-declaration');
      if (!declCheck.checked) {
        if (errDecl) errDecl.style.display = 'flex';
        isValid = false;
      }
    }

    return isValid;
  };

  const showFieldError = (inputEl, errorId) => {
    if (inputEl) inputEl.classList.add('is-invalid');
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.style.display = 'flex';
  };

  // --- STEPPER UI UPDATER ---
  const updateStepper = (targetStep) => {
    currentStep = targetStep;

    // Calculate progress line percentage
    const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    stepperProgress.style.width = `${progressPercent}%`;

    // Update stepper node badges
    stepperItems.forEach((item, index) => {
      const stepNum = index + 1;
      item.classList.remove('active', 'completed');

      if (stepNum === currentStep) {
        item.classList.add('active');
      } else if (stepNum < currentStep) {
        item.classList.add('completed');
        item.querySelector('.step-node').innerHTML = '&#10003;';
      } else {
        item.querySelector('.step-node').textContent = stepNum;
      }
    });

    // Update Panels Visibility
    stepPanels.forEach((panel, index) => {
      const panelNum = index + 1;
      if (panelNum === currentStep) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Update Button States
    if (currentStep === 1) {
      btnPrev.style.visibility = 'hidden';
    } else {
      btnPrev.style.visibility = 'visible';
    }

    if (currentStep === totalSteps) {
      btnNext.style.display = 'none';
      btnSubmit.style.display = 'inline-flex';
      
      // Update Step 6 Review Card Info
      const surname = document.getElementById('app-surname').value.trim();
      const firstname = document.getElementById('app-firstname').value.trim();
      const othername = document.getElementById('app-othername').value.trim();
      const desiredClass = document.getElementById('acad-desired-class').value;
      const gName = document.getElementById('guardian-name').value.trim();
      const gPhone = document.getElementById('guardian-phone').value.trim();

      const fullName = `${surname} ${firstname} ${othername}`.trim();
      if (reviewName) reviewName.textContent = fullName || 'Samuel Adebayo';
      if (reviewClass) reviewClass.textContent = desiredClass || 'JSS 1';
      if (reviewGuardian) reviewGuardian.textContent = `${gName} (${gPhone})` || 'Mr. Timothy Adebayo';

    } else {
      btnNext.style.display = 'inline-flex';
      btnSubmit.style.display = 'none';
    }

    // Smooth scroll to top of form
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // --- NAVIGATION BUTTON EVENT HANDLERS ---
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
          updateStepper(currentStep + 1);
        }
      } else {
        showToast("Please fill in all required fields correctly before proceeding.");
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 1) {
        updateStepper(currentStep - 1);
      }
    });
  }

  // Stepper Header Node Click Direct Navigation
  stepperItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetStep = parseInt(item.getAttribute('data-step'), 10);
      
      // Only allow skipping forward if previous steps pass validation
      if (targetStep < currentStep) {
        updateStepper(targetStep);
      } else if (targetStep > currentStep) {
        let canAdvance = true;
        for (let s = 1; s < targetStep; s++) {
          if (!validateStep(s)) {
            canAdvance = false;
            updateStepper(s);
            showToast(`Please complete Step ${s} before skipping ahead.`);
            break;
          }
        }
        if (canAdvance) {
          updateStepper(targetStep);
        }
      }
    });
  });

  // --- SAVE AS DRAFT LOGIC ---
  if (btnSaveDraft) {
    btnSaveDraft.addEventListener('click', () => {
      const draftData = {
        surname: document.getElementById('app-surname').value,
        firstname: document.getElementById('app-firstname').value,
        othername: document.getElementById('app-othername').value,
        gender: document.getElementById('app-gender').value,
        dob: document.getElementById('app-dob').value,
        nationality: document.getElementById('app-nationality').value,
        state: document.getElementById('app-state').value,
        lga: document.getElementById('app-lga').value,
        email: document.getElementById('app-email').value,
        phone: document.getElementById('app-phone').value,
        address: document.getElementById('app-address').value,
        guardianName: document.getElementById('guardian-name').value,
        guardianRelation: document.getElementById('guardian-relation').value,
        guardianOccupation: document.getElementById('guardian-occupation').value,
        guardianPhone: document.getElementById('guardian-phone').value,
        guardianEmail: document.getElementById('guardian-email').value,
        guardianAddress: document.getElementById('guardian-address').value,
        prevSchool: document.getElementById('acad-prev-school').value,
        lastClass: document.getElementById('acad-last-class').value,
        desiredClass: document.getElementById('acad-desired-class').value,
        step: currentStep,
        timestamp: new Date().toISOString()
      };

      try {
        localStorage.setItem('hgs_application_draft', JSON.stringify(draftData));
        
        const checkIcon = `
          <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        showToast("Application draft saved successfully!", checkIcon);
      } catch (err) {
        showToast("Draft saved locally.");
      }
    });
  }

  // --- SUBMIT APPLICATION LOGIC ---
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate all steps from 1 to 6
      let allValid = true;
      for (let s = 1; s <= totalSteps; s++) {
        if (!validateStep(s)) {
          allValid = false;
          updateStepper(s);
          showToast(`Validation check failed at Step ${s}. Please fix errors to submit.`);
          break;
        }
      }

      if (allValid) {
        // Show submitting loading state
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; margin-right: 0.5rem;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
          Submitting...
        `;

        setTimeout(() => {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = `Submit Application`;

          // Populate modal details
          const surname = document.getElementById('app-surname').value.trim();
          const firstname = document.getElementById('app-firstname').value.trim();
          if (modalAppName) modalAppName.textContent = `${surname} ${firstname}`.trim();

          // Show Success Modal
          if (successModal) {
            successModal.classList.add('active');
          }
        }, 1200);
      }
    });
  }

  // Initialize Stepper
  updateStepper(1);
});
