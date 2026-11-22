"""Choose source-language city names and transliterate missing variants."""
import re
import unicodedata
from zipfile import ZipFile

ARABIC_LETTER = re.compile(r"[\u0620-\u064a\u066e-\u06d3]")
