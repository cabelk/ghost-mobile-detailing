(function () {
  const providers = {};

  window.GhostBookingProviders = {
    register(name, factory) {
      providers[name] = factory;
    },
    create(config) {
      const factory = providers[config.mode];
      if (!factory) throw new Error(`Unknown booking provider mode: ${config.mode}`);
      return factory(config);
    }
  };
})();
