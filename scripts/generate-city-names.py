"""Extract localized exemplar cities from CLDR timeZoneNames.json files."""
import json
from pathlib import Path
import sys

source = Path(sys.argv[1])
