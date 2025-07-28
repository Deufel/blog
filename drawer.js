/**
 * Modern Drawer System using View Transitions API
 * Provides smooth, mobile-optimized drawer animations with automatic fallbacks
 */

class ViewTransitionsDrawer {
  constructor() {
    this.hasViewTransitions = this.checkViewTransitionsSupport();
    this.activeDrawers = new Set();
    this.isAnimating = false;
    this.init();
  }

  /**
   * Check if browser supports View Transitions API properly
   */
  checkViewTransitionsSupport() {
    return (
      "startViewTransition" in document &&
      CSS.supports("view-transition-name", "test")
    );
  }

  /**
   * Initialize the drawer system
   */
  init() {
    console.log(
      this.hasViewTransitions
        ? "🎬 Using View Transitions API for drawer animations"
        : "⚡ Using fallback animations for drawer system",
    );

    this.setupEventListeners();
    this.setupKeyboardHandlers();
    this.setupMobileOptimizations();
  }

  /**
   * Setup event listeners for drawer triggers
   */
  setupEventListeners() {
    // Handle drawer trigger buttons
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-drawer-trigger]");
      if (trigger) {
        e.preventDefault();
        const targetId = trigger.getAttribute("data-drawer-trigger");
        const action = trigger.getAttribute("data-drawer-action") || "toggle";

        this.handleDrawerAction(targetId, action);
      }
    });

    // Handle backdrop clicks
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("drawer-backdrop")) {
        const drawerId = e.target.getAttribute("data-drawer-backdrop");
        this.closeDrawer(drawerId);
      }
    });

    // Prevent drawer content clicks from closing
    document.addEventListener("click", (e) => {
      if (e.target.closest(".drawer")) {
        e.stopPropagation();
      }
    });
  }

  /**
   * Setup keyboard handlers
   */
  setupKeyboardHandlers() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.activeDrawers.size > 0) {
        this.closeAllDrawers();
      }
    });
  }

  /**
   * Setup mobile-specific optimizations
   */
  setupMobileOptimizations() {
    // Handle orientation changes
    window.addEventListener("orientationchange", () => {
      setTimeout(() => this.handleOrientationChange(), 300);
    });

    // Handle viewport changes for mobile browsers
    let timeout;
    window.addEventListener("resize", () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => this.adjustMobileViewport(), 150);
    });
  }

  /**
   * Handle drawer actions (open, close, toggle)
   */
  handleDrawerAction(drawerId, action) {
    if (this.isAnimating) return;

    const drawer = document.getElementById(drawerId);
    if (!drawer) {
      console.warn(`Drawer with ID "${drawerId}" not found`);
      return;
    }

    switch (action) {
      case "open":
        this.openDrawer(drawerId);
        break;
      case "close":
        this.closeDrawer(drawerId);
        break;
      case "toggle":
      default:
        this.toggleDrawer(drawerId);
        break;
    }
  }

  /**
   * Open a drawer
   */
  async openDrawer(drawerId) {
    if (this.isAnimating) return;

    const drawer = document.getElementById(drawerId);
    if (!drawer || drawer.classList.contains("drawer-open")) return;

    this.isAnimating = true;

    try {
      if (this.hasViewTransitions) {
        await this.openDrawerWithViewTransitions(drawer);
      } else {
        this.openDrawerWithFallback(drawer);
      }
    } catch (error) {
      console.warn("Drawer animation failed, using fallback:", error);
      this.openDrawerWithFallback(drawer);
    } finally {
      this.isAnimating = false;
    }
  }

  /**
   * Close a drawer
   */
  async closeDrawer(drawerId) {
    if (this.isAnimating) return;

    const drawer = document.getElementById(drawerId);
    if (!drawer || !drawer.classList.contains("drawer-open")) return;

    this.isAnimating = true;

    try {
      if (this.hasViewTransitions) {
        await this.closeDrawerWithViewTransitions(drawer);
      } else {
        this.closeDrawerWithFallback(drawer);
      }
    } catch (error) {
      console.warn("Drawer animation failed, using fallback:", error);
      this.closeDrawerWithFallback(drawer);
    } finally {
      this.isAnimating = false;
    }
  }

  /**
   * Toggle a drawer
   */
  toggleDrawer(drawerId) {
    const drawer = document.getElementById(drawerId);
    if (!drawer) return;

    if (drawer.classList.contains("drawer-open")) {
      this.closeDrawer(drawerId);
    } else {
      this.openDrawer(drawerId);
    }
  }

  /**
   * Open drawer using View Transitions API
   */
  async openDrawerWithViewTransitions(drawer) {
    // Close other auto drawers first
    this.closeAutoDrawers(drawer);

    // Create and show backdrop
    const backdrop = this.getOrCreateBackdrop(drawer.id);

    const transition = document.startViewTransition(() => {
      // Update DOM state
      drawer.classList.add("drawer-open");
      backdrop.classList.add("backdrop-open");
      this.handleDrawerOpened(drawer);
    });

    await transition.finished;
  }

  /**
   * Close drawer using View Transitions API
   */
  async closeDrawerWithViewTransitions(drawer) {
    const backdrop = this.getBackdrop(drawer.id);

    const transition = document.startViewTransition(() => {
      // Update DOM state
      drawer.classList.remove("drawer-open");
      if (backdrop) {
        backdrop.classList.remove("backdrop-open");
      }
      this.handleDrawerClosed(drawer);
    });

    await transition.finished;
  }

  /**
   * Open drawer with fallback animations
   */
  openDrawerWithFallback(drawer) {
    this.closeAutoDrawers(drawer);

    const backdrop = this.getOrCreateBackdrop(drawer.id);

    // Force reflow to ensure starting state
    drawer.offsetHeight;

    drawer.classList.add("drawer-open");
    backdrop.classList.add("backdrop-open");

    this.handleDrawerOpened(drawer);
  }

  /**
   * Close drawer with fallback animations
   */
  closeDrawerWithFallback(drawer) {
    const backdrop = this.getBackdrop(drawer.id);

    drawer.classList.remove("drawer-open");
    if (backdrop) {
      backdrop.classList.remove("backdrop-open");
    }

    this.handleDrawerClosed(drawer);
  }

  /**
   * Handle drawer opened state
   */
  handleDrawerOpened(drawer) {
    this.activeDrawers.add(drawer);

    // Prevent body scroll on mobile
    if (this.isMobile()) {
      document.body.style.overflow = "hidden";
    }

    // Focus management
    const firstFocusable = drawer.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 100);
    }

    // Dispatch custom event
    drawer.dispatchEvent(
      new CustomEvent("drawer:opened", {
        detail: { drawerId: drawer.id },
      }),
    );
  }

  /**
   * Handle drawer closed state
   */
  handleDrawerClosed(drawer) {
    this.activeDrawers.delete(drawer);

    // Restore body scroll if no more drawers are open
    if (this.activeDrawers.size === 0 && this.isMobile()) {
      document.body.style.overflow = "";
    }

    // Dispatch custom event
    drawer.dispatchEvent(
      new CustomEvent("drawer:closed", {
        detail: { drawerId: drawer.id },
      }),
    );
  }

  /**
   * Close auto drawers (drawers without data-manual attribute)
   */
  closeAutoDrawers(currentDrawer) {
    if (currentDrawer.hasAttribute("data-manual")) return;

    this.activeDrawers.forEach((drawer) => {
      if (drawer !== currentDrawer && !drawer.hasAttribute("data-manual")) {
        this.closeDrawer(drawer.id);
      }
    });
  }

  /**
   * Close all open drawers
   */
  closeAllDrawers() {
    const drawersToClose = Array.from(this.activeDrawers);
    drawersToClose.forEach((drawer) => {
      this.closeDrawer(drawer.id);
    });
  }

  /**
   * Get or create backdrop for drawer
   */
  getOrCreateBackdrop(drawerId) {
    let backdrop = this.getBackdrop(drawerId);

    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "drawer-backdrop";
      backdrop.setAttribute("data-drawer-backdrop", drawerId);
      document.body.appendChild(backdrop);
    }

    return backdrop;
  }

  /**
   * Get existing backdrop for drawer
   */
  getBackdrop(drawerId) {
    return document.querySelector(`[data-drawer-backdrop="${drawerId}"]`);
  }

  /**
   * Handle orientation changes on mobile
   */
  handleOrientationChange() {
    if (this.activeDrawers.size > 0) {
      this.adjustMobileViewport();
    }
  }

  /**
   * Adjust viewport for mobile devices
   */
  adjustMobileViewport() {
    if (!this.isMobile()) return;

    this.activeDrawers.forEach((drawer) => {
      // Handle dynamic viewport height
      const vh = window.innerHeight * 0.01;
      drawer.style.setProperty("--vh", `${vh}px`);
    });
  }

  /**
   * Check if device is mobile
   */
  isMobile() {
    return (
      window.innerWidth <= 768 ||
      /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(
        navigator.userAgent,
      )
    );
  }

  /**
   * Public API: Check if a drawer is open
   */
  isDrawerOpen(drawerId) {
    const drawer = document.getElementById(drawerId);
    return drawer ? drawer.classList.contains("drawer-open") : false;
  }

  /**
   * Public API: Get all open drawer IDs
   */
  getOpenDrawers() {
    return Array.from(this.activeDrawers).map((drawer) => drawer.id);
  }

  /**
   * Public API: Set reduced motion preference
   */
  setReducedMotion(enabled) {
    if (enabled) {
      document.documentElement.style.setProperty(
        "--drawer-animation-duration",
        "0.1s",
      );
    } else {
      document.documentElement.style.removeProperty(
        "--drawer-animation-duration",
      );
    }
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.viewTransitionsDrawer = new ViewTransitionsDrawer();
  });
} else {
  window.viewTransitionsDrawer = new ViewTransitionsDrawer();
}

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = ViewTransitionsDrawer;
}
