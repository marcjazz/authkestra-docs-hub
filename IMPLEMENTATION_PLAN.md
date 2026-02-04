# Implementation Plan: Vite to Next.js with Fumadocs Migration

This document outlines the migration plan for `authkestra-docs-hub` from a Vite-based Single Page Application to a Next.js App Router application using Fumadocs.

## Phase 1: Preparation & Cleanup

1.  **Backup Existing Content:** Create a `_backup` directory and move the existing `src/pages/docs/**/*.tsx` files into it. This preserves the original content for later migration.
2.  **Clean Project Directory:** Remove Vite-specific configuration and dependencies. This includes deleting `vite.config.ts`, `index.html` at the root, and uninstalling Vite-related packages from `package.json`.
3.  **Update `.gitignore`:** Add `.next/` and `out/` to the `.gitignore` file to exclude Next.js build artifacts.

## Phase 2: Foundation

1.  **Initialize Next.js:** Set up a new Next.js project within the existing directory structure.
2.  **Install Fumadocs:** Add Fumadocs and its required dependencies (`fumadocs-ui`, `fumadocs-core`).
3.  **Configure Tailwind CSS:** Initialize and configure Tailwind CSS for the Next.js project by creating `tailwind.config.ts` and `postcss.config.js`.

## Phase 3: Architecture

1.  **App Router Setup:** Create the main documentation route at `app/docs/[[...slug]]/page.tsx` to handle all documentation pages.
2.  **Layout and Provider:** Implement the root layout in `app/layout.tsx` and set up the Fumadocs provider to enable features like search and navigation.

## Phase 4: Content Migration

1.  **Convert `.tsx` to `.mdx`:** Systematically convert the backed-up `.tsx` files into `.mdx` format. This involves extracting the JSX content and mapping it to Markdown and MDX components.
2.  **Organize Content:** Place the new `.mdx` files in a `content/docs/` directory, mirroring the original structure.

## Phase 5: SEO & Polish

1.  **Implement Sitemap and `robots.txt`:** Generate a sitemap and a `robots.txt` file to improve search engine discoverability.
2.  **Dynamic Metadata:** Configure dynamic metadata generation in the layout and page files to ensure each page has a unique and relevant title and description.
3.  **JSON-LD Structured Data:** Implement JSON-LD structured data for articles and breadcrumbs to provide rich search results.
