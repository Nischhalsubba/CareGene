import { GoogleGenAI } from "@google/genai";

// 1. Init Lenis (Smooth Scroll)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    direction: 'vertical'
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. Init GSAP
gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrollToPlugin);
// Sync GSAP ticker
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

// --- Magnetic Button Effect ---
const magnets = document.querySelectorAll('.hover-magnet');

magnets.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Move the button slightly towards cursor
        gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    });
});

// --- Hero Parallax (Mouse Move) ---
const heroSection = document.querySelector('.hero');
const parallaxLayers = document.querySelectorAll('.parallax-layer');

if (heroSection && window.innerWidth > 960) {
    heroSection.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        
        parallaxLayers.forEach(layer => {
            const depth = parseFloat(layer.getAttribute('data-depth'));
            gsap.to(layer, {
                x: x * 40 * depth, // Movement factor
                y: y * 40 * depth,
                rotationY: x * 5 * depth,
                rotationX: -y * 5 * depth,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    });
}

// --- Scroll-Telling Logic (Seamless Transitions) ---
const steps = document.querySelectorAll('.scroll-step');
const visuals = document.querySelectorAll('.stage-card');

steps.forEach((step, i) => {
    ScrollTrigger.create({
        trigger: step,
        start: "top center",
        end: "bottom center",
        onEnter: () => activateStep(i),
        onEnterBack: () => activateStep(i),
        toggleClass: { targets: step, className: "active" }
    });
});

function activateStep(index) {
    visuals.forEach((vis, i) => {
        if (i === index) {
            vis.classList.add('active');
            // Add internal animation for the active card
            animateInternalVisuals(vis, index);
        } else {
            vis.classList.remove('active');
        }
    });
}

function animateInternalVisuals(element, index) {
    // Reset any previous animations if needed
    if (index === 0) {
        // Records stack animation
        const cards = element.querySelectorAll('.file-card');
        gsap.fromTo(cards, 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "back.out(1.7)" }
        );
    } else if (index === 1) {
        // Timeline events slide in
        const events = element.querySelectorAll('.tl-event');
        gsap.fromTo(events,
            { x: -30, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.2, duration: 0.5, ease: "power2.out" }
        );
    }
    // Index 2 (Voice) relies on CSS keyframe animations mostly
}

// --- Hero Intro Animation ---
const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
tl.from(".nav-bar", { y: -50, opacity: 0, duration: 1 })
  .from(".hero-headline", { y: 50, opacity: 0, duration: 1.2 }, "-=0.8")
  .from(".hero-sub", { y: 20, opacity: 0, duration: 1 }, "-=0.8")
  .from(".hero-actions", { y: 20, opacity: 0, duration: 1 }, "-=0.8")
  .from(".hero-visual", { scale: 0.9, opacity: 0, duration: 1.5, ease: "power4.out" }, "-=1");

// --- Gemini AI Demo ---
const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });
const aiBtn = document.getElementById('aiBtn');
const aiInput = document.getElementById('aiInput');
const aiOutput = document.getElementById('aiOutput');

async function handleAIDemo() {
    const query = aiInput.value.trim();
    if (!query) return;

    aiOutput.innerHTML = '<span style="color:var(--text-light)">Thinking...</span>';
    aiBtn.disabled = true;

    try {
        // Context mimicking a clinical database query
        const context = `
            Patient: Emma.
            Data: 
            - Nov 10: Keppra started.
            - Nov 12-14: Sleep duration increased by 1.5 hours avg.
            - Nov 15: Parent reported "She slept through the night."
            
            Task: Answer the user's question about sleep improvement based on data. Be concise (max 20 words).
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Context: ${context}. Question: ${query}`,
        });
        
        const text = response.text;
        
        // Typewriter reveal
        aiOutput.textContent = "";
        gsap.to(aiOutput, {
            text: text,
            duration: 1.5,
            ease: "none"
        });

    } catch (error) {
        console.error(error);
        aiOutput.textContent = "Demo unavailable. Please check configuration.";
    } finally {
        aiBtn.disabled = false;
    }
}

if (aiBtn) {
    aiBtn.addEventListener('click', handleAIDemo);
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAIDemo();
    });
}
