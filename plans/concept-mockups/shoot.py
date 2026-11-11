"""Capture a still of each concept mockup and build the contact sheet.

Run from anywhere: `python plans/concept-mockups/shoot.py`. Needs `playwright` (with its
Chromium) and `Pillow`. It serves this folder itself, so nothing else has to be running.

WebGL needs real wall time to draw, so this waits on the page's own `__ready` flag and then
sleeps, instead of using headless Chrome's virtual time budget, which skips the frames.
"""

from __future__ import annotations

import functools
import http.server
import sys
import threading
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
SHOTS = HERE / "shots"
NAMES = ["city", "marble", "desk", "bot", "pc", "trail", "control-room"]
SIZE = (1600, 900)
SETTLE_MS = 3500


def serve() -> int:
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args: object) -> None:
            return

    handler = functools.partial(Quiet, directory=str(HERE))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server.server_address[1]


def title_card(sheet: Image.Image, at: tuple[int, int], tile: tuple[int, int]) -> None:
    """Fill the eighth slot so the sheet says what it is."""
    draw = ImageDraw.Draw(sheet)
    try:
        big = ImageFont.truetype("segoeuib.ttf", 44)
        small = ImageFont.truetype("segoeui.ttf", 22)
    except OSError:
        big = small = ImageFont.load_default()
    x, y = at[0] + 56, at[1] + tile[1] // 2 - 80
    draw.text((x, y), "3D portfolio", font=big, fill=(255, 255, 255))
    draw.text((x, y + 56), "seven concepts", font=big, fill=(255, 180, 84))
    draw.text((x, y + 128), "Rough live mockups in three.js.", font=small, fill=(170, 184, 210))
    draw.text((x, y + 158), "They show the idea, not the final art.", font=small, fill=(170, 184, 210))


def main(only: list[int]) -> int:
    SHOTS.mkdir(exist_ok=True)
    port = serve()
    failed = 0
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"])
        page = browser.new_page(viewport={"width": SIZE[0], "height": SIZE[1]})
        errors: list[str] = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        for i, name in enumerate(NAMES, start=1):
            if only and i not in only:
                continue
            errors.clear()
            page.goto(f"http://127.0.0.1:{port}/index.html?c={i}&shot=1")
            try:
                page.wait_for_function("window.__ready === true", timeout=30000)
            except Exception as exc:  # noqa: BLE001 - report and move on to the next scene
                errors.append(f"never ready: {exc}")
            page.wait_for_timeout(SETTLE_MS)
            png = SHOTS / f"0{i}-{name}.png"
            page.screenshot(path=str(png))
            Image.open(png).convert("RGB").save(png.with_suffix(".jpg"), quality=86, optimize=True)
            png.unlink()
            state = "ok" if not errors else "ERRORS"
            failed += bool(errors)
            print(f"[shoot] {i}/{len(NAMES)} {name}: {state}")
            for e in errors:
                print(f"[shoot]   {e[:300]}")
        browser.close()

    tile = (800, 450)
    sheet = Image.new("RGB", (tile[0] * 2, tile[1] * 4), (10, 12, 18))
    title_card(sheet, (tile[0], tile[1] * 3), tile)
    for i, name in enumerate(NAMES):
        jpg = SHOTS / f"0{i + 1}-{name}.jpg"
        if jpg.exists():
            sheet.paste(Image.open(jpg).resize(tile, Image.LANCZOS), ((i % 2) * tile[0], (i // 2) * tile[1]))
    sheet.save(SHOTS / "contact-sheet.jpg", quality=86, optimize=True)
    print(f"[shoot] contact sheet written, {failed} scene(s) with errors")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main([int(a) for a in sys.argv[1:]]))
