"""Capture a still of each section of the sectioned prototype, and one sheet of all of them.

Run from anywhere: `python prototypes/site/shoot.py`. Needs `playwright` (with its Chromium)
and `Pillow`. It serves the repo root itself, because the page reads the site's own
screenshots from `public/`. WebGL needs real wall time to draw, so this waits on each
canvas's own ready mark and then sleeps.
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
ROOT = HERE.parent.parent
SHOTS = HERE / "shots"
SIZE = (1600, 900)
# section id, file name, what to do before the picture
SECTIONS = [
    ("about", "01-about", None),
    ("projects", "02-projects", "window.__demo.pick(9)"),
    ("skills", "03-skills", "window.__demo.skill('TypeScript')"),
    ("work", "04-work", None),
    ("writing", "05-guides", "window.__demo.book(0)"),
]


def serve() -> int:
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args: object) -> None:
            return

    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=str(ROOT)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server.server_address[1]


def main(only: list[str]) -> int:
    SHOTS.mkdir(exist_ok=True)
    port = serve()
    errors: list[str] = []
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"])
        page = browser.new_page(viewport={"width": SIZE[0], "height": SIZE[1]})
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.goto(f"http://127.0.0.1:{port}/prototypes/site/index.html")
        page.wait_for_function("window.__loaded === true", timeout=60000)
        for sid, name, act in SECTIONS:
            if only and sid not in only:
                continue
            page.evaluate("id => document.getElementById(id).scrollIntoView({ behavior: 'instant' })", sid)
            try:
                page.wait_for_function(
                    "id => { const c = document.querySelector(`#${id} canvas`); return !c || c.dataset.ready === '1'; }", arg=sid, timeout=30000
                )
            except Exception as exc:  # noqa: BLE001 - report it and still take the picture
                errors.append(f"{sid} never ready: {exc}")
            page.wait_for_timeout(5000 if sid == "work" else 2600)
            if act:
                page.evaluate(act)
                page.wait_for_timeout(2600)
            Image.open(io.BytesIO(page.screenshot())).convert("RGB").save(SHOTS / f"{name}.jpg", quality=86, optimize=True)
            print(f"[shoot] {sid}: ok")
        browser.close()

    tiles = [Image.open(SHOTS / f"{name}.jpg").resize((800, 450), Image.LANCZOS) for _, name, _ in SECTIONS if (SHOTS / f"{name}.jpg").exists()]
    rows = (len(tiles) + 1) // 2
    sheet = Image.new("RGB", (1600, 450 * rows), (10, 12, 17))
    for i, tile in enumerate(tiles):
        sheet.paste(tile, ((i % 2) * 800 + (400 if i == len(tiles) - 1 and len(tiles) % 2 else 0), (i // 2) * 450))
    sheet.save(SHOTS / "sections.jpg", quality=86, optimize=True)
    for e in errors:
        print(f"[shoot] ERROR {e[:400]}")
    print(f"[shoot] done, {len(errors)} error(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
