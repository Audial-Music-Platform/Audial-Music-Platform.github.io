# Audial Music Platform
Version 0.1.0 — experimental foundation.

Public GitHub Pages entry: index.html loads index.js; index.js initializes the JavaScript class registry, responsive display and WebR bridge to index.R. HTML and styling are generated at runtime. No backend, accounts, uploads or copyrighted music are included.

## Qualification
Source scaffold only. GitHub Pages publication, WebR browser loading, accessibility, device support and regression testing require separate verification. WebR uses a pinned-version follow-up before production qualification.

## Version 0.2.0 — Music Web OS foundation
Six registered applications: Music Library, Audio Studio, Artists, Releases, Events, Settings. Local audio playback uses object URLs and does not upload files. The event registry tracks application openings and audio loading. Desktop/tablet/mobile modes are responsive, with shared application state. Artists, Releases and Events are explicitly placeholders, not functional services. Browser smoke tests and accessibility review are required before production qualification.

## Version 0.3.0 — independent system boundaries
Five independent SystemCore-derived class instances: Plugin, Library, Sound, Audio and Music. Each has its own nested registry, operations, lifecycle, events and state. The central SystemRegistry registers each with the runtime. Plugin manifests are inspected as inert metadata only; untrusted code execution, permissions and installation are intentionally not implemented. Library and Music are in-memory prototypes; Sound supports a bounded sine sample generator; Audio reports capabilities and can resume an AudioContext only on invocation. No persistent accounts, remote services or recordings are enabled. Experimental, pending browser and security qualification.
