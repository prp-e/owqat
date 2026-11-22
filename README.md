# Owqat

Daily prayer times, sunrise and sunset in English, Persian, and Arabic.
Open [Tehran](https://prp-e.github.io/owqat/Asia/Tehran/), [Kabul](https://prp-e.github.io/owqat/Asia/Kabul/), or [New York](https://prp-e.github.io/owqat/America/New_York/).

Select a time zone at the top of the page or append a geographic IANA time zone to the site URL. The site uses the zone’s local date and the representative coordinates from the IANA database. Prayer times come from AlAdhan.

After editing the shared HTML in `Asia/Tehran/index.html`, run `python3 scripts/generate-routes.py` from the repository root on a system with `zone.tab` and `tzdata.zi` under `/usr/share/zoneinfo`. The script generates one-line static pages and the zone catalog for GitHub Pages.

Persian and Arabic city names use [Unicode CLDR 48.0.0](https://github.com/unicode-org/cldr-json/tree/48.0.0), under the [Unicode License](CLDR-LICENSE.txt), with local additions. To rebuild the names after regenerating the routes, save CLDR's Persian and Arabic `timeZoneNames.json` files as `fa.json` and `ar.json` in a shared directory and pass it to `python3 scripts/generate-city-names.py`.

## Install Owqat
In Safari on iPhone, use **Share → Add to Home Screen**, then enable **Open as Web App**.
Owqat can open previously cached time-zone pages offline. It only reuses prayer times for the same date and time zone when those exact results are cached.

Choose a city in the selected time zone to use its coordinates. City links preserve the zone and selected GeoNames ID. Cities are sourced from [GeoNames](https://www.geonames.org/) under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Rebuild with `python3 scripts/generate-cities.py cities15000.zip admin1CodesASCII.txt alternateNamesV2.zip` using the [GeoNames exports](https://download.geonames.org/export/dump/).
