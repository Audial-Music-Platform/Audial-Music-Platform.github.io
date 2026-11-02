import { SystemCore } from "../core.js";
export class LibrarySystem extends SystemCore {
  constructor(runtime) {
    super("library", runtime);
    this.registry.entries = new Map();
    this.register("add", (id, metadata) => this.add(id, metadata));
    this.register("search", query => [...this.registry.entries.values()].filter(x => x.title.toLowerCase().includes(String(query).toLowerCase())));
  }
  add(id, metadata) {
    if (typeof id !== "string" || !id || typeof metadata?.title !== "string") throw new Error("Invalid entry");
    const record = { id, title: metadata.title };
    this.registry.entries.set(id, record);
    this.registry.runtime.emit("library:added", { id });
    return record;
  }
}
