/**
 * @file vite.config.ts
 * Purpose: Configure the CareGene concept site's Vite development and production build behavior.
 * Responsibilities:
 * - Produce relative production asset URLs so the built site works from GitHub Pages project paths or other subdirectories.
 * - Run the local development server on the project's established host and port.
 * - Preserve the root alias used by project tooling.
 * - Keep browser bundles free of private environment values and API credentials.
 * Execution context: Vite configuration evaluated by Node.js during development, build, and preview commands.
 * Maintenance: Add environment values only through server-side code or public-safe `VITE_` variables; never inject secrets into client bundles.
 */
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
    base: "./",
    server: {
        port: 3000,
        host: "0.0.0.0",
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "."),
        },
    },
});
