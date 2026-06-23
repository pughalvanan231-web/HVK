/* ============================================
   HOUSE OF VENU KRISHNA - Admin Dashboard JavaScript
   ============================================ */

"use strict";

document.addEventListener("DOMContentLoaded", function () {

  // ============================================
  // MOBILE SIDEBAR TOGGLE
  // ============================================
  var adminToggle = document.querySelector(".admin-mobile-toggle");
  var adminSidebar = document.querySelector(".admin-sidebar");

  if (adminToggle && adminSidebar) {
    adminToggle.addEventListener("click", function () {
      adminSidebar.classList.toggle("open");
    });
  }

  // ============================================
  // SIDEBAR NAV - Active State + Section Switching
  // ============================================
  var sectionTitles = {
    dashboard: ["Good Evening, Abdul", "Here's what's happening at HVK today."],
    orders: ["Order Management", "Track and manage all incoming orders."],
    reservations: ["Reservations", "Manage table bookings and guest schedules."],
    menu: ["Menu Management", "Add, edit, or remove menu items."],
    customers: ["Customer Directory", "View and manage customer information."],
    loyalty: ["Loyalty Rewards", "Manage reward points and membership tiers."],
    marketing: ["Marketing Dashboard", "Create and track marketing campaigns."],
    sales: ["Sales Reports", "Revenue analysis and sales performance."],
    settings: ["Settings", "Configure restaurant and system settings."],
  };

  var navItems = document.querySelectorAll(".admin-nav-item:not(.logout)");
  var contentSections = document.querySelectorAll(".admin-content-section");
  var sectionTitle = document.getElementById("sectionTitle");
  var sectionSubtitle = document.getElementById("sectionSubtitle");

  navItems.forEach(function (item) {
    item.addEventListener("click", function () {
      var section = item.getAttribute("data-section");
      if (!section) return;

      // Update nav active state
      navItems.forEach(function (n) { n.classList.remove("active"); });
      item.classList.add("active");

      // Show corresponding content section
      contentSections.forEach(function (s) {
        s.classList.remove("active");
        if (s.getAttribute("data-section") === section) {
          s.classList.add("active");
        }
      });

      // Update header title
      if (sectionTitles[section] && sectionTitle && sectionSubtitle) {
        sectionTitle.textContent = sectionTitles[section][0];
        sectionSubtitle.textContent = sectionTitles[section][1];
      }

      // Close sidebar on mobile
      if (adminSidebar && window.innerWidth <= 768) {
        adminSidebar.classList.remove("open");
      }
    });
  });

  // ============================================
  // CHART BAR ANIMATION
  // ============================================
  var chartBars = document.querySelectorAll(".chart-bar");
  if (chartBars.length) {
    setTimeout(function () {
      chartBars.forEach(function (bar) {
        var target = bar.getAttribute("data-height") || Math.random() * 80 + 20;
        bar.style.height = target + "%";
      });
    }, 300);
  }

  // ============================================
  // CHART PERIOD BUTTONS
  // ============================================
  var periodBtns = document.querySelectorAll(".chart-period-btn");
  periodBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var parent = this.closest(".chart-period");
      if (parent) {
        parent.querySelectorAll(".chart-period-btn").forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
      }
    });
  });

  // ============================================
  // STAT COUNTER ANIMATION
  // ============================================
  function animateStats() {
    var statNumbers = document.querySelectorAll(".admin-stat-card-number");
    statNumbers.forEach(function (stat) {
      var text = stat.textContent.trim();
      var prefix = text.charAt(0) === "\u20B9" ? "\u20B9" : "";
      var suffix = text.includes("K") ? "K" : text.includes("+") ? "+" : "";
      var cleanNum = parseFloat(text.replace(/[^\d.]/g, ""));
      if (isNaN(cleanNum)) return;

      var duration = 1500;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * cleanNum);

        if (suffix === "K" || suffix === "+") {
          stat.textContent = prefix + current + suffix;
        } else {
          stat.textContent = prefix + current.toLocaleString("en-IN");
        }

        if (progress < 1) requestAnimationFrame(step);
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
        { threshold: 0.3 }
      );
      observer.observe(stat);
    });
  }
  animateStats();

  // ============================================
  // TABLE ACTION BUTTONS - View Order Modal
  // ============================================
  var actionBtns = document.querySelectorAll(".action-btn");
  function showOrderModal(orderRow) {
    var cells = orderRow.querySelectorAll("td");
    var orderId = cells[0] ? cells[0].textContent.trim() : "#HVK-0000";
    var customer = cells[1] ? cells[1].textContent.trim() : "Guest";
    var items = cells[2] ? cells[2].textContent.trim() : "Various items";
    var amount = cells[3] ? cells[3].textContent.trim() : "₹0";
    var statusEl = cells[4] ? cells[4].querySelector(".status") : null;
    var status = statusEl ? statusEl.textContent.trim() : "Pending";

    var overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:1000;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease;padding:20px";

    var modal = document.createElement("div");
    modal.style.cssText =
      "background:#FAFAF5;border:1px solid rgba(200,168,76,0.3);border-radius:16px;padding:32px;max-width:480px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.1);animation:scaleIn 0.3s ease";

    var statusColors = {
      Preparing: "#3498DB",
      Confirmed: "#2ECC71",
      Pending: "#F39C12",
      Delivered: "#2ECC71",
      Cancelled: "#E74C3C",
      "Out for Delivery": "#3498DB",
    };

    modal.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">' +
      '<h3 style="font-family:Playfair Display,serif;font-size:22px;font-weight:700;color:#2C2C2C">Order Details</h3>' +
      '<button class="modal-close" style="width:36px;height:36px;border-radius:50%;border:1px solid rgba(0,0,0,0.1);background:none;color:#5C5C5C;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center">&times;</button>' +
      "</div>" +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">' +
      "<div><span style='color:#5C5C5C;font-size:12px;text-transform:uppercase;letter-spacing:1px'>Order ID</span><p style='color:#C9A84C;font-weight:700;font-size:16px;margin-top:4px'>" +
      orderId +
      "</p></div>" +
      "<div><span style='color:#5C5C5C;font-size:12px;text-transform:uppercase;letter-spacing:1px'>Amount</span><p style='color:#C9A84C;font-weight:700;font-size:16px;margin-top:4px'>" +
      amount +
      "</p></div>" +
      "<div><span style='color:#5C5C5C;font-size:12px;text-transform:uppercase;letter-spacing:1px'>Customer</span><p style='color:#2C2C2C;font-weight:600;font-size:14px;margin-top:4px'>" +
      customer +
      "</p></div>" +
      "<div><span style='color:#5C5C5C;font-size:12px;text-transform:uppercase;letter-spacing:1px'>Status</span><p style='color:" +
      (statusColors[status] || "#5C5C5C") +
      ";font-weight:600;font-size:14px;margin-top:4px'>" +
      status +
      "</p></div>" +
      "</div>" +
      "<div style='margin-bottom:24px'><span style='color:#5C5C5C;font-size:12px;text-transform:uppercase;letter-spacing:1px'>Items Ordered</span><p style='color:#5C5C5C;font-size:14px;margin-top:4px'>" +
      items +
      "</p></div>" +
      '<div style="display:flex;gap:12px">' +
      '<button class="modal-action" data-action="accept" style="flex:1;padding:12px;background:linear-gradient(135deg,#C9A84C,#D4B96A);color:#FAFAF5;border:none;border-radius:6px;font-weight:600;font-size:13px;text-transform:uppercase;letter-spacing:1px;cursor:pointer">Accept Order</button>' +
      '<button class="modal-action" data-action="reject" style="flex:1;padding:12px;background:transparent;color:#E74C3C;border:1px solid #E74C3C;border-radius:6px;font-weight:600;font-size:13px;text-transform:uppercase;letter-spacing:1px;cursor:pointer">Reject</button>' +
      "</div>";

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    overlay.querySelector(".modal-close").addEventListener("click", function () {
      document.body.removeChild(overlay);
    });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) document.body.removeChild(overlay);
    });

    overlay.querySelectorAll(".modal-action").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        var action = this.getAttribute("data-action");
        var actionText = action === "accept" ? "accepted" : "rejected";
        var parent = this.closest("div");
        parent.innerHTML =
          '<div style="text-align:center;padding:12px;color:#2ECC71;font-weight:600">Order ' +
          actionText +
          ' successfully!</div>';
        setTimeout(function () {
          document.body.removeChild(overlay);
        }, 1500);
      });
    });
  }

  actionBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var row = this.closest("tr");
      if (row) showOrderModal(row);
    });
  });

  // ============================================
  // NOTIFICATION BUTTONS
  // ============================================
  var notificationBtns = document.querySelectorAll(".admin-notification");
  notificationBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var isBell = this.querySelector(".fa-bell");
      var isMail = this.querySelector(".fa-envelope");

      var msg = "";
      if (isBell) {
        msg = "No new notifications at this time.";
      } else if (isMail) {
        msg = "No unread messages in your inbox.";
      }

      var toast = document.createElement("div");
      toast.textContent = msg;
      toast.style.cssText =
        "position:fixed;bottom:30px;right:30px;background:#FAFAF5;border:1px solid rgba(200,168,76,0.3);color:#2C2C2C;padding:16px 24px;border-radius:12px;font-size:14px;z-index:2000;box-shadow:0 10px 40px rgba(0,0,0,0.1);animation:fadeInUp 0.3s ease";
      document.body.appendChild(toast);
      setTimeout(function () {
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.3s";
        setTimeout(function () {
          if (toast.parentNode) document.body.removeChild(toast);
        }, 300);
      }, 2500);

      // Remove notification dot if bell
      if (isBell) {
        var dot = this.querySelector(".admin-notification-dot");
        if (dot) dot.style.display = "none";
      }
    });
  });

  // ============================================
  // ORDER STATUS RANDOM UPDATES (SIMULATION)
  // ============================================
  var statuses = ["preparing", "confirmed", "out for delivery", "pending"];
  var statusClasses = {
    preparing: "preparing",
    confirmed: "confirmed",
    "out for delivery": "preparing",
    pending: "pending",
    delivered: "confirmed",
    cancelled: "cancelled",
  };

  var statusCells = document.querySelectorAll(".admin-table .status");
  if (statusCells.length) {
    setInterval(function () {
      var randomIndex = Math.floor(Math.random() * statusCells.length);
      var cell = statusCells[randomIndex];
      var randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      cell.textContent = randomStatus.charAt(0).toUpperCase() + randomStatus.slice(1);
      cell.className = "status " + (statusClasses[randomStatus] || "pending");
    }, 8000);
  }

  // ============================================
  // SALES SUMMARY STYLING
  // ============================================
  var summaryCards = document.querySelectorAll(".sales-summary-card .change");
  summaryCards.forEach(function (card) {
    var value = card.textContent.trim();
    if (value.startsWith("+")) {
      card.classList.add("positive");
    } else if (value.startsWith("-")) {
      card.classList.add("negative");
    }
  });

  // ============================================
  // SALES SUMMARY CARD CLICK
  // ============================================
  var salesCards = document.querySelectorAll(".sales-summary-card");
  salesCards.forEach(function (card) {
    card.addEventListener("click", function () {
      var title = this.querySelector("h4").textContent;
      var amount = this.querySelector(".amount").textContent;

      var toast = document.createElement("div");
      toast.textContent = title + ": " + amount;
      toast.style.cssText =
        "position:fixed;bottom:30px;right:30px;background:linear-gradient(135deg,#C9A84C,#D4B96A);color:#FAFAF5;padding:16px 24px;border-radius:12px;font-size:14px;font-weight:600;z-index:2000;box-shadow:0 10px 40px rgba(0,0,0,0.1);animation:fadeInUp 0.3s ease";
      document.body.appendChild(toast);
      setTimeout(function () {
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.3s";
        setTimeout(function () {
          if (toast.parentNode) document.body.removeChild(toast);
        }, 300);
      }, 2500);
    });
  });

  // ============================================
  // CUSTOMER INSIGHT CLICK
  // ============================================
  var customerItems = document.querySelectorAll(".customer-insight");
  customerItems.forEach(function (item) {
    item.addEventListener("click", function () {
      var name = this.querySelector("h4").textContent;
      var orders = this.querySelector("strong").textContent;

      var toast = document.createElement("div");
      toast.textContent = name + " - " + orders + " total orders";
      toast.style.cssText =
        "position:fixed;bottom:30px;right:30px;background:#FAFAF5;border:1px solid rgba(200,168,76,0.3);color:#2C2C2C;padding:16px 24px;border-radius:12px;font-size:14px;z-index:2000;box-shadow:0 10px 40px rgba(0,0,0,0.1);animation:fadeInUp 0.3s ease";
      document.body.appendChild(toast);
      setTimeout(function () {
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.3s";
        setTimeout(function () {
          if (toast.parentNode) document.body.removeChild(toast);
        }, 300);
      }, 2500);
    });
  });

  // ============================================
  // QUICK NAV LINK (e.g. "View All" on dashboard)
  // ============================================
  document.querySelectorAll(".nav-quick-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var target = this.getAttribute("data-target");
      if (target) {
        // Find and click the matching nav item
        var navItem = document.querySelector('.admin-nav-item[data-section="' + target + '"]');
        if (navItem) navItem.click();
      }
    });
  });

  // ============================================
  // LOGOUT BUTTON
  // ============================================
  var logoutBtn = document.querySelector(".admin-nav-item.logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      if (confirm("Are you sure you want to logout?")) {
        var overlay = document.createElement("div");
        overlay.style.cssText =
          "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:3000;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;animation:fadeIn 0.3s ease";
        overlay.innerHTML =
          '<i class="fas fa-check-circle" style="font-size:48px;color:#2ECC71"></i>' +
          '<p style="color:#F5F0E8;font-size:18px;font-weight:600">Logged out successfully</p>';
        document.body.appendChild(overlay);
        setTimeout(function () {
          window.location.href = "index.html";
        }, 1500);
      }
    });
  }

  // ============================================
  // ADD FADEIN KEYFRAME IF MISSING
  // ============================================
  if (!document.getElementById("admin-dynamic-styles")) {
    var styleSheet = document.createElement("style");
    styleSheet.id = "admin-dynamic-styles";
    styleSheet.textContent =
      "@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }";
    document.head.appendChild(styleSheet);
  }

  console.log(
    "%c HVK ADMIN ",
    "background:#C9A84C;color:#FAFAF5;font-size:16px;font-weight:bold;padding:8px 16px;border-radius:4px"
  );
});
