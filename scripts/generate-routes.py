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
