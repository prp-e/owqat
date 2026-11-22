"""Extract localized exemplar cities from CLDR timeZoneNames.json files."""
import json
from pathlib import Path
import sys

source = Path(sys.argv[1])
zones = json.loads(Path("zones.json").read_text())


def exemplar_cities(tree, prefix=""):
