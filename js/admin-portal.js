/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Administrator Portal Dashboard Script
 * Controls Master Control Center tab views, Cloudinary file uploads,
 * Homepage configuration, Gallery management, News publishing, Downloads PDFs,
 * and session authentication / logout.
 */

import { HGS_SESSION } from './session.js';
import { HGS_AUTH } from './auth.js';
import { HGS_DB } from './database.js';
import { uploadToCloudinary } from './cloudinary.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Session Guard Check - Ensure active Administrator session exists
  const currentUser = HGS_SESSION.requireAuthentication(['administrator'], 'admin-login.html');
  if (!currentUser) return;

  // DOM Elements - Navigation & Layout
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const portalDropdown = document.getElementById('portal-dropdown');
  const toastContainer = document.getElementById('toast-container');

  const sidebarButtons = document.querySelectorAll('.admin-nav-btn[data-tab]');
  const sidebarLogoutBtn = document.getElementById('sidebar-admin-logout');

  // Tab Panes
  const paneDashboard = document.getElementById('pane-admin-dashboard');
  const paneHomepage = document.getElementById('pane-admin-homepage');
  const paneGallery = document.getElementById('pane-admin-gallery');
  const paneNews = document.getElementById('pane-admin-news');
  const paneDownloads = document.getElementById('pane-admin-downloads');
  const paneCS = document.getElementById('pane-admin-cs');

  const csModuleHeading = document.getElementById('cs-module-heading');
  const csModuleNameText = document.getElementById('cs-module-name-text');
  const returnDashBtns = document.querySelectorAll('.btn-return-dash');

  // Quick Action Buttons
  const qaManageHomepage = document.getElementById('qa-manage-homepage');
  const qaReviewAdmissions = document.getElementById('qa-review-admissions');
  const qaViewStudents = document.getElementById('qa-view-students');
  const qaManageTeachers = document.getElementById('qa-manage-teachers');
  const qaAdminLogout = document.getElementById('qa-admin-logout');

  // Module Cards
  const moduleCards = document.querySelectorAll('.module-card-item');

  // Homepage Config Elements
  const homepageConfigForm = document.getElementById('homepage-config-form');
  const dzSchoolLogo = document.getElementById('dz-school-logo');
  const dzHeroBg = document.getElementById('dz-hero-bg');
  const inputLogoFile = document.getElementById('input-logo-file');
  const inputHeroFile = document.getElementById('input-hero-file');

  const previewLogoImg = document.getElementById('preview-logo-img');
  const previewHeroImg = document.getElementById('preview-hero-img');

  const welcomeHeadlineInput = document.getElementById('welcome-headline');
  const welcomeBodyInput = document.getElementById('welcome-body');
  const topBannerInput = document.getElementById('top-banner-text');

  // Progress Bar Containers & Fills
  const logoProgressBox = document.getElementById('logo-upload-progress');
  const logoProgressBarFill = document.getElementById('logo-progress-bar-fill');
  const logoProgressPercent = document.getElementById('logo-progress-percent');
  const logoUploadStatus = document.getElementById('logo-upload-status');

  const heroProgressBox = document.getElementById('hero-upload-progress');
  const heroProgressBarFill = document.getElementById('hero-progress-bar-fill');
  const heroProgressPercent = document.getElementById('hero-progress-percent');
  const heroUploadStatus = document.getElementById('hero-upload-status');

  // Gallery Elements
  const galleryForm = document.getElementById('gallery-upload-form');
  const dzGalleryPhoto = document.getElementById('dz-gallery-photo');
  const inputGalleryFile = document.getElementById('input-gallery-file');
  const galleryFileLabel = document.getElementById('gallery-file-label');
  const galleryCaptionInput = document.getElementById('gallery-caption-input');
  const galleryCategorySelect = document.getElementById('gallery-category-select');
  const galleryProgressBox = document.getElementById('gallery-upload-progress');
  const galleryProgressBarFill = document.getElementById('gallery-progress-bar-fill');
  const galleryProgressPercent = document.getElementById('gallery-progress-percent');
  const galleryAdminGrid = document.getElementById('admin-gallery-grid');

  // News Elements
  const newsForm = document.getElementById('news-upload-form');
  const newsTitleInput = document.getElementById('news-title-input');
  const newsCategorySelect = document.getElementById('news-category-select');
  const newsBodyInput = document.getElementById('news-body-input');
  const dzNewsImage = document.getElementById('dz-news-image');
  const inputNewsFile = document.getElementById('input-news-file');
  const newsFileLabel = document.getElementById('news-file-label');
  const newsProgressBox = document.getElementById('news-upload-progress');
  const newsProgressBarFill = document.getElementById('news-progress-bar-fill');
  const newsProgressPercent = document.getElementById('news-progress-percent');
  const adminNewsContainer = document.getElementById('admin-news-container');

  // Downloads / PDF Elements
  const docForm = document.getElementById('doc-upload-form');
  const docTitleInput = document.getElementById('doc-title-input');
  const docTypeSelect = document.getElementById('doc-type-select');
  const dzDocFile = document.getElementById('dz-doc-file');
  const inputDocFile = document.getElementById('input-doc-file');
  const docFileLabel = document.getElementById('doc-file-label');
  const docProgressBox = document.getElementById('doc-upload-progress');
  const docProgressBarFill = document.getElementById('doc-progress-bar-fill');
  const docProgressPercent = document.getElementById('doc-progress-percent');
  const adminDocsContainer = document.getElementById('admin-docs-container');

  // Current State URLs
  let currentLogoUrl = null;
  let currentHeroBgUrl = null;

  // Display Name in Welcome Banner
  const adminDisplayNameEl = document.getElementById('admin-display-name');
  if (adminDisplayNameEl && currentUser.fullName) {
    adminDisplayNameEl.textContent = currentUser.fullName;
  }

  // Sticky Header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Navigation
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Toast System
  const showToast = (message, isError = false) => {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'error' : ''}`;
    const icon = isError
      ? `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
      : `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    toast.innerHTML = `${icon}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  };

  // Module Titles Mapping
  const getModuleTitle = (key) => {
    const map = {
      homepage: 'Homepage Management',
      admissions: 'Admission Management',
      students: 'Student Management',
      teachers: 'Teacher Management',
      gallery: 'Gallery Management',
      news: 'News & Notice Board',
      'admission-letters': 'Official Downloads & PDFs',
      qrcodes: 'QR Code Management',
      results: 'Results Management',
      timetable: 'Timetable Management',
      fees: 'School Fees Management',
      settings: 'Website Settings',
      profile: 'Administrator Profile'
    };
    return map[key] || 'Master Control Module';
  };

  // Switch Pane View Function
  const switchAdminPane = (targetTab) => {
    // Hide all panes
    if (paneDashboard) paneDashboard.style.display = 'none';
    if (paneHomepage) paneHomepage.style.display = 'none';
    if (paneGallery) paneGallery.style.display = 'none';
    if (paneNews) paneNews.style.display = 'none';
    if (paneDownloads) paneDownloads.style.display = 'none';
    if (paneCS) paneCS.style.display = 'none';

    // Update sidebar buttons
    sidebarButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === targetTab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (targetTab === 'dashboard') {
      if (paneDashboard) paneDashboard.style.display = 'block';
    } else if (targetTab === 'homepage') {
      if (paneHomepage) paneHomepage.style.display = 'block';
      loadHomepageConfig();
    } else if (targetTab === 'gallery') {
      if (paneGallery) paneGallery.style.display = 'block';
      loadGalleryAdminList();
    } else if (targetTab === 'news') {
      if (paneNews) paneNews.style.display = 'block';
      loadNewsAdminList();
    } else if (targetTab === 'admission-letters' || targetTab === 'downloads') {
      if (paneDownloads) paneDownloads.style.display = 'block';
      loadDocsAdminList();
    } else {
      const title = getModuleTitle(targetTab);
      if (csModuleHeading) csModuleHeading.textContent = title;
      if (csModuleNameText) csModuleNameText.textContent = title;
      if (paneCS) paneCS.style.display = 'block';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sidebar & Return Handlers
  sidebarButtons.forEach(btn => btn.addEventListener('click', () => switchAdminPane(btn.getAttribute('data-tab'))));
  returnDashBtns.forEach(btn => btn.addEventListener('click', () => switchAdminPane('dashboard')));
  moduleCards.forEach(card => card.addEventListener('click', () => switchAdminPane(card.getAttribute('data-tab-target'))));

  if (qaManageHomepage) qaManageHomepage.addEventListener('click', () => switchAdminPane('homepage'));
  if (qaReviewAdmissions) qaReviewAdmissions.addEventListener('click', () => switchAdminPane('admissions'));
  if (qaViewStudents) qaViewStudents.addEventListener('click', () => switchAdminPane('students'));
  if (qaManageTeachers) qaManageTeachers.addEventListener('click', () => switchAdminPane('teachers'));

  // =========================================================
  // 1. HOMEPAGE CONFIG & CLOUDINARY UPLOADS (LOGO & HERO BG)
  // =========================================================

  const loadHomepageConfig = async () => {
    try {
      const config = await HGS_DB.dbGetDoc('settings', 'homepage');
      if (config) {
        if (config.logoUrl && previewLogoImg) {
          previewLogoImg.src = config.logoUrl;
          currentLogoUrl = config.logoUrl;
        }
        if (config.heroBgUrl && previewHeroImg) {
          previewHeroImg.src = config.heroBgUrl;
          currentHeroBgUrl = config.heroBgUrl;
        }
        if (config.welcomeTitle && welcomeHeadlineInput) {
          welcomeHeadlineInput.value = config.welcomeTitle;
        }
        if (config.welcomeMessage && welcomeBodyInput) {
          welcomeBodyInput.value = config.welcomeMessage;
        }
        if (config.topBannerText && topBannerInput) {
          topBannerInput.value = config.topBannerText;
        }
      }
    } catch (err) {
      console.warn('Unable to load homepage settings from Firestore:', err);
    }
  };

  // Trigger File Input Click
  if (dzSchoolLogo && inputLogoFile) dzSchoolLogo.addEventListener('click', () => inputLogoFile.click());
  if (dzHeroBg && inputHeroFile) dzHeroBg.addEventListener('click', () => inputHeroFile.click());

  // Upload Logo directly to Cloudinary
  if (inputLogoFile) {
    inputLogoFile.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (logoProgressBox) logoProgressBox.classList.add('active');
      if (logoProgressBarFill) logoProgressBarFill.style.width = '0%';
      if (logoProgressPercent) logoProgressPercent.textContent = '0%';

      try {
        const result = await uploadToCloudinary(file, {
          folder: 'school_logo',
          onProgress: (percent) => {
            if (logoProgressBarFill) logoProgressBarFill.style.width = `${percent}%`;
            if (logoProgressPercent) logoProgressPercent.textContent = `${percent}%`;
          }
        });

        currentLogoUrl = result.url;
        if (previewLogoImg) previewLogoImg.src = result.url;

        // Persist URL in Firestore
        await HGS_DB.dbSetDoc('settings', 'homepage', { logoUrl: result.url });

        showToast("Upload completed successfully.");
        if (logoUploadStatus) {
          logoUploadStatus.className = 'upload-status-text success';
          logoUploadStatus.innerHTML = `<span>Upload completed successfully.</span><span>100%</span>`;
        }
      } catch (err) {
        console.error('Logo upload error:', err);
        const errorMsg = err.message || "Upload failed. Please try again.";
        showToast(errorMsg, true);
        if (logoUploadStatus) {
          logoUploadStatus.className = 'upload-status-text error';
          logoUploadStatus.innerHTML = `<span>Upload failed. Please try again.</span><span>Error</span>`;
        }
      }
    });
  }

  // Upload Hero Background directly to Cloudinary
  if (inputHeroFile) {
    inputHeroFile.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (heroProgressBox) heroProgressBox.classList.add('active');
      if (heroProgressBarFill) heroProgressBarFill.style.width = '0%';
      if (heroProgressPercent) heroProgressPercent.textContent = '0%';

      try {
        const result = await uploadToCloudinary(file, {
          folder: 'hero_background',
          onProgress: (percent) => {
            if (heroProgressBarFill) heroProgressBarFill.style.width = `${percent}%`;
            if (heroProgressPercent) heroProgressPercent.textContent = `${percent}%`;
          }
        });

        currentHeroBgUrl = result.url;
        if (previewHeroImg) previewHeroImg.src = result.url;

        // Persist URL in Firestore
        await HGS_DB.dbSetDoc('settings', 'homepage', { heroBgUrl: result.url });

        showToast("Upload completed successfully.");
        if (heroUploadStatus) {
          heroUploadStatus.className = 'upload-status-text success';
          heroUploadStatus.innerHTML = `<span>Upload completed successfully.</span><span>100%</span>`;
        }
      } catch (err) {
        console.error('Hero background upload error:', err);
        const errorMsg = err.message || "Upload failed. Please try again.";
        showToast(errorMsg, true);
        if (heroUploadStatus) {
          heroUploadStatus.className = 'upload-status-text error';
          heroUploadStatus.innerHTML = `<span>Upload failed. Please try again.</span><span>Error</span>`;
        }
      }
    });
  }

  // Save Welcome Message & Banners in Firestore
  if (homepageConfigForm) {
    homepageConfigForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const welcomeTitle = welcomeHeadlineInput ? welcomeHeadlineInput.value.trim() : '';
      const welcomeMessage = welcomeBodyInput ? welcomeBodyInput.value.trim() : '';
      const topBannerText = topBannerInput ? topBannerInput.value.trim() : '';

      try {
        await HGS_DB.dbSetDoc('settings', 'homepage', {
          welcomeTitle,
          welcomeMessage,
          topBannerText,
          logoUrl: currentLogoUrl,
          heroBgUrl: currentHeroBgUrl
        });

        showToast('Homepage configuration updated successfully!');
      } catch (err) {
        console.error('Firestore save error:', err);
        showToast('Failed to save homepage settings. Please try again.', true);
      }
    });
  }

  // Initial Load of Homepage Config
  loadHomepageConfig();

  // =========================================================
  // 2. GALLERY MANAGEMENT (CLOUDINARY & FIRESTORE)
  // =========================================================

  if (dzGalleryPhoto && inputGalleryFile) {
    dzGalleryPhoto.addEventListener('click', () => inputGalleryFile.click());
    inputGalleryFile.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        galleryFileLabel.textContent = `Selected: ${e.target.files[0].name}`;
      }
    });
  }

  const loadGalleryAdminList = async () => {
    if (!galleryAdminGrid) return;
    galleryAdminGrid.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">Loading gallery photos...</p>`;

    try {
      const items = await HGS_DB.dbQueryDocs('gallery');
      if (!items || items.length === 0) {
        galleryAdminGrid.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; background: var(--secondary-bg); border-radius: var(--radius-md); border: 1px dashed var(--border);">
            <p style="color: var(--text-muted); font-size: 0.9rem;">No gallery photos uploaded yet. Use the form above to upload images via Cloudinary.</p>
          </div>
        `;
        return;
      }

      // Sort newest first
      items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

      galleryAdminGrid.innerHTML = items.map(item => `
        <div class="gallery-admin-card" data-doc-id="${item.id}">
          <img src="${item.imageUrl}" alt="${item.caption || 'Gallery Photo'}" class="gallery-admin-thumb" referrerPolicy="no-referrer">
          <div class="gallery-admin-content">
            <span style="display: inline-block; padding: 0.15rem 0.5rem; background: rgba(18, 62, 124, 0.1); color: var(--primary); font-size: 0.7rem; font-weight: 700; border-radius: var(--radius-sm); text-transform: uppercase; margin-bottom: 0.4rem;">
              ${item.category || 'general'}
            </span>
            <p style="font-size: 0.85rem; font-weight: 600; color: var(--text-dark); margin-bottom: 0.5rem; line-height: 1.3;">
              ${item.caption || 'No Caption'}
            </p>
            <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
              <button type="button" class="btn-edit-caption" data-doc-id="${item.id}" data-current-caption="${item.caption || ''}" style="padding: 0.35rem 0.6rem; font-size: 0.75rem; background: var(--secondary-bg); border: 1px solid var(--border); border-radius: var(--radius-sm); font-weight: 600; cursor: pointer;">
                Edit Caption
              </button>
              <button type="button" class="btn-delete-photo" data-doc-id="${item.id}" style="padding: 0.35rem 0.6rem; font-size: 0.75rem; background: #FEE2E2; color: #DC2626; border: 1px solid #FCA5A5; border-radius: var(--radius-sm); font-weight: 600; cursor: pointer;">
                Delete
              </button>
            </div>
          </div>
        </div>
      `).join('');

      // Attach Edit Caption & Delete Event Listeners
      galleryAdminGrid.querySelectorAll('.btn-edit-caption').forEach(btn => {
        btn.addEventListener('click', async () => {
          const docId = btn.getAttribute('data-doc-id');
          const currentCaption = btn.getAttribute('data-current-caption');
          const newCaption = prompt('Enter new caption for this photo:', currentCaption);

          if (newCaption !== null && newCaption.trim() !== '') {
            try {
              await HGS_DB.dbUpdateDoc('gallery', docId, { caption: newCaption.trim() });
              showToast('Gallery caption updated successfully!');
              loadGalleryAdminList();
            } catch (err) {
              console.error('Caption update error:', err);
              showToast('Failed to update caption. Please try again.', true);
            }
          }
        });
      });

      galleryAdminGrid.querySelectorAll('.btn-delete-photo').forEach(btn => {
        btn.addEventListener('click', async () => {
          const docId = btn.getAttribute('data-doc-id');
          if (confirm('Are you sure you want to delete this photo from the school gallery?')) {
            try {
              await HGS_DB.dbDeleteDoc('gallery', docId);
              showToast('Gallery photo deleted successfully.');
              loadGalleryAdminList();
            } catch (err) {
              console.error('Gallery delete error:', err);
              showToast('Failed to delete photo. Please try again.', true);
            }
          }
        });
      });

    } catch (err) {
      console.error('Gallery load error:', err);
      galleryAdminGrid.innerHTML = `<p style="color: #DC2626; font-size: 0.9rem;">Unable to load gallery photos from Firestore.</p>`;
    }
  };

  // Gallery Upload Form Submit
  if (galleryForm) {
    galleryForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const file = inputGalleryFile ? inputGalleryFile.files[0] : null;
      const caption = galleryCaptionInput ? galleryCaptionInput.value.trim() : '';
      const category = galleryCategorySelect ? galleryCategorySelect.value : 'campus';

      if (!caption) {
        showToast('Please enter a photo caption.', true);
        return;
      }

      if (!file) {
        showToast('Please select an image file to upload.', true);
        return;
      }

      if (galleryProgressBox) galleryProgressBox.classList.add('active');
      if (galleryProgressBarFill) galleryProgressBarFill.style.width = '0%';
      if (galleryProgressPercent) galleryProgressPercent.textContent = '0%';

      try {
        const result = await uploadToCloudinary(file, {
          folder: 'gallery',
          onProgress: (percent) => {
            if (galleryProgressBarFill) galleryProgressBarFill.style.width = `${percent}%`;
            if (galleryProgressPercent) galleryProgressPercent.textContent = `${percent}%`;
          }
        });

        // Save metadata to Firestore
        const docId = `gallery_${Date.now()}`;
        await HGS_DB.dbSetDoc('gallery', docId, {
          imageUrl: result.url,
          publicId: result.public_id,
          caption,
          category,
          createdAt: new Date().toISOString()
        });

        showToast("Upload completed successfully.");
        galleryForm.reset();
        if (galleryFileLabel) galleryFileLabel.textContent = 'No file selected';

        setTimeout(() => {
          if (galleryProgressBox) galleryProgressBox.classList.remove('active');
          loadGalleryAdminList();
        }, 1000);

      } catch (err) {
        console.error('Gallery upload error:', err);
        showToast(err.message || "Upload failed. Please try again.", true);
      }
    });
  }

  // =========================================================
  // 3. NEWS & NOTICE BOARD MANAGEMENT
  // =========================================================

  if (dzNewsImage && inputNewsFile) {
    dzNewsImage.addEventListener('click', () => inputNewsFile.click());
    inputNewsFile.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        newsFileLabel.textContent = `Selected: ${e.target.files[0].name}`;
      }
    });
  }

  const loadNewsAdminList = async () => {
    if (!adminNewsContainer) return;
    adminNewsContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">Loading news posts...</p>`;

    try {
      const posts = await HGS_DB.dbQueryDocs('news');
      if (!posts || posts.length === 0) {
        adminNewsContainer.innerHTML = `
          <div style="padding: 2rem; text-align: center; background: var(--secondary-bg); border-radius: var(--radius-md); border: 1px dashed var(--border);">
            <p style="color: var(--text-muted); font-size: 0.9rem;">No news posts published yet. Create your first notice post using the form above.</p>
          </div>
        `;
        return;
      }

      // Sort newest first
      posts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

      adminNewsContainer.innerHTML = posts.map(post => `
        <div style="background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1.25rem; display: flex; gap: 1.25rem; align-items: flex-start;">
          ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}" style="width: 110px; height: 90px; object-fit: cover; border-radius: var(--radius-sm); flex-shrink: 0;" referrerPolicy="no-referrer">` : ''}
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 0.35rem;">
              <span style="display: inline-block; padding: 0.15rem 0.5rem; background: rgba(212, 175, 55, 0.15); color: #92400E; font-size: 0.725rem; font-weight: 700; border-radius: var(--radius-sm);">
                ${post.category || 'Notice'}
              </span>
              <span style="font-size: 0.75rem; color: var(--text-muted);">${post.date || ''}</span>
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--primary); margin-bottom: 0.35rem;">
              ${post.title}
            </h4>
            <p style="font-size: 0.85rem; color: var(--text-dark); margin-bottom: 0.75rem; line-height: 1.5;">
              ${post.body}
            </p>
            <button type="button" class="btn-delete-news" data-doc-id="${post.id}" style="padding: 0.35rem 0.75rem; font-size: 0.75rem; background: #FEE2E2; color: #DC2626; border: 1px solid #FCA5A5; border-radius: var(--radius-sm); font-weight: 600; cursor: pointer;">
              Delete News Post
            </button>
          </div>
        </div>
      `).join('');

      // Attach Delete Event Handler
      adminNewsContainer.querySelectorAll('.btn-delete-news').forEach(btn => {
        btn.addEventListener('click', async () => {
          const docId = btn.getAttribute('data-doc-id');
          if (confirm('Are you sure you want to delete this news post?')) {
            try {
              await HGS_DB.dbDeleteDoc('news', docId);
              showToast('News post deleted successfully.');
              loadNewsAdminList();
            } catch (err) {
              console.error('News delete error:', err);
              showToast('Failed to delete news post.', true);
            }
          }
        });
      });

    } catch (err) {
      console.error('News load error:', err);
      adminNewsContainer.innerHTML = `<p style="color: #DC2626; font-size: 0.9rem;">Unable to load news items from Firestore.</p>`;
    }
  };

  // News Form Submit
  if (newsForm) {
    newsForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const title = newsTitleInput ? newsTitleInput.value.trim() : '';
      const category = newsCategorySelect ? newsCategorySelect.value : 'Academic Notice';
      const body = newsBodyInput ? newsBodyInput.value.trim() : '';
      const file = inputNewsFile ? inputNewsFile.files[0] : null;

      if (!title || !body) {
        showToast('Please fill in both post title and body message.', true);
        return;
      }

      let imageUrl = null;

      if (file) {
        if (newsProgressBox) newsProgressBox.classList.add('active');
        if (newsProgressBarFill) newsProgressBarFill.style.width = '0%';
        if (newsProgressPercent) newsProgressPercent.textContent = '0%';

        try {
          const result = await uploadToCloudinary(file, {
            folder: 'news',
            onProgress: (percent) => {
              if (newsProgressBarFill) newsProgressBarFill.style.width = `${percent}%`;
              if (newsProgressPercent) newsProgressPercent.textContent = `${percent}%`;
            }
          });
          imageUrl = result.url;
        } catch (err) {
          console.error('News image upload error:', err);
          showToast(err.message || "Upload failed. Please try again.", true);
          return;
        }
      }

      try {
        const docId = `news_${Date.now()}`;
        await HGS_DB.dbSetDoc('news', docId, {
          title,
          category,
          body,
          imageUrl,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          createdAt: new Date().toISOString()
        });

        showToast("Upload completed successfully.");
        newsForm.reset();
        if (newsFileLabel) newsFileLabel.textContent = 'No image selected';

        setTimeout(() => {
          if (newsProgressBox) newsProgressBox.classList.remove('active');
          loadNewsAdminList();
        }, 800);

      } catch (err) {
        console.error('News post save error:', err);
        showToast('Failed to publish news post. Please try again.', true);
      }
    });
  }

  // =========================================================
  // 4. DOWNLOADS & PDF DOCUMENTS MANAGEMENT
  // =========================================================

  if (dzDocFile && inputDocFile) {
    dzDocFile.addEventListener('click', () => inputDocFile.click());
    inputDocFile.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        docFileLabel.textContent = `Selected: ${e.target.files[0].name}`;
      }
    });
  }

  const loadDocsAdminList = async () => {
    if (!adminDocsContainer) return;
    adminDocsContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">Loading official documents...</p>`;

    try {
      const docs = await HGS_DB.dbQueryDocs('downloads');
      if (!docs || docs.length === 0) {
        adminDocsContainer.innerHTML = `
          <div style="padding: 2rem; text-align: center; background: var(--secondary-bg); border-radius: var(--radius-md); border: 1px dashed var(--border);">
            <p style="color: var(--text-muted); font-size: 0.9rem;">No official PDF documents uploaded yet. Upload Admission Letters, Student Handbooks or Prospectuses above.</p>
          </div>
        `;
        return;
      }

      docs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

      adminDocsContainer.innerHTML = docs.map(docItem => `
        <div class="doc-admin-card">
          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <div style="width: 42px; height: 42px; border-radius: var(--radius-sm); background: #FEE2E2; color: #DC2626; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: 800; font-size: 0.8rem;">
              PDF
            </div>
            <div>
              <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--primary); margin-bottom: 0.15rem;">
                ${docItem.title}
              </h4>
              <span style="font-size: 0.775rem; color: var(--text-muted);">
                ${docItem.type || 'Official PDF'} • Uploaded ${new Date(docItem.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <a href="${docItem.docUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; font-weight: 600;">
              View / Download PDF
            </a>
            <button type="button" class="btn-delete-doc" data-doc-id="${docItem.id}" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; background: #FEE2E2; color: #DC2626; border: 1px solid #FCA5A5; border-radius: var(--radius-sm); font-weight: 600; cursor: pointer;">
              Delete
            </button>
          </div>
        </div>
      `).join('');

      // Delete handler
      adminDocsContainer.querySelectorAll('.btn-delete-doc').forEach(btn => {
        btn.addEventListener('click', async () => {
          const docId = btn.getAttribute('data-doc-id');
          if (confirm('Are you sure you want to delete this document from Cloudinary registry?')) {
            try {
              await HGS_DB.dbDeleteDoc('downloads', docId);
              showToast('PDF document deleted successfully.');
              loadDocsAdminList();
            } catch (err) {
              console.error('Doc delete error:', err);
              showToast('Failed to delete document.', true);
            }
          }
        });
      });

    } catch (err) {
      console.error('Docs load error:', err);
      adminDocsContainer.innerHTML = `<p style="color: #DC2626; font-size: 0.9rem;">Unable to load document records from Firestore.</p>`;
    }
  };

  // Doc Form Submit
  if (docForm) {
    docForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const title = docTitleInput ? docTitleInput.value.trim() : '';
      const type = docTypeSelect ? docTypeSelect.value : 'Admission Letter';
      const file = inputDocFile ? inputDocFile.files[0] : null;

      if (!title || !file) {
        showToast('Please enter document title and select a PDF file.', true);
        return;
      }

      if (docProgressBox) docProgressBox.classList.add('active');
      if (docProgressBarFill) docProgressBarFill.style.width = '0%';
      if (docProgressPercent) docProgressPercent.textContent = '0%';

      try {
        const result = await uploadToCloudinary(file, {
          folder: 'documents',
          allowDocuments: true,
          onProgress: (percent) => {
            if (docProgressBarFill) docProgressBarFill.style.width = `${percent}%`;
            if (docProgressPercent) docProgressPercent.textContent = `${percent}%`;
          }
        });

        const docId = `doc_${Date.now()}`;
        await HGS_DB.dbSetDoc('downloads', docId, {
          title,
          type,
          docUrl: result.url,
          originalFilename: result.original_filename,
          createdAt: new Date().toISOString()
        });

        showToast("Upload completed successfully.");
        docForm.reset();
        if (docFileLabel) docFileLabel.textContent = 'No PDF selected';

        setTimeout(() => {
          if (docProgressBox) docProgressBox.classList.remove('active');
          loadDocsAdminList();
        }, 800);

      } catch (err) {
        console.error('PDF upload error:', err);
        showToast(err.message || "Upload failed. Please try again.", true);
      }
    });
  }

  // Logout Handler
  const handleAdminLogout = async (e) => {
    if (e) e.preventDefault();
    showToast('Signing out of Master Control Center...');
    try {
      await HGS_AUTH.logoutUser();
    } catch (err) {
      console.warn('Logout error:', err);
    }
    localStorage.removeItem('hgs_admin_logged_in');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);
  };

  if (qaAdminLogout) qaAdminLogout.addEventListener('click', handleAdminLogout);
  if (sidebarLogoutBtn) sidebarLogoutBtn.addEventListener('click', handleAdminLogout);
});
