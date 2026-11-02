export class MusicApplications {
  constructor(runtime) {
    this.registry = { runtime, applications: new Map(), active: null, history: [] };
    for (const [id, title, description] of [
      ["library","Music Library","Local, in-session audio file browsing and playback"],
      ["studio","Audio Studio","Waveform analysis and basic playback controls"],
      ["artists","Artists","Artist workspace foundation and identity planning"],
      ["releases","Releases","Release metadata and publishing preparation"],
      ["events","Events","Music events and programme planning"],
      ["settings","Settings","Runtime information and platform preferences"]
    ]) this.registry.applications.set(id, { id, title, description });
  }
  open(id) {
    const app = this.registry.applications.get(id);
    if (!app) throw new Error("Unknown application");
    this.registry.active = id;
    this.registry.history.push(id);
    this.registry.runtime.emit("application:open", { id });
    return app;
  }
  all() { return [...this.registry.applications.values()]; }
}
export class LocalAudioSession {
  constructor(runtime) { this.registry = { runtime, audio: null, url: null, file: null }; }
  load(file) {
    if (!file || !file.type.startsWith("audio/")) throw new Error("Select a supported audio file");
    this.close();
    this.registry.file = file;
    this.registry.url = URL.createObjectURL(file);
    this.registry.audio = new Audio(this.registry.url);
    this.registry.runtime.emit("audio:loaded", { name: file.name, bytes: file.size });
    return this.registry.audio;
  }
  close() {
    if (this.registry.audio) { this.registry.audio.pause(); this.registry.audio.removeAttribute("src"); this.registry.audio.load(); }
    if (this.registry.url) URL.revokeObjectURL(this.registry.url);
    this.registry.audio = null; this.registry.url = null; this.registry.file = null;
  }
}
