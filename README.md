# NEXUS PC

NEXUS PC is a browser-based desktop shell for managing cloud-backed files and locally executed Windows applications.

## Current scope

This first version is a front-end prototype:
- Desktop shell with taskbar and Start menu
- App launcher and file explorer mock interface
- Window open, minimize, maximize, and close interactions
- Responsive browser layout

## Architecture note

A browser cannot directly execute native Windows applications such as Bambu Studio. The planned PC Runner will be a separate, locally executed Windows component. It will later handle approved app launches, local cache, and synchronization with Supabase.

The runner, secure pairing, storage policies, and app installation workflow are not implemented yet.

## Run locally

Open `index.html` in a modern browser, or serve this folder with a static web server.

## Planned next phases

1. Connect metadata and settings to the dedicated Supabase project.
2. Define private storage buckets and access policies.
3. Build the Windows PC Runner with explicit allowlisted actions.
4. Add managed application manifests, downloads, cache, and updates.
5. Integrate Bambu Studio after validating the runner and the target PC's capabilities.
