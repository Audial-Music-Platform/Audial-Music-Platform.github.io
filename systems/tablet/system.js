export class TabletEnvironment {
  constructor(display) { this.registry = { display, stack: [], recent: false }; }
  mount(shell) {
    const view = this.registry.display.node("section", shell, "", "amp-handheld amp-tablet");
    const screen = this.registry.display.node("main", view, "", "amp-handheld-screen");
    const nav = this.registry.display.node("nav", view, "", "amp-android-nav");
    const back = this.registry.display.node("button", nav, "‹");
    back.setAttribute("aria-label", "Back");
    const home = this.registry.display.node("button", nav, "●");
    home.setAttribute("aria-label", "Home");
    const recent = this.registry.display.node("button", nav, "▢");
    recent.setAttribute("aria-label", "Recent applications");
    const showHome = () => {
      this.registry.recent = false;
      screen.replaceChildren();
      this.registry.display.home(screen);
      const entries = [...this.registry.display.registry.systems.all().map(x => ({id:"system:"+x.name,title:x.name.toUpperCase()+" SYSTEM"})), ...this.registry.display.registry.applications.all().map(x => ({id:"app:"+x.id,title:x.title}))];
      const launch = this.registry.display.node("div", screen, "", "tiles");
      for (const item of entries) {
        const button = this.registry.display.node("button", launch, item.title, "tile");
        button.addEventListener("click", () => this.open(item.id, screen));
      }
    };
    back.addEventListener("click", () => { if (this.registry.recent) return showHome(); this.registry.stack.pop(); const previous = this.registry.stack.pop(); previous ? this.open(previous, screen) : showHome(); });
    home.addEventListener("click", showHome);
    recent.addEventListener("click", () => {
      this.registry.recent = true;
      screen.replaceChildren();
      this.registry.display.node("h2", screen, "Recent applications");
      for (const id of [...new Set(this.registry.stack)].reverse()) {
        const card = this.registry.display.node("div", screen, "", "amp-recent-card");
        const launch = this.registry.display.node("button", card, id.replace("system:","").replace("app:",""));
        launch.addEventListener("click", () => { this.registry.stack = this.registry.stack.filter(x => x !== id); this.open(id, screen); });
        const close = this.registry.display.node("button", card, "×");
        close.setAttribute("aria-label", "Close recent application");
        close.addEventListener("click", () => { this.registry.stack = this.registry.stack.filter(x => x !== id); card.remove(); });
      }
    });
    showHome();
  }
  open(id, screen) {
    this.registry.recent = false;
    this.registry.stack.push(id);
    if (id.startsWith("system:")) this.registry.display.openSystem(id.slice(7), screen);
    else this.registry.display.open(id.slice(4), screen);
    this.registry.display.registry.runtime.emit("handheld:opened", {id});
  }
}
