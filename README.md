# Owqat

Daily prayer times, sunrise, and sunset with Gregorian, Solar Hijri, and Lunar Hijri dates. English is the default, and the language dropdown also offers Persian, Arabic, Russian, and Turkish. Owqat remembers your language choice across city pages.
Open [Owqat](https://prp-e.github.io/owqat/) or go directly to [Tehran](https://prp-e.github.io/owqat/Asia/Tehran/), [Kabul](https://prp-e.github.io/owqat/Asia/Kabul/), or [New York](https://prp-e.github.io/owqat/America/New_York/).

## Choose a location

Use the location dropdown to choose how Owqat finds your prayer times.

- **Use my location** is selected by default. Press the button to request browser permission and get a nearby city suggestion.
- **Time zone (IANA)** opens the list of geographic time zones.
- **Open my time zone** uses the time zone reported by your device, without requesting its coordinates.
- **Choose on map** lets you tap an [OpenStreetMap](https://www.openstreetmap.org/copyright) map to find the nearest listed city.
- **Choose a city** lets you select a city within the current time zone.

Confirm a suggested city to use its coordinates. City links preserve the time zone and selected GeoNames ID. When you choose only a time zone, Owqat uses the IANA reference coordinates. Prayer times use the selected zone’s local date and come from [AlAdhan](https://aladhan.com/prayer-times-api).

## Install Owqat

Owqat opens directly to the prayer-times page. In Safari on iPhone, use **Share → Add to Home Screen**, then enable **Open as Web App**.

Owqat can open previously cached time-zone pages offline. Prayer times are available offline when results for the same date and location were cached earlier.

## Development

After editing the shared HTML in `Asia/Tehran/index.html`, run `python3 scripts/generate-routes.py` from the repository root on a system with `zone.tab` and `tzdata.zi` under `/usr/share/zoneinfo`. The script generates one-line static pages and the zone catalog for GitHub Pages.

Persian, Arabic, Russian, and Turkish reference city names use [Unicode CLDR 48.0.0](https://github.com/unicode-org/cldr-json/tree/48.0.0), under the [Unicode License](CLDR-LICENSE.txt), with local additions. To rebuild the names after regenerating the routes, save CLDR's Persian, Arabic, Russian, and Turkish `timeZoneNames.json` files as `fa.json`, `ar.json`, `ru.json`, and `tr.json` in a shared directory and pass it to `python3 scripts/generate-city-names.py`.

Cities are sourced from [GeoNames](https://www.geonames.org/) under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Rebuild with `python3 scripts/generate-cities.py cities15000.zip admin1CodesASCII.txt alternateNamesV2.zip` using the [GeoNames exports](https://download.geonames.org/export/dump/).

Persian and Arabic city labels prefer localized GeoNames names, with CLDR reference names and transliteration as fallbacks. Transliterated spellings are approximate.

## Changelog

### November 25, 2026

- The website and installed app open directly to prayer times.
- One location dropdown brings together device location, IANA time zones, the device time zone, the OpenStreetMap picker, and the city list. **Use my location** is selected by default and asks for permission when pressed.
- The language dropdown shows a flag for each language and remembers the selection. English is the default. Russian and Turkish join Persian and Arabic.
- The service worker checks for updated app files online and serves cached files when offline.
