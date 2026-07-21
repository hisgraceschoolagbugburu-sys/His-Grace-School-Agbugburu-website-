/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Main Application Script - Vanilla JavaScript
 * Handles SPA routing, interactive transitions, portals warnings, FAQ accordion, lightboxes, and contact submissions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE & CONFIG ---
  const CONFIG = {
    schoolName: "His Grace School Agbugburu",
    email: "hisgraceschoolagbugburu@gmail.com",
    phones: ["09034014865", "08068045866"],
    defaultRoute: 'home',
    routes: ['home', 'about', 'admission', 'gallery', 'contact']
  };

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

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Set active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      // Filter gallery cards
      galleryCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          // Force reflow and add animation class
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --- LIGHTBOX MODAL SYSTEM ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const zoomButtons = document.querySelectorAll('.gallery-zoom-btn, .gallery-preview-item');

  zoomButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // If it's a gallery preview item, get img inside, else get img relative to button
      let img, title, category;
      
      if (btn.classList.contains('gallery-preview-item')) {
        img = btn.querySelector('.gallery-preview-img');
        title = btn.querySelector('.gallery-preview-text h4').textContent;
        category = btn.querySelector('.gallery-preview-text p').textContent;
      } else {
        const card = btn.closest('.gallery-card');
        img = card.querySelector('.gallery-img');
        title = card.querySelector('.gallery-card-info h3').textContent;
        category = card.querySelector('.gallery-card-info p').textContent;
      }

      if (img && lightbox && lightboxImg && lightboxCaption) {
        e.stopPropagation();
        lightboxImg.src = img.src;
        lightboxCaption.textContent = `${title} — ${category}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scrolling
      }
    });
  });

  if (lightboxClose && lightbox) {
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = ''; // Unlock scrolling
    };

    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close on overlay click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // --- CONTACT FORM SUBMISSION SIMULATOR ---
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve form data
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();

      // Simple validation
      if (!name || !email || !subject || !message) {
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
