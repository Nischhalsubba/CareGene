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
const sections = document.querySelectorAll('[data-color]');
sections.forEach((section, i) => {
    const color = section.getAttribute('data-color');
    ScrollTrigger.create({
        trigger: section,
        start: "top 60%",
        end: "bottom 60%",
        onEnter: () => gsap.to("body", { backgroundColor: color, duration: 1.0, ease: "power2.inOut" }),
        onEnterBack: () => gsap.to("body", { backgroundColor: color, duration: 1.0, ease: "power2.inOut" })
    });
});

// --- Toggle Switch Logic ---
function initToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const toggleBg = document.querySelector('.toggle-bg');
    const views = document.querySelectorAll('.use-case-view');

    function updateToggle(btn) {
        // Calculate position
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
        
        // Button Styles
        toggleBtns.forEach(b => {
             b.classList.remove('active');
             b.style.color = 'var(--text-muted)';
        });
        btn.classList.add('active');
        btn.style.color = '#fff';
    }

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => updateToggle(btn));
    });

    // Init state
    const activeBtn = document.querySelector('.toggle-btn.active');
    if(activeBtn) {
        setTimeout(() => updateToggle(activeBtn), 100);
    }
}
initToggle();

// --- Scroll Telling (Sticky Logic) ---
const steps = document.querySelectorAll('.scroll-item');
const panes = document.querySelectorAll('.visual-card-frame');

steps.forEach((step, i) => {
    ScrollTrigger.create({
        trigger: step,
        start: "top center", 
        end: "bottom center",
        onToggle: (self) => {
            if (self.isActive) {
                step.classList.add('active');
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
        } else {
            pane.classList.remove('active');
        }
    });
}

// --- Reveal Animations for New Sections ---
// Hero
gsap.from(".hero-content > *", { y: 30, opacity: 0, duration: 1, stagger: 0.2, ease: "power2.out", delay: 0.5 });
// Cards
gsap.utils.toArray('.journey-card, .eth-card').forEach(card => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });
});

// Banner Reveal
gsap.from('.banner-teal', {
    scrollTrigger: { trigger: '.banner-teal', start: "top 80%" },
    scale: 0.95, opacity: 0, duration: 0.8, ease: "back.out(1.5)"
});


// --- Gemini AI Demo (Sentinel Refusal Logic) ---
const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });
const aiBtn = document.getElementById('aiBtn');
const aiInput = document.getElementById('aiInput');
const aiOutput = document.getElementById('aiOutput');

async function runDemo() {
    const q = aiInput.value;
    if(!q) return;
    
    aiOutput.innerHTML = "<em>Accessing medical literature...</em>";
    aiBtn.style.opacity = "0.5";
    
    try {
        const context = `
            Context: The user is a parent of a child with KCNQ2-related epilepsy.
            The user asks about long-term prognosis.
            Medical literature is currently limited for specific variants.
            Task: Provide a "Sentinel Refusal" response. State that you cannot predict the clinical trajectory with certainty due to data gaps. Be honest. Do not hallucinate.
            Question: ${q}
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: context
        });

        const text = response.text;
        aiOutput.innerHTML = "";
        
        gsap.to(aiOutput, {
            text: text,
            duration: 2,
            ease: "none"
        });
        
    } catch(e) {
        aiOutput.textContent = "Demo unavailable. Check configuration.";
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

// Parallax for Hero
document.querySelector('.hero').addEventListener('mousemove', (e) => {
    if(window.innerWidth < 960) return;
    const layer = document.querySelector('.app-mockup');
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    
    gsap.to(layer, {
        x: x * 15,
        y: y * 15,
        rotationY: x * 5,
        duration: 0.5,
        ease: "power2.out"
    });
});
