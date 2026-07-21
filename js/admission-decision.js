/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Admission Decision & Letter Module Logic
 * Handles dynamic status display (Approved, Under Review, Rejected),
 * letter preview, print/download simulation, and accept offer modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM ELEMENTS ---
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const portalDropdown = document.getElementById('portal-dropdown');
  const toastContainer = document.getElementById('toast-container');

  // State Switcher Pills
  const statePillBtns = document.querySelectorAll('.state-pill-btn');

  // Status Card Elements
  const decisionStatusCard = document.getElementById('decision-status-card');
  const badgeContainer = document.getElementById('status-badge-container');
  const msgTitle = document.getElementById('decision-msg-title');
  const msgBody = document.getElementById('decision-msg-body');

  // Action Groups
  const approvedActions = document.getElementById('approved-actions');
  const underReviewActions = document.getElementById('under-review-actions');
  const rejectedActions = document.getElementById('rejected-actions');

  // Action Buttons
  const btnViewLetter = document.getElementById('btn-view-letter');
  const btnDownloadLetter = document.getElementById('btn-download-letter');
  const btnAcceptAdmission = document.getElementById('btn-accept-admission');
  const btnRefreshStatus = document.getElementById('btn-refresh-status');

  // Admission Letter Section
  const letterSection = document.getElementById('admission-letter-section');
  const letterDocument = document.getElementById('letter-document');

  // Accept Modal
  const acceptModal = document.getElementById('accept-admission-modal');
  const btnCancelAccept = document.getElementById('btn-cancel-accept');
  const btnConfirmAccept = document.getElementById('btn-confirm-accept');

  // Local state tracking
  let currentState = 'approved';
  let isAdmissionAccepted = false;

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

  // --- RENDER DECISION STATE ---
  const applyState = (state) => {
    currentState = state;

    // Reset card classes
    decisionStatusCard.className = 'decision-status-card';
    decisionStatusCard.classList.add(`status-state-${state}`);

    if (state === 'approved') {
      badgeContainer.innerHTML = `
        <span class="large-status-badge approved">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          Approved
        </span>
      `;

      msgTitle.textContent = 'Congratulations! You have been offered provisional admission.';
      msgBody.textContent = 'The school management board has officially evaluated your credentials and entrance assessment results. You are hereby invited to accept your provisional offer and proceed with registration.';

      approvedActions.style.display = 'flex';
      underReviewActions.style.display = 'none';
      rejectedActions.style.display = 'none';

      if (letterSection) letterSection.style.display = 'block';

    } else if (state === 'under-review') {
      badgeContainer.innerHTML = `
        <span class="large-status-badge under-review">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          Under Review
        </span>
      `;

      msgTitle.textContent = 'Your application is currently under review.';
      msgBody.textContent = 'Our admissions office is carefully assessing your application details, academic transcripts, and interview records. Please check back regularly for updates.';

      approvedActions.style.display = 'none';
      underReviewActions.style.display = 'flex';
      rejectedActions.style.display = 'none';

      if (letterSection) letterSection.style.display = 'none';

    } else if (state === 'rejected') {
      badgeContainer.innerHTML = `
        <span class="large-status-badge rejected">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          Rejected
        </span>
      `;

      msgTitle.textContent = 'We regret to inform you that your application was not successful.';
      msgBody.textContent = 'Thank you for your interest in His Grace School Agbugburu. Due to space constraints and competitive entrance metrics, we are unable to offer you admission at this time. We wish you every success in your future academic endeavors.';

      approvedActions.style.display = 'none';
      underReviewActions.style.display = 'none';
      rejectedActions.style.display = 'flex';

      if (letterSection) letterSection.style.display = 'none';
    }
  };

  // --- STATE PILLS EVENT LISTENERS ---
  statePillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      statePillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetState = btn.getAttribute('data-state');
      applyState(targetState);
    });
  });

  // --- VIEW ADMISSION LETTER BUTTON ---
  if (btnViewLetter && letterSection) {
    btnViewLetter.addEventListener('click', () => {
      letterSection.scrollIntoView({ behavior: 'smooth' });
      if (letterDocument) {
        letterDocument.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.4)';
        setTimeout(() => {
          letterDocument.style.boxShadow = 'var(--shadow-lg)';
        }, 2000);
      }
    });
  }

  // --- DOWNLOAD ADMISSION LETTER BUTTON ---
  if (btnDownloadLetter) {
    btnDownloadLetter.addEventListener('click', () => {
      showToast('Preparing official Admission Letter PDF document for download...');
      setTimeout(() => {
        showToast('Admission Letter downloaded successfully! Prepared for print.');
      }, 1500);
    });
  }

  // --- ACCEPT ADMISSION OFFER BUTTON ---
  if (btnAcceptAdmission && acceptModal) {
    btnAcceptAdmission.addEventListener('click', () => {
      acceptModal.classList.add('active');
    });
  }

  // --- REFRESH STATUS BUTTON ---
  if (btnRefreshStatus) {
    btnRefreshStatus.addEventListener('click', () => {
      showToast('Refreshing application status from server...');
    });
  }

  // --- CANCEL ACCEPT MODAL ---
  if (btnCancelAccept && acceptModal) {
    btnCancelAccept.addEventListener('click', () => {
      acceptModal.classList.remove('active');
    });
  }

  // --- CONFIRM ACCEPT ADMISSION ---
  if (btnConfirmAccept && acceptModal) {
    btnConfirmAccept.addEventListener('click', () => {
      acceptModal.classList.remove('active');
      isAdmissionAccepted = true;

      // Update Accept button visual
      if (btnAcceptAdmission) {
        btnAcceptAdmission.style.backgroundColor = '#059669';
        btnAcceptAdmission.style.borderColor = '#059669';
        btnAcceptAdmission.disabled = true;
        btnAcceptAdmission.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Admission Offer Accepted
        `;
      }

      showToast('Admission offer accepted successfully! Registration process unlocked.');
    });
  }

  // Initialize with Approved state by default
  applyState('approved');
});
