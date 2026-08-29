"""Extract individual dormer groups from the Wikimedia vector illustration.

Source: https://commons.wikimedia.org/wiki/File:Dachgauben_Dachkanten_2_simple_numbered.svg
Original: Roland Bergmann; vector derivative: Hietzinger Friedhof
License: CC BY-SA 3.0 / GFDL
"""

from copy import deepcopy
from pathlib import Path
from shutil import copyfile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/images/wikimedia/dachgauben-vektor-original.svg"
OUT = ROOT / "public/images/wikimedia/gauben"
LAYER_TRANSFORM = "translate(-94.983086,3.0511811)"

# Bounding rectangles measured in the rendered source SVG coordinate system.
BOXES = {
    "g3394": (53.19, 184.25, 18.99, 29.24),
    "g3389": (66.48, 168.30, 24.70, 36.32),
    "g3384": (91.18, 172.73, 19.00, 23.04),
    "g3377": (110.18, 153.24, 19.00, 33.67),
    "g3370": (129.17, 152.36, 19.01, 25.69),
    "g3363": (148.17, 135.53, 19.00, 33.67),
    "g3354": (167.17, 119.98, 19.00, 40.36),
    "g3456": (254.55, 154.13, 13.30, 33.65),
    "g3506": (237.45, 97.26, 15.20, 12.59),
    "g3497": (260.25, 88.58, 7.61, 10.64),
    "g3655": (113.97, 121.35, 19.01, 21.27),
    "g3650": (79.78, 141.73, 13.31, 14.18),
    "g3583": (296.34, 45.17, 7.61, 8.87),
    "g3271": (218.46, 134.64, 30.40, 38.99),
    "g3465": (201.36, 121.35, 30.40, 38.99),
}

ET.register_namespace("", "http://www.w3.org/2000/svg")
tree = ET.parse(SOURCE)
root = tree.getroot()
groups = {element.get("id"): element for element in root.iter() if element.get("id") in BOXES}
OUT.mkdir(parents=True, exist_ok=True)

for group_id, (x, y, width, height) in BOXES.items():
    padding = max(width, height) * 0.18
    view_box = f"{x-padding:.3f} {y-padding:.3f} {width+2*padding:.3f} {height+2*padding:.3f}"
    svg = ET.Element("{http://www.w3.org/2000/svg}svg", {
        "viewBox": view_box,
        "width": "600",
        "height": "600",
        "role": "img",
        "aria-label": f"Freigestellte Gaubenform {group_id}",
    })
    svg.append(ET.Element("{http://www.w3.org/2000/svg}rect", {
        "x": f"{x-padding:.3f}", "y": f"{y-padding:.3f}",
        "width": f"{width+2*padding:.3f}", "height": f"{height+2*padding:.3f}",
        "fill": "#ffffff",
    }))
    transformed = ET.SubElement(svg, "{http://www.w3.org/2000/svg}g", {"transform": LAYER_TRANSFORM})
    transformed.append(deepcopy(groups[group_id]))
    ET.ElementTree(svg).write(OUT / f"{group_id}.svg", encoding="utf-8", xml_declaration=True)

# Teaching terminology -> visually and technically corresponding vector group.
SEMANTIC = {
    "spitzgaube": "g3497",           # Wikimedia: Dreiecksgaube
    "schleppgaube": "g3389",         # Wikimedia: gerade Schleppgaube
    "walmgaube": "g3377",            # Wikimedia: Walmgaube mit First
    "tonnengaube": "g3370",          # Wikimedia: Gaube mit Bogendach
    "trapezgaube": "g3650",          # Wikimedia: liegende Schleppgaube / Trapezgaube
    "fledermausgaube": "g3506",
}
for name, group_id in SEMANTIC.items():
    copyfile(OUT / f"{group_id}.svg", OUT / f"{name}.svg")

cards = "".join(f'<figure><img src="{group_id}.svg"><figcaption>{group_id}</figcaption></figure>' for group_id in BOXES)
(OUT / "preview.html").write_text(f"""<!doctype html><html><head><meta charset="utf-8"><style>
body{{font-family:system-ui;background:#eef2f7;margin:0;padding:24px}}main{{display:grid;grid-template-columns:repeat(5,1fr);gap:16px}}figure{{margin:0;background:white;border:1px solid #ccd6e2;border-radius:12px;padding:10px}}img{{width:100%;height:170px;object-fit:contain}}figcaption{{text-align:center;font-weight:800;color:#345}}
</style></head><body><main>{cards}</main></body></html>""", encoding="utf-8")
print(f"Extracted {len(BOXES)} vector groups to {OUT}")
