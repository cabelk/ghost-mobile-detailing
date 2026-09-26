GhostBookingProviders.register("redirect", function (config) {
  function mapped(value, map) { return (map && map[value]) || value; }
  return {
    async handoff(payload) {
      if (!config.bookingUrl) throw new Error("bookingUrl is not configured.");
      const url = new URL(config.bookingUrl, window.location.href);
      if (config.handoff?.appendQuery !== false) {
        const keys = config.handoff?.queryKeys || {};
        const serviceMap = config.handoff?.serviceMap || {};
        const vehicleMap = config.handoff?.vehicleMap || {};
        const addonMap = config.handoff?.addonMap || {};
        const mappedAddons = payload.addons.map(id => mapped(id, addonMap));
        if (keys.service) url.searchParams.set(keys.service, mapped(payload.service, serviceMap));
        if (keys.vehicleClass) url.searchParams.set(keys.vehicleClass, mapped(payload.vehicleClass, vehicleMap));
        if (keys.addons && mappedAddons.length) url.searchParams.set(keys.addons, mappedAddons.join(","));
        if (keys.postalCode && payload.postalCode) url.searchParams.set(keys.postalCode, payload.postalCode);
        if (keys.estimate) url.searchParams.set(keys.estimate, String(payload.estimate));
      }
      window.location.assign(url.toString());
      return { type: "redirect", url: url.toString() };
    }
  };
});
