window.GHOST_CONFIG = {
  business: {
    name: "Ghost Mobile Detailing",
    shortName: "Ghost Detailing",
    phoneDisplay: "(682) 458-9684",
    phoneE164: "+16824589684",
    serviceArea: "Dallas–Fort Worth",
    // Set this only after the production business email is confirmed.
    email: ""
  },
  booking: {
    // Change only this object when switching booking vendors.
    // Modes: "demo", "redirect", "embed".
    mode: "demo",
    providerLabel: "Booking provider",
    bookingUrl: "",
    embedUrl: "",
    handoff: {
      appendQuery: true,
      queryKeys: {
        service: "service",
        vehicleClass: "vehicle",
        addons: "addons",
        postalCode: "zip",
        estimate: "estimate"
      },
      serviceMap: {
        "ghost-premium-detail": "ghost-premium-detail"
      },
      vehicleMap: {
        standard: "standard",
        large: "large"
      },
      addonMap: {}
    }
  },
  analytics: {
    enabled: false,
    // Hook point only. Add a privacy-conscious analytics provider later.
    track: function (eventName, properties) {
      if (window.GHOST_CONFIG.analytics.enabled) {
        console.info("analytics", eventName, properties || {});
      }
    }
  }
};
