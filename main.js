/**
 * ENVIROTECH SERVICES, LLC - OFFICIAL CLIENT-SIDE SCRIPT
 * Fast, lightweight, accessible interactive enhancements
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initStickyHeader();
  initSectionSpy();
  initTestimonialCarousel();
  initServiceSelectLinks();
  initCitySearchFilter();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  if (!menuBtn || !drawer) return;

  function toggleMenu(open) {
    const shouldOpen = typeof open === 'boolean' ? open : !drawer.classList.contains('show');
    menuBtn.classList.toggle('open', shouldOpen);
    drawer.classList.toggle('show', shouldOpen);
    menuBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    drawer.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
  }

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close drawer on link click
  const mobileLinks = drawer.querySelectorAll('.mobile-nav-link, .mobile-drawer-btn');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Close drawer on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('show')) {
      toggleMenu(false);
    }
  });

  // Close when clicking outside drawer
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('show') && !drawer.contains(e.target) && !menuBtn.contains(e.target)) {
      toggleMenu(false);
    }
  });
}

/* --------------------------------------------------------------------------
   2. STICKY HEADER SHADOW ON SCROLL
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
      header.style.boxShadow = '0 4px 16px rgba(10, 41, 77, 0.08)';
    } else {
      header.classList.remove('scrolled');
      header.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.04)';
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   3. ACTIVE NAV LINK TRACKING (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initSectionSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -70% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

/* --------------------------------------------------------------------------
   4. CLIENT TESTIMONIALS CAROUSEL
   -------------------------------------------------------------------------- */
function initTestimonialCarousel() {
  const slider = document.getElementById('testimonialSlider');
  const items = document.querySelectorAll('.testimonial-item');
  const dots = document.querySelectorAll('.indicator-dot');
  const prevBtn = document.getElementById('prevReviewBtn');
  const nextBtn = document.getElementById('nextReviewBtn');

  if (!slider || !items.length) return;

  let currentIndex = 0;
  const totalSlides = items.length;
  let autoplayTimer = null;

  function showSlide(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    // Move slider track
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Toggle active state
    items.forEach((item, i) => {
      item.classList.toggle('active', i === currentIndex);
    });

    // Toggle indicator dots
    dots.forEach((dot, i) => {
      const isActive = i === currentIndex;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  // Next & Prev button listeners
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      restartAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      restartAutoplay();
    });
  }

  // Dot indicators click
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      if (!isNaN(idx)) {
        showSlide(idx);
        restartAutoplay();
      }
    });
  });

  // Autoplay function
  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 6500);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Pause autoplay on mouse hover or focus
  slider.parentElement.addEventListener('mouseenter', stopAutoplay);
  slider.parentElement.addEventListener('mouseleave', startAutoplay);
  slider.parentElement.addEventListener('focusin', stopAutoplay);
  slider.parentElement.addEventListener('focusout', startAutoplay);

  // Keyboard navigation
  slider.parentElement.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
      restartAutoplay();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
      restartAutoplay();
    }
  });

  // Start initial autoplay
  startAutoplay();
}

/* --------------------------------------------------------------------------
   5. AUTO-SELECT SERVICE IN CONTACT FORM FROM SERVICE CTA LINKS
   -------------------------------------------------------------------------- */
function initServiceSelectLinks() {
  const serviceLinks = document.querySelectorAll('[data-service-select]');
  const serviceSelect = document.getElementById('serviceSelect');
  if (!serviceLinks.length || !serviceSelect) return;

  serviceLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetService = link.getAttribute('data-service-select');
      if (targetService) {
        // Find matching option in select
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value.toLowerCase().includes(targetService.toLowerCase())) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. INSTANT CITY / TOWN SEARCH FILTER
   -------------------------------------------------------------------------- */
function initCitySearchFilter() {
  const searchInput = document.getElementById('citySearch');
  const clearBtn = document.getElementById('clearCityBtn');
  const cityTags = document.querySelectorAll('.city-tag');
  const stateCards = document.querySelectorAll('[data-state-card]');
  const noMatchMsg = document.getElementById('noMatchCity');

  if (!searchInput || !cityTags.length) return;

  function filterCities() {
    const query = searchInput.value.trim().toLowerCase();
    
    if (clearBtn) {
      clearBtn.style.display = query.length > 0 ? 'block' : 'none';
    }

    let totalVisible = 0;

    stateCards.forEach(stateCard => {
      const stateCities = stateCard.querySelectorAll('.city-tag');
      let visibleInState = 0;

      stateCities.forEach(tag => {
        const townData = (tag.getAttribute('data-town') || tag.textContent).toLowerCase();
        if (!query || townData.includes(query)) {
          tag.classList.remove('hidden');
          visibleInState++;
          totalVisible++;
        } else {
          tag.classList.add('hidden');
        }
      });

      // If no cities visible in this state, hide state container
      if (visibleInState === 0) {
        stateCard.classList.add('hidden-state');
      } else {
        stateCard.classList.remove('hidden-state');
      }
    });

    if (noMatchMsg) {
      noMatchMsg.style.display = totalVisible === 0 ? 'block' : 'none';
    }
  }

  searchInput.addEventListener('input', filterCities);

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      filterCities();
      searchInput.focus();
    });
  }
}

/* --------------------------------------------------------------------------
   7. CONTACT FORM VALIDATION & INTERACTIVE SUBMISSION
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successBox = document.getElementById('formSuccessBox');
  const submitBtn = document.getElementById('submitBtn');
  const fileInput = document.getElementById('fileUpload');
  const fileLabel = document.getElementById('fileChosenLabel');

  if (!form) return;

  // File input preview
  if (fileInput && fileLabel) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        fileLabel.textContent = `Selected: ${fileName}`;
        fileLabel.style.fontWeight = '700';
        fileLabel.style.color = '#0284c7';
      } else {
        fileLabel.textContent = 'Attach photos of area to clean (optional)';
        fileLabel.style.fontWeight = 'normal';
        fileLabel.style.color = '';
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Required fields validation
    const fields = [
      { input: document.getElementById('clientName'), wrapper: document.getElementById('clientName')?.parentElement },
      { input: document.getElementById('clientAddress'), wrapper: document.getElementById('clientAddress')?.parentElement },
      { input: document.getElementById('clientCity'), wrapper: document.getElementById('clientCity')?.parentElement },
      { input: document.getElementById('clientZip'), wrapper: document.getElementById('clientZip')?.parentElement },
      { input: document.getElementById('clientPhone'), wrapper: document.getElementById('clientPhone')?.parentElement },
      { input: document.getElementById('clientEmail'), wrapper: document.getElementById('clientEmail')?.parentElement }
    ];

    let isValid = true;
    let firstErrorField = null;

    fields.forEach(({ input, wrapper }) => {
      if (!input || !wrapper) return;
      
      const val = input.value.trim();
      let fieldValid = val.length > 0;

      // Simple email check
      if (input.type === 'email' && fieldValid) {
        fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      }

      if (!fieldValid) {
        wrapper.classList.add('has-error');
        isValid = false;
        if (!firstErrorField) firstErrorField = input;
      } else {
        wrapper.classList.remove('has-error');
      }

      // Realtime clear on typing
      input.addEventListener('input', () => {
        wrapper.classList.remove('has-error');
      }, { once: true });
    });

    if (!isValid) {
      if (firstErrorField) firstErrorField.focus();
      return;
    }

    // Submit Simulation
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting Request...';
    }

    setTimeout(() => {
      if (successBox) {
        successBox.style.display = 'flex';
        successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      form.reset();
      if (fileLabel) {
        fileLabel.textContent = 'Attach photos of area to clean (optional)';
        fileLabel.style.fontWeight = 'normal';
        fileLabel.style.color = '';
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message or Request Services';
      }
    }, 600);
  });
}
