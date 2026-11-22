# Owqat

Daily prayer times, sunrise and sunset in English and Persian.
Open [Tehran](https://prp-e.github.io/owqat/Asia/Tehran/), [Kabul](https://prp-e.github.io/owqat/Asia/Kabul/), or [New York](https://prp-e.github.io/owqat/America/New_York/).

Append a geographic IANA time zone to the site URL. The site uses the zone’s local date and the representative coordinates from the IANA database. Prayer times come from AlAdhan.

After editing the shared HTML in `Asia/Tehran/index.html`, run `python3 scripts/generate-routes.py` from the repository root on a system with `zone.tab` and `tzdata.zi` under `/usr/share/zoneinfo`. The script generates one-line static pages and the zone catalog for GitHub Pages.
