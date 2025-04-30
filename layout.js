// function handlePopoverAttributes() {
//   const mobilePopoverElements = document.querySelectorAll('[data-layout="mobile-popover"]');
//   const isMobile = window.innerWidth <= 768;

//   mobilePopoverElements.forEach(element => {
//     if (isMobile) {
//       element.setAttribute('popover', 'auto');
//       element.removeAttribute('style');
//     } else {
//       element.removeAttribute('popover');
//       element.style.position = 'static';
//       element.style.transform = 'none';
//       element.style.opacity = '1';
//       element.style.width = 'auto';
//     }
//   });
// }

// function closeNavOnLinkClick() {
//   // Get all links inside the nav
//   const navElement = document.getElementById('nav');
//   if (!navElement) return;

//   const navLinks = navElement.querySelectorAll('a, button');

//   navLinks.forEach(link => {
//     link.addEventListener('click', () => {
//       // Check if we're in mobile mode and nav is a popover
//       if (window.innerWidth <= 768 && navElement.hasAttribute('popover')) {
//         navElement.hidePopover();
//       }
//     });
//   });
// }

// // Initialize when DOM is ready
// document.addEventListener("DOMContentLoaded", () => {
//   handlePopoverAttributes();
//   closeNavOnLinkClick();
//   window.addEventListener('resize', handlePopoverAttributes);

//   // Listen for HTMX events
//   document.body.addEventListener('htmx:afterSwap', () => {
//     handlePopoverAttributes();
//     closeNavOnLinkClick(); // Re-attach event listeners after content changes
//   });

//   document.body.addEventListener('htmx:load', () => {
//     handlePopoverAttributes();
//     closeNavOnLinkClick();
//   });
// });


function handlePopoverAttributes() {
  const mobilePopoverElements = document.querySelectorAll('[data-layout="mobile-popover"]');
  const isMobile = window.innerWidth <= 768;

  mobilePopoverElements.forEach(element => {
    if (isMobile) {
      element.setAttribute('popover', 'auto');
      element.removeAttribute('style');

      // Add event listener for popover state changes if not already added
      if (!element.hasAttribute('data-popover-initialized')) {
        element.setAttribute('data-popover-initialized', 'true');

        // Handle popover opening and closing
        element.addEventListener('toggle', (event) => {
          if (event.newState === 'open') {
            // Set inert on everything except the popover
            document.querySelectorAll('body > *:not([popover]:popover-open)').forEach(el => {
              el.setAttribute('inert', '');
            });
          } else {
            // Remove inert from all elements
            document.querySelectorAll('[inert]').forEach(el => {
              el.removeAttribute('inert');
            });
          }
        });
      }
    } else {
      element.removeAttribute('popover');
      element.style.position = 'static';
      element.style.transform = 'none';
      element.style.opacity = '1';
      element.style.width = 'auto';

      // Remove any inert attributes
      document.querySelectorAll('[inert]').forEach(el => {
        el.removeAttribute('inert');
      });
    }
  });
}
