/**
 * ============================================================================
 * SAMIA ABDULLAH — GRAPHIC DESIGNER PORTFOLIO
 * Vanilla JavaScript (No Frameworks, No Libraries)
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. STICKY HEADER & SCROLL STATE
     -------------------------------------------------------------------------- */
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('back-to-top');

  const handleScrollState = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    // Header styling on scroll
    if (scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to Top button visibility
    if (backToTopBtn) {
      if (scrollY > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScrollState, { passive: true });
  handleScrollState(); // Initialize on load

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* --------------------------------------------------------------------------
     2. MOBILE NAVIGATION DRAWER & ACCESSIBILITY
     -------------------------------------------------------------------------- */
  const navToggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileNav = (forceState) => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    const newState = typeof forceState === 'boolean' ? forceState : !isExpanded;

    navToggle.setAttribute('aria-expanded', newState);
    if (mobileNav) {
      mobileNav.classList.toggle('open', newState);
      mobileNav.setAttribute('aria-hidden', !newState);
    }
  };

  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileNav();
    });
  }

  // Close mobile nav when clicking any link inside it
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggleMobileNav(false);
    });
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileNav && mobileNav.classList.contains('open')) {
      if (!mobileNav.contains(e.target) && !navToggle.contains(e.target)) {
        toggleMobileNav(false);
      }
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      toggleMobileNav(false);
    }
  });

  /* --------------------------------------------------------------------------
     3. SMOOTH SCROLLING WITH FIXED HEADER OFFSET
     -------------------------------------------------------------------------- */
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* --------------------------------------------------------------------------
     4. ACTIVE NAVIGATION LINK ON SCROLL (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-link');

  const updateActiveNavLink = () => {
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        desktopNavLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });

        mobileNavLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  /* --------------------------------------------------------------------------
     5. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if (prefersReducedMotion) {
    revealElements.forEach((el) => el.classList.add('revealed'));
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el, index) => {
      // Optional slight staggered delay for grid items
      if (el.classList.contains('skill-card') || el.classList.contains('service-card')) {
        el.style.transitionDelay = `${(index % 3) * 0.12}s`;
      }
      revealObserver.observe(el);
    });
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  /* --------------------------------------------------------------------------
     6. TESTIMONIALS SLIDER (Vanilla JavaScript)
     -------------------------------------------------------------------------- */
  const sliderTrack = document.getElementById('testimonial-track');
  const sliderViewport = document.getElementById('testimonial-viewport');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const dotsContainer = document.getElementById('slider-dots');

  if (sliderTrack && slides.length > 0) {
    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoPlayTimer = null;
    const autoPlayInterval = 5000; // 5 seconds per slide

    // Generate pagination dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
        dot.addEventListener('click', () => {
          goToSlide(idx);
          resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
      });
    }

    const updateSliderUI = () => {
      sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

      const dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];
      dots.forEach((dot, idx) => {
        const isActive = idx === currentIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    };

    const goToSlide = (index) => {
      if (index < 0) {
        currentIndex = totalSlides - 1;
      } else if (index >= totalSlides) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }
      updateSliderUI();
    };

    const nextSlide = () => {
      goToSlide(currentIndex + 1);
    };

    const prevSlide = () => {
      goToSlide(currentIndex - 1);
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
      });
    }

    // Auto Play functionality
    const startAutoPlay = () => {
      if (!prefersReducedMotion) {
        autoPlayTimer = setInterval(nextSlide, autoPlayInterval);
      }
    };

    const stopAutoPlay = () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    };

    const resetAutoPlay = () => {
      stopAutoPlay();
      startAutoPlay();
    };

    // Pause on hover
    if (sliderViewport) {
      sliderViewport.addEventListener('mouseenter', stopAutoPlay);
      sliderViewport.addEventListener('mouseleave', startAutoPlay);
    }

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    sliderTrack.addEventListener('touchstart', (e) => {
      stopAutoPlay();
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoPlay();
    }, { passive: true });

    const handleSwipe = () => {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 40) {
        if (swipeDistance < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    };

    // Keyboard navigation
    sliderViewport.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoPlay();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoPlay();
      }
    });

    // Initialize auto play
    startAutoPlay();
  }

  /* --------------------------------------------------------------------------
     7. SUBTLE MOUSE PARALLAX EFFECT (Desktop Only)
     -------------------------------------------------------------------------- */
  const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (supportsFinePointer && !prefersReducedMotion) {
    const ambientBlobs = [
      { el: document.getElementById('blob-1'), factorX: 25, factorY: -20 },
      { el: document.getElementById('blob-2'), factorX: -20, factorY: 25 },
      { el: document.getElementById('blob-3'), factorX: 18, factorY: 15 },
      { el: document.getElementById('blob-4'), factorX: -15, factorY: -18 }
    ];

    const interactiveStage = document.getElementById('hero-interactive-stage');
    const floatingTags = document.querySelectorAll('.floating-tag');

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let animationFrameId = null;

    const onMouseMove = (e) => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Normalized coordinates (-1 to 1)
      targetX = (e.clientX / windowWidth - 0.5) * 2;
      targetY = (e.clientY / windowHeight - 0.5) * 2;

      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(renderParallax);
      }
    };

    const renderParallax = () => {
      // Ease towards target
      mouseX += (targetX - mouseX) * 0.08;
      mouseY += (targetY - mouseY) * 0.08;

      // Move background blobs
      ambientBlobs.forEach(({ el, factorX, factorY }) => {
        if (el) {
          const moveX = mouseX * factorX;
          const moveY = mouseY * factorY;
          el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        }
      });

      // Move hero floating tags
      if (interactiveStage) {
        floatingTags.forEach((tag, idx) => {
          const depth = idx === 0 ? 12 : -10;
          tag.style.transform = `translate3d(${mouseX * depth}px, ${mouseY * depth}px, 0)`;
        });
      }

      // Continue animation until settled
      if (Math.abs(targetX - mouseX) > 0.001 || Math.abs(targetY - mouseY) > 0.001) {
        animationFrameId = requestAnimationFrame(renderParallax);
      } else {
        animationFrameId = null;
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
  }

});
