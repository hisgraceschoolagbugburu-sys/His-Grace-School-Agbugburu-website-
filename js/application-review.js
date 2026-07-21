/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Application Review Page Script
 * Manages data review, declaration validation, draft saving, submission modal & success modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM ELEMENTS ---
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const portalDropdown = document.getElementById('portal-dropdown');
  const toastContainer = document.getElementById('toast-container');

  // Review Elements
  const valAppId = document.getElementById('val-app-id');
  const valFullname = document.getElementById('val-fullname');
  const valGender = document.getElementById('val-gender');
  const valDob = document.getElementById('val-dob');
  const valNationality = document.getElementById('val-nationality');
  const valStateLga = document.getElementById('val-state-lga');
  const valEmail = document.getElementById('val-email');
  const valPhone = document.getElementById('val-phone');
  const valAddress = document.getElementById('val-address');
  const valGuardianName = document.getElementById('val-guardian-name');
  const valGuardianRelation = document.getElementById('val-guardian-relation');
  const valGuardianOccupation = document.getElementById('val-guardian-occupation');
  const valGuardianPhone = document.getElementById('val-guardian-phone');
  const valGuardianEmail = document.getElementById('val-guardian-email');
  const valPrevSchool = document.getElementById('val-prev-school');
  const valLastClass = document.getElementById('val-last-class');
  const valDesiredClass = document.getElementById('val-desired-class');
  const valAcademicSession = document.getElementById('val-academic-session');

  // Documents
  const docFilePassport = document.getElementById('doc-file-passport');
  const docFileBirth = document.getElementById('doc-file-birth');
  const docFileResult = document.getElementById('doc-file-result');

  // Declaration & Actions
  const declarationCheck = document.getElementById('review-declaration-check');
  const errorDeclaration = document.getElementById('error-review-declaration');
  const btnFinalSubmit = document.getElementById('btn-final-submit');
  const btnSaveDraft = document.getElementById('btn-review-draft');

  // Modals
  const submissionModal = document.getElementById('submission-modal');
  const btnCancelModal = document.getElementById('btn-cancel-modal');
  const btnConfirmSubmit = document.getElementById('btn-confirm-submit');

  const successModal = document.getElementById('success-modal');
  const modalSuccessFullname = document.getElementById('modal-success-fullname');
  const modalSuccessAppid = document.getElementById('modal-success-appid');

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

  // --- LOAD APPLICATION DATA (FROM LOCALSTORAGE OR PLACEHOLDERS) ---
  const loadSavedApplicationData = () => {
    try {
      const savedDataRaw = localStorage.getItem('hgs_admission_application_draft');
      if (savedDataRaw) {
        const saved = JSON.parse(savedDataRaw);
        
        if (saved.appId && valAppId) valAppId.textContent = saved.appId;
        
        const fullNameStr = [saved.surname, saved.firstname, saved.othername].filter(Boolean).join(' ');
        if (fullNameStr && valFullname) valFullname.textContent = fullNameStr;
        
        if (saved.gender && valGender) valGender.textContent = saved.gender;
        if (saved.dob && valDob) {
          // Format YYYY-MM-DD to DD/MM/YYYY if applicable
          const parts = saved.dob.split('-');
          if (parts.length === 3) {
            valDob.textContent = `${parts[2]}/${parts[1]}/${parts[0]}`;
          } else {
            valDob.textContent = saved.dob;
          }
        }
        if (saved.nationality && valNationality) valNationality.textContent = saved.nationality;
        if (saved.state && valStateLga) {
          valStateLga.textContent = `${saved.state} (${saved.lga || 'Odeda LGA'})`;
        }
        if (saved.email && valEmail) valEmail.textContent = saved.email;
        if (saved.phone && valPhone) valPhone.textContent = saved.phone;
        if (saved.address && valAddress) valAddress.textContent = saved.address;

        if (saved.guardianName && valGuardianName) valGuardianName.textContent = saved.guardianName;
        if (saved.guardianRelation && valGuardianRelation) valGuardianRelation.textContent = saved.guardianRelation;
        if (saved.guardianOccupation && valGuardianOccupation) valGuardianOccupation.textContent = saved.guardianOccupation;
        if (saved.guardianPhone && valGuardianPhone) valGuardianPhone.textContent = saved.guardianPhone;
        if (saved.guardianEmail && valGuardianEmail) valGuardianEmail.textContent = saved.guardianEmail;

        if (saved.prevSchool && valPrevSchool) valPrevSchool.textContent = saved.prevSchool;
        if (saved.lastClass && valLastClass) valLastClass.textContent = saved.lastClass;
        if (saved.desiredClass && valDesiredClass) valDesiredClass.textContent = saved.desiredClass;
        if (saved.academicSession && valAcademicSession) valAcademicSession.textContent = saved.academicSession;

        if (saved.passportFileName && docFilePassport) docFilePassport.textContent = `${saved.passportFileName} (Uploaded)`;
        if (saved.birthCertFileName && docFileBirth) docFileBirth.textContent = `${saved.birthCertFileName} (Uploaded)`;
        if (saved.resultFileName && docFileResult) docFileResult.textContent = `${saved.resultFileName} (Uploaded)`;
      }
    } catch (err) {
      console.warn('Could not read saved application draft, using defaults:', err);
    }
  };

  loadSavedApplicationData();

  // --- SAVE AS DRAFT ACTION ---
  if (btnSaveDraft) {
    btnSaveDraft.addEventListener('click', () => {
      showToast('Application draft saved successfully. You can return anytime to finalize your submission.');
    });
  }

  // --- DECLARATION CHECKBOX EVENT ---
  if (declarationCheck) {
    declarationCheck.addEventListener('change', () => {
      if (declarationCheck.checked && errorDeclaration) {
        errorDeclaration.style.display = 'none';
      }
    });
  }

  // --- FINAL SUBMIT CLICK ---
  if (btnFinalSubmit) {
    btnFinalSubmit.addEventListener('click', () => {
      if (!declarationCheck || !declarationCheck.checked) {
        if (errorDeclaration) {
          errorDeclaration.style.display = 'block';
        }
        showToast('Please check the declaration box before submitting your application.');
        declarationCheck?.focus();
        return;
      }

      // Hide error message if checked
      if (errorDeclaration) {
        errorDeclaration.style.display = 'none';
      }

      // Show Submission Modal
      if (submissionModal) {
        submissionModal.classList.add('active');
      }
    });
  }

  // --- SUBMISSION MODAL CANCEL ---
  if (btnCancelModal) {
    btnCancelModal.addEventListener('click', () => {
      if (submissionModal) {
        submissionModal.classList.remove('active');
      }
    });
  }

  // Close submission modal on overlay backdrop click
  if (submissionModal) {
    submissionModal.addEventListener('click', (e) => {
      if (e.target === submissionModal) {
        submissionModal.classList.remove('active');
      }
    });
  }

  // --- CONFIRM SUBMISSION CLICK ---
  if (btnConfirmSubmit) {
    btnConfirmSubmit.addEventListener('click', () => {
      // Hide Submission Modal
      if (submissionModal) {
        submissionModal.classList.remove('active');
      }

      // Sync names to success modal
      if (modalSuccessFullname && valFullname) {
        modalSuccessFullname.textContent = valFullname.textContent;
      }
      if (modalSuccessAppid && valAppId) {
        modalSuccessAppid.textContent = valAppId.textContent;
      }

      // Show Success Modal
      if (successModal) {
        setTimeout(() => {
          successModal.classList.add('active');
        }, 150);
      }

      showToast('Application submitted successfully!');
    });
  }

});
