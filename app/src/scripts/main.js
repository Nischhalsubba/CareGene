/**
 * @file src/scripts/main.js
 * Purpose: Coordinate CareGene's scrolling, motion, staged product-story visuals, and self-contained concept-demo interactions.
 * Responsibilities:
 * - Drive smooth scrolling and synchronize Lenis with GSAP.
 * - Apply page-load, scroll-triggered, navigation, and pointer-following motion.
 * - Keep the sticky product-story stage synchronized with the active narrative step.
 * - Provide a deterministic demonstration of the concept without exposing private API credentials in browser code.
 * Execution context: Browser module loaded by the root page through `script.js`.
 * Maintenance: Keep DOM selectors aligned with `index.html`; preserve reduced-motion behavior and do not place private API keys in client-side bundles.
 */
"use strict";

const lenis = new Lenis({
    duration: 1.2,
    easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
    smooth: true,
});

/**
 * Advances Lenis on each animation frame.
 *
 * @param {number} time - Browser animation-frame timestamp in milliseconds.
 * @returns {void} Updates smooth-scroll state and schedules the next frame.
 */
function runAnimationFrame(time) {
    lenis.raf(time);
    requestAnimationFrame(runAnimationFrame);
}

requestAnimationFrame(runAnimationFrame);

gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrollToPlugin);

/**
 * Synchronizes Lenis with GSAP's ticker so scroll-linked animation uses the same timing source.
 *
 * @param {number} time - GSAP ticker time in seconds.
 * @returns {void} Advances Lenis using the equivalent millisecond timestamp.
 */
function synchronizeScrollTicker(time) {
    lenis.raf(time * 1000);
}

gsap.ticker.add(synchronizeScrollTicker);

const introTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

introTimeline
    .to("body", { className: "-=is-loading", duration: 0 })
    .from(".nav-bar", { y: -20, opacity: 0, duration: 1 })
    .from(".tag-pill", { scale: 0.8, opacity: 0, duration: 0.8 }, "-=0.5")
    .from(".hero-title", { y: 40, opacity: 0, duration: 1.2 }, "-=0.6")
    .from(".hero-desc", { y: 20, opacity: 0, duration: 1 }, "-=0.8")
    .from(".hero-btns", { y: 20, opacity: 0, duration: 1 }, "-=0.8")
    .from(".hero-visual", { y: 80, opacity: 0, duration: 1.5, ease: "power4.out" }, "-=1")
    .from(".trust-badges", { opacity: 0, duration: 1 }, "-=1");

/**
 * Applies or removes the compact navigation state based on the current scroll position.
 *
 * @returns {void} Updates the navigation element's `scrolled` class.
 */
function updateNavigationState() {
    const navigation = document.querySelector(".nav-bar");
    if (!navigation) return;
    navigation.classList.toggle("scrolled", window.scrollY > 50);
}

window.addEventListener("scroll", updateNavigationState, { passive: true });

/**
 * Registers a scroll-triggered entrance animation for one content card.
 *
 * @param {Element} element - Feature or trust card to animate into view.
 * @returns {void} Creates the GSAP animation and its ScrollTrigger configuration.
 */
function animateContentCard(element) {
    gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: "top 90%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
    });
}

gsap.utils.toArray(".feature-card, .trust-box").forEach(animateContentCard);

const steps = document.querySelectorAll(".scroll-step");
const visuals = document.querySelectorAll(".stage-item");

/**
 * Makes the requested product-story visual active and hides the other staged visuals.
 *
 * @param {number} activeIndex - Zero-based index of the narrative step currently centered in the viewport.
 * @returns {void} Updates the `active` class on staged visual elements.
 */
function updateStage(activeIndex) {
    visuals.forEach((visual, index) => {
        visual.classList.toggle("active", index === activeIndex);
    });
}

/**
 * Connects one narrative step to the staged visual shown while the step crosses the viewport center.
 *
 * @param {Element} step - Narrative step used as the ScrollTrigger target.
 * @param {number} index - Matching visual-stage index.
 * @returns {void} Creates the ScrollTrigger for the step.
 */
function bindStoryStep(step, index) {
    ScrollTrigger.create({
        trigger: step,
        start: "top center",
        end: "bottom center",
        onEnter: () => updateStage(index),
        onEnterBack: () => updateStage(index),
        toggleClass: { targets: step, className: "active" },
    });
}

steps.forEach(bindStoryStep);

const demoButton = document.getElementById("aiBtn");
const demoInput = document.getElementById("aiInput");
const demoOutput = document.getElementById("aiOutput");

const conceptMemory = {
    medication: "The example timeline records a Keppra increase from 500 mg to 750 mg on Nov 12, followed by a caregiver note reporting fewer seizures and improved sleep.",
    seizure: "In this concept record, the caregiver notes say seizure frequency decreased after the Nov 12 dose change. This is a product demonstration, not medical advice or a clinical interpretation.",
    sleep: "The example caregiver observations record improved sleep after the Nov 12 medication change. A real product would need verified records and clinician review before drawing conclusions.",
    default: "This concept demo can summarize the example timeline, but it does not diagnose, recommend treatment, or replace review by a qualified clinician.",
};

/**
 * Selects a safe, deterministic summary from the local demonstration record.
 *
 * @param {string} query - User-entered question about the example record.
 * @returns {string} Local demonstration summary without making a network request or clinical recommendation.
 */
function summarizeConceptMemory(query) {
    const normalizedQuery = query.toLowerCase();
    if (normalizedQuery.includes("seizure")) return conceptMemory.seizure;
    if (normalizedQuery.includes("sleep")) return conceptMemory.sleep;
    if (normalizedQuery.includes("med") || normalizedQuery.includes("dose") || normalizedQuery.includes("keppra")) {
        return conceptMemory.medication;
    }
    return conceptMemory.default;
}

/**
 * Runs the concept-memory demonstration using only the repository's local example data.
 *
 * @returns {void} Updates the demo output and never sends health information or credentials to an external service.
 */
function runHealthDemo() {
    if (!demoInput || !demoOutput || !demoButton) return;

    const query = demoInput.value.trim();
    if (!query) return;

    const summary = summarizeConceptMemory(query);
    demoButton.disabled = true;
    demoOutput.textContent = "";

    gsap.to(demoOutput, {
        text: summary,
        duration: 1.2,
        ease: "none",
        onComplete: () => {
            demoButton.disabled = false;
        },
    });
}

/**
 * Allows Enter to run the concept demo from the text input.
 *
 * @param {KeyboardEvent} event - Keyboard event emitted by the demo input.
 * @returns {void} Runs the demo only when the Enter key is pressed.
 */
function handleDemoKeydown(event) {
    if (event.key === "Enter") runHealthDemo();
}

if (demoButton) demoButton.addEventListener("click", runHealthDemo);
if (demoInput) demoInput.addEventListener("keydown", handleDemoKeydown);

const cursorGlow = document.querySelector(".cursor-glow");

/**
 * Moves the decorative cursor glow toward the current pointer position.
 *
 * @param {MouseEvent} event - Pointer movement event containing viewport coordinates.
 * @returns {void} Updates the glow position through GSAP when the decorative element exists.
 */
function moveCursorGlow(event) {
    if (!cursorGlow) return;
    gsap.to(cursorGlow, {
        x: event.clientX,
        y: event.clientY,
        duration: 1.5,
        ease: "power2.out",
    });
}

window.addEventListener("mousemove", moveCursorGlow, { passive: true });
