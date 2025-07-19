window.vtCount ??= 1;

document.addEventListener("htmx:beforeSwap", function (evt) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(evt.detail.xhr.responseText, "text/html");
  const slideElements = doc.querySelectorAll("[vt-slide-in-right]");

  slideElements.forEach((element) => {
    const uniqueId = "vt__" + window.vtCount++;
    element.style.viewTransitionName = uniqueId;
  });

  evt.detail.serverResponse = doc.documentElement.outerHTML;
});
