/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Main Application Script - Vanilla JavaScript
 * Handles SPA routing, interactive transitions, portals warnings, FAQ accordion, lightboxes, and contact submissions.
 */

import { HGS_DB } from './database.js';

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE & CONFIG ---
  const CONFIG = {
    schoolName: "His Grace School Agbugburu",
    email: "hisgraceschoolagbugburu@gmail.com",
    phones: ["09034014865", "08068045866"],
    defaultRoute: 'home',
    routes: ['home', 'about', 'admission', 'gallery', 'contact', 'portals']
  };

  // --- DYNAMIC FIRESTORE WEBSITE SYNC ---
  const syncWebsiteWithFirestore = async () => {
    try {
      // 1. Homepage Config (Logo, Hero Background, Welcome Message)
      const config = await HGS_DB.dbGetDoc('settings', 'homepage');
      if (config) {
        if (config.logoUrl) {
          document.querySelectorAll('.logo-img, .logo-img-wrapper img, .badge-logo-container img').forEach(img => {
            img.src = config.logoUrl;
          });
        }
        if (config.heroBgUrl) {
          document.querySelectorAll('.hero-bg').forEach(img => {
            img.src = config.heroBgUrl;
          });
        }
        if (config.welcomeTitle) {
          const welcomeHeading = document.querySelector('#home-view .welcome-text h2');
          if (welcomeHeading) welcomeHeading.textContent = config.welcomeTitle;
        }
        if (config.welcomeMessage) {
          const welcomeBody = document.querySelector('.welcome-message-content');
          if (welcomeBody) {
            welcomeBody.innerHTML = `<p>${config.welcomeMessage.replace(/\n\n/g, '</p><p>')}</p>`;
          }
        }
        if (config.topBannerText) {
          let bannerEl = document.getElementById('hgs-announcement-bar');
          if (!bannerEl) {
            bannerEl = document.createElement('div');
            bannerEl.id = 'hgs-announcement-bar';
            bannerEl.style.cssText = 'background: var(--primary); color: var(--accent); padding: 0.5rem 1rem; text-align: center; font-size: 0.85rem; font-weight: 700; border-bottom: 1px solid var(--accent); position: relative; z-index: 100;';
            document.body.insertBefore(bannerEl, document.body.firstChild);
          }
          bannerEl.textContent = config.topBannerText;
        }
      }

      // 2. Gallery Photos Sync
      const galleryItems = await HGS_DB.dbQueryDocs('gallery');
      if (galleryItems && galleryItems.length > 0) {
        const galleryGrid = document.getElementById('gallery-grid');
        if (galleryGrid) {
          galleryItems.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          galleryGrid.innerHTML = galleryItems.map(item => `
            <div class="gallery-card animate-card" data-category="${item.category || 'all'}">
              <div class="gallery-img-wrapper">
                <img src="${item.imageUrl}" alt="${item.caption || 'School Photo'}" class="gallery-img" referrerPolicy="no-referrer">
                <div class="gallery-card-overlay">
                  <button class="gallery-zoom-btn" title="Zoom image" aria-label="Zoom image">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="11" y1="8" x2="11" y2="14"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="gallery-card-info">
                <h3 class="card-title" style="color: var(--primary); margin-bottom: 0.5rem;">${item.caption || 'School Photo'}</h3>
                <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--accent); font-weight: 600; letter-spacing: 1px;">${item.category || 'General'}</span>
              </div>
            </div>
          `).join('');
        }
      }

    } catch (err) {
      console.warn('Firestore sync error:', err);
    }
  };

  syncWebsiteWithFirestore();

  // --- DOM ELEMENTS ---
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const portalDropdown = document.getElementById('portal-dropdown');
  const portalLinks = document.querySelectorAll('.portal-link');
  const pageViews = document.querySelectorAll('.page-view');
  const toastContainer = document.getElementById('toast-container');
  const contactForm = document.getElementById('contact-form');
  const contactAlert = document.getElementById('contact-alert');

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

  // Handle mobile portal dropdown toggle (tap instead of hover)
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

  // --- ROBUST VANILLA SPA ROUTER ---
  const handleRouting = () => {
    let hash = window.location.hash.replace('#/', '').replace('#', '').trim();
    
    // Default to home if route is empty or invalid
    if (!hash || !CONFIG.routes.includes(hash)) {
      hash = CONFIG.defaultRoute;
      window.location.hash = `#/${CONFIG.defaultRoute}`;
      return;
    }

    // Update active page view
    pageViews.forEach(view => {
      if (view.id === `${hash}-view`) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    // Update active state in Navigation Links
    navLinks.forEach(link => {
      const linkHash = link.getAttribute('href').replace('#/', '').replace('#', '');
      if (linkHash === hash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close mobile nav drawer if open
    if (mobileToggle && navMenu) {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }

    if (portalDropdown) {
      portalDropdown.classList.remove('active');
    }

    // Scroll back to top smoothly
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Listen for hash changes
  window.addEventListener('hashchange', handleRouting);
  
  // Initialize route on first load
  handleRouting();

  // --- TOAST NOTIFICATION SYSTEM ---
  const showToast = (message, iconSVG = null) => {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // Default icon (info circle) if none provided
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

    // Trigger transition
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // Fade out and remove toast
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4500);
  };

  // --- INTERCEPT PORTAL ACCESS (FUTURE SYSTEM) ---
  portalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const portalName = link.textContent.trim();
      
      const calendarIcon = `
        <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      `;

      showToast(`${portalName} will be available in a future phase! (Administrator system preparation underway)`, calendarIcon);
    });
  });

  // --- APPLY FOR ADMISSION TRIGGER ---
  const applyBtn = document.getElementById('apply-admission-btn');
  if (applyBtn) {
    applyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const successCheckIcon = `
        <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;

      showToast("Admission portal launching soon! The Applicant Registration System is scheduled for Phase 2.", successCheckIcon);
    });
  }

  // --- FAQ ACCORDION HANDLER ---
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const parent = question.closest('.faq-item');
      const isActive = parent.classList.contains('active');

      // Close all other FAQs first
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      // Toggle active state for clicked FAQ
      if (!isActive) {
        parent.classList.add('active');
      }
    });
  });

  // --- DYNAMIC PORTFOLIO / GALLERY FILTER ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  // Keep track of which cards are currently visible to support lightbox cycling
  let visibleCards = Array.from(galleryCards);

  const filterGallery = (filterValue) => {
    visibleCards = [];
    galleryCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filterValue === 'all' || category === filterValue) {
        card.style.display = 'block';
        visibleCards.push(card);
        // Fade and scale in smoothly
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  };

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Set active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');
      filterGallery(filterValue);
    });
  });

  // --- LIGHTBOX MODAL SYSTEM ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  
  let currentCardIndex = -1;

  const updateLightboxContent = (index) => {
    if (index < 0 || index >= visibleCards.length) return;
    currentCardIndex = index;

    const card = visibleCards[index];
    const img = card.querySelector('.gallery-img');
    const title = card.querySelector('.gallery-card-info h3').textContent;
    const category = card.querySelector('.gallery-card-info span').textContent;

    if (img && lightboxImg && lightboxCaption) {
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = `${title} — ${category}`;
        lightboxImg.style.opacity = '1';
      }, 150);
    }
  };

  // Setup click listeners on cards for the zoom button or card image wrapper click
  galleryCards.forEach(card => {
    const zoomBtn = card.querySelector('.gallery-zoom-btn');
    const imgWrapper = card.querySelector('.gallery-img-wrapper');
    const triggerElements = [zoomBtn, imgWrapper].filter(Boolean);

    triggerElements.forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Find index of this card in the currently visible cards
        const index = visibleCards.indexOf(card);
        if (index !== -1) {
          updateLightboxContent(index);
          if (lightbox) {
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock scrolling
          }
        }
      });
    });
  });

  // Also handle preview items on home page (which aren't part of the main gallery view grid)
  const previewItems = document.querySelectorAll('.gallery-preview-item');
  previewItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const img = item.querySelector('.gallery-preview-img');
      const title = item.querySelector('.gallery-preview-text h4').textContent;
      const category = item.querySelector('.gallery-preview-text p').textContent;

      if (img && lightbox && lightboxImg && lightboxCaption) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = `${title} — ${category}`;
        // Hide previous/next buttons for preview mode
        if (lightboxPrev) lightboxPrev.style.display = 'none';
        if (lightboxNext) lightboxNext.style.display = 'none';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Lightbox Close Logic
  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = ''; // Unlock scrolling
      // Restore previous/next button displays
      if (lightboxPrev) lightboxPrev.style.display = '';
      if (lightboxNext) lightboxNext.style.display = '';
    }
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Lightbox Navigation Logic (Prev / Next)
  const navigateLightbox = (direction) => {
    if (visibleCards.length === 0 || currentCardIndex === -1) return;
    
    let newIndex = currentCardIndex + direction;
    if (newIndex < 0) {
      newIndex = visibleCards.length - 1; // Cycle to end
    } else if (newIndex >= visibleCards.length) {
      newIndex = 0; // Cycle to start
    }
    
    updateLightboxContent(newIndex);
  };

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(-1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(1);
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      if (currentCardIndex !== -1) {
        navigateLightbox(-1);
      }
    } else if (e.key === 'ArrowRight') {
      if (currentCardIndex !== -1) {
        navigateLightbox(1);
      }
    }
  });

  // --- CONTACT FORM SUBMISSION SIMULATOR ---
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve form data
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();

      // Simple validation
      if (!name || !email || !phone || !subject || !message) {
        showToast("Please fill in all form fields.", `
          <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2">
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        `);
        return;
      }

      // Show alert & toast
      if (contactAlert) {
        contactAlert.className = 'form-alert success';
        contactAlert.innerHTML = `
          <svg class="form-alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Message sent successfully! Thank you for contacting His Grace School Agbugburu. We will get back to you shortly.</span>
        `;
        
        // Scroll to form alert nicely
        contactAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        const checkIcon = `
          <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;

        showToast("Your message was dispatched successfully!", checkIcon);
        
        // Reset the form
        contactForm.reset();

        // Automatically hide alert after 8 seconds
        setTimeout(() => {
          contactAlert.className = 'form-alert';
          contactAlert.innerHTML = '';
        }, 8000);
      }
    });
  }
});
