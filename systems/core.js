export class SystemCore {
  constructor(name, runtime) {
    this.registry = { name, runtime, state: "created", functions: new Map(), children: new Map(), events: [], attributes: new Map() };
    this.transition("ready");
  }
  transition(state) {
    this.registry.state = state;
    const event = this.registry.runtime.emit("system:lifecycle", { system: this.registry.name, state });
    this.registry.events.push(event);
    return event;
  }
  register(name, operation) {
    if (this.registry.functions.has(name)) throw new Error("Duplicate operation");
    this.registry.functions.set(name, operation);
  }
  invoke(name, ...args) {
    const fn = this.registry.functions.get(name);
    if (!fn) throw new Error("Operation unavailable");
    this.registry.runtime.emit("system:invoke", { system: this.registry.name, operation: name });
    return fn(...args);
  }
  snapshot() {
    return { name: this.registry.name, state: this.registry.state, operations: [...this.registry.functions.keys()], events: this.registry.events.length };
  }
}
