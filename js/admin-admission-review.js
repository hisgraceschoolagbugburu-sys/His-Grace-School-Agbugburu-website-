/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Administrator Admission Review Dashboard Logic
 * Handles searching, filtering, applicant review, status workflows, notes & approval modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM ELEMENTS ---
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const portalDropdown = document.getElementById('portal-dropdown');
  const toastContainer = document.getElementById('toast-container');

  // Stats Counters
  const statTotal = document.getElementById('stat-total');
  const statPending = document.getElementById('stat-pending');
  const statApproved = document.getElementById('stat-approved');
  const statRejected = document.getElementById('stat-rejected');
  const statDraft = document.getElementById('stat-draft');

  // Filter Badges
  const badgeCountAll = document.getElementById('badge-count-all');
  const badgeCountSubmitted = document.getElementById('badge-count-submitted');
  const badgeCountUnderReview = document.getElementById('badge-count-under-review');
  const badgeCountApproved = document.getElementById('badge-count-approved');
  const badgeCountRejected = document.getElementById('badge-count-rejected');
  const badgeCountDraft = document.getElementById('badge-count-draft');

  // Search & Filter Controls
  const searchInput = document.getElementById('admin-search-input');
  const filterTabs = document.getElementById('filter-tabs');
  const tableBody = document.getElementById('applications-table-body');
  const btnExportList = document.getElementById('btn-export-list');

  // Review Drawer Elements
  const reviewDrawerOverlay = document.getElementById('review-drawer-overlay');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');
  const drawerApplicantName = document.getElementById('drawer-applicant-name');
  const drawerApplicantId = document.getElementById('drawer-applicant-id');
  const drawerTimelineTrack = document.getElementById('drawer-timeline-track');

  // Drawer Form Fields
  const drawerFullname = document.getElementById('drawer-fullname');
  const drawerGender = document.getElementById('drawer-gender');
  const drawerDob = document.getElementById('drawer-dob');
  const drawerNationality = document.getElementById('drawer-nationality');
  const drawerStateLga = document.getElementById('drawer-state-lga');
  const drawerEmail = document.getElementById('drawer-email');
  const drawerPhone = document.getElementById('drawer-phone');
  const drawerAddress = document.getElementById('drawer-address');
  const drawerGuardianName = document.getElementById('drawer-guardian-name');
  const drawerGuardianRelation = document.getElementById('drawer-guardian-relation');
  const drawerGuardianOccupation = document.getElementById('drawer-guardian-occupation');
  const drawerGuardianPhone = document.getElementById('drawer-guardian-phone');
  const drawerGuardianEmail = document.getElementById('drawer-guardian-email');
  const drawerPrevSchool = document.getElementById('drawer-prev-school');
  const drawerLastClass = document.getElementById('drawer-last-class');
  const drawerDesiredClass = document.getElementById('drawer-desired-class');
  const drawerSession = document.getElementById('drawer-session');
  const drawerDocList = document.getElementById('drawer-doc-list');
  const adminNotesTextarea = document.getElementById('admin-notes-textarea');

  // Drawer Action Buttons
  const btnDrawerApprove = document.getElementById('btn-drawer-approve');
  const btnDrawerReject = document.getElementById('btn-drawer-reject');
  const btnDrawerRequestCorrection = document.getElementById('btn-drawer-request-correction');

  // Confirmation Modals
  const approveConfirmModal = document.getElementById('approve-confirm-modal');
  const btnCancelApprove = document.getElementById('btn-cancel-approve');
  const btnConfirmApprove = document.getElementById('btn-confirm-approve');

  const rejectConfirmModal = document.getElementById('reject-confirm-modal');
  const btnCancelReject = document.getElementById('btn-cancel-reject');
  const btnConfirmReject = document.getElementById('btn-confirm-reject');

  // Success Notification Modal
  const adminSuccessModal = document.getElementById('admin-success-modal');
  const adminSuccessIcon = document.getElementById('admin-success-icon');
  const adminSuccessTitle = document.getElementById('admin-success-title');
  const adminSuccessMsg = document.getElementById('admin-success-msg');
  const btnCloseSuccessModal = document.getElementById('btn-close-success-modal');

  // --- SAMPLE APPLICANTS DATASET ---
  let applications = [
    {
      id: 'HGS-2026-8942',
      fullname: 'Adebayo Samuel Oluwaseun',
      gender: 'Male',
      dob: '15/05/2014',
      nationality: 'Nigerian',
      stateLga: 'Ogun State (Odeda LGA)',
      email: 'hisgraceschoolagbugburu@gmail.com',
      phone: '09034014865',
      address: 'No. 14 Grace Haven Estate, Agbugburu Road, Abeokuta, Ogun State',
      guardianName: 'Mr. Timothy Adebayo',
      guardianRelation: 'Father',
      guardianOccupation: 'Civil Servant',
      guardianPhone: '08068045866',
      guardianEmail: 'timothy.adebayo@gmail.com',
      prevSchool: 'St. Marks Nursery & Primary School',
      lastClass: 'Primary 5',
      desiredClass: 'JSS 1',
      session: '2026/2027',
      submissionDate: '21/07/2026',
      status: 'submitted',
      notes: 'Submitted application on 21st July 2026. Academic transcripts verified.',
      documents: [
        { name: 'Passport Photograph', file: 'passport_photo.jpg', uploaded: true },
        { name: 'Birth Certificate', file: 'birth_certificate.pdf', uploaded: true },
        { name: 'Previous School Result / Report Card', file: 'primary5_result.pdf', uploaded: true },
        { name: 'School Testimonial', file: 'Not attached', uploaded: false }
      ]
    },
    {
      id: 'HGS-2026-8943',
      fullname: 'Okonkwo Chidimma Grace',
      gender: 'Female',
      dob: '22/08/2015',
      nationality: 'Nigerian',
      stateLga: 'Enugu State (Nsukka LGA)',
      email: 'okonkwo.grace@gmail.com',
      phone: '08031234567',
      address: 'Plot 8 Federal Housing Estate, Obantoko, Abeokuta',
      guardianName: 'Mrs. Mary Okonkwo',
      guardianRelation: 'Mother',
      guardianOccupation: 'Merchant Trader',
      guardianPhone: '08039988776',
      guardianEmail: 'mary.okonkwo@gmail.com',
      prevSchool: 'Corona Primary School, Gbagada',
      lastClass: 'Primary 5',
      desiredClass: 'JSS 1',
      session: '2026/2027',
      submissionDate: '20/07/2026',
      status: 'under-review',
      notes: 'Interview scheduled for 25th July. Entrance exam score: 88%.',
      documents: [
        { name: 'Passport Photograph', file: 'chidimma_passport.jpg', uploaded: true },
        { name: 'Birth Certificate', file: 'birth_cert_chidimma.pdf', uploaded: true },
        { name: 'Previous School Result / Report Card', file: 'corona_report_card.pdf', uploaded: true },
        { name: 'School Testimonial', file: 'testimonial_corona.pdf', uploaded: true }
      ]
    },
    {
      id: 'HGS-2026-8944',
      fullname: 'Bello Ibrahim Farouk',
      gender: 'Male',
      dob: '10/01/2013',
      nationality: 'Nigerian',
      stateLga: 'Kano State (Fagge LGA)',
      email: 'bello.ibrahim@yahoo.com',
      phone: '08129876543',
      address: '12 Commercial Avenue, Onikolobo, Abeokuta',
      guardianName: 'Alhaji Musa Bello',
      guardianRelation: 'Father',
      guardianOccupation: 'Architect',
      guardianPhone: '08023344556',
      guardianEmail: 'musa.bello@architects.ng',
      prevSchool: 'Federal Staff School, Abeokuta',
      lastClass: 'JSS 1',
      desiredClass: 'JSS 2',
      session: '2026/2027',
      submissionDate: '18/07/2026',
      status: 'approved',
      notes: 'Approved by Principal on 19th July. Letter generated.',
      documents: [
        { name: 'Passport Photograph', file: 'ibrahim_photo.jpg', uploaded: true },
        { name: 'Birth Certificate', file: 'birth_cert_ibrahim.pdf', uploaded: true },
        { name: 'Previous School Result / Report Card', file: 'jss1_results_fss.pdf', uploaded: true },
        { name: 'School Testimonial', file: 'testimonial_fss.pdf', uploaded: true }
      ]
    },
    {
      id: 'HGS-2026-8945',
      fullname: 'Adewale Blessing Temitope',
      gender: 'Female',
      dob: '04/11/2017',
      nationality: 'Nigerian',
      stateLga: 'Oyo State (Ibadan North LGA)',
      email: 'adewale.temitope@gmail.com',
      phone: '08076543210',
      address: '25 Camp Junction Road, Abeokuta',
      guardianName: 'Dr. Kunle Adewale',
      guardianRelation: 'Father',
      guardianOccupation: 'Medical Doctor',
      guardianPhone: '08034455667',
      guardianEmail: 'kunle.adewale@fmc.gov.ng',
      prevSchool: 'Graceful Kids Nursery School',
      lastClass: 'Kindergarten 2',
      desiredClass: 'Primary 1',
      session: '2026/2027',
      submissionDate: '15/07/2026',
      status: 'approved',
      notes: 'Placement test passed. Admitted to Primary 1.',
      documents: [
        { name: 'Passport Photograph', file: 'blessing_pass.jpg', uploaded: true },
        { name: 'Birth Certificate', file: 'birth_cert_blessing.pdf', uploaded: true },
        { name: 'Previous School Result / Report Card', file: 'kg2_assessment.pdf', uploaded: true },
        { name: 'School Testimonial', file: 'Not attached', uploaded: false }
      ]
    },
    {
      id: 'HGS-2026-8946',
      fullname: 'Eze Solomon Chukwuemeka',
      gender: 'Male',
      dob: '11/03/2011',
      nationality: 'Nigerian',
      stateLga: 'Anambra State (Aguata LGA)',
      email: 'eze.solomon@gmail.com',
      phone: '09012345678',
      address: '5 Elega Quarters, Abeokuta',
      guardianName: 'Chief Emmanuel Eze',
      guardianRelation: 'Father',
      guardianOccupation: 'Businessman',
      guardianPhone: '08051122334',
      guardianEmail: 'emmanuel.eze@globaltech.com',
      prevSchool: 'Christ The King College, Onitsha',
      lastClass: 'JSS 3',
      desiredClass: 'SSS 1',
      session: '2026/2027',
      submissionDate: '12/07/2026',
      status: 'rejected',
      notes: 'BECE transcript missing mandatory science subjects. Rejection confirmed.',
      documents: [
        { name: 'Passport Photograph', file: 'solomon_passport.jpg', uploaded: true },
        { name: 'Birth Certificate', file: 'birth_cert_solomon.pdf', uploaded: true },
        { name: 'Previous School Result / Report Card', file: 'incomplete_transcript.pdf', uploaded: true },
        { name: 'School Testimonial', file: 'Not attached', uploaded: false }
      ]
    },
    {
      id: 'HGS-2026-8947',
      fullname: 'Danladi Fatima Usman',
      gender: 'Female',
      dob: '02/09/2014',
      nationality: 'Nigerian',
      stateLga: 'Kaduna State (Zaria LGA)',
      email: 'fatima.danladi@gmail.com',
      phone: '08021112233',
      address: '18 Housing Estate, Kuto, Abeokuta',
      guardianName: 'Engr. Kabir Danladi',
      guardianRelation: 'Father',
      guardianOccupation: 'Civil Engineer',
      guardianPhone: '08032223344',
      guardianEmail: 'kabir.danladi@works.gov.ng',
      prevSchool: 'Ahmadu Bello University Staff School',
      lastClass: 'Primary 5',
      desiredClass: 'JSS 1',
      session: '2026/2027',
      submissionDate: '21/07/2026',
      status: 'submitted',
      notes: 'Fresh submission pending initial screening.',
      documents: [
        { name: 'Passport Photograph', file: 'fatima_photo.jpg', uploaded: true },
        { name: 'Birth Certificate', file: 'birth_cert_fatima.pdf', uploaded: true },
        { name: 'Previous School Result / Report Card', file: 'primary5_results.pdf', uploaded: true },
        { name: 'School Testimonial', file: 'testimonial_abu.pdf', uploaded: true }
      ]
    },
    {
      id: 'HGS-2026-8948',
      fullname: 'Salami David Ayomide',
      gender: 'Male',
      dob: '19/12/2015',
      nationality: 'Nigerian',
      stateLga: 'Ogun State (Abeokuta South LGA)',
      email: 'salami.david@gmail.com',
      phone: '07089900112',
      address: '7 Totoro Road, Abeokuta',
      guardianName: 'Pastor Joseph Salami',
      guardianRelation: 'Father',
      guardianOccupation: 'Clergy',
      guardianPhone: '08023311224',
      guardianEmail: 'joseph.salami@church.org',
      prevSchool: 'Grace Primary Academy',
      lastClass: 'Primary 4',
      desiredClass: 'Primary 5',
      session: '2026/2027',
      submissionDate: '10/07/2026',
      status: 'draft',
      notes: 'Draft application saved by applicant.',
      documents: [
        { name: 'Passport Photograph', file: 'david_pass.jpg', uploaded: true },
        { name: 'Birth Certificate', file: 'Not attached', uploaded: false },
        { name: 'Previous School Result / Report Card', file: 'Not attached', uploaded: false },
        { name: 'School Testimonial', file: 'Not attached', uploaded: false }
      ]
    }
  ];

  let activeFilter = 'all';
  let activeSearchQuery = '';
  let selectedApplicantId = null;

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

  // --- RECALCULATE STATS & COUNTS ---
  const updateStatsAndBadges = () => {
    const total = applications.length;
    const submitted = applications.filter(a => a.status === 'submitted').length;
    const underReview = applications.filter(a => a.status === 'under-review').length;
    const approved = applications.filter(a => a.status === 'approved').length;
    const rejected = applications.filter(a => a.status === 'rejected').length;
    const draft = applications.filter(a => a.status === 'draft').length;

    const pendingTotal = submitted + underReview;

    if (statTotal) statTotal.textContent = total;
    if (statPending) statPending.textContent = pendingTotal;
    if (statApproved) statApproved.textContent = approved;
    if (statRejected) statRejected.textContent = rejected;
    if (statDraft) statDraft.textContent = draft;

    if (badgeCountAll) badgeCountAll.textContent = total;
    if (badgeCountSubmitted) badgeCountSubmitted.textContent = submitted;
    if (badgeCountUnderReview) badgeCountUnderReview.textContent = underReview;
    if (badgeCountApproved) badgeCountApproved.textContent = approved;
    if (badgeCountRejected) badgeCountRejected.textContent = rejected;
    if (badgeCountDraft) badgeCountDraft.textContent = draft;
  };

  // --- RENDER APPLICATIONS TABLE ---
  const renderTable = () => {
    if (!tableBody) return;

    // Filter by status & search query
    const filtered = applications.filter(app => {
      // Status filter
      let matchesStatus = true;
      if (activeFilter === 'submitted') matchesStatus = app.status === 'submitted';
      else if (activeFilter === 'under-review') matchesStatus = app.status === 'under-review';
      else if (activeFilter === 'approved') matchesStatus = app.status === 'approved';
      else if (activeFilter === 'rejected') matchesStatus = app.status === 'rejected';
      else if (activeFilter === 'draft') matchesStatus = app.status === 'draft';

      // Search query filter
      let matchesSearch = true;
      if (activeSearchQuery.trim() !== '') {
        const query = activeSearchQuery.toLowerCase().trim();
        matchesSearch = app.fullname.toLowerCase().includes(query) ||
                        app.id.toLowerCase().includes(query) ||
                        app.email.toLowerCase().includes(query) ||
                        app.desiredClass.toLowerCase().includes(query);
      }

      return matchesStatus && matchesSearch;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 0.5rem; color: var(--text-muted);"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <p style="margin-bottom: 0; font-weight: 600;">No admission applications found matching your filter criteria.</p>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filtered.map(app => {
      let statusBadgeHTML = '';
      if (app.status === 'submitted') {
        statusBadgeHTML = `<span class="status-badge status-submitted"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg> Submitted</span>`;
      } else if (app.status === 'under-review') {
        statusBadgeHTML = `<span class="status-badge status-under-review"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg> Under Review</span>`;
      } else if (app.status === 'approved') {
        statusBadgeHTML = `<span class="status-badge status-approved"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg> Approved</span>`;
      } else if (app.status === 'rejected') {
        statusBadgeHTML = `<span class="status-badge status-rejected"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg> Rejected</span>`;
      } else {
        statusBadgeHTML = `<span class="status-badge status-draft"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg> Draft</span>`;
      }

      return `
        <tr>
          <td>
            <strong style="color: var(--primary); font-family: monospace; font-size: 0.95rem;">${app.id}</strong>
          </td>
          <td>
            <div style="font-weight: 700; color: var(--text-dark);">${app.fullname}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${app.email}</div>
          </td>
          <td>
            <span style="font-weight: 600; color: var(--primary);">${app.desiredClass}</span>
          </td>
          <td>
            <span style="font-size: 0.85rem; color: var(--text-muted);">${app.submissionDate}</span>
          </td>
          <td>
            ${statusBadgeHTML}
          </td>
          <td style="text-align: right;">
            <div class="action-btn-group" style="justify-content: flex-end;">
              <button type="button" class="btn-action-icon btn-review-app" data-id="${app.id}" title="Review Details">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
              
              <button type="button" class="btn-action-icon btn-action-approve btn-approve-direct" data-id="${app.id}" title="Approve Application">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </button>

              <button type="button" class="btn-action-icon btn-action-reject btn-reject-direct" data-id="${app.id}" title="Reject Application">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach click listeners to row action buttons
    document.querySelectorAll('.btn-review-app').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openReviewDrawer(id);
      });
    });

    document.querySelectorAll('.btn-approve-direct').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        selectedApplicantId = id;
        if (approveConfirmModal) approveConfirmModal.classList.add('active');
      });
    });

    document.querySelectorAll('.btn-reject-direct').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        selectedApplicantId = id;
        if (rejectConfirmModal) rejectConfirmModal.classList.add('active');
      });
    });
  };

  // --- FILTER TABS EVENT LISTENERS ---
  if (filterTabs) {
    filterTabs.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterTabs.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter') || 'all';
        renderTable();
      });
    });
  }

  // --- SEARCH INPUT EVENT LISTENER ---
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeSearchQuery = e.target.value;
      renderTable();
    });
  }

  // --- EXPORT CSV LISTENER ---
  if (btnExportList) {
    btnExportList.addEventListener('click', () => {
      showToast('Exporting applications dataset to CSV file...');
    });
  }

  // --- OPEN REVIEW DRAWER WITH APPLICANT DETAILS ---
  const openReviewDrawer = (id) => {
    const app = applications.find(a => a.id === id);
    if (!app) return;

    selectedApplicantId = id;

    // Header info
    if (drawerApplicantName) drawerApplicantName.textContent = app.fullname;
    if (drawerApplicantId) drawerApplicantId.textContent = `ID: ${app.id} | Status: ${app.status.toUpperCase()}`;

    // Timeline workflow highlighting
    if (drawerTimelineTrack) {
      const steps = drawerTimelineTrack.querySelectorAll('.admin-timeline-step');
      steps.forEach(step => {
        step.classList.remove('completed', 'active-stage');
      });

      if (app.status === 'draft') {
        steps[0].classList.add('active-stage');
      } else if (app.status === 'submitted') {
        steps[0].classList.add('completed');
        steps[1].classList.add('active-stage');
      } else if (app.status === 'under-review') {
        steps[0].classList.add('completed');
        steps[1].classList.add('active-stage');
      } else if (app.status === 'approved') {
        steps[0].classList.add('completed');
        steps[1].classList.add('completed');
        steps[2].classList.add('active-stage');
      } else if (app.status === 'rejected') {
        steps[0].classList.add('completed');
        steps[1].classList.add('active-stage');
      }
    }

    // Populate drawer form fields
    if (drawerFullname) drawerFullname.textContent = app.fullname;
    if (drawerGender) drawerGender.textContent = app.gender;
    if (drawerDob) drawerDob.textContent = app.dob;
    if (drawerNationality) drawerNationality.textContent = app.nationality;
    if (drawerStateLga) drawerStateLga.textContent = app.stateLga;
    if (drawerEmail) drawerEmail.textContent = app.email;
    if (drawerPhone) drawerPhone.textContent = app.phone;
    if (drawerAddress) drawerAddress.textContent = app.address;

    if (drawerGuardianName) drawerGuardianName.textContent = app.guardianName;
    if (drawerGuardianRelation) drawerGuardianRelation.textContent = app.guardianRelation;
    if (drawerGuardianOccupation) drawerGuardianOccupation.textContent = app.guardianOccupation;
    if (drawerGuardianPhone) drawerGuardianPhone.textContent = app.guardianPhone;
    if (drawerGuardianEmail) drawerGuardianEmail.textContent = app.guardianEmail;

    if (drawerPrevSchool) drawerPrevSchool.textContent = app.prevSchool;
    if (drawerLastClass) drawerLastClass.textContent = app.lastClass;
    if (drawerDesiredClass) drawerDesiredClass.textContent = app.desiredClass;
    if (drawerSession) drawerSession.textContent = app.session;

    // Render documents list
    if (drawerDocList) {
      drawerDocList.innerHTML = app.documents.map(doc => `
        <div class="doc-review-row">
          <div class="doc-file-info">
            <div class="doc-file-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            </div>
            <div>
              <span style="font-size: 0.875rem; font-weight: 600; color: var(--primary); display: block;">${doc.name}</span>
              <span style="font-size: 0.8rem; color: var(--text-muted);">${doc.file}</span>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            ${doc.uploaded 
              ? `<span class="doc-status-badge uploaded">✓ Uploaded</span>` 
              : `<span class="doc-status-badge pending">Pending</span>`
            }
            ${doc.uploaded 
              ? `<button type="button" class="btn btn-outline btn-sm btn-view-doc" style="font-size: 0.75rem; padding: 0.25rem 0.6rem;">Preview</button>`
              : ''
            }
          </div>
        </div>
      `).join('');

      drawerDocList.querySelectorAll('.btn-view-doc').forEach(btn => {
        btn.addEventListener('click', () => {
          showToast('Opening document preview window...');
        });
      });
    }

    // Admin Notes
    if (adminNotesTextarea) {
      adminNotesTextarea.value = app.notes || '';
    }

    // Show Drawer
    if (reviewDrawerOverlay) {
      reviewDrawerOverlay.classList.add('active');
    }
  };

  // --- CLOSE REVIEW DRAWER ---
  if (btnCloseDrawer && reviewDrawerOverlay) {
    btnCloseDrawer.addEventListener('click', () => {
      reviewDrawerOverlay.classList.remove('active');
    });

    reviewDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === reviewDrawerOverlay) {
        reviewDrawerOverlay.classList.remove('active');
      }
    });
  }

  // --- DRAWER ACTIONS LISTENERS ---
  if (btnDrawerApprove) {
    btnDrawerApprove.addEventListener('click', () => {
      if (approveConfirmModal) approveConfirmModal.classList.add('active');
    });
  }

  if (btnDrawerReject) {
    btnDrawerReject.addEventListener('click', () => {
      if (rejectConfirmModal) rejectConfirmModal.classList.add('active');
    });
  }

  if (btnDrawerRequestCorrection) {
    btnDrawerRequestCorrection.addEventListener('click', () => {
      if (adminSuccessIcon) {
        adminSuccessIcon.className = 'modal-icon-badge';
        adminSuccessIcon.style.backgroundColor = '#FEF3C7';
        adminSuccessIcon.style.color = '#D97706';
        adminSuccessIcon.style.border = '2px solid #F59E0B';
        adminSuccessIcon.innerHTML = `
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg>
        `;
      }
      if (adminSuccessTitle) adminSuccessTitle.textContent = 'Correction Request Sent';
      if (adminSuccessMsg) adminSuccessMsg.textContent = 'A correction notification has been dispatched to the applicant. Their status will update to Under Review.';

      if (adminSuccessModal) adminSuccessModal.classList.add('active');
      showToast('Correction request successfully sent.');
    });
  }

  // --- APPROVAL CONFIRMATION MODAL LISTENERS ---
  if (btnCancelApprove && approveConfirmModal) {
    btnCancelApprove.addEventListener('click', () => {
      approveConfirmModal.classList.remove('active');
    });
  }

  if (btnConfirmApprove && approveConfirmModal) {
    btnConfirmApprove.addEventListener('click', () => {
      approveConfirmModal.classList.remove('active');

      // Update local state
      const targetApp = applications.find(a => a.id === selectedApplicantId);
      if (targetApp) {
        targetApp.status = 'approved';
        if (adminNotesTextarea && adminNotesTextarea.value.trim()) {
          targetApp.notes = adminNotesTextarea.value.trim();
        }
      }

      updateStatsAndBadges();
      renderTable();

      // Show Success Modal
      if (adminSuccessIcon) {
        adminSuccessIcon.className = 'modal-icon-badge success';
        adminSuccessIcon.style.backgroundColor = '#D1FAE5';
        adminSuccessIcon.style.color = '#059669';
        adminSuccessIcon.style.border = '2px solid #10B981';
        adminSuccessIcon.innerHTML = `
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
      }
      if (adminSuccessTitle) adminSuccessTitle.textContent = 'Application Approved Successfully';
      if (adminSuccessMsg) adminSuccessMsg.textContent = `Application ${selectedApplicantId} has been successfully approved for admission. Prepared for future backend integration.`;

      if (adminSuccessModal) adminSuccessModal.classList.add('active');
      showToast(`Application ${selectedApplicantId} approved!`);
    });
  }

  // --- REJECTION CONFIRMATION MODAL LISTENERS ---
  if (btnCancelReject && rejectConfirmModal) {
    btnCancelReject.addEventListener('click', () => {
      rejectConfirmModal.classList.remove('active');
    });
  }

  if (btnConfirmReject && rejectConfirmModal) {
    btnConfirmReject.addEventListener('click', () => {
      rejectConfirmModal.classList.remove('active');

      // Update local state
      const targetApp = applications.find(a => a.id === selectedApplicantId);
      if (targetApp) {
        targetApp.status = 'rejected';
        if (adminNotesTextarea && adminNotesTextarea.value.trim()) {
          targetApp.notes = adminNotesTextarea.value.trim();
        }
      }

      updateStatsAndBadges();
      renderTable();

      // Show Success Modal
      if (adminSuccessIcon) {
        adminSuccessIcon.className = 'modal-icon-badge';
        adminSuccessIcon.style.backgroundColor = '#FEE2E2';
        adminSuccessIcon.style.color = '#DC2626';
        adminSuccessIcon.style.border = '2px solid #EF4444';
        adminSuccessIcon.innerHTML = `
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        `;
      }
      if (adminSuccessTitle) adminSuccessTitle.textContent = 'Application Rejected Successfully';
      if (adminSuccessMsg) adminSuccessMsg.textContent = `Application ${selectedApplicantId} has been marked as rejected.`;

      if (adminSuccessModal) adminSuccessModal.classList.add('active');
      showToast(`Application ${selectedApplicantId} rejected.`);
    });
  }

  // --- CLOSE SUCCESS MODAL ---
  if (btnCloseSuccessModal && adminSuccessModal) {
    btnCloseSuccessModal.addEventListener('click', () => {
      adminSuccessModal.classList.remove('active');
      if (reviewDrawerOverlay) reviewDrawerOverlay.classList.remove('active');
    });
  }

  // --- INITIAL RENDERING ---
  updateStatsAndBadges();
  renderTable();
});
