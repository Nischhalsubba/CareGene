/**
 * @file script.js
 * Purpose: Preserve the historical root browser entrypoint while the maintained runtime lives under `src/scripts/`.
 * Responsibilities:
 * - Load the organized CareGene browser runtime from its canonical source location.
 * Execution context: Browser ES module referenced by the root `index.html` page.
 * Maintenance: Keep this compatibility entry small; new behavior belongs in `src/scripts/main.js`.
 */
import "./src/scripts/main.js";
