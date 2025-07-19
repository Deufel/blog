document.addEventListener("htmx:load", function (evt) {
  const slideElements = evt.detail.elt.querySelectorAll("[vt-slide-in-right]");

  slideElements.forEach((element) => {
    // Set a specific view-transition-name
    element.style.viewTransitionName = "slide-right";
  });
});
