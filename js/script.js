/* =============================================
   HELP CLEANERS — Professional Cleaning Services
   JavaScript
   ============================================= */

'use strict';

// =============================================
// DOM Content Loaded
// =============================================
document.addEventListener('DOMContentLoaded', function() {

  initHeaderScroll();
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initBeforeAfterSlider();
  initFaqAccordion();
  initTestimonialDots();
  initCounterAnimation();
  initContactForm();

});

// =============================================
// HEADER: Scroll effect
// =============================================
function initHeaderScroll() {
  var header = document.querySelector('.header');
  if (!header) return;

  function checkScroll() {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }
  checkScroll();
  window.addEventListener('scroll', checkScroll, { passive: true });
}

// =============================================
// MOBILE MENU
// =============================================
function initMobileMenu() {
  var toggle = document.querySelector('.menu-toggle');
  var drawer = document.querySelector('.mobile-drawer');
  if (!toggle || !drawer) return;

  toggle.addEventListener('click', function() {
    toggle.classList.toggle('active');
    drawer.classList.toggle('open');
    document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  drawer.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      toggle.classList.remove('active');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// =============================================
// SMOOTH SCROLL for anchor links
// =============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var headerH = 60;
      var top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
}

// =============================================
// SCROLL ANIMATIONS (IntersectionObserver)
// =============================================
function initScrollAnimations() {
  var els = document.querySelectorAll('.fade-up, .fade-in, .scale-in');
  if (!els.length) return;

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function(el) { observer.observe(el); });
  } else {
    // Fallback
    els.forEach(function(el) { el.classList.add('visible'); });
  }
}

// =============================================
// BEFORE / AFTER IMAGE SLIDER
// =============================================
function initBeforeAfterSlider() {
  var slider = document.getElementById('baSlider');
  if (!slider) return;

  var before = slider.querySelector('.before');
  var handle = slider.querySelector('.slider-handle');
  var isDragging = false;

  function setPosition(x) {
    var rect = slider.getBoundingClientRect();
    var pct = Math.max(0, Math.min(1, (x - rect.left) / rect.width)) * 100;
    if (before) before.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    if (handle) handle.style.left = pct + '%';
  }

  function onStart(e) {
    isDragging = true;
    slider.style.cursor = 'grabbing';
    setPosition(e.type === 'touchstart' ? e.touches[0].clientX : e.clientX);
    e.preventDefault();
  }

  function onMove(e) {
    if (!isDragging) return;
    setPosition(e.type === 'touchmove' ? e.touches[0].clientX : e.clientX);
    e.preventDefault();
  }

  function onEnd() {
    isDragging = false;
    slider.style.cursor = 'ew-resize';
  }

  // Mouse events
  slider.addEventListener('mousedown', onStart);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);

  // Touch events
  slider.addEventListener('touchstart', onStart, { passive: false });
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onEnd);

  // Click to move
  slider.addEventListener('click', function(e) {
    if (!isDragging) setPosition(e.clientX);
  });
}

// =============================================
// FAQ ACCORDION
// =============================================
function initFaqAccordion() {
  document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = this.closest('.faq-item');
      if (!item) return;

      var isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(function(other) {
        other.classList.remove('open');
      });

      // Toggle current
      if (!isOpen) item.classList.add('open');
    });
  });
}

// =============================================
// TESTIMONIAL DOTS
// =============================================
function initTestimonialDots() {
  var container = document.querySelector('.testimonials-scroll');
  var dots = document.querySelectorAll('.testimonial-dots button');
  if (!container || !dots.length) return;

  function updateDots() {
    var scrollLeft = container.scrollLeft;
    var cardWidth = container.querySelector('.testimonial-card')?.offsetWidth || 340;
    var gap = 20;
    var adjustedWidth = cardWidth + gap;
    var activeIndex = Math.round(scrollLeft / adjustedWidth);

    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === activeIndex);
    });
  }

  container.addEventListener('scroll', updateDots, { passive: true });
  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      var cardWidth = container.querySelector('.testimonial-card')?.offsetWidth || 340;
      var gap = 20;
      container.scrollTo({
        left: parseInt(this.dataset.index) * (cardWidth + gap),
        behavior: 'smooth'
      });
    });
  });

  // Initial update
  updateDots();
}

// =============================================
// COUNTER ANIMATION (Trust Bar)
// =============================================
function initCounterAnimation() {
  var counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function(c) { observer.observe(c); });
  } else {
    counters.forEach(function(c) { animateCounter(c); });
  }
}

function animateCounter(el) {
  var target = parseInt(el.getAttribute('data-target'));
  if (isNaN(target)) return;
  var duration = 2000;
  var start = performance.now();

  function update(now) {
    var elapsed = now - start;
    var progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    var eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// =============================================
// CONTACT FORM
// =============================================
function initContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var btn = form.querySelector('button[type="submit"]');
    var originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    // Simulate send — replace with actual form action
    setTimeout(function() {
      var inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(function(el) { el.value = ''; });

      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#2E7D32';

      setTimeout(function() {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1200);
  });
}

// =============================================
// LAZY LOADING for images (native + fallback)
// =============================================
document.addEventListener('DOMContentLoaded', function() {
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(function(img) {
      img.src = img.dataset.src || img.src;
    });
  }
});
