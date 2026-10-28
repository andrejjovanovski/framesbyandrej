const {PHASE_DEVELOPMENT_SERVER} = require('next/constants');

module.exports = (phase) => ({
  // Keep development output separate from production builds.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
});
