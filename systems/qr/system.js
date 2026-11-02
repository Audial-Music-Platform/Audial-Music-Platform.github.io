import { SystemCore } from "../core.js";
export class QRSystem extends SystemCore {
  constructor(runtime) {
    super("qr", runtime);
    this.registry.records = new Map();
    this.register("prepare", (id, payload) => this.prepare(id, payload));
    this.register("list", () => [...this.registry.records.values()]);
  }
  prepare(id, payload) {
    if (typeof id !== "string" || !/^[a-z0-9._-]{1,80}$/i.test(id) || typeof payload !== "string" || !payload || new TextEncoder().encode(payload).length > 1024) throw new Error("Invalid QR payload");
    const record = {id, payload, status:"pending-encoder"};
    this.registry.records.set(id, record);
    this.registry.runtime.emit("qr:payload-prepared", {id, bytes:new TextEncoder().encode(payload).length});
    return record;
  }
}
