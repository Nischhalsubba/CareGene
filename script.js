import { GoogleGenAI } from "@google/genai";

// 1. Initialize Lenis (Smooth Scroll)
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

// 2. Initialize GSAP
gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrollToPlugin);
gsap.ticker.add((time) => lenis.raf(time * 1000));

// --- Global Background Color Manager ---
// This interpolates the body background color based on the section in view
const sections = document.querySelectorAll('[data-color]');
sections.forEach((section, i) => {
    const color = section.getAttribute('data-color');
    ScrollTrigger.create({
        trigger: section,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => gsap.to("body", { backgroundColor: color, duration: 1.0, ease: "power2.inOut" }),
        onEnterBack: () => gsap.to("body", { backgroundColor: color, duration: 1.0, ease: "power2.inOut" })
    });
});

// --- Toggle Switch Logic (Fixed) ---
function initToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const toggleBg = document.querySelector('.toggle-bg');
    const views = document.querySelectorAll('.use-case-view');

    function updateToggle(btn) {
        // Calculate position relative to parent
        const parentRect = btn.parentElement.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        
        const width = btnRect.width;
        const left = btnRect.left - parentRect.left;

        gsap.to(toggleBg, { 
            width: width, 
            x: left, 
            duration: 0.4, 
            ease: "elastic.out(1, 0.6)" 
        });

        // Content Switching
        const targetId = btn.getAttribute('data-target');
        views.forEach(view => {
            if(view.id === targetId) {
                view.classList.add('active');
                gsap.fromTo(view.children, 
                    { y: 15, opacity: 0 }, 
                    { y: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: "power2.out" }
                );
            } else {
                view.classList.remove('active');
            }
        });
        
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => updateToggle(btn));
    });

    // Init state
    const activeBtn = document.querySelector('.toggle-btn.active');
    if(activeBtn) {
        // Small timeout to ensure layout is computed
        setTimeout(() => updateToggle(activeBtn), 100);
    }
    
    // Handle Resize
    window.addEventListener('resize', () => {
        const current = document.querySelector('.toggle-btn.active');
        if(current) updateToggle(current);
    });
}
initToggle();

// --- Scroll Telling (Sticky Logic Fixed) ---
const steps = document.querySelectorAll('.scroll-item');
const panes = document.querySelectorAll('.pane-content');

steps.forEach((step, i) => {
    ScrollTrigger.create({
        trigger: step,
        start: "top center", 
        end: "bottom center",
        onToggle: (self) => {
            if (self.isActive) {
                // Activate Step Text
                step.classList.add('active');
                // Activate Visual Pane
                updatePane(i);
            } else {
                step.classList.remove('active');
            }
        }
    });
});

function updatePane(index) {
    panes.forEach((pane, i) => {
        if (i === index) {
            pane.classList.add('active');
            // Internal animations for specific panes
            if (index === 0) {
                gsap.fromTo(pane.querySelectorAll('.file'), 
                    { scale: 0.8, opacity: 0 },
                    { scale: 1, opacity: 1, stagger: 0.1, duration: 0.5 }
                );
            }
        } else {
            pane.classList.remove('active');
        }
    });
}

// --- Hero & Entrance Animations ---
const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
tl.from(".nav-bar", { y: -20, opacity: 0, duration: 0.8 })
  .from(".badge-pill", { y: 20, opacity: 0, duration: 0.8 }, "-=0.4")
  .from(".hero-title", { y: 40, opacity: 0, duration: 1 }, "-=0.6")
  .from(".hero-desc", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
  .from(".hero-actions", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
  .from(".hero-visual-stage", { y: 60, opacity: 0, rotationX: 10, duration: 1.2 }, "-=0.6");

// --- Parallax Effect ---
document.querySelector('.hero').addEventListener('mousemove', (e) => {
    if(window.innerWidth < 960) return;
    
    const layers = document.querySelectorAll('.parallax-layer');
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    
    layers.forEach(layer => {
        const depth = parseFloat(layer.getAttribute('data-depth'));
        gsap.to(layer, {
            x: x * 40 * depth,
            y: y * 40 * depth,
            rotationY: x * 5 * depth,
            duration: 0.5,
            ease: "power2.out"
        });
    });
});

// --- Gemini AI Demo ---
const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });
const aiBtn = document.getElementById('aiBtn');
const aiInput = document.getElementById('aiInput');
const aiOutput = document.getElementById('aiOutput');

async function runDemo() {
    const q = aiInput.value;
    if(!q) return;
    
    aiOutput.textContent = "Analyzing clinical context...";
    aiBtn.style.opacity = "0.5";
    
    try {
        const context = `
            Patient: Emma (Age 6). 
            MECP2 Variant.
            Recent History: Started Keppra (Nov 1). Seizures reduced from 5/week to 1/week.
            Question: ${q}
            Task: Answer concisely as a medical AI assistant.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: context
        });

        const text = response.text;
        aiOutput.textContent = "";
        
        // Typewriter effect
        gsap.to(aiOutput, {
            text: text,
            duration: 1.5,
            ease: "none"
        });
        
    } catch(e) {
        aiOutput.textContent = "System offline. Please check connection.";
    } finally {
        aiBtn.style.opacity = "1";
    }
}

if(aiBtn) {
    aiBtn.addEventListener('click', runDemo);
    aiInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') runDemo();
    });
}
