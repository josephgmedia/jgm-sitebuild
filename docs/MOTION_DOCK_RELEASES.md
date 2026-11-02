# Motion Dock releases

Production remains the existing GitHub main branch and Vercel jgm-website project.

- Download page: /plugins
- Signed release feed: /updates/motion-dock/latest.json
- Public installer: /downloads/motion-dock/Motion-Dock-VERSION.zxp
- Legacy update archive: /downloads/motion-dock/Motion-Dock-VERSION.zip

The extension source is in the Motion Dock Codex workspace, separately from this repo.

## Publishing

1. Finish and test the extension. Bump manifest, host hello version, UI and readme.
2. Run work/sign-motiondock.cjs in its workspace. It uses Adobe ZXPSignCmd 4.1.3,
   signs with the private Joseph G Media certificate and a DigiCert timestamp,
   and verifies the ZXP signature. Signing requires network access for timestamping.
3. Run work/publish-motiondock.cjs with the website checkout path. It verifies
   the ZXP, prepares the legacy ZIP, and signs a feed containing hashes and sizes
   for both files. It does not deploy.
4. Review/build the website, commit the new archives/feed, then push main.

Never change bytes at an already published versioned URL. Use a new version.

## Signing credentials

Private credentials live outside Git under Documents/Codex/Release Keys/Motion Dock:
- signing-private.pem signs the update feed. Its public key is pinned in installed panels.
- zxp-signing.p12 and zxp-password.txt sign Adobe ZXP packages.

Keep private backups. Do not commit/upload credentials, regenerate them casually,
or put their values into logs. The ZXP uses a self-signed certificate; this is not
Adobe Marketplace approval or an independently verified publisher identity.

## Updating

From 2.8, Updates > Install downloads the complete signed ZXP and verifies its
hash/size against the RSA-signed feed. An external worker installs the full package,
including META-INF signature metadata. Every installed file and the complete file
list must match the signed package. The publisher verifies Adobe's signature before
the feed is signed. No unsigned modifications to a signed release are introduced.

The worker validates paths, duplicate filenames, symlinks, size limits, bundle ID,
version and the pinned release key. A per-install mutex prevents concurrent updates.
It backs up the full managed installation and rolls back on write/verification errors.
Backup location: %APPDATA%/Motion Dock/updates/backups. Reload panel completes the update.
Real Windows file-lock failure, rollback and resulting Adobe signature are tested.

The existing local computer was upgraded directly to 2.8 using the tested worker.
Other computers on 2.7 need one final ZXP install to acquire the direct updater.
Older unsigned installs can still use the ZIP feed path; future 2.8 updates prefer ZXP.
The legacy ZIP remains in the feed for older clients. It must never be copied over
a signed install using the old client/host/CSXS-only worker.

For local development updates to an existing signed panel, sign a new version and
use the complete signed-package worker. The old development file copier is guarded.

Preferences, saved expressions and ROI Patch Manager records live outside the package.
The public ZXP contains client, host, CSXS, user instructions, licences and its signature.
It contains no CMD installer, vendor JSXBIN/AEX, private credentials or review reports.

## Source review

A technical crop/easing provenance review is in the Motion Dock workspace outputs.
It found no substantial verbatim matches or bundled vendor binaries. Earlier recovered
reference scripts were examined, so this is not a clean-room claim or legal clearance.

## Mobile fonts

Root Vite base and locally hosted fonts repair the old /assets/fonts 404s.
The homepage retains its existing Monument styling. Plugins uses Anybody and Barlow.
