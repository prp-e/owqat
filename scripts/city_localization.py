"""Choose source-language city names and transliterate missing variants."""
import re
import unicodedata
from zipfile import ZipFile

ARABIC_LETTER = re.compile(r"[\u0620-\u064a\u066e-\u06d3]")
TO_PERSIAN = str.maketrans("كيىة", "کییه")
TO_ARABIC = str.maketrans({"ک": "ك", "ی": "ي", "پ": "ب", "چ": "تش", "ژ": "ج", "گ": "غ", "ڤ": "ف"})
CONSONANTS = {"b": "ب", "c": "ک", "d": "د", "f": "ف", "g": "گ", "h": "ه", "j": "ج", "k": "ک", "l": "ل", "m": "م", "n": "ن", "p": "پ", "q": "ق", "r": "ر", "s": "س", "t": "ت", "v": "و", "w": "و", "x": "کس", "y": "ی", "z": "ز"}
VOWELS = {"a": "ا", "e": "", "i": "ی", "o": "و", "u": "و"}
SOUNDS = {"sch": "ش", "sh": "ش", "ch": "چ", "zh": "ژ", "kh": "خ", "gh": "غ", "ph": "ف", "th": "ت", "ng": "نگ", "oo": "و", "ee": "ی", "ay": "ی", "ai": "ای", "ou": "و", "ow": "او"}
