import { GoogleGenAI } from "@google/genai";

// 1. Initialize Lenis (Smooth Scrolling)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. Initialize GSAP & Register Plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrollToPlugin);

// Sync GSAP with Lenis
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

// --- Animations ---

// Hero Intro Timeline
const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

tl.to('body', { className: "-=is-loading", duration: 0 })
  .from(".nav-bar", { y: -20, opacity: 0, duration: 1 })
  .from(".tag-pill", { scale: 0.8, opacity: 0, duration: 0.8 }, "-=0.5")
  .from(".hero-title", { y: 40, opacity: 0, duration: 1.2 }, "-=0.6")
  .from(".hero-desc", { y: 20, opacity: 0, duration: 1 }, "-=0.8")
  .from(".hero-btns", { y: 20, opacity: 0, duration: 1 }, "-=0.8")
  .from(".hero-visual", { y: 80, opacity: 0, duration: 1.5, ease: "power4.out" }, "-=1")
  .from(".trust-badges", { opacity: 0, duration: 1 }, "-=1");

// Navbar Scroll Frosted Effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav-bar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// General Fade Up Elements
gsap.utils.toArray('.feature-card, .trust-box').forEach(element => {
    gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: "top 90%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// Scroll Telling Logic (Sticky Section)
const steps = document.querySelectorAll('.scroll-step');
const visuals = document.querySelectorAll('.stage-item');

steps.forEach((step, i) => {
    ScrollTrigger.create({
        trigger: step,
        start: "top center",
        end: "bottom center",
        onEnter: () => updateStage(i),
        onEnterBack: () => updateStage(i),
        toggleClass: { targets: step, className: "active" }
    });
});

function updateStage(index) {
    visuals.forEach((vis, i) => {
        if (i === index) {
            vis.classList.add('active');
        } else {
            vis.classList.remove('active');
        }
    });
}

// --- Gemini AI Demo Logic ---
const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });
const aiBtn = document.getElementById('aiBtn');
const aiInput = document.getElementById('aiInput');
const aiOutput = document.getElementById('aiOutput');

async function runHealthDemo() {
    const query = aiInput.value.trim();
    if (!query) return;

    aiOutput.innerHTML = '<span style="color:var(--coral)">Consulting CareGene memory...</span>';
    aiBtn.disabled = true;

    try {
        const context = `
            Patient: Emma (Age 6). 
            Diagnosed: KCNQ2-related epilepsy (Variant c.637C>T).
            Medication History: Started Keppra 500mg (Oct), increased to 750mg (Nov 12).
            Recent Observations: 
            - "Seizures reduced significantly after dosage increase."
            - "Sleep improved."
            
            Task: Answer the parent's question based on this data. Be empathetic but factual. Max 2 sentences.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Context: ${context}. Question: ${query}`,
        });

        const text = response.text;
        
        // Typewriter Effect
        aiOutput.textContent = "";
        gsap.to(aiOutput, {
            text: text,
            duration: 2.5,
            ease: "none"
        });

    } catch (e) {
        console.error(e);
        aiOutput.textContent = "Demo unavailable. Please check API key.";
    } finally {
        aiBtn.disabled = false;
    }
}

aiBtn.addEventListener('click', runHealthDemo);
aiInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') runHealthDemo();
});

// Custom Cursor (Subtle Glow Follow)
const cursorGlow = document.querySelector('.cursor-glow');
window.addEventListener('mousemove', (e) => {
    gsap.to(cursorGlow, {
        x: e.clientX,
        y: e.clientY,
        duration: 1.5,
        ease: "power2.out"
    });
});
