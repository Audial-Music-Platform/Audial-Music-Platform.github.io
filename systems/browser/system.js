import { SystemCore } from "../core.js";
export class BrowserSystem extends SystemCore {
  constructor(runtime) {
    super("browser", runtime);
    this.registry.details = this.detect();
    this.register("detect", () => ({...this.registry.details}));
    this.register("features", () => this.features());
    this.register("open", value => this.open(value));
  }
  detect() {
    const ua = navigator.userAgent;
    const browser = /Firefox\//.test(ua) ? "Firefox" : /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "Other";
    const os = /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iOS/iPadOS" : /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "Other";
    return { browser, os, touch: navigator.maxTouchPoints > 0, width: window.innerWidth, height: window.innerHeight };
  }
  features() { return { webAudio: !!(window.AudioContext || window.webkitAudioContext), webGPU: !!navigator.gpu, webBluetooth: !!navigator.bluetooth, webUSB: !!navigator.usb, webAssembly: typeof WebAssembly !== "undefined" }; }
  open(value) {
    const url = new URL(value, location.href);
    if (!["https:","http:"].includes(url.protocol) || url.username || url.password) throw new Error("Unsupported browser URL");
    this.registry.runtime.emit("browser:navigate-requested", {origin:url.origin});
    return url.href; // Deliberately does not navigate without explicit UI confirmation.
  }
}
