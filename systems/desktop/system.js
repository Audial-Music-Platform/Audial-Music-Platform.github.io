import { WindowSystem } from "../window/system.js";
export class DesktopEnvironment {
  constructor(display) { this.registry = { display, windows: null }; }
  mount(shell) {
    const desktop = this.registry.display.node("section", shell, "", "amp-desktop");
    const dock = this.registry.display.node("nav", desktop, "", "amp-dock");
    const workspace = this.registry.display.node("div", desktop, "", "amp-workspace");
    this.registry.windows = new WindowSystem(this.registry.display.registry.runtime, workspace);
    const open = (id, title, callback) => this.registry.windows.open(id, title, callback);
    for (const system of this.registry.display.registry.systems.all()) {
      const button = this.registry.display.node("button", dock, system.name.toUpperCase());
      button.addEventListener("click", () => open("system:" + system.name, system.name.toUpperCase() + " SYSTEM", panel => this.registry.display.openSystem(system.name, panel)));
    }
    for (const app of this.registry.display.registry.applications.all()) {
      const button = this.registry.display.node("button", dock, app.title);
      button.addEventListener("click", () => open("app:" + app.id, app.title, panel => this.registry.display.open(app.id, panel)));
    }
    open("welcome", "AMP — DESKTOP", panel => this.registry.display.home(panel));
  }
}
