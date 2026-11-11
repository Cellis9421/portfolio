"""Build the small textures the prototypes use from free photo scans.

Run from the repo root: `python prototypes/build-assets.py`. Needs `Pillow`. It downloads
the sources once into a cache folder outside the repo, then writes the processed files.
Every source is CC0, so nothing here needs a credit line.

| Output | Source |
|---|---|
| career-tree/assets/sky.jpg | Poly Haven HDRI `meadow_2`, tone-mapped panorama |
| career-tree/assets/bark.jpg, bark_n.jpg | Poly Haven texture `bark_brown_02` |
| career-tree/assets/sprig.webp | ambientCG `LeafSet024`, leaves arranged on a drawn twig |
| career-tree/assets/grass.webp | ambientCG `Foliage001`, blades arranged in a clump |
| site/assets/wood.jpg | Poly Haven texture `american_walnut_veneer` |
| site/assets/shots/*.webp | the site's own `public/img/screenshots`, cut to the gallery card |
"""

from __future__ import annotations

import io
import math
import random
import tempfile
import urllib.request
import zipfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageStat

HERE = Path(__file__).resolve().parent
CACHE = Path(tempfile.gettempdir()) / "portfolio-asset-cache"
PH = "https://dl.polyhaven.org/file/ph-assets"
SOURCES = {
    "meadow_2.jpg": f"{PH}/HDRIs/extra/Tonemapped%20JPG/meadow_2.jpg",
    "bark_diff.jpg": f"{PH}/Textures/jpg/1k/bark_brown_02/bark_brown_02_diff_1k.jpg",
    "bark_nor.jpg": f"{PH}/Textures/jpg/1k/bark_brown_02/bark_brown_02_nor_gl_1k.jpg",
    "wood_diff.jpg": f"{PH}/Textures/jpg/1k/american_walnut_veneer/american_walnut_veneer_diff_1k.jpg",
    "LeafSet024.zip": "https://ambientcg.com/get?file=LeafSet024_1K-JPG.zip",
    "Foliage001.zip": "https://ambientcg.com/get?file=Foliage001_1K-JPG.zip",
}
Image.MAX_IMAGE_PIXELS = None
random.seed(11)


def fetch(name: str) -> Path:
    CACHE.mkdir(exist_ok=True)
    path = CACHE / name
    if not path.exists():
        print(f"[assets] downloading {name}")
        req = urllib.request.Request(SOURCES[name], headers={"User-Agent": "portfolio-prototype-assets"})
        with urllib.request.urlopen(req, timeout=300) as r:
            path.write_bytes(r.read())
    return path


def scan(zip_name: str, asset: str) -> Image.Image:
    """An ambientCG atlas as one RGBA image: its colour map with its opacity map as alpha."""
    with zipfile.ZipFile(fetch(zip_name)) as z:
        colour = Image.open(io.BytesIO(z.read(f"{asset}_1K-JPG_Color.jpg"))).convert("RGB")
        alpha = Image.open(io.BytesIO(z.read(f"{asset}_1K-JPG_Opacity.jpg"))).convert("L")
    colour.putalpha(alpha)
    return colour


def pieces(atlas: Image.Image, min_area: int) -> list[Image.Image]:
    """Cut an atlas into its separate leaves or blades by flood-filling the alpha."""
    alpha = atlas.getchannel("A").point(lambda v: 255 if v > 90 else 0)
    w, h = alpha.size
    px = alpha.load()
    seen = [[False] * w for _ in range(h)]
    found = []
    for y0 in range(0, h, 4):
        for x0 in range(0, w, 4):
            if px[x0, y0] == 0 or seen[y0][x0]:
                continue
            stack, box = [(x0, y0)], [x0, y0, x0, y0]
            seen[y0][x0] = True
            n = 0
            while stack:
                x, y = stack.pop()
                n += 1
                box = [min(box[0], x), min(box[1], y), max(box[2], x), max(box[3], y)]
                for dx, dy in ((2, 0), (-2, 0), (0, 2), (0, -2)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx] and px[nx, ny]:
                        seen[ny][nx] = True
                        stack.append((nx, ny))
            if n * 4 >= min_area:
                found.append(atlas.crop((box[0], box[1], box[2] + 1, box[3] + 1)))
    return found


def stamp(canvas: Image.Image, piece: Image.Image, at: tuple[float, float], angle: float, length: float, shade: float) -> None:
    """Paste a piece so the middle of its bottom edge sits at `at`, turned by `angle` degrees clockwise from straight up."""
    k = length / piece.height
    leaf = piece.resize((max(1, round(piece.width * k)), max(1, round(length))), Image.LANCZOS)
    rgb = ImageEnhance.Brightness(leaf.convert("RGB")).enhance(shade)
    rgb.putalpha(leaf.getchannel("A"))
    side = int(2 * length + 8)
    pad = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    pad.paste(rgb, (side // 2 - rgb.width // 2, side // 2 - rgb.height))  # base at the centre
    pad = pad.rotate(-angle, resample=Image.BICUBIC)
    canvas.alpha_composite(pad, (round(at[0] - side / 2), round(at[1] - side / 2)))


def bleed(img: Image.Image, colour: tuple[int, int, int]) -> Image.Image:
    """Give the transparent pixels the foliage colour, so a shrunken copy has no dark fringe."""
    base = Image.new("RGBA", img.size, (*colour, 255))
    base.alpha_composite(img)
    base.putalpha(img.getchannel("A"))
    return base


def sprig() -> None:
    leaves = [p for p in pieces(scan("LeafSet024.zip", "LeafSet024"), 9000)][:7]
    size = 900
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    stem = [(size / 2 + math.sin(t * 2.2) * 26, size - 14 - t * (size - 150)) for t in [i / 40 for i in range(41)]]
    ImageDraw.Draw(canvas).line(stem, fill=(92, 84, 52, 255), width=9, joint="curve")
    for i in range(12):
        t = 0.1 + 0.8 * i / 11
        x, y = stem[round(t * 40)]
        side = 1 if i % 2 else -1
        stamp(canvas, leaves[i % len(leaves)], (x, y), side * (62 - 22 * t) + random.uniform(-9, 9), 300 * (1 - 0.38 * t) * random.uniform(0.88, 1.08), random.uniform(0.84, 1.1))
    stamp(canvas, leaves[2], stem[-1], random.uniform(-8, 8), 230, 1.04)
    out = bleed(canvas, (86, 128, 52)).resize((512, 512), Image.LANCZOS)
    out.save(HERE / "career-tree" / "assets" / "sprig.webp", quality=88, method=6)


def grass() -> None:
    blades = [p for p in pieces(scan("Foliage001.zip", "Foliage001"), 2500) if p.height > 500][:8]
    w, h = 640, 720
    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    for i in range(9):
        angle = (i - 4) * 9 + random.uniform(-5, 5)
        stamp(canvas, blades[i % len(blades)], (w / 2 + (i - 4) * 16, h - 4), angle, h * random.uniform(0.62, 0.97), random.uniform(0.9, 1.25))
    out = bleed(canvas, (88, 132, 48)).resize((384, 432), Image.LANCZOS)
    out.save(HERE / "career-tree" / "assets" / "grass.webp", quality=86, method=6)


def sky() -> None:
    pano = Image.open(fetch("meadow_2.jpg"))
    pano.draft("RGB", (4096, 2048))
    pano = pano.convert("RGB").resize((2048, 1024), Image.LANCZOS)
    small = pano.resize((512, 256), Image.BILINEAR).convert("L").filter(ImageFilter.GaussianBlur(6))
    top = max(range(512 * 128), key=small.getdata().__getitem__)  # brightest point above the horizon: the sun
    haze = ImageStat.Stat(pano.crop((0, 500, 2048, 530))).mean
    turf = ImageStat.Stat(pano.crop((0, 640, 2048, 900))).mean
    soft = ImageEnhance.Color(pano.filter(ImageFilter.GaussianBlur(5))).enhance(1.08)
    soft.save(HERE / "career-tree" / "assets" / "sky.jpg", quality=82, optimize=True)
    print(f"[assets] sky: sun at u={top % 512 / 512:.3f} v={1 - top // 512 / 256:.3f}, haze rgb={[round(c) for c in haze]}, turf rgb={[round(c) for c in turf]}")


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
    (HERE / "career-tree" / "assets").mkdir(exist_ok=True)
    (HERE / "site" / "assets").mkdir(exist_ok=True)
    sky()
    plain("bark_diff.jpg", HERE / "career-tree" / "assets" / "bark.jpg", 512)
    plain("bark_nor.jpg", HERE / "career-tree" / "assets" / "bark_n.jpg", 512, 88)
    plain("wood_diff.jpg", HERE / "site" / "assets" / "wood.jpg", 512)
    sprig()
    grass()
    shots()
    for f in sorted([*(HERE / "career-tree" / "assets").iterdir(), *(HERE / "site" / "assets").iterdir()]):
        if f.is_file():
            print(f"[assets] {f.relative_to(HERE)}  {f.stat().st_size // 1024} KB")
    cut = list((HERE / "site" / "assets" / "shots").iterdir())
    print(f"[assets] site/assets/shots  {len(cut)} files, {sum(f.stat().st_size for f in cut) // 1024} KB")


if __name__ == "__main__":
    main()
