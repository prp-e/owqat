"""Build per-zone city catalogs from the GeoNames cities15000 and admin1 exports."""
from collections import Counter, defaultdict
import json
from pathlib import Path
import sys
from zipfile import ZipFile

archive, admin_path = sys.argv[1:]
zones = json.loads(Path("zones.json").read_text())
regions = dict(line.split("\t")[:2] for line in Path(admin_path).read_text().splitlines() if line)
localized = {
    "1133616": ["مزار شریف", "مزار شريف"],
    "1147242": ["بامیان", "باميان"],
