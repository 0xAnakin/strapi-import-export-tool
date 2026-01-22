/**
 * @fileoverview Utility functions for strapi-migrate
 * @description Shared helper functions for Strapi instance loading, file downloads,
 * and path resolution used across export and import operations.
 * @module strapi-migrate/utils
 */

const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');
const { finished } = require('stream/promises');

/**
 * Downloads a file from a URL to a local destination path.
 * @async
 * @param {string} url - The URL to download from
 * @param {string} destPath - The absolute path where the file should be saved
 * @returns {Promise<string>} The destination path of the downloaded file
 * @throws {Error} If the download fails or no response body is received
 * @example
 * await downloadFile('https://example.com/export.tar.gz', '/tmp/export.tar.gz');
 */
async function downloadFile(url, destPath) {
    console.log(`  • Downloading ${url}...`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to download file: ${res.statusText}`);
    
    // Ensure directory exists
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const fileStream = fs.createWriteStream(destPath);
    
    // Node.js 18+ fetch returns a web stream, which needs conversion for pipe
    if (res.body) {
        await finished(Readable.fromWeb(res.body).pipe(fileStream));
    } else {
        throw new Error("No response body received");
    }
    
    console.log(`  ✓ Downloaded to ${destPath}`);
    return destPath;
}

/**
 * Loads and initializes a local Strapi instance from the current working directory.
 * Supports both Strapi v4 and v5 initialization patterns.
 * @async
 * @returns {Promise<Object>} The loaded Strapi application instance
 * @throws {Error} If Strapi cannot be loaded (not in a Strapi project directory)
 * @example
 * const strapi = await loadLocalStrapi();
 * console.log(strapi.contentTypes); // Access content types
 */
async function loadLocalStrapi() {
  const cwd = process.cwd();
  // console.log(`  • Loading Strapi context...`); 
  
  try {
    // Attempt to resolve @strapi/strapi from the user's project
    // This is the main entry point for both v4 and v5
    const strapiPkgPath = require.resolve('@strapi/strapi', { paths: [cwd] });
    const strapiPkg = require(strapiPkgPath);
    
    // Check for v5 compileStrapi API
    if (strapiPkg.compileStrapi) {
        const context = await strapiPkg.compileStrapi({ appDir: cwd });
        const app = await strapiPkg.createStrapi(context).load();
        return app;
    } 
    // Fallback for v4 or older v5
    else {
        const app = await strapiPkg({ appDir: cwd, distDir: cwd }).load();
        return app;
    }
  } catch (err) {
    console.error('Error loading Strapi core. Ensure you are in the root of a Strapi project.');
    console.error(err);
    process.exit(1);
  }
}

/**
 * Gets the absolute path to the Strapi uploads directory.
 * @returns {string} The absolute path to public/uploads in the current working directory
 * @example
 * const uploadsPath = getUploadsPath();
 * // Returns: '/path/to/project/public/uploads'
 */
function getUploadsPath() {
    return path.join(process.cwd(), 'public', 'uploads');
}

module.exports = {
  loadLocalStrapi,
  getUploadsPath,
  downloadFile
};
