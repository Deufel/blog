document.addEventListener("htmx:beforeSwap", function (evt) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(evt.detail.xhr.responseText, "text/html");
  const slideElements = doc.querySelectorAll("[vt-slide-in-right]");

  slideElements.forEach((element) => {
    element.style.viewTransitionName = "slide-right";
  });

  evt.detail.serverResponse = doc.documentElement.outerHTML;
});
