# Strapi v5 Import/Export CLI Tool

A powerful, standalone CLI utility designed to facilitate the migration of content and media between Strapi v5 installations. This tool handles complex content relationships and media file associations, packaging everything into a portable `.tar.gz` archive.

## Features

-   **Interactive Export:** Select which Content Types (Collection Types & Single Types) to export using an interactive checklist.
-   **Media Awareness:** recursivley scans exported content to find and link associated media files (images, videos, files).
-   **Portable Archives:** Bundles JSON data and physical media files into a compressed `.tar.gz` file.
-   **Smart Import:**
    -   **Media Deduplication:** Checks file hashes to prevent creating duplicate media entries if the file already exists in the target Strapi.
    -   **ID Remapping:** Automatically updates content to point to the correct Media IDs in the new database.
    -   **Single Type & Collection Type Support:** Handles creation and updates appropriate for different Strapi content kinds.

## Prerequisites

-   **Strapi v5:** This tool is designed for Strapi v5 architecture.
-   **Execution Context:** You must run this tool **from the root directory** of your Strapi project. It relies on loading the `@strapi/core` from your project's `node_modules` and reading your project's configuration.

## Installation

You can install this tool globally or run it using `npx`.

```bash
# Run directly without installing (recommended for one-off tasks)
npx /path/to/strapi-import-export-tool <command>

# Or install globally (if published)
npm install -g strapi-import-export-tool
```

## Usage

### Exporting Data

Run the export command from your Strapi project root.

**Interactive Mode:**
If you don't specify any content types, the tool will fetch all `api::` content types and present a selection list.

```bash
npx /path/to/strapi-import-export-tool export
```

**Manual Mode:**
You can specify content types directly as arguments.

```bash
npx /path/to/strapi-import-export-tool export api::article.article api::category.category
```

**Output:**
The tool generates an export archive in the `export-data/` folder at your project root, named `export-YYYY-MM-DD-THH-mm-ss.tar.gz`.

### Importing Data

Run the import command from the target Strapi project root.

```bash
npx /path/to/strapi-import-export-tool import ./path/to/export-2026-01-19.tar.gz
```

**Process:**
1.  Extracts the archive to a temporary directory.
2.  Imports media files into `public/uploads` and creates/links database entries.
3.  Imports content entries, replacing old media IDs with the new ones.
4.  Cleans up temporary files.

## Technical Details

-   **Runtime:** Node.js
-   **Key Libraries:**
    -   `commander`: CLI interface.
    -   `inquirer`: Interactive prompts.
    -   `tar`: Archive creation and extraction.
    -   `@strapi/core`: Used to load the Strapi instance programmatically.
-   **Architecture:**
    -   The tool dynamically resolves `@strapi/core` from `process.cwd()` to ensure it uses the version and database configuration of the project being operated on.
    -   Export logic is in `lib/export.js`.
    -   Import logic is in `lib/import.js`.

## Development

To modify this tool:
1.  Edit files in `lib/`.
2.  Test changes by running `node index.js export` from a valid Strapi project directory.
