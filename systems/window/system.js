export class WindowSystem {
  constructor(runtime, host) {
    this.registry = { runtime, host, windows: new Map(), z: 10, drag: null };
  }
  open(id, title, render) {
    if (this.registry.windows.has(id)) {
      const existing = this.registry.windows.get(id);
      existing.hidden = false;
      this.focus(id);
      return existing;
    }
    const win = document.createElement("section");
    win.className = "amp-window";
    win.setAttribute("aria-label", title);
    win.style.left = (45 + this.registry.windows.size * 28) + "px";
    win.style.top = (55 + this.registry.windows.size * 28) + "px";
    const bar = document.createElement("header");
    bar.className = "amp-window-bar";
    const label = document.createElement("strong");
    label.textContent = title;
    const actions = document.createElement("div");
    for (const [text, action] of [["−", () => { win.hidden = true; this.registry.runtime.emit("window:minimized", {id}); }], ["□", () => win.classList.toggle("maximized")], ["×", () => this.close(id)]]) {
      const button = document.createElement("button");
      button.textContent = text;
      button.setAttribute("aria-label", text === "−" ? "Minimize" : text === "□" ? "Maximize" : "Close");
      button.addEventListener("click", action);
      actions.append(button);
    }
    bar.append(label, actions);
    const content = document.createElement("div");
    content.className = "amp-window-content";
    win.append(bar, content);
    this.registry.host.append(win);
    this.registry.windows.set(id, win);
    win.addEventListener("pointerdown", () => this.focus(id));
    bar.addEventListener("pointerdown", event => {
      if (event.target.closest("button") || win.classList.contains("maximized")) return;
      this.registry.drag = { win, pointerId: event.pointerId, x: event.clientX - win.offsetLeft, y: event.clientY - win.offsetTop };
      bar.setPointerCapture(event.pointerId);
    });
    bar.addEventListener("pointermove", event => {
      const drag = this.registry.drag;
      if (!drag || drag.win !== win || drag.pointerId !== event.pointerId) return;
      win.style.left = Math.max(0, Math.min(this.registry.host.clientWidth - 80, event.clientX - drag.x)) + "px";
      win.style.top = Math.max(0, Math.min(this.registry.host.clientHeight - 40, event.clientY - drag.y)) + "px";
    });
    for (const type of ["pointerup", "pointercancel"]) bar.addEventListener(type, () => { this.registry.drag = null; });
    this.focus(id);
    render(content);
    this.registry.runtime.emit("window:opened", {id});
    return win;
  }
  focus(id) {
    const win = this.registry.windows.get(id);
    if (win) { win.style.zIndex = String(++this.registry.z); this.registry.runtime.emit("window:focused", {id}); }
  }
  close(id) {
    this.registry.windows.get(id)?.remove();
    this.registry.windows.delete(id);
    this.registry.runtime.emit("window:closed", {id});
  }
}
