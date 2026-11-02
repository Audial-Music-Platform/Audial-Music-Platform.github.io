import { SystemCore } from "../core.js";
export class URLSystem extends SystemCore {
  constructor(runtime, uriSystem) {
    super("url", runtime);
    this.registry.uri = uriSystem;
    this.registry.routes = new Map();
    this.register("parse", value => this.parse(value));
    this.register("map", (uri, path) => this.map(uri, path));
    this.register("resolve", uri => this.resolve(uri));
  }
  parse(value) {
    if (typeof value !== "string" || value.length > 2048) throw new Error("Invalid URL");
    const parsed = new URL(value, location.origin);
    if (!["https:", "http:"].includes(parsed.protocol) || parsed.username || parsed.password) throw new Error("Unsupported URL");
    return { origin: parsed.origin, pathname: parsed.pathname, canonical: parsed.href };
  }
  map(uri, path) {
    const resource = this.registry.uri.parse(uri);
    if (resource.scheme !== "audial") throw new Error("Internal URI required");
    if (typeof path !== "string" || !/^\/[a-z0-9/_~-]*$/i.test(path) || path.includes("//") || path.split("/").includes("..")) throw new Error("Invalid route");
    const target = new URL(path, location.origin);
    this.registry.routes.set(resource.canonical, target.href);
    this.registry.runtime.emit("url:route-mapped", { uri: resource.canonical, path: target.pathname });
    return target.href;
  }
  resolve(uri) {
    const resource = this.registry.uri.parse(uri);
    return this.registry.routes.get(resource.canonical) ?? null;
  }
}
