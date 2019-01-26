const nconf = module.exports = require('nconf');
const path = require('path');

nconf
// 1. Command-line arguments
  .argv()
  // 2. Environment variables
  .env([
    'GCLOUD_PROJECT',
    'PORT',
    
  ])
  // 3. Config file
  .file({file: path.join(__dirname, 'config.json')})
  // 4. Defaults
  .defaults({
    PORT: 5003
  });

// Check for required settings
checkConfig('PORT');

function checkConfig(setting) {
  if (!nconf.get(setting)) {
    throw "You must set " + setting + " as an environment variable or in config.json!";
  }
}