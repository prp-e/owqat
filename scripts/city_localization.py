"""Choose source-language city names and transliterate missing variants."""
import re
import unicodedata
from zipfile import ZipFile

ARABIC_LETTER = re.compile(r"[\u0620-\u064a\u066e-\u06d3]")
TO_PERSIAN = str.maketrans("كيىة", "کییه")
TO_ARABIC = str.maketrans({"ک": "ك", "ی": "ي", "پ": "ب", "چ": "تش", "ژ": "ج", "گ": "غ", "ڤ": "ف"})
