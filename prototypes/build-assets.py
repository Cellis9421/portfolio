"""Build the small images the prototype loads.

Run from the repo root: `python prototypes/build-assets.py`. Needs `Pillow`. It downloads
the wood once into a cache folder outside the repo, then writes the processed files.
The wood is CC0, so it needs no credit line.

| Output | Source |
|---|---|
| site/assets/wood.jpg | Poly Haven texture `american_walnut_veneer` |
| site/assets/shots/*.webp | the site's own `public/img/screenshots`, cut to the gallery card |
"""

from __future__ import annotations

import tempfile
import urllib.request
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
CACHE = Path(tempfile.gettempdir()) / "portfolio-asset-cache"
PH = "https://dl.polyhaven.org/file/ph-assets"
SOURCES = {
    "wood_diff.jpg": f"{PH}/Textures/jpg/1k/american_walnut_veneer/american_walnut_veneer_diff_1k.jpg",
}


def fetch(name: str) -> Path:
    CACHE.mkdir(exist_ok=True)
    path = CACHE / name
    if not path.exists():
        print(f"[assets] downloading {name}")
        req = urllib.request.Request(SOURCES[name], headers={"User-Agent": "portfolio-prototype-assets"})
        with urllib.request.urlopen(req, timeout=300) as r:
            path.write_bytes(r.read())
    return path


def plain(source: str, out: Path, size: int, quality: int = 84) -> None:
    Image.open(fetch(source)).convert("RGB").resize((size, size), Image.LANCZOS).save(out, quality=quality, optimize=True)


def shots() -> None:
    """The gallery's screenshots at the size a card shows them: 4.5 MB of PNG becomes well under 1 MB."""
    out = HERE / "site" / "assets" / "shots"
    out.mkdir(exist_ok=True)
    for src in sorted((HERE.parent / "public" / "img" / "screenshots").glob("*.png")):
        im = Image.open(src).convert("RGB")
        k = max(640 / im.width, 330 / im.height)
        im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS).crop((0, 0, 640, 330))
        im.save(out / f"{src.stem}.webp", quality=80, method=6)


def main() -> None:
    (HERE / "site" / "assets").mkdir(exist_ok=True)
    plain("wood_diff.jpg", HERE / "site" / "assets" / "wood.jpg", 512)
    shots()
    for f in sorted((HERE / "site" / "assets").iterdir()):
        if f.is_file():
            print(f"[assets] {f.relative_to(HERE)}  {f.stat().st_size // 1024} KB")
    cut = list((HERE / "site" / "assets" / "shots").iterdir())
    print(f"[assets] site/assets/shots  {len(cut)} files, {sum(f.stat().st_size for f in cut) // 1024} KB")


if __name__ == "__main__":
    main()
