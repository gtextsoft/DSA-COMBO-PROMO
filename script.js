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

function syncBannerState() {
  const bannerVisible = topBanner && !topBanner.classList.contains("is-hidden");
  document.body.classList.toggle("has-top-banner", Boolean(bannerVisible));
  setMobileNavTop();
}

closeBanner?.addEventListener("click", () => {
  topBanner?.classList.add("is-hidden");
  document.body.classList.add("banner-dismissed");
  sessionStorage.setItem("bannerDismissed", "1");
  syncBannerState();
});

if (sessionStorage.getItem("bannerDismissed")) {
  topBanner?.classList.add("is-hidden");
  document.body.classList.add("banner-dismissed");
} else {
  document.body.classList.add("has-top-banner");
}

syncBannerState();

// Header scroll state
const siteHeader = document.getElementById("siteHeader");
let lastScroll = 0;

// Mobile nav
const navToggle = document.getElementById("navToggle");
const navMobile = document.getElementById("navMobile");
const navBackdrop = document.getElementById("navBackdrop");

function setMobileNavTop() {
  if (!navMobile || !siteHeader || window.innerWidth >= 900) return;
  const headerBottom = siteHeader.getBoundingClientRect().bottom;
  navMobile.style.top = `${headerBottom}px`;
}

function setMobileNavOpen(open) {
  navToggle?.classList.toggle("is-open", open);
  navToggle?.setAttribute("aria-expanded", String(open));
  navToggle?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  navMobile?.classList.toggle("is-open", open);
  navMobile?.setAttribute("aria-hidden", String(!open));
  navBackdrop?.classList.toggle("is-visible", open);
  navBackdrop?.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("nav-open", open);
  if (open) setMobileNavTop();
}

function closeMobileNav() {
  setMobileNavOpen(false);
}

navToggle?.addEventListener("click", () => {
  setMobileNavOpen(!navToggle.classList.contains("is-open"));
});

navBackdrop?.addEventListener("click", closeMobileNav);

navMobile?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});

window.addEventListener("resize", () => {
  setMobileNavTop();
  if (window.innerWidth >= 900) closeMobileNav();
});

window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    siteHeader?.classList.toggle("is-scrolled", y > 60);

    const floatingCta = document.getElementById("floatingCta");
    floatingCta?.classList.toggle("is-visible", y > 500);

    if (navMobile?.classList.contains("is-open")) setMobileNavTop();

    lastScroll = y;
  },
  { passive: true }
);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navMobile?.classList.contains("is-open")) {
    closeMobileNav();
  }
});

setMobileNavTop();

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

// Social proof — rotating “recent purchase” activity
const SOCIAL_PROOF_KEY = "comboSocialProofOff";

const socialProofNames = [
  { first: "Chidi", last: "O" },
  { first: "Amaka", last: "N" },
  { first: "Tunde", last: "B" },
  { first: "Ngozi", last: "E" },
  { first: "Emeka", last: "A" },
  { first: "Fatima", last: "Y" },
  { first: "Ibrahim", last: "M" },
  { first: "Blessing", last: "K" },
  { first: "Olumide", last: "S" },
  { first: "Adaeze", last: "C" },
  { first: "Yusuf", last: "H" },
  { first: "Kemi", last: "A" },
  { first: "Segun", last: "O" },
  { first: "Zainab", last: "L" },
  { first: "Ifeanyi", last: "U" },
  { first: "Halima", last: "B" },
  { first: "Rotimi", last: "D" },
  { first: "Chiamaka", last: "I" },
];

const socialProofCities = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Ibadan",
  "Kano",
  "Enugu",
  "Benin City",
  "Accra",
  "London",
  "Dubai",
];

const socialProofActions = [
  "just secured the combo offer",
  "completed payment for the ₦15M combo",
  "reserved the premium combo package",
  "joined the combo offer",
];

const socialProofTimes = [
  "Just now",
  "2 minutes ago",
  "4 minutes ago",
  "6 minutes ago",
  "8 minutes ago",
  "12 minutes ago",
];

const socialProofEl = document.getElementById("socialProof");
const socialProofText = document.getElementById("socialProofText");
const socialProofTime = document.getElementById("socialProofTime");
const socialProofAvatar = document.getElementById("socialProofAvatar");
const socialProofClose = document.getElementById("socialProofClose");

let socialProofTimer = null;
let socialProofHideTimer = null;
let lastSocialProofIndex = -1;

function pickSocialProofEntry() {
  let index;
  do {
    index = Math.floor(Math.random() * socialProofNames.length);
  } while (index === lastSocialProofIndex && socialProofNames.length > 1);
  lastSocialProofIndex = index;

  const person = socialProofNames[index];
  const city = socialProofCities[Math.floor(Math.random() * socialProofCities.length)];
  const action = socialProofActions[Math.floor(Math.random() * socialProofActions.length)];
  const time = socialProofTimes[Math.floor(Math.random() * socialProofTimes.length)];

  return { person, city, action, time };
}

function hideSocialProofToast() {
  if (!socialProofEl) return;
  socialProofEl.classList.remove("is-visible");
}

function showSocialProof() {
  if (!socialProofEl || sessionStorage.getItem(SOCIAL_PROOF_KEY)) return;
  if (document.body.classList.contains("nav-open")) return;

  const { person, city, action, time } = pickSocialProofEntry();
  const displayName = `${person.first} ${person.last}.`;

  if (socialProofAvatar) {
    socialProofAvatar.textContent = `${person.first[0]}${person.last[0]}`;
  }
  if (socialProofText) {
    socialProofText.innerHTML = `<strong>${displayName}</strong> from ${city} ${action}`;
  }
  if (socialProofTime) {
    socialProofTime.textContent = time;
  }

  socialProofEl.classList.remove("is-off");
  hideSocialProofToast();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      socialProofEl.classList.add("is-visible");
    });
  });

  clearTimeout(socialProofHideTimer);
  socialProofHideTimer = setTimeout(hideSocialProofToast, 9000);
}

function scheduleSocialProof() {
  clearTimeout(socialProofTimer);
  if (sessionStorage.getItem(SOCIAL_PROOF_KEY)) return;

  const delay = 6000 + Math.random() * 8000;
  socialProofTimer = setTimeout(() => {
    showSocialProof();
    scheduleSocialProof();
  }, delay);
}

function initSocialProof() {
  if (!socialProofEl) return;

  if (sessionStorage.getItem(SOCIAL_PROOF_KEY)) {
    socialProofEl.classList.add("is-off");
    return;
  }

  socialProofEl.classList.remove("is-off");

  // First popup quickly so visitors see it
  setTimeout(showSocialProof, 2000);
  scheduleSocialProof();
}

socialProofClose?.addEventListener("click", () => {
  sessionStorage.setItem(SOCIAL_PROOF_KEY, "1");
  clearTimeout(socialProofTimer);
  clearTimeout(socialProofHideTimer);
  hideSocialProofToast();
  socialProofEl?.classList.add("is-off");
});

initSocialProof();
