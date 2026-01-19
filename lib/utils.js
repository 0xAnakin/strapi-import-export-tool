const path = require('path');
const fs = require('fs');

async function loadLocalStrapi() {
  const cwd = process.cwd();
  console.log(`Loading Strapi context from ${cwd}...`);
  
  try {
    // Attempt to resolve @strapi/core from the user's project
    const corePath = require.resolve('@strapi/core', { paths: [cwd] });
    const core = require(corePath);
    
    const context = await core.compileStrapi({ appDir: cwd });
    const app = await core.createStrapi(context).load();
    return app;
  } catch (err) {
    console.error('Error loading Strapi core. Ensure you are in the root of a Strapi project.');
    console.error(err);
    process.exit(1);
  }
}

function getUploadsPath() {
    return path.join(process.cwd(), 'public', 'uploads');
}

module.exports = {
  loadLocalStrapi,
  getUploadsPath
};
