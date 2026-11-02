export class BrowserEnvironment {
  constructor() { this.registry = { userAgent: navigator.userAgent, touch: navigator.maxTouchPoints || 0 }; }
  mode() {
    const width = window.innerWidth;
    return width < 640 ? "mobile" : width < 1024 ? "tablet" : "desktop";
  }
}
