import { Runtime } from "./runtime/runtime.js";
import { BrowserEnvironment } from "./browser/environment.js";
import { DesktopSystem, TabletSystem, MobileSystem } from "./systems/display.js";
import { AuditBridge } from "./audit/bridge.js";
class AudialPlatform {
  constructor() {
    this.registry = { environment: null, runtime: null, display: null, audit: null };
    this.registry.environment = new BrowserEnvironment();
    this.registry.runtime = new Runtime();
    this.registry.audit = new AuditBridge(this.registry.runtime);
    this.registry.display = this.createDisplay();
    this.start();
  }
  createDisplay() {
    const mode = this.registry.environment.mode();
    return mode === "mobile" ? new MobileSystem(this.registry.runtime) : mode === "tablet" ? new TabletSystem(this.registry.runtime) : new DesktopSystem(this.registry.runtime);
  }
  start() {
    this.registry.runtime.emit("platform:start", { version: "0.1.0" });
    this.registry.display.mount(document.body);
    this.registry.audit.start();
    window.addEventListener("resize", () => this.onResize(), { passive: true });
  }
  onResize() {
    const mode = this.registry.environment.mode();
    if (this.registry.display.mode !== mode) {
      this.registry.display = this.createDisplay();
      this.registry.display.mount(document.body);
      this.registry.runtime.emit("display:changed", { mode });
    }
  }
}
new AudialPlatform();
