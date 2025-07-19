// Simple HTMX + View Transitions integration
document.addEventListener("htmx:load", function (evt) {
  // Find elements with vt-slide-in-right in the newly loaded content
  const slideElements = evt.detail.elt.querySelectorAll("[vt-slide-in-right]");

  slideElements.forEach((element) => {
    // Give it a unique view-transition-name
    element.style.viewTransitionName = "slide-" + Date.now();
  });
});
