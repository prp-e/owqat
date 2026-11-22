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
    "119208": ["قم", "قم"],
    "124665": ["مشهد", "مشهد"],
    "141681": ["بندرعباس", "بندر عباس"],
    "112931": ["تهران", "طهران"],
    "1138958": ["کابل", "كابول"],
}
cities = defaultdict(list)
with ZipFile(archive) as source, source.open("cities15000.txt") as rows:
    for line in rows:
        row = line.decode("utf-8").rstrip("\n").split("\t")
        city_id, name, latitude, longitude, country, zone = (row[i] for i in (0, 2, 4, 5, 8, 17))
