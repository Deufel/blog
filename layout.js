function handlePopoverAttributes() {
  const mobilePopoverElements = document.querySelectorAll('[data-layout="mobile-popover"]');
  const isMobile = window.innerWidth <= 768;

  mobilePopoverElements.forEach(element => {
    if (isMobile) {
      element.setAttribute('popover', 'auto');
      element.removeAttribute('style');
    } else {
      element.removeAttribute('popover');
      element.style.position = 'static';
      element.style.transform = 'none';
      element.style.opacity = '1';
      element.style.width = 'auto';
    }
  });
}

function closeNavOnLinkClick() {
  // Get all links inside the nav
  const navElement = document.getElementById('nav');
  if (!navElement) return;

  const navLinks = navElement.querySelectorAll('a, button');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Check if we're in mobile mode and nav is a popover
      if (window.innerWidth <= 768 && navElement.hasAttribute('popover')) {
        navElement.hidePopover();
      }
    });
  });
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  handlePopoverAttributes();
  closeNavOnLinkClick();
  window.addEventListener('resize', handlePopoverAttributes);

  // Listen for HTMX events
  document.body.addEventListener('htmx:afterSwap', () => {
    handlePopoverAttributes();
    closeNavOnLinkClick(); // Re-attach event listeners after content changes
  });

  document.body.addEventListener('htmx:load', () => {
    handlePopoverAttributes();
    closeNavOnLinkClick();
  });
});

function handlePopoverAttributes() {
  const mobilePopoverElements = document.querySelectorAll('[data-layout="mobile-popover"]');
  const isMobile = window.innerWidth <= 768;

  mobilePopoverElements.forEach(element => {
    if (isMobile) {
      element.setAttribute('popover', 'auto');
      element.removeAttribute('style');

      // Set up enhanced popover behavior if needed
      if (element.getAttribute('data-focus-trap') === 'true' && !element.hasAttribute('data-enhanced')) {
        enhancePopover(element);
        element.setAttribute('data-enhanced', 'true');
      }
    } else {
      element.removeAttribute('popover');
      element.style.position = 'static';
      element.style.transform = 'none';
      element.style.opacity = '1';
      element.style.width = 'auto';
    }
  });
}

function enhancePopover(popoverElement) {
  // Create backdrop element if it doesn't exist
  let backdrop = document.getElementById('popover-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'popover-backdrop';
    backdrop.style.position = 'fixed';
    backdrop.style.top = '0';
    backdrop.style.left = '0';
    backdrop.style.width = '100vw';
    backdrop.style.height = '100vh';
    backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    backdrop.style.zIndex = '998';  // Just below popover
    backdrop.style.display = 'none';
    document.body.appendChild(backdrop);

    // Prevent clicks on backdrop from bubbling
    backdrop.addEventListener('click', (e) => {
      e.stopPropagation();
      // Find any open popovers and close them
      const openPopovers = document.querySelectorAll('[popover][data-focus-trap="true"][popover=open]');
      openPopovers.forEach(pop => pop.hidePopover());
    });
  }

  // Add event listeners for popover open/close
  popoverElement.addEventListener('toggle', (e) => {
    if (e.newState === 'open') {
      // Show backdrop
      backdrop.style.display = 'block';

      // Lock scroll
      document.body.style.overflow = 'hidden';

      // Set up focus trap
      setupFocusTrap(popoverElement);
    } else {
      // Hide backdrop
      backdrop.style.display = 'none';

      // Unlock scroll
      document.body.style.overflow = '';

      // Remove focus trap
      removeFocusTrap();
    }
  });
}

// Focus trap implementation
let lastFocusedElement = null;

function setupFocusTrap(element) {
  // Save currently focused element to restore later
  lastFocusedElement = document.activeElement;

  // Find all focusable elements within the popover
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  // Focus the first element
  firstElement.focus();

  // Set up keydown event for tab key
  document.addEventListener('keydown', trapTabKey);

  function trapTabKey(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    } else if (e.key === 'Escape') {
      // Close the popover on Escape key
      element.hidePopover();
    }
  }
}

function removeFocusTrap() {
  document.removeEventListener('keydown', trapTabKey);

  // Restore focus to the element that was focused before
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

function closeNavOnLinkClick() {
  const navElement = document.getElementById('nav');
  if (!navElement) return;

  const navLinks = navElement.querySelectorAll('a, button');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768 && navElement.hasAttribute('popover')) {
        navElement.hidePopover();
      }
    });
  });
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  handlePopoverAttributes();
  closeNavOnLinkClick();
  window.addEventListener('resize', handlePopoverAttributes);

  // Listen for HTMX events
  document.body.addEventListener('htmx:afterSwap', () => {
    handlePopoverAttributes();
    closeNavOnLinkClick();
  });

  document.body.addEventListener('htmx:load', () => {
    handlePopoverAttributes();
    closeNavOnLinkClick();
  });
});

// Note: The trapTabKey function needs to be defined at a higher scope
// or attached to the window object to be accessible from removeFocusTrap
function trapTabKey(e) {
  // This is a placeholder - the actual implementation will be created
  // dynamically for each popover in setupFocusTrap
}
