/**
 * CoPet Landing Page Script
 * Handles Navigation state, interactive transitions, and scroll animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Navigation Active State Handling ---
  const navLinks = document.querySelectorAll('.site-header .nav-link');
  const footerLinks = document.querySelectorAll('.footer-nav-link');

  function setActiveNavLink(targetHref) {
    navLinks.forEach(link => {
      if (link.getAttribute('href') === targetHref) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      // If it's an on-page section link (starts with #)
      if (href && href.startsWith('#')) {
        e.preventDefault();
        setActiveNavLink(href);

        const targetSection = document.querySelector(href);
        if (targetSection) {
          const headerHeight = document.querySelector('.site-header')?.offsetHeight || 70;
          const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      } else {
        // Toggle active state immediately for visual demonstration
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }

      // Close mobile menu if open
      const offcanvasEl = document.getElementById('navbarOffcanvas');
      if (offcanvasEl) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (bsOffcanvas) {
          bsOffcanvas.hide();
        }
      }
      const navbarCollapse = document.getElementById('navbarContent');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });

  footerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        setActiveNavLink(href);
        const targetSection = document.querySelector(href);
        if (targetSection) {
          const headerHeight = document.querySelector('.site-header')?.offsetHeight || 70;
          window.scrollTo({
            top: targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // --- 2. Sticky Header Elevation on Scroll ---
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  });

  // --- 3. Interactive Subtle Tilt / Float Effect on Hero Product Image ---
  const heroContainer = document.querySelector('.hero-image-container');

  if (heroContainer) {
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    let isHovering = false;

    heroContainer.addEventListener('mousemove', (e) => {
      isHovering = true;
      const rect = heroContainer.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      mouseX = (-y / rect.height) * 10;
      mouseY = (x / rect.width) * 10;
    });

    heroContainer.addEventListener('mouseleave', () => {
      isHovering = false;
      mouseX = 0;
      mouseY = 0;
      heroContainer.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      heroContainer.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    heroContainer.addEventListener('mouseenter', () => {
      heroContainer.style.transition = 'transform 0.15s ease-out';
    });

    // Smooth animation frame for fluid 60fps tracking
    function updateTilt() {
      if (isHovering) {
        currentX += (mouseX - currentX) * 0.12;
        currentY += (mouseY - currentY) * 0.12;
        heroContainer.style.transform = `perspective(900px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      }
      requestAnimationFrame(updateTilt);
    }
    requestAnimationFrame(updateTilt);
  }

  // --- 4. Button Magnetic Hover & Ripple Micro-Interactions ---
  const buttons = document.querySelectorAll('.btn-discover-copet, .btn-nav-product, .btn-explore-copet');
  buttons.forEach(btn => {
    // Subtle magnetic attraction on hover
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
      btn.style.transform = `translate(${x.toFixed(1)}px, ${(y - 3).toFixed(1)}px) scale(1.02)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });

    // Elegant click ripple effect & smooth scroll if anchor
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(href);
        if (targetSection) {
          const headerHeight = document.querySelector('.site-header')?.offsetHeight || 70;
          const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.transform = 'scale(0)';
      ripple.style.background = 'rgba(255, 255, 255, 0.35)';
      ripple.style.pointerEvents = 'none';
      
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      ripple.style.animation = 'ripple 0.6s linear';
      
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // --- 5. Innovation Process Timeline Scroll-Triggered Animation ---
  const processSection = document.querySelector('.innovation-process-section');
  const timelineTrack = document.querySelector('.process-timeline-track');

  if (processSection && timelineTrack) {
    const processObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // When scrolled into view, smoothly draw the line and sequence the nodes
          timelineTrack.classList.add('animate-in');
        } else {
          // Reset when scrolled out of view so it runs when scrolled back up or down
          timelineTrack.classList.remove('animate-in');
        }
      });
    }, {
      threshold: 0.2 // Trigger when 20% of the section is visible
    });

    processObserver.observe(processSection);
  }

  // --- 6. Global Scroll-Reveal — Bi-directional fade for all discover.html sections ---
  const srElements = document.querySelectorAll('.scroll-reveal');

  if (srElements.length > 0) {
    // Track the last known scroll position to determine scroll direction
    let lastScrollY = window.scrollY;

    const revealObserver = new IntersectionObserver((entries) => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY >= lastScrollY;
      lastScrollY = currentScrollY;

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Element entering viewport — show it, clear exit classes
          entry.target.classList.remove('sr-exit-up', 'sr-exit-down');
          entry.target.classList.add('sr-visible');
        } else {
          // Element leaving viewport — apply directional exit
          entry.target.classList.remove('sr-visible');
          if (scrollingDown) {
            // Scrolled past — element exits upward
            entry.target.classList.add('sr-exit-up');
            entry.target.classList.remove('sr-exit-down');
          } else {
            // Scrolled back up — element exits downward (back to entry state)
            entry.target.classList.add('sr-exit-down');
            entry.target.classList.remove('sr-exit-up');
          }
        }
      });
    }, {
      threshold: 0.12,          // Fire when at least 12% of element is visible
      rootMargin: '0px 0px -48px 0px' // Small bottom margin for natural feel
    });

    srElements.forEach(el => revealObserver.observe(el));

    // Keep lastScrollY fresh on every scroll event
    window.addEventListener('scroll', () => {
      lastScrollY = window.scrollY;
    }, { passive: true });
  }

  // Log confirmation & instructions for custom assets
  console.log('🐾 CoPet Website Initialized Successfully!');
  console.log('📁 Images directory: /images/');
  console.log('   - To replace the bowls image, place your file into /images/ and update hero-product-img src in index.html.');
  console.log('   - To replace the logo, place your file into /images/ and update brand-logo-img src in index.html.');
});
