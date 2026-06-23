/* ============================================
   HOUSE OF VENU KRISHNA - Main JavaScript
   Premium Vegetarian Restaurant Website
   ============================================ */

"use strict";

document.addEventListener("DOMContentLoaded", function () {

  // ============================================
  // PRELOADER
  // ============================================
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(function () {
      preloader.classList.add("hidden");
    }, 1800);
  }

  // ============================================
  // NAVBAR - Sticky on Scroll
  // ============================================
  const navbar = document.getElementById("navbar");
  let lastScroll = 0;

  window.addEventListener("scroll", function () {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    lastScroll = currentScroll;

    // Back to top button
    const backToTop = document.getElementById("backToTop");
    if (backToTop) {
      if (currentScroll > 500) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    }
  });

  // ============================================
  // MOBILE MENU TOGGLE
  // ============================================
  const mobileToggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", function () {
      mobileToggle.classList.toggle("active");
      navLinks.classList.toggle("mobile-open");
      document.body.style.overflow = navLinks.classList.contains("mobile-open") ? "hidden" : "";
    });

    // Close menu on link click
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileToggle.classList.remove("active");
        navLinks.classList.remove("mobile-open");
        document.body.style.overflow = "";
      });
    });
  }

  // ============================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================
  const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");

  function checkReveal() {
    const windowHeight = window.innerHeight;
    revealElements.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowHeight - 100 && rect.bottom > 0) {
        el.classList.add("revealed");
      }
    });
  }

  // Initial check
  setTimeout(checkReveal, 200);

  // Check on scroll with throttling
  let revealTimeout;
  window.addEventListener("scroll", function () {
    if (revealTimeout) {
      cancelAnimationFrame(revealTimeout);
    }
    revealTimeout = requestAnimationFrame(checkReveal);
  });

  // ============================================
  // HERO PARTICLES
  // ============================================
  const particlesContainer = document.getElementById("particles");
  if (particlesContainer) {
    for (var i = 0; i < 20; i++) {
      var particle = document.createElement("div");
      particle.className = "hero-particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 20 + "s";
      particle.style.animationDuration = 15 + Math.random() * 15 + "s";
      particle.style.width = 2 + Math.random() * 4 + "px";
      particle.style.height = particle.style.width;
      particlesContainer.appendChild(particle);
    }
  }

  // ============================================
  // COUNTER ANIMATION
  // ============================================
  function animateCounters() {
    var counters = document.querySelectorAll(".hero-stat-number");
    counters.forEach(function (counter) {
      var text = counter.textContent;
      var num = parseFloat(text);
      if (isNaN(num)) return;

      var suffix = text.replace(/[\d.]/g, "");
      var target = num;
      var duration = 2000;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = eased * target;

        if (text.includes(".")) {
          counter.textContent = current.toFixed(1) + suffix;
        } else {
          counter.textContent = Math.floor(current) + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              requestAnimationFrame(step);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      observer.observe(counter);
    });
  }
  animateCounters();

  // ============================================
  // TESTIMONIALS SWIPER
  // ============================================
  if (typeof Swiper !== "undefined") {
    var testimonialSwiper = new Swiper(".testimonial-swiper", {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });
  }

  // ============================================
  // MENU FILTER
  // ============================================
  var filterBtns = document.querySelectorAll(".menu-filter-btn");
  var menuItems = document.querySelectorAll("#menuGrid .dish-card");

  if (filterBtns.length && menuItems.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");

        var filter = btn.getAttribute("data-filter");

        menuItems.forEach(function (item) {
          if (filter === "all" || item.getAttribute("data-category") === filter) {
            item.style.display = "";
            item.style.animation = "none";
            setTimeout(function () {
              item.style.animation = "fadeInUp 0.5s ease forwards";
            }, 10);
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  }

  // ============================================
  // OFFER TIMER COUNTDOWN
  // ============================================
  function startTimers() {
    var timers = document.querySelectorAll(".offer-timer");
    timers.forEach(function (timer) {
      var hours = timer.querySelector(".offer-timer-item:nth-child(1) .offer-timer-number");
      var mins = timer.querySelector(".offer-timer-item:nth-child(2) .offer-timer-number");
      var secs = timer.querySelector(".offer-timer-item:nth-child(3) .offer-timer-number");

      if (!hours || !mins || !secs) return;

      var h = parseInt(hours.textContent) || 0;
      var m = parseInt(mins.textContent) || 0;
      var s = parseInt(secs.textContent) || 0;

      setInterval(function () {
        s--;
        if (s < 0) {
          s = 59;
          m--;
          if (m < 0) {
            m = 59;
            h--;
            if (h < 0) {
              h = 0;
              m = 0;
              s = 0;
            }
          }
        }
        hours.textContent = String(h).padStart(2, "0");
        mins.textContent = String(m).padStart(2, "0");
        secs.textContent = String(s).padStart(2, "0");
      }, 1000);
    });
  }
  startTimers();

  // ============================================
  // RESERVATION FORM
  // ============================================
  var reservationForm = document.getElementById("reservationForm");
  if (reservationForm) {
    reservationForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var successMsg = document.getElementById("reservationSuccess");
      if (successMsg) {
        successMsg.classList.add("show");
        reservationForm.style.display = "none";
        setTimeout(function () {
          successMsg.classList.remove("show");
          reservationForm.style.display = "";
          reservationForm.reset();
        }, 5000);
      } else {
        alert("Thank you! Your reservation has been submitted. We'll confirm shortly.");
        reservationForm.reset();
      }
    });
  }

  // ============================================
  // NEWSLETTER FORM
  // ============================================
  var newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = this.querySelector('input[type="email"]');
      if (email && email.value) {
        alert("Thank you for subscribing to House of Venu Krishna! Stay tuned for exclusive offers.");
        email.value = "";
      }
    });
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        var offset = 80;
        var targetPos = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: targetPos,
          behavior: "smooth",
        });
      }
    });
  });

  // ============================================
  // BACK TO TOP
  // ============================================
  var backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // ============================================
  // ORDER TRACKING ANIMATION
  // ============================================
  var trackingSteps = document.querySelector(".tracking-steps");
  if (trackingSteps) {
    var progressBar = trackingSteps.querySelector("::after");
    var steps = trackingSteps.querySelectorAll(".tracking-step");
    var activeIndex = 0;

    steps.forEach(function (step, index) {
      if (step.classList.contains("active")) {
        activeIndex = index;
      }
    });

    // Animate progress
    var progress = ((activeIndex) / (steps.length - 1)) * 100;
    var style = document.createElement("style");
    style.textContent =
      ".tracking-steps::after { width: " + progress + "% !important; }";
    document.head.appendChild(style);
  }

  // ============================================
  // GALLERY CLICK TO EXPAND (LIGHTBOX)
  // ============================================
  var galleryItems = document.querySelectorAll(".gallery-item");
  galleryItems.forEach(function (item) {
    item.addEventListener("click", function () {
      var img = this.querySelector("img");
      if (img) {
        var overlay = document.createElement("div");
        overlay.style.cssText =
          "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:1000;display:flex;align-items:center;justify-content:center;cursor:pointer;animation:fadeIn 0.3s ease";
        var clonedImg = document.createElement("img");
        clonedImg.src = img.src;
        clonedImg.style.cssText =
          "max-width:90%;max-height:90%;object-fit:contain;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,0.8)";
        overlay.appendChild(clonedImg);
        overlay.addEventListener("click", function () {
          document.body.removeChild(overlay);
        });
        document.body.appendChild(overlay);
      }
    });
  });

  // ============================================
  // SMOOTH PARALLAX ON HERO
  // ============================================
  var heroSection = document.querySelector(".hero");
  if (heroSection) {
    window.addEventListener("scroll", function () {
      var scrollPos = window.pageYOffset;
      if (scrollPos < window.innerHeight) {
        var video = heroSection.querySelector(".hero-video");
        if (video) {
          video.style.transform = "translateY(" + scrollPos * 0.3 + "px)";
        }
      }
    });
  }

  // ============================================
  // ADD TO CART BUTTON FEEDBACK
  // ============================================
  document.querySelectorAll('.btn-primary .fa-plus, .btn-primary .fa-shopping-bag').forEach(function (icon) {
    var btn = icon.closest(".btn-primary");
    if (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var original = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> Added';
        this.style.background = "linear-gradient(135deg, #2ECC71, #27AE60)";
        var self = this;
        setTimeout(function () {
          self.innerHTML = original;
          self.style.background = "";
        }, 2000);
      });
    }
  });

  console.log("%c HVK 🥘 ", "background:#C9A84C;color:#FAFAF5;font-size:18px;font-weight:bold;padding:10px 20px;border-radius:4px;font-family:Playfair Display,serif");
  console.log("%c House of Venu Krishna | Sowcarpet, Chennai", "color:#5C5C5C;font-size:12px");
});
