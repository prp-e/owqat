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
