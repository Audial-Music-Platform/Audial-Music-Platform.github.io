import { SystemCore } from "../core.js";
export class URISystem extends SystemCore {
  constructor(runtime) {
    super("uri", runtime);
    this.registry.schemes = new Map([["audial", { description: "Internal Audial resource identifier" }]]);
    this.register("parse", value => this.parse(value));
    this.register("create", (system, resource, id) => this.create(system, resource, id));
    this.register("schemes", () => [...this.registry.schemes.keys()]);
  }
  parse(value) {
    if (typeof value !== "string" || value.length > 2048 || !/^[a-z][a-z0-9+.-]*:/i.test(value)) throw new Error("Invalid URI");
    if (value.toLowerCase().startsWith("audial://") && value.slice(9).split("/").some(segment => segment === "." || segment === "..")) throw new Error("Unsafe path traversal");
    const url = new URL(value);
    if (url.protocol === "audial:") {
      if (url.username || url.password || url.port || url.search || url.hash || !url.hostname || !/^\/[a-z0-9._~%-]+(?:\/[a-z0-9._~%-]+)*$/i.test(url.pathname)) throw new Error("Unsupported Audial URI");
      const segments = url.pathname.split("/").filter(Boolean).map(segment => decodeURIComponent(segment));
      if (segments.some(segment => !/^[a-z0-9._~-]+$/i.test(segment) || segment === "." || segment === "..")) throw new Error("Unsafe Audial URI segment");
      return { scheme: "audial", system: url.hostname, segments, canonical: this.create(url.hostname, ...segments) };
    }
    return { scheme: url.protocol.slice(0,-1), canonical: url.href };
  }
  create(system, ...segments) {
    const all = [system, ...segments];
    if (all.length < 2 || all.some(x => typeof x !== "string" || !/^[a-z0-9][a-z0-9._~-]*$/i.test(x) || x === "." || x === "..")) throw new Error("Invalid resource path");
    return "audial://" + all[0].toLowerCase() + "/" + all.slice(1).map(encodeURIComponent).join("/");
  }
}
