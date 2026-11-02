import { SystemCore } from "../core.js";
export class StudioSystem extends SystemCore {
  constructor(runtime) {
    super("studio", runtime);
    this.registry.sessions = new Map();
    this.registry.active = null;
    this.register("open", (id, projectId) => this.open(id, projectId));
    this.register("close", id => this.close(id));
    this.register("list", () => [...this.registry.sessions.values()]);
  }
  open(id, projectId) {
    if (typeof id !== "string" || !id || typeof projectId !== "string" || !projectId || this.registry.sessions.has(id)) throw new Error("Invalid or duplicate session");
    const session = { id, projectId, state: "open", createdAt: new Date().toISOString() };
    this.registry.sessions.set(id, session);
    this.registry.active = id;
    this.registry.runtime.emit("studio:session-opened", { id, projectId });
    return session;
  }
  close(id) {
    const session = this.registry.sessions.get(id);
    if (!session || session.state !== "open") throw new Error("Session not open");
    session.state = "closed";
    if (this.registry.active === id) this.registry.active = null;
    this.registry.runtime.emit("studio:session-closed", { id });
    return session;
  }
}
