document.addEventListener("htmx:load", function (evt) {
  console.log("HTMX load event fired!", evt.detail.elt);
  const slideElements = evt.detail.elt.querySelectorAll("[vt-slide-in-right]");

  slideElements.forEach((element) => {
    // Set a specific view-transition-name
    element.style.viewTransitionName = "slide-right";
  });
});
