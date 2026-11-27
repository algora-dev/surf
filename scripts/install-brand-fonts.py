#!/usr/bin/env python3
"""Install the owner's licensed webfonts from their original ZIP; no third-party packages."""
import argparse
from pathlib import Path, PurePosixPath
from zipfile import ZipFile

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('archive', type=Path)
parser.add_argument('--licensed', action='store_true', help='Confirm web embedding/deployment rights have been checked')
args = parser.parse_args()
if not args.licensed:
    parser.error('Confirm web embedding rights first, then pass --licensed.')
root = Path(__file__).resolve().parents[1]
fonts = root / 'public/brand/fonts'
css = root / 'src/styles/fonts.local.css'
files = [
    ('SFC Bearwood.woff2', 'sfc-bearwood.woff2', 'SFC Bearwood', 'woff2', 'normal', b'wOF2'),
    ('SFC Woster Sans.woff2', 'sfc-woster-sans.woff2', 'SFC Woster Sans', 'woff2', 'normal', b'wOF2'),
    ('Aciella Script Italic.otf', 'aciella-script-italic.otf', 'Aciella Script', 'opentype', 'italic', b'OTTO'),
]
faces = []
validated = []
with ZipFile(args.archive) as archive:
    for source, target, family, fmt, style, signature in files:
        matches = [n for n in archive.namelist() if PurePosixPath(n).name == source and not n.startswith('__MACOSX/')]
        if len(matches) != 1:
            raise SystemExit(f'Expected exactly one {source}, found {len(matches)}')
        payload = archive.read(matches[0])
        if not payload.startswith(signature):
            raise SystemExit(f'Invalid font signature: {source}')
        validated.append((target, payload))
        faces.append(f'@font-face {{ font-family: "{family}"; src: url("/brand/fonts/{target}") format("{fmt}"); font-style: {style}; font-weight: 400; font-display: swap; }}')
fonts.mkdir(parents=True, exist_ok=True)
for target, payload in validated:
    (fonts / target).write_bytes(payload)
css.write_text('/* Generated from the owner-supplied licensed fonts. */\n'+'\n'.join(faces)+'\n', encoding='utf-8')
print('Installed brand fonts and activated their CSS. Ensure these files are present in the deployment build environment.')
