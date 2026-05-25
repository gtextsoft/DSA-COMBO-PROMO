/**
 * Dr. Stephen Akintayo Combo Landing Page
 * Update WHATSAPP_NUMBER below with your real WhatsApp number (country code, no + or spaces)
 */
const WHATSAPP_NUMBER = "2340000000000";
const WHATSAPP_MESSAGE =
  "Hello, I want to secure the ₦15 million combo offer for Dr. Stephen Akintayo's weekly events. Please send me the payment details.";

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

// Apply WhatsApp links
document.querySelectorAll(
  '#whatsappHero, #whatsappForm, .floating-cta .btn--whatsapp, .form-success .btn--whatsapp'
).forEach((el) => {
  if (el) el.href = whatsappUrl;
});

// Also update any remaining wa.me links
document.querySelectorAll('a[href*="wa.me"]').forEach((el) => {
  el.href = whatsappUrl;
});

// Year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Top banner dismiss
const topBanner = document.getElementById("topBanner");
const closeBanner = document.getElementById("closeBanner");

closeBanner?.addEventListener("click", () => {
  topBanner?.classList.add("is-hidden");
  document.body.classList.add("banner-dismissed");
  sessionStorage.setItem("bannerDismissed", "1");
});

if (sessionStorage.getItem("bannerDismissed")) {
  topBanner?.classList.add("is-hidden");
  document.body.classList.add("banner-dismissed");
}

// Header scroll state
const siteHeader = document.getElementById("siteHeader");
let lastScroll = 0;

window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    siteHeader?.classList.toggle("is-scrolled", y > 60);

    const floatingCta = document.getElementById("floatingCta");
    floatingCta?.classList.toggle("is-visible", y > 500);

    lastScroll = y;
  },
  { passive: true }
);

// Mobile nav
const navToggle = document.getElementById("navToggle");
const navMobile = document.getElementById("navMobile");

navToggle?.addEventListener("click", () => {
  const open = navToggle.classList.toggle("is-open");
  navMobile.hidden = !open;
});

navMobile?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.classList.remove("is-open");
    navMobile.hidden = true;
  });
});

// Slots meter (visual urgency — update slotsRemaining as slots fill)
const SLOTS_TOTAL = 10;
let slotsRemaining = 7; // Change this when slots are claimed

const slotsFill = document.getElementById("slotsFill");
const slotsRemainingEl = document.getElementById("slotsRemaining");

function updateSlots() {
  const taken = SLOTS_TOTAL - slotsRemaining;
  const pct = (taken / SLOTS_TOTAL) * 100;
  if (slotsFill) slotsFill.style.width = `${Math.max(pct, 10)}%`;
  if (slotsRemainingEl) slotsRemainingEl.textContent = String(slotsRemaining);
}

updateSlots();

// Lead form → Formspree (Vanilla JS AJAX)
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mjgzeqyw";
const leadForm = document.getElementById("leadForm");
const formSuccess = document.getElementById("formSuccess");
const formError = document.getElementById("formError");
const formSubmitBtn = document.getElementById("formSubmitBtn");

function showFormError(message) {
  if (!formError) return;
  formError.textContent = message;
  formError.hidden = false;
}

function hideFormError() {
  if (!formError) return;
  formError.hidden = true;
  formError.textContent = "";
}

function setFormSubmitting(isSubmitting) {
  if (!formSubmitBtn) return;
  formSubmitBtn.disabled = isSubmitting;
  formSubmitBtn.textContent = isSubmitting
    ? "Sending…"
    : "Secure My Combo Offer Now";
}

leadForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideFormError();

  if (!leadForm.checkValidity()) {
    leadForm.reportValidity();
    return;
  }

  setFormSubmitting(true);

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: new FormData(leadForm),
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      leadForm.reset();
      leadForm.hidden = true;
      formSuccess.hidden = false;
      formSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const data = await response.json().catch(() => ({}));
    const fieldErrors = data.errors?.map((err) => err.message).filter(Boolean);
    const message =
      fieldErrors?.length > 0
        ? fieldErrors.join(" ")
        : "Something went wrong. Please try again or contact us on WhatsApp.";

    showFormError(message);
  } catch {
    showFormError(
      "Unable to send right now. Check your connection or use the WhatsApp button below."
    );
  } finally {
    setFormSubmitting(false);
  }
});

// Scroll reveal
const revealTargets = document.querySelectorAll(
  ".section-header, .combo-card, .why-stat, .include-block, .first10-copy, .audience-grid li, .pricing-card, .faq-item, .lead-form, .form-intro"
);

revealTargets.forEach((el) => el.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
);

revealTargets.forEach((el) => revealObserver.observe(el));

// Stagger combo cards
document.querySelectorAll(".combo-card").forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.08}s`;
});
