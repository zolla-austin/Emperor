(function () {
  "use strict";

  const scriptUrl = document.currentScript?.src || document.baseURI;
  const fallbackImageUrl = new URL("../images/fallback.svg", scriptUrl).href;

  function applyImageFallback(image) {
    if (!(image instanceof HTMLImageElement) || image.dataset.fallbackApplied === "true") {
      return;
    }

    image.dataset.fallbackApplied = "true";
    image.src = image.dataset.fallback || fallbackImageUrl;
    image.classList.add("is-fallback");
  }

  window.addEventListener(
    "error",
    (event) => {
      if (event.target instanceof HTMLImageElement) {
        applyImageFallback(event.target);
      }
    },
    true,
  );

  function initializeImages() {
    document.querySelectorAll(".item-card img").forEach((image) => {
      if (!image.hasAttribute("loading")) {
        image.loading = "lazy";
      }
      image.decoding = "async";
    });

    document.querySelectorAll("img").forEach((image) => {
      image.addEventListener("error", () => applyImageFallback(image), { once: true });

      if (image.complete && image.naturalWidth === 0) {
        applyImageFallback(image);
      }
    });
  }

  function initializeMobileMenu() {
    const menuToggle = document.querySelector("[data-menu-toggle]");
    const navigation = document.querySelector("[data-site-nav]");

    if (!menuToggle || !navigation) {
      return;
    }

    const closeMenu = () => {
      menuToggle.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    };

    const openMenu = () => {
      menuToggle.setAttribute("aria-expanded", "true");
      navigation.classList.add("is-open");
      document.body.classList.add("menu-open");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        menuToggle.getAttribute("aria-expanded") === "true" &&
        !navigation.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 56rem)").matches) {
        closeMenu();
      }
    });
  }

  function setCurrentYear() {
    document.querySelectorAll("[data-current-year]").forEach((element) => {
      element.textContent = new Date().getFullYear();
    });
  }

  function initializeSiteConfig() {
    if (typeof EMPEROR_SITE_CONFIG === "undefined") {
      return;
    }

    const whatsappUrl = `https://wa.me/${EMPEROR_SITE_CONFIG.whatsappNumber}`;
    const phoneUrl = `tel:+${EMPEROR_SITE_CONFIG.whatsappNumber}`;

    document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
      link.href = whatsappUrl;
    });

    document.querySelectorAll("[data-phone-link]").forEach((link) => {
      link.href = phoneUrl;
    });

    document.querySelectorAll("[data-instagram-link]").forEach((link) => {
      link.href = EMPEROR_SITE_CONFIG.instagramUrl;
    });

    document.querySelectorAll("[data-whatsapp-label]").forEach((element) => {
      element.textContent = `WhatsApp: ${EMPEROR_SITE_CONFIG.phoneDisplay}`;
    });

    document.querySelectorAll("[data-phone-label]").forEach((element) => {
      element.textContent = `Call: ${EMPEROR_SITE_CONFIG.phoneDisplay}`;
    });
  }

  function initializeFilterTabs() {
    document.querySelectorAll("[data-filter-tabs]").forEach((tabList) => {
      const targetSelector = tabList.dataset.filterTarget;
      const target = targetSelector ? document.querySelector(targetSelector) : null;

      if (!target) {
        return;
      }

      const buttons = tabList.querySelectorAll("[data-filter]");
      const items = target.querySelectorAll("[data-subcategory]");

      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          const selectedFilter = button.dataset.filter;

          buttons.forEach((candidate) => {
            const isSelected = candidate === button;
            candidate.classList.toggle("is-active", isSelected);
            candidate.setAttribute("aria-selected", String(isSelected));
          });

          items.forEach((item) => {
            item.hidden =
              selectedFilter !== "All" && item.dataset.subcategory !== selectedFilter;
          });
        });
      });
    });
  }

  class OrderModal {
    constructor() {
      this.backdrop = document.createElement("div");
      this.previouslyFocused = null;
      this.backdrop.className = "om-backdrop";
      this.backdrop.id = "orderModalBackdrop";
      this.backdrop.setAttribute("aria-hidden", "true");
      this.backdrop.inert = true;
      this.backdrop.innerHTML = `
        <div
          class="om-box"
          role="dialog"
          aria-modal="true"
          aria-labelledby="omTitle"
          aria-describedby="omNote"
        >
          <button class="om-close" type="button" aria-label="Close order dialog">✕</button>
          <div class="om-title" id="omTitle">Place Your Order</div>

          <div class="om-section">
            <div class="om-section-label">📦 Order Summary</div>
            <div class="om-order-summary">
              <p class="om-product-name">Product</p>
              <p class="om-product-price">₦0</p>
            </div>
          </div>

          <div class="om-section">
            <div class="om-section-label">💳 Payment Details</div>
            <div class="om-payment-card">
              <div class="om-payment-row">
                <div class="om-payment-label">Bank</div>
                <div class="om-payment-value" data-payment-bank></div>
              </div>
              <div class="om-payment-row">
                <div class="om-payment-label">Account Name</div>
                <div class="om-payment-value" data-payment-name></div>
              </div>
              <div class="om-payment-row account-row">
                <div class="om-payment-label">Account Number</div>
                <div class="om-payment-value" data-payment-number></div>
                <button class="om-copy-btn" type="button"><span>Copy</span></button>
              </div>
            </div>
          </div>

          <p class="om-note" id="omNote">
            After payment, tap below to confirm your order on WhatsApp.
          </p>

          <div class="om-actions">
            <button class="om-btn primary" type="button" data-modal-whatsapp>
              <span>Confirm on WhatsApp</span>
            </button>
            <button class="om-btn om-cancel-btn" type="button">
              <span>Cancel</span>
            </button>
          </div>

          <div class="om-secondary-actions">
            <a href="#" class="om-call-link" data-modal-call>
              <span class="om-call-icon">☎️</span>
              <span>Call to Order</span>
            </a>
          </div>
        </div>
      `;

      document.body.appendChild(this.backdrop);
      this.modal = this.backdrop.querySelector(".om-box");
      this.closeButton = this.modal.querySelector(".om-close");
      this.whatsappButton = this.modal.querySelector("[data-modal-whatsapp]");

      this.modal.querySelector("[data-payment-bank]").textContent =
        EMPEROR_SITE_CONFIG.payment.bank;
      this.modal.querySelector("[data-payment-name]").textContent =
        EMPEROR_SITE_CONFIG.payment.accountName;
      this.modal.querySelector("[data-payment-number]").textContent =
        EMPEROR_SITE_CONFIG.payment.accountNumber;
      this.modal.querySelector("[data-modal-call]").href =
        `tel:+${EMPEROR_SITE_CONFIG.whatsappNumber}`;

      this.backdrop.addEventListener("click", (event) => {
        if (event.target === this.backdrop) {
          this.close();
        }
      });

      this.closeButton.addEventListener("click", () => this.close());
      this.modal
        .querySelector(".om-cancel-btn")
        .addEventListener("click", () => this.close());
      this.modal
        .querySelector(".om-copy-btn")
        .addEventListener("click", () => this.copyAccountNumber());

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && this.backdrop.classList.contains("show")) {
          this.close();
        }
      });
    }

    open(productName, displayedPrice) {
      this.previouslyFocused = document.activeElement;
      this.modal.querySelector(".om-product-name").textContent = productName;
      this.modal.querySelector(".om-product-price").textContent = displayedPrice;

      const message = EMPEROR_SITE_CONFIG.createOrderMessage(
        productName,
        displayedPrice,
      );
      const whatsappUrl =
        `https://wa.me/${EMPEROR_SITE_CONFIG.whatsappNumber}` +
        `?text=${encodeURIComponent(message)}`;

      this.whatsappButton.onclick = () => {
        window.open(whatsappUrl, "_blank", "noopener");
        this.close();
      };

      this.backdrop.classList.add("show");
      this.backdrop.setAttribute("aria-hidden", "false");
      this.backdrop.inert = false;
      document.body.classList.add("modal-open");
      this.closeButton.focus();
    }

    close() {
      this.backdrop.classList.remove("show");
      this.backdrop.setAttribute("aria-hidden", "true");
      this.backdrop.inert = true;
      document.body.classList.remove("modal-open");

      if (this.previouslyFocused instanceof HTMLElement) {
        this.previouslyFocused.focus();
      }
    }

    async copyAccountNumber() {
      const accountNumber = EMPEROR_SITE_CONFIG.payment.accountNumber;

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(accountNumber);
        } else {
          const temporaryInput = document.createElement("textarea");
          temporaryInput.value = accountNumber;
          temporaryInput.style.position = "fixed";
          temporaryInput.style.opacity = "0";
          document.body.appendChild(temporaryInput);
          temporaryInput.select();
          document.execCommand("copy");
          temporaryInput.remove();
        }
        this.showToast("Copied!");
      } catch {
        this.showToast("Copy failed");
      }
    }

    showToast(message) {
      let toast = document.getElementById("omToast");
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "omToast";
        toast.className = "om-toast";
        toast.setAttribute("role", "status");
        document.body.appendChild(toast);
      }

      toast.textContent = message;
      toast.classList.add("show");
      window.setTimeout(() => toast.classList.remove("show"), 2000);
    }
  }

  function initializeOrderModal() {
    const orderButtons = document.querySelectorAll("[data-order-button]");
    if (
      orderButtons.length === 0 ||
      typeof EMPEROR_SITE_CONFIG === "undefined"
    ) {
      return;
    }

    const orderModal = new OrderModal();
    orderButtons.forEach((button) => {
      button.addEventListener("click", () => {
        orderModal.open(button.dataset.productName, button.dataset.productPrice);
      });
    });
  }

  function initialize() {
    initializeImages();
    initializeMobileMenu();
    initializeSiteConfig();
    initializeFilterTabs();
    initializeOrderModal();
    setCurrentYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
