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
