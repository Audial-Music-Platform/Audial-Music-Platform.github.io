import { SystemCore } from "../core.js";
export class MusicSystem extends SystemCore {
  constructor(runtime) {
    super("music", runtime);
    this.registry.compositions = new Map();
    this.register("create", (id, title, bpm = 120) => {
      if (typeof id !== "string" || !id || typeof title !== "string" || !Number.isFinite(bpm) || bpm < 20 || bpm > 400) throw new Error("Invalid composition");
      const composition = { id, title, bpm, tracks: [] };
      this.registry.compositions.set(id, composition);
      this.registry.runtime.emit("music:created", { id });
      return composition;
    });
    this.register("list", () => [...this.registry.compositions.values()]);
  }
}
