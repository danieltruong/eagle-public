(function (window) {
  window.__env = window.__env || {};

  // Log level: 0 = All, 1 = Debug, 2 = Info, 3 = Warn, 4 = Error
  window.__env.logLevel = 0;

  // Get config from remote host? 
  // false = use env.js values only (local dev)
  // true = fetch config from API endpoint (deployed environments)
  window.__env.configEndpoint = false;

  // Environment name
  window.__env.ENVIRONMENT = 'local'; // local | dev | test | prod

  // API configuration
  // For local dev: proxy routes to dev OpenShift API (see proxy.conf.json)
  // For deployed: configEndpoint=true fetches from /api/config
  window.__env.API_LOCATION = '';
  window.__env.API_PATH = '/api/public';

  // Local development paths
  window.__env.ADMIN_PATH = 'http://localhost:4200/admin/';

  // Analytics - for local dev, use localhost penguin-analytics (port 3001)
  window.__env.ANALYTICS_API_URL = 'http://localhost:3001';
  window.__env.ANALYTICS_DEBUG = true;

  // Build hash - replaced during CI build
  window.__env.GH_HASH = 'local-build';
}(this));
