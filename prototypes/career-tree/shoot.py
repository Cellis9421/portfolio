"""Capture stills and a short scrub of the career tree prototype.

Run from anywhere: `python prototypes/career-tree/shoot.py`. Needs `playwright` (with its
Chromium) and `Pillow`. It serves this folder itself.

`python shoot.py stills` skips the animation. WebGL needs real wall time to draw, so this
waits on the page's own `__ready` flag and then sleeps between frames.
"""

from __future__ import annotations

import functools
import http.server
import io
import sys
import threading
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
SHOTS = HERE / "shots"
SIZE = (1600, 900)
# name, year
STOPS = [("2010", 2010.4), ("2014", 2014.6), ("2019", 2019.6), ("now", 2026.9)]
Y0, Y1 = 2009.0, 2026.9
SCRUB_FRAMES = 44


def serve() -> int:
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args: object) -> None:
            return

    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=str(HERE)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server.server_address[1]


def main(stills_only: bool) -> int:
    SHOTS.mkdir(exist_ok=True)
    port = serve()
    errors: list[str] = []
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"])
        page = browser.new_page(viewport={"width": SIZE[0], "height": SIZE[1]})
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.goto(f"http://127.0.0.1:{port}/index.html?shot=1")
        try:
            page.wait_for_function("window.__ready === true", timeout=60000)
        except Exception as exc:  # noqa: BLE001 - report it and still try to capture
            errors.append(f"never ready: {exc}")
        page.wait_for_timeout(1500)

        tiles = []
        for name, year in STOPS:
            page.evaluate("g => window.__setG(g)", (year - Y0) / (Y1 - Y0))
            page.wait_for_timeout(1400)
            shot = Image.open(io.BytesIO(page.screenshot())).convert("RGB")
            shot.save(SHOTS / f"{name}.jpg", quality=88, optimize=True)
            tiles.append(shot.resize((800, 450), Image.LANCZOS))
            print(f"[shoot] still {name}: ok")
        sheet = Image.new("RGB", (1600, 900))
        for i, tile in enumerate(tiles):
            sheet.paste(tile, ((i % 2) * 800, (i // 2) * 450))
        sheet.save(SHOTS / "four-years.jpg", quality=86, optimize=True)

        if not stills_only:
            frames = []
            for i in range(SCRUB_FRAMES):
                page.evaluate("g => window.__setG(g)", i / (SCRUB_FRAMES - 1))
                page.wait_for_timeout(260)
                frames.append(Image.open(io.BytesIO(page.screenshot())).convert("RGB").resize((720, 405), Image.LANCZOS))
            hold = [frames[-1]] * 10
            frames[0].save(SHOTS / "scrub.webp", save_all=True, append_images=frames[1:] + hold, duration=110, loop=0, quality=72, method=4)
            print(f"[shoot] scrub: {len(frames)} frames")
        browser.close()
    for e in errors:
        print(f"[shoot] ERROR {e[:400]}")
    print(f"[shoot] done, {len(errors)} error(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main("stills" in sys.argv[1:]))
