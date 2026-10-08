# Helix Compute Website

Public static website for Helix Compute Systems.

The homepage presents Helix through a simple principle: do more with less data
by preserving what remains valid and processing what changed.

State Field V2 is a first-party, client-side conceptual playback. Its sparse,
dense, and tampered scenes use illustrative work units and do not call a live
service, run a benchmark, or depict private Core topology. Measured results
remain separate and link to the public Helix evidence repository.

The site stays deliberately static and dependency-free:

- `style.css` owns the established site and brand system;
- `state-field-v2.css` owns the namespaced interactive presentation;
- `state-field-v2.js` owns playback, controls, and accessible state;
- `state-field-v2-visualization.js` owns decorative Canvas rendering.

## Local check

Serve this directory over HTTP so ES modules load under normal browser rules.
The public homepage has no Render dependency and accepts no visitor data.
