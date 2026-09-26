(function () {
  const catalog = window.GHOST_CATALOG;
  const config = window.GHOST_CONFIG;
  const form = document.getElementById("booking-form");
  const addonContainer = document.getElementById("addon-options");
  const totalEl = document.getElementById("estimate-total");
  const summaryEl = document.getElementById("estimate-summary");
  const statusEl = document.getElementById("booking-status");
  const demoPanel = document.getElementById("demo-panel");
  const embedPanel = document.getElementById("embed-panel");
  const embedFrame = document.getElementById("booking-frame");

  function money(value) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: catalog.currency, maximumFractionDigits: 0 }).format(value);
  }

  function renderAddons() {
    addonContainer.innerHTML = catalog.addons.map(addon => `
      <label class="addon-option">
        <input type="checkbox" name="addons" value="${addon.id}">
        <span class="addon-copy"><strong>${addon.name}</strong><small>+${money(addon.price)}</small></span>
      </label>`).join("");
  }

  function getSelection() {
    const fd = new FormData(form);
    const vehicleClass = fd.get("vehicleClass") || "standard";
    const addons = fd.getAll("addons");
    const base = catalog.baseService.vehiclePricing[vehicleClass]?.price || 0;
    const addonTotal = addons.reduce((sum, id) => sum + (catalog.addons.find(a => a.id === id)?.price || 0), 0);
    return {
      service: catalog.baseService.id,
      vehicleClass,
      addons,
      postalCode: String(fd.get("postalCode") || "").trim(),
      estimate: base + addonTotal
    };
  }

  function updateEstimate() {
    const selection = getSelection();
    totalEl.textContent = money(selection.estimate);
    const vehicle = catalog.baseService.vehiclePricing[selection.vehicleClass]?.label || "Vehicle";
    const addonNames = selection.addons.map(id => catalog.addons.find(a => a.id === id)?.name).filter(Boolean);
    summaryEl.textContent = `${vehicle}${addonNames.length ? " + " + addonNames.join(", ") : ""}`;
  }

  renderAddons();
  form.addEventListener("change", updateEstimate);
  form.addEventListener("input", updateEstimate);
  updateEstimate();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    demoPanel.hidden = true;
    embedPanel.hidden = true;
    statusEl.textContent = "";

    const selection = getSelection();
    if (!/^\d{5}(-\d{4})?$/.test(selection.postalCode)) {
      statusEl.textContent = "Enter a valid 5-digit ZIP code before continuing.";
      document.getElementById("postalCode").focus();
      return;
    }

    try {
      config.analytics.track("booking_handoff", selection);
      const provider = GhostBookingProviders.create(config.booking);
      const result = await provider.handoff(selection);

      if (result.type === "demo") {
        const vehicle = catalog.baseService.vehiclePricing[selection.vehicleClass].label;
        const addons = selection.addons.map(id => catalog.addons.find(a => a.id === id)?.name).filter(Boolean);
        document.getElementById("demo-summary").textContent = `${catalog.baseService.name} — ${vehicle} — ${money(selection.estimate)}${addons.length ? " — " + addons.join(", ") : ""} — ZIP ${selection.postalCode}`;
        demoPanel.hidden = false;
        demoPanel.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (result.type === "embed") {
        embedFrame.src = result.url;
        embedPanel.hidden = false;
        embedPanel.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (error) {
      console.error(error);
      statusEl.textContent = "Online booking is temporarily unavailable. Please call or text us instead.";
    }
  });

  document.getElementById("copy-summary")?.addEventListener("click", async () => {
    const text = document.getElementById("demo-summary").textContent;
    try {
      await navigator.clipboard.writeText(text);
      document.getElementById("copy-summary").textContent = "Copied";
      setTimeout(() => document.getElementById("copy-summary").textContent = "Copy estimate", 1600);
    } catch (_) {}
  });
})();
