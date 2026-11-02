import { MusicApplications, LocalAudioSession } from "../music/apps.js";
class DisplaySystem {
  constructor(runtime, mode, systems) {
    this.mode = mode;
    this.registry = { runtime, mode, systems, applications: new MusicApplications(runtime), audio: new LocalAudioSession(runtime), root: null };
  }
  node(tag, parent, text = "", cls = "") {
    const el = document.createElement(tag);
    el.textContent = text;
    if (cls) el.className = cls;
    parent.append(el);
    return el;
  }
  mount(root) {
    this.registry.root = root;
    root.replaceChildren();
    document.getElementById("audial-style")?.remove();
    const style = this.node("style", document.head);
    style.id = "audial-style";
    style.textContent = `*{box-sizing:border-box}body{margin:0;background:radial-gradient(ellipse at 80% 0%,#273955,#10121a 62%);color:#f1f6ff;font:15px system-ui,sans-serif;min-height:100vh}button,input{font:inherit}button{cursor:pointer;color:inherit;background:#ffffff13;border:1px solid #ffffff25;border-radius:12px;padding:11px 15px}button:hover,button:focus-visible{background:#ffffff2a}button:focus-visible,input:focus-visible{outline:2px solid #70e2cb;outline-offset:3px}.shell{max-width:1350px;margin:auto;padding:24px}.bar{display:flex;justify-content:space-between;align-items:center;gap:12px;border-bottom:1px solid #ffffff20;padding-bottom:18px}.brand{font-size:18px;font-weight:750;letter-spacing:.14em}.muted{color:#aabacf}.hero{padding:55px 0 28px}.hero h1{font-size:clamp(2.4rem,6vw,5.5rem);letter-spacing:-.06em;margin:0}.hero p{max-width:720px;line-height:1.6}.layout{display:grid;grid-template-columns:240px 1fr;gap:20px}.nav,.panel{background:#ffffff0a;border:1px solid #ffffff1c;border-radius:20px;padding:18px;backdrop-filter:blur(16px)}.nav{display:flex;flex-direction:column;gap:8px}.nav button{text-align:left}.panel{min-height:280px}.panel h2{margin-top:4px}.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}.tile{text-align:left;min-height:115px}.tile strong{display:block;margin-bottom:8px}.tile span{color:#aabacf;font-size:13px}.status{display:flex;gap:18px;flex-wrap:wrap;padding:22px 0;color:#aabacf;font-size:12px}audio{width:min(100%,600px);margin-top:18px}input[type=file]{max-width:100%}@media(max-width:900px){.layout{grid-template-columns:1fr}.nav{flex-direction:row;overflow:auto}.nav button{white-space:nowrap}.hero{padding:35px 0 18px}}@media(max-width:600px){.shell{padding:14px}.bar{align-items:flex-start}.brand{font-size:14px}.nav{padding:10px}.panel{min-height:260px}.hero h1{font-size:2.8rem}}`;
    const shell = this.node("div", root, "", "shell");
    const bar = this.node("header", shell, "", "bar");
    this.node("div", bar, "AUDIAL MUSIC PLATFORM", "brand");
    this.node("div", bar, "WEB OS · 0.4.0", "muted");
    const hero = this.node("section", shell, "", "hero");
    this.node("h1", hero, "Sound. Systems. Possibilities.");
    this.node("p", hero, "A modular environment for music, artists, releases, audio tools and creative infrastructure.", "muted");
    const layout = this.node("div", shell, "", "layout");
    const nav = this.node("nav", layout, "", "nav");
    nav.setAttribute("aria-label", "Applications");
    const panel = this.node("main", layout, "", "panel");
    for (const system of this.registry.systems.all()) {
      const button = this.node("button", nav, system.name.toUpperCase() + " SYSTEM");
      button.addEventListener("click", () => this.openSystem(system.name, panel));
    }
    for (const app of this.registry.applications.all()) {
      const button = this.node("button", nav, app.title);
      button.addEventListener("click", () => this.open(app.id, panel));
    }
    const footer = this.node("footer", shell, "", "status");
    this.node("span", footer, "Mode: " + this.mode);
    this.node("span", footer, "Runtime: active");
    this.node("span", footer, "WebR: optional analysis");
    this.node("span", footer, "Experimental · no cloud upload");
    this.home(panel);
  }
  home(panel) {
    panel.replaceChildren();
    this.node("h2", panel, "Independent Systems");
    const systems = this.node("div", panel, "", "tiles");
    for (const system of this.registry.systems.all()) {
      const tile = this.node("button", systems, "", "tile");
      this.node("strong", tile, system.name.toUpperCase() + " SYSTEM");
      this.node("span", tile, system.operations.join(" · "));
      tile.addEventListener("click", () => this.openSystem(system.name, panel));
    }
    this.node("h2", panel, "Applications");
    this.node("p", panel, "Choose a workspace to explore the platform foundation.", "muted");
    const tiles = this.node("div", panel, "", "tiles");
    for (const app of this.registry.applications.all()) {
      const tile = this.node("button", tiles, "", "tile");
      this.node("strong", tile, app.title);
      this.node("span", tile, app.description);
      tile.addEventListener("click", () => this.open(app.id, panel));
    }
  }
  openSystem(id, panel) {
    const system = this.registry.systems.get(id);
    const snapshot = system.snapshot();
    panel.replaceChildren();
    this.node("h2", panel, id.toUpperCase() + " SYSTEM");
    this.node("p", panel, "Lifecycle: " + snapshot.state + " · Events: " + snapshot.events, "muted");
    this.node("h3", panel, "Registered operations");
    for (const op of snapshot.operations) this.node("p", panel, op);
    if (id === "uri") this.node("p", panel, system.invoke("create", "music", "tracks", "demo"), "muted");
    if (id === "url") this.node("p", panel, "Maps internal Audial URIs to approved HTTP(S) routes; no external redirects are performed.", "muted");
    if (id === "audio") this.node("p", panel, JSON.stringify(system.invoke("capabilities")), "muted");
    if (id === "plugins") this.node("p", panel, "Manifest inspection only. Third-party code execution and installation are disabled until permission and isolation qualification.", "muted");
    this.registry.runtime.emit("system:opened", { system: id });
  }
  open(id, panel) {
    const app = this.registry.applications.open(id);
    panel.replaceChildren();
    this.node("h2", panel, app.title);
    this.node("p", panel, app.description, "muted");
    if (id === "library" || id === "studio") {
      const input = this.node("input", panel);
      input.type = "file"; input.accept = "audio/*";
      input.setAttribute("aria-label", "Choose local audio file");
      const message = this.node("p", panel, "Select an audio file. It stays in this browser session.", "muted");
      input.addEventListener("change", () => {
        try {
          if (!input.files?.[0]) return;
          const audio = this.registry.audio.load(input.files[0]);
          panel.querySelector("audio")?.remove();
          audio.controls = true;
          panel.append(audio);
          message.textContent = input.files[0].name + " · " + (input.files[0].size / 1048576).toFixed(2) + " MiB";
        } catch (error) { message.textContent = String(error.message); }
      });
    } else if (id === "settings") {
      this.node("p", panel, "Mode: " + this.mode);
      this.node("p", panel, "Recorded runtime events: " + this.registry.runtime.registry.events.length);
      this.node("p", panel, "No accounts, backend or persistent storage are enabled.", "muted");
    } else {
      this.node("p", panel, "Workspace reserved for a future qualified implementation. No remote publishing or account functionality is active.", "muted");
    }
  }
}
export class DesktopSystem extends DisplaySystem { constructor(runtime, systems) { super(runtime, "desktop", systems); } }
export class TabletSystem extends DisplaySystem { constructor(runtime, systems) { super(runtime, "tablet", systems); } }
export class MobileSystem extends DisplaySystem { constructor(runtime, systems) { super(runtime, "mobile", systems); } }
