GhostBookingProviders.register("demo", function (config) {
  return {
    async handoff(payload) {
      return { type: "demo", payload, providerLabel: config.providerLabel || "Booking provider" };
    }
  };
});
