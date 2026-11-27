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
localized = {}
for language in ("fa", "ar", "ru", "tr", "ps"):
    data = json.loads((source / f"{language}.json").read_text())
    tree = data["main"][language]["dates"]["timeZoneNames"]["zone"]
    names = dict(exemplar_cities(tree))
    by_location = {tuple(zones[zone]): name for zone, name in names.items() if zone in zones}
    localized[language] = {
        zone: names.get(zone) or by_location.get(tuple(location)) or additional_names.get(language, {}).get(zone)
        for zone, location in zones.items()
    }

Path("city-names.json").write_text(json.dumps(localized, ensure_ascii=False, separators=(",", ":")) + "\n")
