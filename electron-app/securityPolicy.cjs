const BASE_DIRECTIVES = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data:",
];

function getContentSecurityPolicy({ isDev = false } = {}) {
  const scriptSources = ["'self'"];
  const connectSources = ["'self'"];

  if (isDev) {
    scriptSources.push("'unsafe-inline'");
    connectSources.push('ws://localhost:5173');
  }

  return [
    ...BASE_DIRECTIVES.slice(0, 4),
    `script-src ${scriptSources.join(' ')}`,
    ...BASE_DIRECTIVES.slice(4),
    `connect-src ${connectSources.join(' ')}`,
  ].join('; ');
}

module.exports = {
  getContentSecurityPolicy,
};
