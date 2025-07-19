// document.addEventListener("htmx:beforeSwap", function (evt) {
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(evt.detail.xhr.responseText, "text/html");
//   const slideElements = doc.querySelectorAll("[vt-slide-in-right]");

//   slideElements.forEach((element) => {
//     element.style.viewTransitionName = "slide-right";
//   });

//   evt.detail.serverResponse = doc.documentElement.outerHTML;
// });

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

// htmx.defineExtension("vt", {
//   onEvent: function (name, evt) {
//     if (name === "htmx:beforeSwap") this.handleBeforeSwap(evt);
//     if (name === "htmx:afterSwap") this.handleAfterSwap(evt);
//     return true;
//   },

//   handleBeforeSwap: function (evt) {
//     const extAttr = evt.detail.elt.getAttribute("hx-ext");
//     if (!extAttr || !extAttr.includes("vt:")) return;

//     const transitionType = extAttr.split("vt:")[1].split(" ")[0];
//     const transitionName = `vt-${transitionType}-${Date.now()}`;

//     this.injectCSS(transitionName, transitionType);

//     const parser = new DOMParser();
//     const doc = parser.parseFromString(
//       evt.detail.xhr.responseText,
//       "text/html",
//     );

//     Array.from(doc.body.children).forEach((el) => {
//       el.style.viewTransitionName = transitionName;
//     });

//     evt.detail.serverResponse = new XMLSerializer().serializeToString(doc);
//   },

//   handleAfterSwap: function (evt) {
//     setTimeout(() => {
//       evt.target
//         .querySelectorAll('[style*="view-transition-name"]')
//         .forEach((el) => {
//           el.style.viewTransitionName = "";
//         });
//     }, 1000);
//   },

//   injectCSS: function (transitionName, animationType) {
//     if (document.querySelector(`style[data-vt="${transitionName}"]`)) return;

//     const animations = {
//       "fade-in": "fade-in .5s cubic-bezier(.25,0,.3,1)",
//       "slide-in-right": "slide-in-right .5s cubic-bezier(.25,0,.3,1)",
//       "slide-in-left": "slide-in-left .5s cubic-bezier(.25,0,.3,1)",
//       "slide-in-up": "slide-in-up .5s cubic-bezier(.25,0,.3,1)",
//       "slide-in-down": "slide-in-down .5s cubic-bezier(.25,0,.3,1)",
//       "scale-up": "scale-up .5s cubic-bezier(.25,0,.3,1)",
//     };

//     const keyframes = `@keyframes fade-in{to{opacity:1}}@keyframes slide-in-right{0%{transform:translateX(100%)}}@keyframes slide-in-left{0%{transform:translateX(-100%)}}@keyframes slide-in-up{0%{transform:translateY(100%)}}@keyframes slide-in-down{0%{transform:translateY(-100%)}}@keyframes scale-up{to{transform:scale(1.25)}}`;

//     const animation = animations[animationType];
//     if (!animation) return;

//     const style = document.createElement("style");
//     style.setAttribute("data-vt", transitionName);
//     style.textContent =
//       keyframes +
//       `::view-transition-new(${transitionName}){animation:${animation}}`;
//     document.head.appendChild(style);

//     setTimeout(() => style.remove(), 2000);
//   },
// });

htmx.defineExtension("vt", {
  onEvent: function (name, evt) {
    if (name === "htmx:afterSwap") this.handleAfterSwap(evt);
    return true;
  },

  handleAfterSwap: function (evt) {
    const extAttr = evt.detail.elt.getAttribute("hx-ext");
    if (!extAttr || !extAttr.includes("vt:")) return;

    const transitionType = extAttr.split("vt:")[1].split(" ")[0];
    const newElements = evt.target.children;

    Array.from(newElements).forEach((el) => {
      const transitionName = `vt-${transitionType}-${Date.now()}`;
      el.style.viewTransitionName = transitionName;
      this.injectCSS(transitionName, transitionType);
    });
  },

  injectCSS: function (transitionName, animationType) {
    const keyframes = `@keyframes slide-in-right{from{transform:translateX(100%)}to{transform:translateX(0)}}`;
    const style = document.createElement("style");
    style.textContent =
      keyframes +
      `::view-transition-new(${transitionName}){animation:slide-in-right .5s ease-out}`;
    document.head.appendChild(style);
    setTimeout(() => style.remove(), 1000);
  },
});
