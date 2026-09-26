GhostBookingProviders.register("embed", function (config) {
  return {
    async handoff(payload) {
      if (!config.embedUrl) throw new Error("embedUrl is not configured.");
      sessionStorage.setItem("ghost.bookingPayload", JSON.stringify(payload));
      return { type: "embed", url: config.embedUrl };
    }
  };
});
