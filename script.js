import { GoogleGenAI } from "@google/genai";

// 1. Lenis Smooth Scroll
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

// 2. GSAP Init
gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrollToPlugin);
gsap.ticker.add((time) => lenis.raf(time * 1000));

// --- Hero Animations ---
const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
tl.from(".hero-title", { y: 50, opacity: 0, duration: 1.2 })
  .from(".hero-desc", { y: 20, opacity: 0, duration: 1 }, "-=0.8")
  .from(".hero-actions", { y: 20, opacity: 0, duration: 1 }, "-=0.8")
  .from(".hero-visual-stage", { rotationX: 20, y: 100, opacity: 0, duration: 1.5, ease: "power2.out" }, "-=1");

// --- Parallax (Hero) ---
document.querySelector('.hero').addEventListener('mousemove', (e) => {
    const layers = document.querySelectorAll('.parallax-layer');
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    
    layers.forEach(layer => {
        const depth = parseFloat(layer.getAttribute('data-depth'));
        gsap.to(layer, {
            x: x * 50 * depth,
            y: y * 50 * depth,
            rotationY: x * 10 * depth,
            duration: 0.5
        });
    });
});

// --- Tab System (For Families vs Appointments) ---
const toggleBtns = document.querySelectorAll('.toggle-btn');
const toggleBg = document.querySelector('.toggle-bg');
const views = document.querySelectorAll('.use-case-view');

toggleBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        // Switch Buttons
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Move Background
        const width = btn.offsetWidth;
        const left = btn.offsetLeft;
        gsap.to(toggleBg, { width: width, x: left, duration: 0.3, ease: "power2.out" });

        // Switch Content
        const targetId = btn.getAttribute('data-target');
        views.forEach(view => {
            if(view.id === targetId) {
                view.classList.add('active');
                gsap.fromTo(view.children, 
                    { y: 20, opacity: 0 }, 
                    { y: 0, opacity: 1, stagger: 0.1, duration: 0.4 }
                );
            } else {
                view.classList.remove('active');
            }
        });
    });
});

// Init Toggle BG Position
const activeBtn = document.querySelector('.toggle-btn.active');
if(activeBtn) {
    gsap.set(toggleBg, { width: activeBtn.offsetWidth, x: activeBtn.offsetLeft });
}

// --- Scroll Telling ---
const steps = document.querySelectorAll('.scroll-item');
const panes = document.querySelectorAll('.pane-content');

steps.forEach((step, i) => {
    ScrollTrigger.create({
        trigger: step,
        start: "top center",
        end: "bottom center",
        onEnter: () => updatePane(i),
        onEnterBack: () => updatePane(i),
        toggleClass: { targets: step, className: "active" }
    });
});

function updatePane(index) {
    panes.forEach((pane, i) => {
        if (i === index) {
            pane.classList.add('active');
            // Trigger internal animations
            if (index === 0) {
                gsap.to('.progress', { strokeDashoffset: 0, duration: 1.5 });
            }
        } else {
            pane.classList.remove('active');
            if (index === 0) {
                gsap.set('.progress', { strokeDashoffset: 100 });
            }
        }
    });
}

// --- Gemini AI Demo ---
const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });
const aiBtn = document.getElementById('aiBtn');
const aiInput = document.getElementById('aiInput');
const aiOutput = document.getElementById('aiOutput');

async function runDemo() {
    const q = aiInput.value;
    if(!q) return;
    
    aiOutput.textContent = "Thinking...";
    
    try {
        // Simulated context
        const context = `
            Patient History: 
            - Started Keppra (Nov 1).
            - Seizures reduced from 5/week to 1/week.
            - Sleep logs: "Slept 8 hours" (Nov 3), "Woke up once" (Nov 5).
            Question: ${q}
            Task: Answer in 1 short sentence based on data.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: context
        });

        const text = response.text;
        aiOutput.textContent = "";
        gsap.to(aiOutput, { text: text, duration: 2, ease: "none" });
        
    } catch(e) {
        aiOutput.textContent = "Demo Limit Reached.";
    }
}

if(aiBtn) aiBtn.addEventListener('click', runDemo);

// --- Magnetic Buttons ---
document.querySelectorAll('.hover-magnet').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3 });
    });
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    });
});
