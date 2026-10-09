#!/usr/bin/env python3
"""Rebuild the self-contained offline HTML from the editable sources."""
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parents[1]
html = (ROOT / 'shell.html').read_text(encoding='utf-8')
for marker, source in [('__THREE__', 'vendor/three.min.js'), ('__SKY__', 'vendor/Sky.js'), ('__GRAPHICS__', 'graphics.js'), ('__GAME__', 'game.js'), ('__APP__', 'app-mode.js')]:
    html = html.replace(marker, (ROOT / source).read_text(encoding='utf-8'))
(ROOT / 'index.html').write_text(html, encoding='utf-8')
release = ROOT / 'releases'
release.mkdir(exist_ok=True)
with zipfile.ZipFile(release / 'FrontlineZero-installable.zip', 'w', zipfile.ZIP_DEFLATED) as bundle:
    for name in ['index.html', 'manifest.webmanifest', 'sw.js', 'icon-192.png', 'icon-512.png', 'INSTALL.txt']:
        bundle.write(ROOT / name, 'FrontlineZero/' + name)
print('Built index.html and releases/FrontlineZero-installable.zip')
