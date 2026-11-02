export class Runtime {
  constructor() {
    this.registry = { objects: new Map(), events: [], listeners: new Map(), sequence: 0 };
  }
  register(name, object) {
    if (this.registry.objects.has(name)) throw new Error("Duplicate object: " + name);
    this.registry.objects.set(name, object);
    this.emit("object:registered", { name });
    return object;
  }
  on(name, fn) {
    const handlers = this.registry.listeners.get(name) || [];
    handlers.push(fn);
    this.registry.listeners.set(name, handlers);
  }
  emit(name, detail = {}) {
    const event = { id: ++this.registry.sequence, name, detail, at: new Date().toISOString() };
    this.registry.events.push(event);
    if (this.registry.events.length > 500) this.registry.events.shift();
    for (const fn of this.registry.listeners.get(name) || []) fn(event);
    return event;
  }
}
