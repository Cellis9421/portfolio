"""Cut the site's screenshots down to the size a gallery card shows them.

Run from the repo root: `python prototypes/build-assets.py`. Needs `Pillow`. It reads
`public/img/screenshots` and writes `prototypes/site/assets/shots`: 4.5 MB of PNG becomes
well under 1 MB of WebP.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent


def main() -> None:
    out = HERE / "site" / "assets" / "shots"
    out.mkdir(parents=True, exist_ok=True)
    for src in sorted((HERE.parent / "public" / "img" / "screenshots").glob("*.png")):
        im = Image.open(src).convert("RGB")
        k = max(640 / im.width, 330 / im.height)
        im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS).crop((0, 0, 640, 330))
        im.save(out / f"{src.stem}.webp", quality=80, method=6)
    cut = list(out.iterdir())
    print(f"[assets] site/assets/shots  {len(cut)} files, {sum(f.stat().st_size for f in cut) // 1024} KB")


if __name__ == "__main__":
    main()
