# Motion Dock releases

The portfolio remains deployed from `main` to the existing Vercel `jgm-website` project.

- Download page: `/plugins`
- Signed release feed: `/updates/motion-dock/latest.json`
- Immutable ZIPs: `/downloads/motion-dock/Motion-Dock-VERSION.zip`
- The extension source lives separately in the Motion Dock Codex workspace, not in this website repo.

To release an update, finish and test the extension, bump its manifest/host/UI version,
then run `work/publish-motiondock.cjs` from that workspace with this checkout as its
argument. It prepares the ZIP and signed feed; it does not deploy. Commit the generated
release artifacts and push the website `main` branch after reviewing/building.
Never replace an already-published versioned ZIP; use a new version number.

The signing private key is local under `%USERPROFILE%/Documents/Codex/Release Keys/Motion Dock/`.
Keep a private backup. It must never be committed or uploaded. Existing installations pin
the corresponding public key. If the private key is lost, restore it; generating a new key
would require a deliberate manual upgrade on every installation.

The update installer only replaces `client`, `host` and `CSXS`, verifies SHA-256, and backs
up replaced files under `%APPDATA%/Motion Dock/updates/backups`. Local preferences,
expressions and ROI records are outside the release package. Public packages contain
user instructions and font licences, not internal validation logs or user project data.

## Repository cleanup / mobile fonts

The October source cleanup had already removed old skill/tooling folders. This change
removes the only unreachable JS module (`case-study-expand.js`), extracts four unchanged
base64 images from the links page, self-hosts its existing fonts, and excludes local
secret files. Portfolio images remain because both static and Blob-backed project data
can reference them; a filename-only unused-file sweep would delete live gallery content.

The mobile Monument failure was a real 404: a relative Vite base generated
`/assets/fonts/MonumentExtended-*.woff2` while public fonts live at `/fonts/`.
The site now uses a root base, local font assets and static display instances where
needed for WebKit. Existing homepage Monument styling is retained.
