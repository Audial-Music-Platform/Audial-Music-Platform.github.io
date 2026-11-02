class DisplaySystem {
  constructor(runtime, mode) { this.registry = { runtime, mode, elements: [] }; this.mode = mode; }
  element(tag, text, parent) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    parent.append(node);
    this.registry.elements.push(node);
    return node;
  }
  mount(root) {
    root.replaceChildren();
    const style = this.element("style", "", document.head);
    style.textContent = "*,*::before,*::after{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(ellipse at 70% 15%,#27334a,#10121a 60%);color:#eef2ff;font:16px system-ui,sans-serif}main{max-width:1100px;margin:auto;padding:clamp(24px,6vw,90px)}h1{font-size:clamp(2.5rem,7vw,6rem);letter-spacing:-.05em;margin:20px 0}p{line-height:1.6;color:#bac6d7}.eyebrow{letter-spacing:.2em;text-transform:uppercase;color:#80e4ce}.panel{margin-top:35px;padding:24px;border-radius:20px;background:#ffffff0c;border:1px solid #ffffff24;backdrop-filter:blur(18px)}button{border:1px solid #ffffff50;border-radius:12px;background:#ffffff15;color:white;padding:12px 18px;cursor:pointer}button:hover{background:#ffffff25}.muted{font-size:13px}";
    const main = this.element("main", "", root);
    const eyebrow = this.element("div", "AUDIAL / MUSIC PLATFORM", main); eyebrow.className = "eyebrow";
    this.element("h1", "Sound. Systems. Possibilities.", main);
    this.element("p", "An evolving digital environment for music, artists, sound technology and creative infrastructure.", main);
    const panel = this.element("section", "", main); panel.className = "panel";
    this.element("h2", "Platform foundation · 0.1.0", panel);
    this.element("p", "JavaScript runtime · WebR audit integration · Responsive Web OS", panel);
    const button = this.element("button", "Inspect runtime", panel);
    const output = this.element("p", "", panel); output.className = "muted";
    button.addEventListener("click", () => { const event = this.registry.runtime.emit("runtime:inspect", { mode: this.mode }); output.textContent = "Event #" + event.id + " · " + event.name + " · " + this.mode; });
    this.element("p", "Experimental foundation — music services and account systems are not yet deployed.", main).className = "muted";
  }
}
export class DesktopSystem extends DisplaySystem { constructor(runtime) { super(runtime, "desktop"); } }
export class TabletSystem extends DisplaySystem { constructor(runtime) { super(runtime, "tablet"); } }
export class MobileSystem extends DisplaySystem { constructor(runtime) { super(runtime, "mobile"); } }
