/**
 * HIS GRACE SCHOOL AGBUGBURU
 * QR Code Verification System Logic
 * Handles manual ID verification, dynamic verified/invalid record rendering,
 * sample pill shortcuts, and admin placeholder feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM ELEMENTS ---
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const portalDropdown = document.getElementById('portal-dropdown');
  const toastContainer = document.getElementById('toast-container');

  // Form & Input
  const qrVerifyForm = document.getElementById('qr-verify-form');
  const verificationInput = document.getElementById('verification-id-input');
  const samplePills = document.querySelectorAll('.sample-pill');

  // Result Section & Containers
  const resultSection = document.getElementById('result-section');
  const initialPlaceholder = document.getElementById('initial-result-placeholder');
  const verifiedResultCard = document.getElementById('verified-result-card');
  const invalidResultCard = document.getElementById('invalid-result-card');

  // Verified Fields
  const resHeaderTitle = document.getElementById('res-header-title');
  const resFullName = document.getElementById('res-full-name');
  const resIdCode = document.getElementById('res-id-code');
  const resStatusLabel = document.getElementById('res-status-label');
  const resClassLabel = document.getElementById('res-class-label');
  const resTimestamp = document.getElementById('res-timestamp');
  const btnPrintVerification = document.getElementById('btn-print-verification');

  // Invalid Fields
  const searchedIdDisplay = document.getElementById('searched-id-display');

  // Admin Buttons
  const adminButtons = document.querySelectorAll('.admin-action-btn');

  // --- MOCK DATABASE RECORDS FOR FRONTEND DEMO ---
  const MOCK_RECORDS = {
    'HGS-2026-8942': {
      fullName: 'Adebayo Samuel Oluwaseun',
      idCode: 'HGS-2026-8942',
      status: 'Provisional Admission Offered',
      className: 'JSS 1 (Junior Secondary)',
      recordType: 'Applicant Record',
      session: '2026/2027 Academic Session'
    },
    'HGS-STD-1024': {
      fullName: 'Okonkwo Chidinma Grace',
      idCode: 'HGS-STD-1024',
      status: 'Enrolled Active Student',
      className: 'SSS 2 (Science Stream)',
      recordType: 'Student Identity Record',
      session: 'Active Student Record'
    },
    'HGS-2026-5510': {
      fullName: 'Bello Farouk Ibrahim',
      idCode: 'HGS-2026-5510',
      status: 'Provisional Admission Offered',
      className: 'JSS 1 (Junior Secondary)',
      recordType: 'Applicant Record',
      session: '2026/2027 Academic Session'
    }
  };

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

  // --- TOAST NOTIFICATION SYSTEM ---
  const showToast = (message, isWarning = false) => {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const icon = isWarning 
      ? `<svg class="toast-icon" style="color: #EF4444;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
      : `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

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

  // --- GENERATE CURRENT TIMESTAMP STRING ---
  const getCurrentTimestamp = () => {
    const now = new Date();
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      timeZoneName: 'short' 
    };
    return now.toLocaleDateString('en-GB', options);
  };

  // --- VERIFY RECORD HANDLER ---
  const verifyID = (queryId) => {
    const cleanId = queryId.trim().toUpperCase();

    if (!cleanId) {
      showToast('Please enter an Applicant ID or Student ID to verify.', true);
      return;
    }

    // Hide initial placeholder
    if (initialPlaceholder) initialPlaceholder.style.display = 'none';

    // Check against mock record dictionary
    const match = MOCK_RECORDS[cleanId];

    if (match) {
      // VALID RECORD FOUND
      invalidResultCard.style.display = 'none';
      verifiedResultCard.style.display = 'block';

      // Update fields
      resHeaderTitle.textContent = match.recordType;
      resFullName.textContent = match.fullName;
      resIdCode.textContent = match.idCode;
      resStatusLabel.textContent = match.status;
      resClassLabel.textContent = match.className;
      resTimestamp.textContent = getCurrentTimestamp();

      showToast(`Record ${match.idCode} verified successfully!`);

    } else {
      // INVALID RECORD
      verifiedResultCard.style.display = 'none';
      invalidResultCard.style.display = 'block';

      searchedIdDisplay.textContent = cleanId;

      showToast(`No record found for reference ID: ${cleanId}`, true);
    }

    // Smooth scroll to results
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  // --- FORM SUBMIT EVENT ---
  if (qrVerifyForm) {
    qrVerifyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      verifyID(verificationInput.value);
    });
  }

  // --- SAMPLE PILLS CLICK EVENT ---
  samplePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const sampleId = pill.getAttribute('data-id');
      if (verificationInput) {
        verificationInput.value = sampleId;
      }
      verifyID(sampleId);
    });
  });

  // --- PRINT VERIFICATION SLIP BUTTON ---
  if (btnPrintVerification) {
    btnPrintVerification.addEventListener('click', () => {
      window.print();
    });
  }

  // --- ADMIN DISABLED BUTTONS TOOLTIP FEEDBACK ---
  adminButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Administrator action disabled — feature will activate upon backend integration.', true);
    });
  });
});
