import { SystemCore } from "../core.js";
export class AudioSystem extends SystemCore {
  constructor(runtime) {
    super("audio", runtime);
    this.registry.context = null;
    this.register("capabilities", () => ({ audioContext: !!(window.AudioContext || window.webkitAudioContext), mediaDevices: !!navigator.mediaDevices, mediaRecorder: !!window.MediaRecorder }));
    this.register("resume", async () => {
      if (!this.registry.context) this.registry.context = new (window.AudioContext || window.webkitAudioContext)();
      await this.registry.context.resume();
      return this.registry.context.state;
    });
  }
}
