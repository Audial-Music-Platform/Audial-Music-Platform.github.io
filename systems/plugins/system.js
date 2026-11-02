import { SystemCore } from "../core.js";
export class PluginSystem extends SystemCore {
  constructor(runtime) {
    super("plugins", runtime);
    this.registry.manifests = new Map();
    this.register("inspect", manifest => this.inspect(manifest));
    this.register("list", () => [...this.registry.manifests.values()]);
  }
  inspect(manifest) {
    if (!manifest || typeof manifest !== "object" || typeof manifest.id !== "string" || !/^[a-z0-9][a-z0-9.-]{1,79}$/.test(manifest.id) || typeof manifest.version !== "string") throw new Error("Invalid manifest");
    const record = Object.freeze({ id: manifest.id, version: manifest.version, status: "untrusted-inert" });
    this.registry.manifests.set(record.id, record);
    this.registry.runtime.emit("plugin:inspected", { id: record.id });
    return record;
  }
}
