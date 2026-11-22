"""Extract localized exemplar cities from CLDR timeZoneNames.json files."""
import json
from pathlib import Path
import sys

source = Path(sys.argv[1])
zones = json.loads(Path("zones.json").read_text())


def exemplar_cities(tree, prefix=""):
    for key, entry in tree.items():
        if not isinstance(entry, dict):
            continue
        zone = f"{prefix}{key}"
        if "exemplarCity" in entry:
            yield zone, entry["exemplarCity"]
        yield from exemplar_cities(entry, f"{zone}/")


additional_names = {
    "fa": {"Africa/Asmara": "اسمره", "America/Atikokan": "اتیکوکان", "Pacific/Chuuk": "چوک", "Pacific/Pohnpei": "پونپی"},
    "ar": {"Africa/Asmara": "أسمرة", "America/Atikokan": "أتيكوكان", "Pacific/Chuuk": "تشوك", "Pacific/Pohnpei": "بوهنبي"},
}
