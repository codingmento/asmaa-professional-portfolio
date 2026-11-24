/* =========================================
   SHARED HELPERS
========================================= */

const qs = (selector, scope = document) => scope.querySelector(selector);

const qsa = (selector, scope = document) => [
  ...scope.querySelectorAll(selector),
];

/* =========================================
   PROFESSIONAL RECOMMENDATIONS
========================================= */

const recommendationModal = qs("[data-recommendation-modal]");
const recommendationName = qs("[data-recommendation-name]");
const recommendationRole = qs("[data-recommendation-role]");
const recommendationCompany = qs("[data-recommendation-company]");
const recommendationText = qs("[data-recommendation-text]");

let lastFocusedElement = null;

function openRecommendation(trigger) {
  if (!recommendationModal) return;

  const quote = qs(".recommendation-quote", trigger);

  lastFocusedElement = trigger;

  recommendationName.textContent = trigger.dataset.name || "";
  recommendationRole.textContent = trigger.dataset.role || "";
  recommendationCompany.textContent = trigger.dataset.company || "";
  recommendationText.textContent = quote?.textContent.trim() || "";

  recommendationModal.classList.add("is-open");
  recommendationModal.setAttribute("aria-hidden", "false");

  document.body.classList.add("modal-open");

  qs(".recommendation-modal-close", recommendationModal)?.focus();
}

function closeRecommendation() {
  if (!recommendationModal) return;

  recommendationModal.classList.remove("is-open");
  recommendationModal.setAttribute("aria-hidden", "true");

  document.body.classList.remove("modal-open");

  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

/* =========================================
   RECOMMENDATION EVENT HANDLERS
========================================= */

document.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;

  if (!target) return;

  const recommendationTrigger = target.closest("[data-recommendation-trigger]");

  if (recommendationTrigger) {
    openRecommendation(recommendationTrigger);
    return;
  }

  if (target.closest("[data-recommendation-close]")) {
    closeRecommendation();
  }
});

/* =========================================
   KEYBOARD ACCESSIBILITY
========================================= */

document.addEventListener("keydown", (event) => {
  if (!recommendationModal?.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") {
    closeRecommendation();
    return;
  }

  if (event.key !== "Tab") return;

  const focusable = qsa(
    'button, a[href], [tabindex]:not([tabindex="-1"])',
    recommendationModal,
  ).filter((element) => !element.disabled && !element.hidden);

  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuToggle = qs("[data-menu-toggle]");
const nav = qs("[data-nav]");

function closeMenu() {
  nav?.classList.remove("is-open");

  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Open navigation menu");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));

  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu",
  );
});

qsa("[data-nav-link], .nav-resume").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

/* =========================================
   HEADER SCROLL & BACK TO TOP
========================================= */

const header = qs("[data-header]");
const backToTop = qs("[data-back-to-top]");

function handleScroll() {
  header?.classList.toggle("scrolled", window.scrollY > 24);

  backToTop?.classList.toggle("visible", window.scrollY > 600);
}

window.addEventListener("scroll", handleScroll, {
  passive: true,
});

handleScroll();

backToTop?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

/* =========================================
   ACTIVE NAVIGATION SECTION
========================================= */

const sections = qsa("[data-section]");
const navLinks = qsa("[data-nav-link]");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`,
        );
      });
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0,
  },
);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

/* =========================================
   REVEAL ANIMATIONS
========================================= */

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.08,
  },
);

qsa(".reveal").forEach((element) => {
  revealObserver.observe(element);
});
