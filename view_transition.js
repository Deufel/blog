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

htmx.defineExtension("vt", {
  onEvent: function (name, evt) {
    if (name === "htmx:beforeSwap") this.handleBeforeSwap(evt);
    if (name === "htmx:afterSwap") this.handleAfterSwap(evt);
    return true;
  },

  handleBeforeSwap: function (evt) {
    const extAttr = evt.detail.elt.getAttribute("hx-ext");
    if (!extAttr || !extAttr.includes("vt:")) return;

    const transitionType = extAttr.split("vt:")[1].split(" ")[0];
    const parser = new DOMParser();
    const doc = parser.parseFromString(
      evt.detail.xhr.responseText,
      "text/html",
    );
    const targetElements = doc.body.children;

    Array.from(targetElements).forEach((el) => {
      const transitionName = `vt-${transitionType}-${Date.now()}`;
      el.style.viewTransitionName = transitionName;
      this.injectCSS(transitionName, transitionType);
    });

    evt.detail.serverResponse = doc.documentElement.outerHTML;
  },

  handleAfterSwap: function (evt) {
    setTimeout(() => {
      evt.target
        .querySelectorAll('[style*="view-transition-name"]')
        .forEach((el) => (el.style.viewTransitionName = ""));
    }, 600);
  },

  injectCSS: function (transitionName, animationType) {
    if (document.querySelector(`style[data-vt="${transitionName}"]`)) return;

    const animations = {
      "fade-in": "fade-in .5s cubic-bezier(.25,0,.3,1)",
      "fade-out": "fade-out .5s cubic-bezier(.25,0,.3,1)",
      "fade-in-bloom": "fade-in-bloom 2s cubic-bezier(.25,0,.3,1)",
      "fade-out-bloom": "fade-out-bloom 2s cubic-bezier(.25,0,.3,1)",
      "scale-up": "scale-up .5s cubic-bezier(.25,0,.3,1)",
      "scale-down": "scale-down .5s cubic-bezier(.25,0,.3,1)",
      "slide-in-up": "slide-in-up .5s cubic-bezier(.25,0,.3,1)",
      "slide-in-down": "slide-in-down .5s cubic-bezier(.25,0,.3,1)",
      "slide-in-left": "slide-in-left .5s cubic-bezier(.25,0,.3,1)",
      "slide-in-right": "slide-in-right .5s cubic-bezier(.25,0,.3,1)",
      "slide-out-up": "slide-out-up .5s cubic-bezier(.25,0,.3,1)",
      "slide-out-down": "slide-out-down .5s cubic-bezier(.25,0,.3,1)",
      "slide-out-left": "slide-out-left .5s cubic-bezier(.25,0,.3,1)",
      "slide-out-right": "slide-out-right .5s cubic-bezier(.25,0,.3,1)",
      "shake-x": "shake-x .75s cubic-bezier(0,0,0,1)",
      "shake-y": "shake-y .75s cubic-bezier(0,0,0,1)",
      "shake-z": "shake-z 1s cubic-bezier(.5,0,.5,1)",
      spin: "spin 2s linear infinite",
      ping: "ping 5s cubic-bezier(0,0,.3,1) infinite",
      blink: "blink 1s cubic-bezier(0,0,.3,1) infinite",
      float: "float 3s cubic-bezier(.5,0,.5,1) infinite",
      bounce: "bounce 2s cubic-bezier(.5,-.9,.1,1.5) infinite",
      pulse: "pulse 2s cubic-bezier(0,0,.3,1) infinite",
    };

    const keyframes = `@keyframes fade-in{to{opacity:1}}@keyframes fade-in-bloom{0%{filter:brightness(1) blur(20px);opacity:0}10%{filter:brightness(2) blur(10px);opacity:1}to{filter:brightness(1) blur(0);opacity:1}}@keyframes fade-out{to{opacity:0}}@keyframes fade-out-bloom{to{filter:brightness(1) blur(20px);opacity:0}10%{filter:brightness(2) blur(10px);opacity:1}0%{filter:brightness(1) blur(0);opacity:1}}@keyframes scale-up{to{transform:scale(1.25)}}@keyframes scale-down{to{transform:scale(.75)}}@keyframes slide-out-up{to{transform:translateY(-100%)}}@keyframes slide-out-down{to{transform:translateY(100%)}}@keyframes slide-out-right{to{transform:translateX(100%)}}@keyframes slide-out-left{to{transform:translateX(-100%)}}@keyframes slide-in-up{0%{transform:translateY(100%)}}@keyframes slide-in-down{0%{transform:translateY(-100%)}}@keyframes slide-in-right{0%{transform:translateX(-100%)}}@keyframes slide-in-left{0%{transform:translateX(100%)}}@keyframes shake-x{0%,to{transform:translateX(0)}20%{transform:translateX(-5%)}40%{transform:translateX(5%)}60%{transform:translateX(-5%)}80%{transform:translateX(5%)}}@keyframes shake-y{0%,to{transform:translateY(0)}20%{transform:translateY(-5%)}40%{transform:translateY(5%)}60%{transform:translateY(-5%)}80%{transform:translateY(5%)}}@keyframes shake-z{0%,to{transform:rotate(0deg)}20%{transform:rotate(-2deg)}40%{transform:rotate(2deg)}60%{transform:rotate(-2deg)}80%{transform:rotate(2deg)}}@keyframes spin{to{transform:rotate(1turn)}}@keyframes ping{90%,to{opacity:0;transform:scale(2)}}@keyframes blink{0%,to{opacity:1}50%{opacity:.5}}@keyframes float{50%{transform:translateY(-25%)}}@keyframes bounce{25%{transform:translateY(-20%)}40%{transform:translateY(-3%)}0%,60%,to{transform:translateY(0)}}@keyframes pulse{50%{transform:scale(.9)}}@media (prefers-color-scheme:dark){@keyframes fade-in-bloom{0%{filter:brightness(1) blur(20px);opacity:0}10%{filter:brightness(.5) blur(10px);opacity:1}to{filter:brightness(1) blur(0);opacity:1}}@keyframes fade-out-bloom{to{filter:brightness(1) blur(20px);opacity:0}10%{filter:brightness(.5) blur(10px);opacity:1}0%{filter:brightness(1) blur(0);opacity:1}}}`;

    const animation = animations[animationType];
    if (!animation) return;

    const style = document.createElement("style");
    style.setAttribute("data-vt", transitionName);
    style.textContent =
      keyframes +
      `::view-transition-new(${transitionName}) { animation: ${animation}; }`;
    document.head.appendChild(style);

    setTimeout(() => style.remove(), 1000);
  },
});
