"""Extract the individual, unlabelled roof drawings from Wikimedia's Dachformen.png.

Source: https://commons.wikimedia.org/wiki/File:Dachformen.png
Author: Stilfehler
License: CC BY-SA 4.0
The crops remove only surrounding whitespace and the German labels.
"""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/images/wikimedia/dachformen-original.png"
OUT = ROOT / "public/images/wikimedia/roofs"

COLS = [(18, 246), (246, 468), (468, 690), (690, 912), (912, 1134), (1134, 1356), (1356, 1590)]
ROWS = [(15, 190), (230, 404), (452, 624), (674, 851)]
NAMES = [
    ["flachdach", "pultdach", "versetztes-pultdach", "satteldach", "frackdach", "knickdach", "nurdach"],
    ["schmetterlingsdach", "zeltdach", "walmdach", "krueppelwalmdach", "fusswalmdach", "mansarddach-mit-fusswalm", "mansardgiebeldach"],
    ["mansardflachdach", "mansardwalmdach", "krueppelmansarddach", "mansarddach-mit-schopf", "sheddach", "paralleldach", "grabendach"],
    ["spitzbogentonnendach", "tonnendach", "tonnendach-mit-halbkalotte", "halbtonnendach", "bogendach", "haengedach"],
]

if not SOURCE.exists():
    raise SystemExit(f"Missing source image: {SOURCE}")

image = Image.open(SOURCE).convert("RGBA")
if image.size != (1600, 929):
    raise SystemExit(f"Unexpected source dimensions: {image.size}")

OUT.mkdir(parents=True, exist_ok=True)
count = 0
for row_index, row in enumerate(NAMES):
    top, bottom = ROWS[row_index]
    for col_index, name in enumerate(row):
        left, right = COLS[col_index]
        crop = image.crop((left, top, right, bottom))
        # Preserve a consistent canvas so silhouettes remain comparable in the quiz.
        canvas = Image.new("RGBA", (456, 350), "white")
        crop.thumbnail((410, 310), Image.Resampling.LANCZOS)
        canvas.alpha_composite(crop, ((456 - crop.width) // 2, (350 - crop.height) // 2))
        canvas.save(OUT / f"{name}.png", optimize=True)
        count += 1

print(f"Extracted {count} Wikimedia roof drawings to {OUT}")
