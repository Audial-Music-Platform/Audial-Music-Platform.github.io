export class AuditBridge {
  constructor(runtime) { this.registry = { runtime, state: "uninitialized", worker: null }; }
  async start() {
    this.registry.state = "loading";
    try {
      const { WebR } = await import("https://webr.r-wasm.org/latest/webr.mjs");
      const webR = new WebR();
      await webR.init();
      this.registry.worker = webR;
      this.registry.state = "ready";
      this.registry.runtime.emit("audit:ready", { engine: "WebR" });
      const result = await webR.evalRString("source('index.R'); audial_audit(c(1,2,3))");
      this.registry.runtime.emit("audit:sample", { result });
    } catch (error) {
      this.registry.state = "unavailable";
      this.registry.runtime.emit("audit:unavailable", { message: String(error) });
    }
  }
}
