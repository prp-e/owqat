# Owqat

Daily prayer times, sunrise, and sunset with Gregorian, Solar Hijri, and Lunar Hijri dates. English is the default, and the language dropdown also offers Persian, Arabic, Pashto, Urdu, Malay, Russian, and Turkish. Owqat remembers your language choice across city pages.
Open [Owqat](https://prp-e.github.io/owqat/) or go directly to [Tehran](https://prp-e.github.io/owqat/Asia/Tehran/), [Kabul](https://prp-e.github.io/owqat/Asia/Kabul/), or [New York](https://prp-e.github.io/owqat/America/New_York/).

## Choose a location

Use the location dropdown to choose how Owqat finds your prayer times.

- **Device location** is selected by default. Press **Use my location** to request browser permission and get a nearby city suggestion.
- **Time zone (IANA)** opens the list of geographic time zones.
- **Open my time zone** uses the time zone reported by your device, without requesting its coordinates.
- **Choose on map** lets you tap an [OpenStreetMap](https://www.openstreetmap.org/copyright) map to find the nearest listed city.
- **Choose a city** lets you select a city within the current time zone.

Confirm a suggested city to use its coordinates. City links preserve the time zone and selected GeoNames ID. When you choose only a time zone, Owqat uses the IANA reference coordinates. Prayer times use the selected zone’s local date and come from [AlAdhan](https://aladhan.com/prayer-times-api).

## Install Owqat

Owqat opens directly to the prayer-times page. In Safari on iPhone, use **Share → Add to Home Screen**, then enable **Open as Web App**.

Owqat can open previously cached time-zone pages offline. Prayer times are available offline when results for the same date and location were cached earlier.

## Development

The Pashto picker uses the [Islamic Emirate of Afghanistan flag with Pashto subtext](https://commons.wikimedia.org/wiki/File:Flag_of_the_Islamic_Emirate_of_Afghanistan_(with_Pashto_subtext).svg) from Wikimedia Commons.

After editing the shared HTML in `Asia/Tehran/index.html`, run `python3 scripts/generate-routes.py` from the repository root on a system with `zone.tab` and `tzdata.zi` under `/usr/share/zoneinfo`. The script generates one-line static pages and the zone catalog for GitHub Pages.

Persian, Arabic, Russian, Turkish, Pashto, and Urdu reference city names use [Unicode CLDR 48.0.0](https://github.com/unicode-org/cldr-json/tree/48.0.0), under the [Unicode License](CLDR-LICENSE.txt), with local additions. To rebuild the names after regenerating the routes, save CLDR's Persian, Arabic, Russian, Turkish, Pashto, and Urdu `timeZoneNames.json` files as `fa.json`, `ar.json`, `ru.json`, `tr.json`, `ps.json`, and `ur.json` in a shared directory and pass it to `python3 scripts/generate-city-names.py`.

Cities are sourced from [GeoNames](https://www.geonames.org/) under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Rebuild with `python3 scripts/generate-cities.py cities15000.zip admin1CodesASCII.txt alternateNamesV2.zip` using the [GeoNames exports](https://download.geonames.org/export/dump/).

Persian and Arabic city labels prefer localized GeoNames names, with CLDR reference names and transliteration as fallbacks. Transliterated spellings are approximate.

## Changelog

### November 25, 2026

- The website and installed app open directly to prayer times.
- One location dropdown brings together device location, IANA time zones, the device time zone, the OpenStreetMap picker, and the city list. **Device location** is selected by default. Pressing **Use my location** asks for browser permission.
- The language dropdown shows a flag for each language and remembers the selection. English is the default. Russian and Turkish join Persian and Arabic.
- The service worker checks for updated app files online and serves cached files when offline.
- The prayer timetable and three calendar dates take up less space on phones. Language and theme controls share the top bar.
- Persian and Arabic help text about IANA time zones is visible again.
- A localized **Try again** button appears if prayer times fail to load. The location picker remains available if a time-zone link is malformed.
