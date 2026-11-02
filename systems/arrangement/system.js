import { SystemCore } from "../core.js";
export class ArrangementSystem extends SystemCore {
  constructor(runtime) {
    super("arrangement", runtime);
    this.registry.arrangements = new Map();
    this.register("create", (id, projectId) => this.create(id, projectId));
    this.register("addClip", (id, clip) => this.addClip(id, clip));
    this.register("list", () => [...this.registry.arrangements.values()]);
  }
  create(id, projectId) {
    if (typeof id !== "string" || !id || typeof projectId !== "string" || !projectId || this.registry.arrangements.has(id)) throw new Error("Invalid or duplicate arrangement");
    const item = { id, projectId, clips: [] };
    this.registry.arrangements.set(id, item);
    this.registry.runtime.emit("arrangement:created", { id, projectId });
    return item;
  }
  addClip(id, clip) {
    const arrangement = this.registry.arrangements.get(id);
    if (!arrangement || typeof clip?.trackId !== "string" || !clip.trackId || !Number.isFinite(clip.startBeat) || clip.startBeat < 0 || !Number.isFinite(clip.lengthBeats) || clip.lengthBeats <= 0) throw new Error("Invalid clip");
    const entry = { trackId: clip.trackId, startBeat: clip.startBeat, lengthBeats: clip.lengthBeats };
    arrangement.clips.push(entry);
    this.registry.runtime.emit("arrangement:clip-added", { id, trackId: entry.trackId });
    return entry;
  }
}
