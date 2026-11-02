import { SystemCore } from "../core.js";
export class ProjectSystem extends SystemCore {
  constructor(runtime) {
    super("project", runtime);
    this.registry.projects = new Map();
    this.register("create", (id, title) => this.create(id, title));
    this.register("get", id => this.registry.projects.get(id) ?? null);
    this.register("list", () => [...this.registry.projects.values()]);
  }
  create(id, title) {
    if (typeof id !== "string" || !id || typeof title !== "string" || !title.trim() || this.registry.projects.has(id)) throw new Error("Invalid or duplicate project");
    const project = { id, title: title.trim(), createdAt: new Date().toISOString(), arrangementIds: [] };
    this.registry.projects.set(id, project);
    this.registry.runtime.emit("project:created", { id });
    return project;
  }
}
