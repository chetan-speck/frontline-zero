# FRONTLINE ZERO

A mobile-first procedural offline FPS built with Three.js and vanilla JavaScript. **Playable release 2**; this is an early playable game, not the completed AAA master specification.

## Play locally

Download `index.html` and open it in a browser that allows local HTML and WebGL. The file embeds Three.js and the game code; no runtime package installation, development server, CDN or backend is required. On Android, save it as `Download/FrontlineZero/index.html`, rotate the phone to landscape, and tap **FULLSCREEN**.

Browser support for Android local-file access, fullscreen, landscape lock and storage varies. Actual Android installation, rendering performance and touch reliability remain unverified.

## Install to the home screen

Serve these files together over HTTPS:

- `index.html`
- `manifest.webmanifest`
- `sw.js`
- `icon-192.png`
- `icon-512.png`

Wait for **Offline files saved**, then select **INSTALL APP** or your browser's **Install app / Add to Home screen** menu. The app manifest requests fullscreen and landscape orientation. The optional service worker caches the game for subsequent offline launches. A `file://` URL cannot install this PWA.

The current private hosted edition is at [frontline-zero-chetan.clearisle.chatgpt.site](https://frontline-zero-chetan.clearisle.chatgpt.site). The local file's **GET INSTALLABLE APP** button opens that address. Change `installURL` in `app-mode.js` if deploying elsewhere.

When publishing changed game files, change the cache version in `sw.js`. Close and reopen the installed app after updates. Browser cache eviction can remove offline files. Local and hosted editions may use separate save storage; transfer progress using Settings → Export Save / Import Save.

## Included

- Five seeded procedural arena themes.
- Team Deathmatch, Free-for-All, Gun Game, Sniper Only, Survival, Training Range and Custom Match.
- Walking, sprinting, jumping, momentum-based bunny hopping, air strafing, crouching, sliding and continuous-ramp stair collision.
- Eight firearms, ADS, sniper scope, recoil, reloads, shotgun pellets, ray-based damage and combat knife.
- Frag, smoke and flash grenades; smoke affects line of sight.
- Grid-navigation bots with perception, short-term memory, strafing and simplified tactical behavior.
- Editable touch HUD, left and right fire buttons, multiple pointer tracking, sensitivity and graphics settings.
- Persistent XP, mastery, loadouts, statistics, saved layouts and save export/import.
- Procedural surface textures, brighter sun/sky contrast, contact shadows, weather, lighting cycle, environmental signage and props, detailed first-person guns, gloves and muzzle flashes.
- Fixed-step simulation, batching, pooled effects and adaptive render resolution.

## Limits

The world is stylized procedural geometry. Bot navigation and tactics are simplified. The full requested weapon roster, advanced vaulting and ladders, ballistic sniper drop, extensive character customization, complete attachment roster, achievements and several other systems from the original specification are not implemented. Custom Match is an adjustable deathmatch variant. The suppressor changes geometry but does not yet simulate sound suppression. Shotgun hit-rate reporting counts pellet hits and can exceed 100%.

Simulation tests do **not** verify WebGL rendering, shader compilation, real mobile multitouch, installed-app behavior, offline relaunch on Android, or sustained FPS. No AAA realism or device performance guarantee is claimed.

## Controls

Touch: move with the left joystick, drag the right-side look region, and use either fire button. Edit, resize and save buttons in **Settings → Edit Touch HUD**.

Desktop: WASD move; mouse look and left click fire; Space jump; Shift sprint; Ctrl crouch; C slide; R reload; Q swap; E ADS; G throw; T grenade type; V knife; F supply; Esc pause.

## Editable source

`game.js` contains the game systems. `shell.html` contains the markup and styles. `app-mode.js` handles fullscreen and optional installation. `vendor/three.min.js` is the bundled classic Three.js r160 build. `index.html` is the committed ready-to-play artifact.

Rebuild using Python 3 (development only):

```sh
python3 tools/build.py
```

This regenerates `index.html` and a ZIP under `releases/`. Neither Python nor Node is required to play the game.

## Development checks

Node 18+ is needed only for the simulation tests. Run from the repository root:

```sh
node --check game.js
node --check app-mode.js
node --check sw.js
node tests/logic-test.cjs
node tests/app-test.cjs
```

The tests use the actual Three.js math/geometry code with a simulated DOM and renderer. They cover deterministic arenas, navigation connectivity, weapons and reloads, movement/collision, throwables, attachments, game modes, victory conditions, independent fire-button release, vertical aim, and app-shell installation/fullscreen branches.

## Third-party notice

Three.js is distributed under the MIT license; see `vendor/LICENSE.three.txt`. No license for the original game code is granted by this repository unless the owner adds one.
