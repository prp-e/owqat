"""Build static GitHub Pages routes from the system IANA time-zone database."""
from html import escape
import json
from pathlib import Path
import re

DATABASE = Path("/usr/share/zoneinfo")
TEMPLATE = Path("Asia/Tehran/index.html")


def coordinate(text, degree_digits):
    magnitude = text[1:]
    degrees = int(magnitude[:degree_digits])
    minutes = int(magnitude[degree_digits:degree_digits + 2])
    seconds = int(magnitude[degree_digits + 2:] or "0")
    return round((degrees + minutes / 60 + seconds / 3600) * (-1 if text[0] == "-" else 1), 6)


zones = {}
for line in (DATABASE / "zone.tab").read_text().splitlines():
    if line and not line.startswith("#"):
        country, position, zone, *_ = line.split()
        latitude, longitude = re.findall(r"[+-]\d+", position)
        zones[zone] = [coordinate(latitude, 2), coordinate(longitude, 3), country]

aliases = {}
for line in (DATABASE / "tzdata.zi").read_text().splitlines():
    fields = line.split()
    if fields and fields[0] in {"L", "Link"}:
        _, target, alias = fields
        aliases[alias] = target

for alias, target in aliases.items():
    while target in aliases and target not in zones:
        target = aliases[target]
    if target in zones:
        zones.setdefault(alias, zones[target])

Path("zones.json").write_text(json.dumps(zones, sort_keys=True, separators=(",", ":")) + "\n")
Path("index.html").write_text(" ".join(line.strip() for line in TEMPLATE.read_text().replace("../../", "./").replace("<title>Tehran Prayer Times", "<title>Prayer Times").splitlines()) + "\n")
template = TEMPLATE.read_text().replace("../../", "/owqat/")
for zone in sorted(zones):
    for route in {zone, zone.replace("_", " ")}:
        output = Path(route) / "index.html"
        if output == TEMPLATE:
            continue
        output.parent.mkdir(parents=True, exist_ok=True)
        title = escape(zone.rsplit("/", 1)[-1].replace("_", " "))
        page = template.replace("<title>Tehran Prayer Times", f"<title>{title} Prayer Times")
        output.write_text(" ".join(line.strip() for line in page.splitlines()) + "\n")

Path("404.html").write_text(" ".join(line.strip() for line in template.splitlines()) + "\n")
