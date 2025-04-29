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
