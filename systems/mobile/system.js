import { TabletEnvironment } from "../tablet/system.js";
export class MobileEnvironment extends TabletEnvironment {
  mount(shell) { super.mount(shell); shell.querySelector(".amp-handheld")?.classList.replace("amp-tablet", "amp-mobile"); }
}
