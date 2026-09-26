(function () {
  const navButton = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (navButton && nav) {
    navButton.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navButton.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navButton.setAttribute("aria-expanded", "false");
    }));
  }

  document.querySelectorAll("[data-book-link]").forEach(link => {
    link.href = "/book/";
    link.addEventListener("click", () => window.GHOST_CONFIG?.analytics?.track?.("book_click", { source: link.dataset.bookLink || "unknown" }));
  });

  document.querySelectorAll("[data-phone-display]").forEach(el => el.textContent = GHOST_CONFIG.business.phoneDisplay);
  document.querySelectorAll("[data-phone-link]").forEach(el => el.href = `tel:${GHOST_CONFIG.business.phoneE164}`);
  document.querySelectorAll("[data-sms-link]").forEach(el => el.href = `sms:${GHOST_CONFIG.business.phoneE164}`);
  document.querySelectorAll("[data-service-area]").forEach(el => el.textContent = GHOST_CONFIG.business.serviceArea);

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  const faqButtons = document.querySelectorAll(".faq-question");
  faqButtons.forEach(button => {
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      const answer = document.getElementById(button.getAttribute("aria-controls"));
      if (answer) answer.hidden = expanded;
    });
  });
})();
