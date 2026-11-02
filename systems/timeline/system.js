import { SystemCore } from "../core.js";
export class TimelineSystem extends SystemCore {
  constructor(runtime) {
    super("timeline", runtime);
    this.registry.markers = new Map();
    this.register("beatsToSeconds", (beats, bpm) => this.beatsToSeconds(beats, bpm));
    this.register("secondsToBeats", (seconds, bpm) => this.secondsToBeats(seconds, bpm));
    this.register("mark", (id, beat) => this.mark(id, beat));
    this.register("markers", () => [...this.registry.markers.entries()].map(([id, beat]) => ({ id, beat })));
  }
  validate(value, bpm) {
    if (!Number.isFinite(value) || value < 0 || !Number.isFinite(bpm) || bpm < 20 || bpm > 400) throw new RangeError("Invalid timeline parameters");
  }
  beatsToSeconds(beats, bpm) { this.validate(beats, bpm); return beats * 60 / bpm; }
  secondsToBeats(seconds, bpm) { this.validate(seconds, bpm); return seconds * bpm / 60; }
  mark(id, beat) {
    if (typeof id !== "string" || !id || !Number.isFinite(beat) || beat < 0) throw new Error("Invalid marker");
    this.registry.markers.set(id, beat);
    this.registry.runtime.emit("timeline:marker-set", { id, beat });
    return { id, beat };
  }
}
