document.addEventListener("htmx:load", function (evt) {
  console.log("HTMX load event fired!", evt.detail.elt);

  const slideElements = evt.detail.elt.querySelectorAll("[vt-slide-in-right]");
  console.log("Found slide elements:", slideElements.length, slideElements);

  slideElements.forEach((element) => {
    console.log("Setting view-transition-name on:", element);
    element.style.viewTransitionName = "slide-right";
    console.log("Style after setting:", element.style.viewTransitionName);
  });
});
