// 🌘 Enhanced View Transition Auto-Generator
window.vtTransitionCount ??= 1; // Global counter for unique IDs
window.vtRegistry ??= new Map(); // Track elements and their transition names

// Animation configuration mapping vt-* attributes to CSS animation properties
const ANIMATION_CONFIG = {
  // Fade animations
  "fade-in": {
    old: "fadeOut 0.5s var(--ease-3) forwards",
    new: "fadeIn 0.5s var(--ease-3) forwards",
  },
  "fade-out": {
    old: "fadeIn 0.5s var(--ease-3) forwards",
    new: "fadeOut 0.5s var(--ease-3) forwards",
  },
  "fade-in-bloom": {
    old: "fadeOutBloom 2s var(--ease-3) forwards",
    new: "fadeInBloom 2s var(--ease-3) forwards",
  },
  "fade-out-bloom": {
    old: "fadeInBloom 2s var(--ease-3) forwards",
    new: "fadeOutBloom 2s var(--ease-3) forwards",
  },

  // Scale animations
  "scale-up": {
    old: "scaleDown 0.5s var(--ease-3) forwards",
    new: "scaleUp 0.5s var(--ease-3) forwards",
  },
  "scale-down": {
    old: "scaleUp 0.5s var(--ease-3) forwards",
    new: "scaleDown 0.5s var(--ease-3) forwards",
  },

  // Slide animations
  "slide-in-up": {
    old: "slideOutDown 0.5s var(--ease-3) forwards",
    new: "slideInUp 0.5s var(--ease-3) forwards",
  },
  "slide-in-down": {
    old: "slideOutUp 0.5s var(--ease-3) forwards",
    new: "slideInDown 0.5s var(--ease-3) forwards",
  },
  "slide-in-left": {
    old: "slideOutRight 0.5s var(--ease-3) forwards",
    new: "slideInLeft 0.5s var(--ease-3) forwards",
  },
  "slide-in-right": {
    old: "slideOutLeft 0.5s var(--ease-3) forwards",
    new: "slideInRight 0.5s var(--ease-3) forwards",
  },
  "slide-out-up": {
    old: "slideInDown 0.5s var(--ease-3) forwards",
    new: "slideOutUp 0.5s var(--ease-3) forwards",
  },
  "slide-out-down": {
    old: "slideInUp 0.5s var(--ease-3) forwards",
    new: "slideOutDown 0.5s var(--ease-3) forwards",
  },
  "slide-out-left": {
    old: "slideInRight 0.5s var(--ease-3) forwards",
    new: "slideOutLeft 0.5s var(--ease-3) forwards",
  },
  "slide-out-right": {
    old: "slideInLeft 0.5s var(--ease-3) forwards",
    new: "slideOutRight 0.5s var(--ease-3) forwards",
  },

  // Shake animations
  "shake-x": {
    old: "",
    new: "shakeX 0.75s var(--ease-out-5) forwards",
  },
  "shake-y": {
    old: "",
    new: "shakeY 0.75s var(--ease-out-5) forwards",
  },
  "shake-z": {
    old: "",
    new: "shakeZ 1s var(--ease-in-out-3) forwards",
  },

  // Continuous animations (infinite)
  spin: {
    old: "",
    new: "spin 2s linear infinite",
  },
  ping: {
    old: "",
    new: "ping 5s var(--ease-out-3) infinite",
  },
  blink: {
    old: "",
    new: "blink 1s var(--ease-out-3) infinite",
  },
  float: {
    old: "",
    new: "float 3s var(--ease-in-out-3) infinite",
  },
  bounce: {
    old: "",
    new: "bounce 2s var(--ease-squish-2) infinite",
  },
  pulse: {
    old: "",
    new: "pulse 2s var(--ease-out-3) infinite",
  },
};

// Keyframes that need to be included (matches your CSS)
const KEYFRAMES = `
@keyframes fadeIn { to { opacity: 1; } }
@keyframes fadeOut { to { opacity: 0; } }

@keyframes fadeInBloom {
    0% { filter: brightness(1) blur(20px); opacity: 0; }
    10% { filter: brightness(2) blur(10px); opacity: 1; }
    to { filter: brightness(1) blur(0); opacity: 1; }
}
@keyframes fadeOutBloom {
    to { filter: brightness(1) blur(20px); opacity: 0; }
    10% { filter: brightness(2) blur(10px); opacity: 1; }
    0% { filter: brightness(1) blur(0); opacity: 1; }
}

@keyframes scaleUp { to { transform: scale(1.25); } }
@keyframes scaleDown { to { transform: scale(.75); } }

@keyframes slideOutUp { to { transform: translateY(-100%); } }
@keyframes slideOutDown { to { transform: translateY(100%); } }
@keyframes slideOutRight { to { transform: translateX(100%); } }
@keyframes slideOutLeft { to { transform: translateX(-100%); } }
@keyframes slideInUp { 0% { transform: translateY(100%); } }
@keyframes slideInDown { 0% { transform: translateY(-100%); } }
@keyframes slideInRight { 0% { transform: translateX(-100%); } }
@keyframes slideInLeft { 0% { transform: translateX(100%); } }

@keyframes shakeX {
    0%, to { transform: translateX(0); }
    20% { transform: translateX(-5%); }
    40% { transform: translateX(5%); }
    60% { transform: translateX(-5%); }
    80% { transform: translateX(5%); }
}
@keyframes shakeY {
    0%, to { transform: translateY(0); }
    20% { transform: translateY(-5%); }
    40% { transform: translateY(5%); }
    60% { transform: translateY(-5%); }
    80% { transform: translateY(5%); }
}
@keyframes shakeZ {
    0%, to { transform: rotate(0deg); }
    20% { transform: rotate(-2deg); }
    40% { transform: rotate(2deg); }
    60% { transform: rotate(-2deg); }
    80% { transform: rotate(2deg); }
}

@keyframes spin { to { transform: rotate(1turn); } }
@keyframes ping { 90%, to { opacity: 0; transform: scale(2); } }
@keyframes blink { 0%, to { opacity: 1; } 50% { opacity: .5; } }
@keyframes float { 50% { transform: translateY(-25%); } }
@keyframes bounce {
    25% { transform: translateY(-20%); }
    40% { transform: translateY(-3%); }
    0%, 60%, to { transform: translateY(0); }
}
@keyframes pulse { 50% { transform: scale(.9); } }

@media (prefers-color-scheme: dark) {
    @keyframes fadeInBloom {
        0% { filter: brightness(1) blur(20px); opacity: 0; }
        10% { filter: brightness(.5) blur(10px); opacity: 1; }
        to { filter: brightness(1) blur(0); opacity: 1; }
    }
    @keyframes fadeOutBloom {
        to { filter: brightness(1) blur(20px); opacity: 0; }
        10% { filter: brightness(.5) blur(10px); opacity: 1; }
        0% { filter: brightness(1) blur(0); opacity: 1; }
    }
}
`;

// View Transition Auto-Generator Observer
window.viewTransitionObserver ??= new MutationObserver((mutations) => {
  // Find all elements with vt-* attributes that don't have transition names yet
  Object.keys(ANIMATION_CONFIG).forEach((animationType) => {
    document
      .querySelectorAll(`[vt-${animationType}]:not([data-vt-processed])`)
      .forEach((element) => {
        processViewTransitionElement(element, animationType);
      });
  });
}).observe(document.documentElement, {
  childList: true,
  subtree: true,
  attributes: true,
});

function processViewTransitionElement(element, animationType) {
  // Generate unique transition name
  const transitionId = "vt__" + window.vtTransitionCount++;

  // Set view-transition-name
  element.style.viewTransitionName = transitionId;

  // Mark as processed
  element.setAttribute("data-vt-processed", "true");
  element.setAttribute("data-vt-type", animationType);

  // Store in registry
  window.vtRegistry.set(element, {
    id: transitionId,
    type: animationType,
  });

  // Generate and inject CSS
  injectTransitionCSS(transitionId, animationType);
}

function injectTransitionCSS(transitionId, animationType) {
  // Check if CSS already exists
  if (document.querySelector(`style[data-vt-id="${transitionId}"]`)) return;

  const config = ANIMATION_CONFIG[animationType];
  if (!config) return;

  // Build CSS based on animation type
  let css = KEYFRAMES;

  if (config.old && config.new) {
    // Bidirectional transition (old -> new)
    css += `
            ::view-transition-old(${transitionId}) {
                animation: ${config.old};
            }

            ::view-transition-new(${transitionId}) {
                animation: ${config.new};
            }
        `;
  } else if (config.new) {
    // One-way transition (just new, for continuous animations or simple effects)
    css += `
            ::view-transition-new(${transitionId}) {
                animation: ${config.new};
            }
        `;
  }

  // Inject the CSS
  const style = document.createElement("style");
  style.setAttribute("data-vt-id", transitionId);
  style.textContent = css;
  document.head.appendChild(style);
}

// Utility function to trigger a view transition on an element
function triggerViewTransition(element, callback) {
  if (document.startViewTransition && typeof callback === "function") {
    document.startViewTransition(callback);
  } else if (typeof callback === "function") {
    callback();
  }
}

// Cleanup function to remove unused styles when elements are removed
function cleanupViewTransitionStyles() {
  window.vtRegistry.forEach((config, element) => {
    if (!document.contains(element)) {
      // Element was removed, clean up its style
      const style = document.querySelector(`style[data-vt-id="${config.id}"]`);
      if (style) {
        style.remove();
      }
      window.vtRegistry.delete(element);
    }
  });
}

// Run cleanup periodically (optional)
setInterval(cleanupViewTransitionStyles, 30000); // Every 30 seconds

// Initialize - process any existing elements
document.addEventListener("DOMContentLoaded", () => {
  // Process any elements that might already exist
  window.viewTransitionObserver.disconnect();
  window.viewTransitionObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
  });
});
