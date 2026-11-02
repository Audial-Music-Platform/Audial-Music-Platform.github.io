import { BrowserSystem } from "./browser/system.js";
import { EANSystem } from "./ean/system.js";
import { QRSystem } from "./qr/system.js";
import { ArrangementSystem } from "./arrangement/system.js";
import { TimelineSystem } from "./timeline/system.js";
import { ProjectSystem } from "./project/system.js";
import { StudioSystem } from "./studio/system.js";
import { URISystem } from "./uri/system.js";
import { URLSystem } from "./url/system.js";
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
    const uri = new URISystem(runtime);
    const url = new URLSystem(runtime, uri);
    for (const instance of [uri, url, new ArrangementSystem(runtime), new TimelineSystem(runtime), new ProjectSystem(runtime), new StudioSystem(runtime), new BrowserSystem(runtime), new EANSystem(runtime), new QRSystem(runtime)]) {
      this.registry.systems.set(instance.registry.name, instance);
      runtime.register("system:" + instance.registry.name, instance);
    }
  }
  get(name) { return this.registry.systems.get(name); }
  all() { return [...this.registry.systems.values()].map(x => x.snapshot()); }
}
