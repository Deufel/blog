document.addEventListener("htmx:beforeSwap", function (evt) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(evt.detail.xhr.responseText, "text/html");
  const slideElements = doc.querySelectorAll("[vt-slide-in-right]");

  slideElements.forEach((element) => {
    element.style.viewTransitionName = "slide-right";
  });

  evt.detail.serverResponse = doc.documentElement.outerHTML;
});

// document.addEventListener("htmx:afterSwap", function (evt) {
//   // Clean up view-transition-name after the transition completes
//   setTimeout(() => {
//     evt.target
//       .querySelectorAll('[style*="view-transition-name"]')
//       .forEach((element) => {
//         element.style.viewTransitionName = "";
//       });
//   }, 500); // Wait for transition to complete
// });

// Clean up view-transition-name after the transition completes
document.addEventListener("htmx:afterSwap", function (evt) {
  document.addEventListener("viewtransition", function handler(e) {
    if (e.viewTransition.finished) {
      evt.target
        .querySelectorAll('[style*="view-transition-name"]')
        .forEach((element) => {
          element.style.viewTransitionName = "";
        });
      document.removeEventListener("viewtransition", handler);
    }
  });
});
