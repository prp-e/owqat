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
GRAPHEME = re.compile("|".join(SOUNDS) + "|[a-z]|[^a-z]+")


def local_names(archive, city_ids):
    names = {}
    with ZipFile(archive) as source, source.open("alternateNamesV2.txt") as rows:
        for line in rows:
            fields = line.rstrip(b"\r\n").split(b"\t", 9)
            city_id, language = fields[1:3]
            if city_id not in city_ids or language not in {b"fa", b"ar", b"prs"}:
                continue
            if fields[7:8] == [b"1"]:
                continue
            name = fields[3].decode("utf-8")
            if not ARABIC_LETTER.search(name) or re.search(r"[A-Za-z]", name):
                continue
            score = (language != b"prs", fields[4:5] == [b"1"], fields[6:7] != [b"1"], fields[5:6] != [b"1"])
            key = (city_id.decode("ascii"), "ar" if language == b"ar" else "fa")
            if key not in names or score > names[key][0]:
                names[key] = (score, name)
    return {key: value[1] for key, value in names.items()}


def transliterate_word(word):
    result = []
    for offset, segment in enumerate(GRAPHEME.findall(word)):
        if segment in SOUNDS:
            result.append(SOUNDS[segment])
        elif segment in VOWELS:
            result.append("ا" + VOWELS[segment] if offset == 0 and segment != "a" else VOWELS[segment])
        else:
            result.append(CONSONANTS.get(segment, segment))
    return "".join(result)


def transliterate(name):
    latin = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[a-z]+", lambda match: transliterate_word(match[0]), latin).translate(TO_PERSIAN)


def city_names(zone, city_id, name, overrides, source_names, cldr):
    if city_id in overrides:
        return overrides[city_id]
    reference = zone.rsplit("/", 1)[-1].replace("_", " ")
    fa = source_names.get((city_id, "fa"))
    ar = source_names.get((city_id, "ar"))
    if name.casefold() == reference.casefold():
        fa = fa or cldr["fa"].get(zone)
        ar = ar or cldr["ar"].get(zone)
    approximation = transliterate(name) if not (fa or ar) else None
    fa = fa or (ar.translate(TO_PERSIAN) if ar else approximation)
    ar = ar or fa.translate(TO_ARABIC)
    return [fa, ar]

