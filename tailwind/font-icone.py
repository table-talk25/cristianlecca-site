"""Rigenera assets/fonts/material-symbols-outlined.woff2 con le sole icone usate dal sito.

Uso (dalla cartella tailwind/):
    npm install                       # scarica material-symbols (devDependency)
    pip install fonttools brotli
    python3 font-icone.py

Cerca i nomi delle icone nelle pagine e negli script (testo dentro gli elementi
material-symbols-outlined e stringhe tra apici), tiene solo i glifi di quelle icone
e le legature che li producono. Va rilanciato quando si usa un'icona nuova.
"""
import glob, os, re, subprocess
from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FULL = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'node_modules/material-symbols/material-symbols-outlined.woff2')
OUT = os.path.join(ROOT, 'assets/fonts/material-symbols-outlined.woff2')

font = TTFont(FULL)
rev = {g: chr(c) for c, g in font.getBestCmap().items()}
ligature = {}
for lk in font['GSUB'].table.LookupList.Lookup:
    for st in lk.SubTable:
        t = st.ExtSubTable if lk.LookupType == 7 else st
        for first, ligs in getattr(t, 'ligatures', {}).items():
            for L in ligs:
                try:
                    ligature[''.join(rev[g] for g in [first] + L.Component)] = L.LigGlyph
                except KeyError:
                    pass

nomi = set()
for p in glob.glob(ROOT + '/**/*', recursive=True):
    if '/node_modules/' in p or '/.git/' in p or not p.endswith(('.html', '.js')):
        continue
    s = open(p, encoding='utf-8', errors='ignore').read()
    nomi |= set(re.findall(r'material-symbols-outlined[^>]*>\s*([a-z0-9_]+)\s*<', s))
    nomi |= set(re.findall(r"['\"]([a-z][a-z0-9_]{1,40})['\"]", s))
    nomi |= set(re.findall(r'>\s*([a-z][a-z0-9_]{1,40})\s*<', s))
glifi = sorted({ligature[n] for n in nomi if n in ligature})
print('icone trovate:', len(glifi))
subprocess.run(['pyftsubset', FULL, '--text=abcdefghijklmnopqrstuvwxyz0123456789_ ', '--glyphs=' + ','.join(glifi),
                '--layout-features=liga,rlig,calt,ccmp', '--no-layout-closure', '--flavor=woff2',
                '--output-file=' + OUT], check=True)
print('scritto', OUT, os.path.getsize(OUT), 'byte')
