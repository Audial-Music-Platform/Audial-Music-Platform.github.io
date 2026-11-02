import { PluginSystem } from "./plugins/system.js";
import { LibrarySystem } from "./library/system.js";
import { SoundSystem } from "./sound/system.js";
import { AudioSystem } from "./audio/system.js";
import { MusicSystem } from "./music/system.js";
export class SystemRegistry {
  constructor(runtime) {
    this.registry = { runtime, systems: new Map() };
    for (const System of [PluginSystem, LibrarySystem, SoundSystem, AudioSystem, MusicSystem]) {
      const instance = new System(runtime);
      this.registry.systems.set(instance.registry.name, instance);
      runtime.register("system:" + instance.registry.name, instance);
    }
  }
  get(name) { return this.registry.systems.get(name); }
  all() { return [...this.registry.systems.values()].map(x => x.snapshot()); }
}
