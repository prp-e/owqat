const messages = {
  en: { map: "Choose on map", locate: "Use my location", center: "Choose map center", select: "Use this city", hint: "Tap the map or choose its center to find the nearest listed city.", locating: "Finding your location…", denied: "Location access was denied. You can still choose on the map.", unavailable: "Could not find your location. Try again or choose on the map.", mapError: "The map could not load. You can still choose a city from the list.", cityError: "Could not look up a nearby city. Try again or choose from the list.", finding: "Finding the nearest listed city…", nearest: "Nearest listed city" },
  fa: { map: "انتخاب روی نقشه", locate: "استفاده از موقعیت من", center: "انتخاب مرکز نقشه", select: "انتخاب این شهر", hint: "روی نقشه بزنید یا مرکز آن را انتخاب کنید تا نزدیک‌ترین شهر پیدا شود.", locating: "در حال یافتن موقعیت شما…", denied: "دسترسی به موقعیت رد شد. می‌توانید روی نقشه انتخاب کنید.", unavailable: "موقعیت پیدا نشد. دوباره تلاش کنید یا روی نقشه انتخاب کنید.", mapError: "نقشه بارگیری نشد. می‌توانید شهری از فهرست انتخاب کنید.", cityError: "شهر نزدیک پیدا نشد. دوباره تلاش کنید یا از فهرست انتخاب کنید.", finding: "در حال یافتن نزدیک‌ترین شهر فهرست…", nearest: "نزدیک‌ترین شهر فهرست" },
  ar: { map: "اختر على الخريطة", locate: "استخدم موقعي", center: "اختر مركز الخريطة", select: "اختر هذه المدينة", hint: "اضغط على الخريطة أو اختر مركزها للعثور على أقرب مدينة في القائمة.", locating: "جارٍ تحديد موقعك…", denied: "تم رفض الوصول إلى الموقع. يمكنك الاختيار على الخريطة.", unavailable: "تعذّر تحديد موقعك. أعد المحاولة أو اختر على الخريطة.", mapError: "تعذّر تحميل الخريطة. يمكنك اختيار مدينة من القائمة.", cityError: "تعذّر العثور على مدينة قريبة. أعد المحاولة أو اختر من القائمة.", finding: "جارٍ البحث عن أقرب مدينة في القائمة…", nearest: "أقرب مدينة في القائمة" },
};
const language = navigator.language.split("-")[0];
const copy = messages[language] ?? messages.en;

function loadLeafletAsset(element, integrity) {
  return new Promise((resolve, reject) => {
    element.integrity = integrity;
    element.crossOrigin = "anonymous";
    element.onload = resolve;
    element.onerror = () => { element.remove(); reject(new Error("Leaflet asset unavailable")); };
    document.head.append(element);
  });
}

function nearestCity(groups, latitude, longitude) {
  const radians = Math.PI / 180;
  const cosLatitude = Math.cos(latitude * radians);
  let nearest;
  let shortest = Infinity;
  for (const [zone, cities] of groups) {
    for (const [id, lat, lon] of cities) {
      const distance = Math.sin((lat - latitude) * radians / 2) ** 2
        + cosLatitude * Math.cos(lat * radians) * Math.sin((lon - longitude) * radians / 2) ** 2;
      if (distance >= shortest) continue;
      shortest = distance;
      nearest = { id, zone, lat, lon };
    }
  }
  return nearest;
}

export function mountPlacePicker(root, readData, latitude, longitude) {
  const panel = document.createElement("section");
  panel.className = "guide place-picker";
  panel.lang = messages[language] ? language : "en";
  panel.dir = panel.lang === "en" ? "ltr" : "rtl";
  panel.innerHTML = `<button type="button" data-locate>${copy.locate}</button>
    <details><summary>${copy.map}</summary><p>${copy.hint}</p><div data-map aria-label="${copy.map}" dir="ltr"></div>
    <button type="button" data-center disabled>${copy.center}</button></details>
    <p role="status" data-place-status></p><a class="my-zone" data-place-select hidden>${copy.select}</a>`;
  document.querySelector("#choose-city").before(panel);
  const details = panel.querySelector("details");
  const status = panel.querySelector("[data-place-status]");
  const select = panel.querySelector("[data-place-select]");
  const locate = panel.querySelector("[data-locate]");
  const center = panel.querySelector("[data-center]");
  let cityIndex;
  let request = 0;
  let map;
  let loadingMap = false;
  let marker;

  async function suggest(lat, lon, centerMap = false) {
    const current = ++request;
    select.hidden = true;
    status.textContent = copy.finding;
    try {
      cityIndex ??= readData("cities/points.json").catch((error) => { cityIndex = undefined; throw error; });
      const place = nearestCity(await cityIndex, lat, lon);
      const cities = await readData(`cities/${place.zone}.json?v=2`);
      const city = cities.find(([id]) => id === place.id);
      if (current !== request) return;
      const label = { fa: city[6], ar: city[7] }[language] || city[5];
      status.textContent = `${copy.nearest} · ${label}`;
      select.href = new URL(`${place.zone}/?city=${encodeURIComponent(place.id)}`, root);
      select.textContent = `${copy.select} · ${label}`;
      select.hidden = false;
      if (map && details.open) {
        if (centerMap) map.setView([place.lat, place.lon], Math.max(map.getZoom(), 8));
        marker?.remove();
        marker = window.L.circleMarker([place.lat, place.lon], { radius: 9, color: "#352719", fillColor: "#f5c875", fillOpacity: 1 }).addTo(map);
      }
    } catch {
      if (current === request) status.textContent = copy.cityError;
    }
  }

  details.addEventListener("toggle", async () => {
    if (!details.open) return;
    if (map) { map.invalidateSize(); return; }
    if (loadingMap) return;
    loadingMap = true;
    const style = Object.assign(document.createElement("link"), { rel: "stylesheet", href: new URL("vendor/leaflet/leaflet.css", root) });
    const script = Object.assign(document.createElement("script"), { src: new URL("vendor/leaflet/leaflet.js", root) });
    try {
      await Promise.all([
        loadLeafletAsset(style, "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="),
        loadLeafletAsset(script, "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="),
      ]);
      const L = window.L;
      map = L.map(panel.querySelector("[data-map]")).setView([latitude, longitude], 6);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).on("tileerror", () => { if (!status.textContent) status.textContent = copy.mapError; }).addTo(map);
      map.on("click", ({ latlng }) => suggest(latlng.lat, latlng.lng));
