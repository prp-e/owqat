"""Build static GitHub Pages routes from the system IANA time-zone database."""
from html import escape
import json
from pathlib import Path
import re
