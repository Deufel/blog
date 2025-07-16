class DrawerManager {
  constructor() {
    this.elements = document.querySelectorAll("[data-drawer-breakpoint]");
    window.addEventListener("resize", () => this.update());
    this.update();
  }

  update() {
    this.elements.forEach((el) => {
      const breakpoint = el.dataset.drawerBreakpoint;
      const shouldBeDrawer =
        breakpoint === "always" || window.innerWidth < parseInt(breakpoint);

      if (shouldBeDrawer) {
        el.setAttribute("popover", "auto");
      } else {
        el.matches(":popover-open") && el.hidePopover();
        el.removeAttribute("popover");
      }
    });
  }
}

new DrawerManager();
