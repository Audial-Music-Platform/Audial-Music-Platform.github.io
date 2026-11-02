import { SystemCore } from "../core.js";
export class SoundSystem extends SystemCore {
  constructor(runtime) {
    super("sound", runtime);
    this.register("sine", (frequency, samples = 128, rate = 48000) => {
      if (!Number.isFinite(frequency) || frequency < 0 || frequency > rate / 2 || !Number.isInteger(samples) || samples < 1 || samples > 48000) throw new RangeError("Invalid oscillator parameters");
      return Float32Array.from({ length: samples }, (_, i) => Math.sin(2 * Math.PI * frequency * i / rate));
    });
  }
}
