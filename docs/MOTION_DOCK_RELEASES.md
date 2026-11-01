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

Signed installations detect META-INF/signatures.xml. They download a feed-verified
ZXP into Downloads/Motion Dock, show it in Explorer, and instruct the user to install
it using a ZXP extension installer and restart AE. They never use in-place ZIP updates.
Both the Node updater and the PowerShell worker refuse ZIP replacement of signed installs.

Existing unsigned local installations can retain the ZIP install/reload flow.
It verifies SHA-256 and backs up replaced client/host/CSXS files under
%APPDATA%/Motion Dock/updates/backups. The legacy ZIP remains available in the feed
so 2.6 updaters continue to work. The website's primary download is the signed ZXP.

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
