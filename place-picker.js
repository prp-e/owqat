import { currentLanguage, referenceCityName } from "./language.js";
const messages = {
  en: { method: "Location", geolocation: "Device location", map: "Choose on map", locate: "Use my location", center: "Choose map center", select: "Use this city", hint: "Tap the map or choose its center to find the nearest listed city.", locating: "Finding your location…", denied: "Location access was denied. You can still choose on the map.", unavailable: "Could not find your location. Try again or choose on the map.", mapError: "The map could not load. You can still choose a city from the list.", cityError: "Could not look up a nearby city. Try again or choose from the list.", finding: "Finding the nearest listed city…", nearest: "Nearest listed city" },
  fa: { method: "موقعیت", geolocation: "موقعیت دستگاه", map: "انتخاب روی نقشه", locate: "استفاده از موقعیت من", center: "انتخاب مرکز نقشه", select: "انتخاب این شهر", hint: "روی نقشه بزنید یا مرکز آن را انتخاب کنید تا نزدیک‌ترین شهر پیدا شود.", locating: "در حال یافتن موقعیت شما…", denied: "دسترسی به موقعیت رد شد. می‌توانید روی نقشه انتخاب کنید.", unavailable: "موقعیت پیدا نشد. دوباره تلاش کنید یا روی نقشه انتخاب کنید.", mapError: "نقشه بارگیری نشد. می‌توانید شهری از فهرست انتخاب کنید.", cityError: "شهر نزدیک پیدا نشد. دوباره تلاش کنید یا از فهرست انتخاب کنید.", finding: "در حال یافتن نزدیک‌ترین شهر فهرست…", nearest: "نزدیک‌ترین شهر فهرست" },
  ar: { method: "الموقع", geolocation: "موقع الجهاز", map: "اختر على الخريطة", locate: "استخدم موقعي", center: "اختر مركز الخريطة", select: "اختر هذه المدينة", hint: "اضغط على الخريطة أو اختر مركزها للعثور على أقرب مدينة في القائمة.", locating: "جارٍ تحديد موقعك…", denied: "تم رفض الوصول إلى الموقع. يمكنك الاختيار على الخريطة.", unavailable: "تعذّر تحديد موقعك. أعد المحاولة أو اختر على الخريطة.", mapError: "تعذّر تحميل الخريطة. يمكنك اختيار مدينة من القائمة.", cityError: "تعذّر العثور على مدينة قريبة. أعد المحاولة أو اختر من القائمة.", finding: "جارٍ البحث عن أقرب مدينة في القائمة…", nearest: "أقرب مدينة في القائمة" },
  ru: { method: "Местоположение", geolocation: "Местоположение устройства", map: "Выбрать на карте", locate: "Определить моё местоположение", center: "Выбрать центр карты", select: "Выбрать этот город", hint: "Нажмите на карту или выберите её центр, чтобы найти ближайший город из списка.", locating: "Определяем ваше местоположение…", denied: "Доступ к местоположению запрещён. Вы можете выбрать город на карте.", unavailable: "Не удалось определить местоположение. Попробуйте ещё раз или выберите город на карте.", mapError: "Не удалось загрузить карту. Вы можете выбрать город из списка.", cityError: "Не удалось найти ближайший город. Попробуйте ещё раз или выберите город из списка.", finding: "Ищем ближайший город из списка…", nearest: "Ближайший город из списка" },
  ms: { method: "Lokasi", geolocation: "Lokasi peranti", map: "Pilih pada peta", locate: "Gunakan lokasi saya", center: "Pilih titik tengah peta", select: "Gunakan bandar ini", hint: "Ketik pada peta atau pilih titik tengahnya untuk mencari bandar terdekat dalam senarai.", locating: "Lokasi anda sedang dikesan…", denied: "Kebenaran untuk mengakses lokasi ditolak. Anda boleh memilih lokasi pada peta.", unavailable: "Lokasi anda tidak dapat dikesan. Cuba lagi atau pilih lokasi pada peta.", mapError: "Peta tidak dapat dimuatkan. Anda boleh memilih bandar daripada senarai.", cityError: "Bandar terdekat tidak ditemui. Cuba lagi atau pilih bandar daripada senarai.", finding: "Bandar terdekat dalam senarai sedang dicari…", nearest: "Bandar terdekat dalam senarai" },
  ur: { method: "مقام", geolocation: "آلے کا مقام", map: "نقشے پر منتخب کریں", locate: "میرا مقام استعمال کریں", center: "نقشے کا مرکز منتخب کریں", select: "یہ شہر استعمال کریں", hint: "فہرست میں قریب ترین شہر تلاش کرنے کے لیے نقشے پر دبائیں یا اس کا مرکز منتخب کریں۔", locating: "آپ کا مقام معلوم کیا جا رہا ہے…", denied: "مقام تک رسائی کی اجازت نہیں ملی۔ آپ نقشے پر کوئی مقام منتخب کر سکتے ہیں۔", unavailable: "آپ کا مقام معلوم نہیں ہو سکا۔ دوبارہ کوشش کریں یا نقشے پر کوئی مقام منتخب کریں۔", mapError: "نقشہ لوڈ نہیں ہو سکا۔ آپ فہرست سے شہر منتخب کر سکتے ہیں۔", cityError: "قریب ترین شہر نہیں ملا۔ دوبارہ کوشش کریں یا فہرست سے شہر منتخب کریں۔", finding: "فہرست میں قریب ترین شہر تلاش کیا جا رہا ہے…", nearest: "فہرست میں قریب ترین شہر" },
  ps: { method: "ځای", geolocation: "د وسیلې ځای", map: "پر نقشه یې وټاکئ", locate: "زما ځای وکاروئ", center: "د نقشې مرکز وټاکئ", select: "دا ښار وکاروئ", hint: "پر نقشه ټک وکړئ یا یې مرکز وټاکئ، څو په لېست کې تر ټولو نږدې ښار وموندل شي.", locating: "ستاسو ځای موندل کېږي…", denied: "ځای ته د لاسرسي اجازه ورنه کړل شوه. پر نقشه یو ځای ټاکلی شئ.", unavailable: "ستاسو ځای ونه موندل شو. بیا هڅه وکړئ یا پر نقشه یو ځای وټاکئ.", mapError: "نقشه بار نه شوه. له لېست څخه یو ښار ټاکلی شئ.", cityError: "نږدې ښار ونه موندل شو. بیا هڅه وکړئ یا له لېست څخه یو ښار وټاکئ.", finding: "په لېست کې تر ټولو نږدې ښار لټول کېږي…", nearest: "په لېست کې تر ټولو نږدې ښار" },
  tr: { method: "Konum", geolocation: "Cihaz konumu", map: "Haritadan seç", locate: "Konumumu kullan", center: "Haritanın merkezini seç", select: "Bu şehri seç", hint: "Listedeki en yakın şehri bulmak için haritaya dokunun veya haritanın merkezini seçin.", locating: "Konumunuz belirleniyor…", denied: "Konum erişimine izin verilmedi. Konumunuzu haritadan seçebilirsiniz.", unavailable: "Konumunuz belirlenemedi. Tekrar deneyin veya haritadan seçin.", mapError: "Harita yüklenemedi. Listeden bir şehir seçebilirsiniz.", cityError: "Yakındaki şehir bulunamadı. Tekrar deneyin veya listeden bir şehir seçin.", finding: "Listedeki en yakın şehir aranıyor…", nearest: "Listedeki en yakın şehir" },
};

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

export function mountPlacePicker(root, readData, latitude, longitude, cityNames) {
  let language = document.documentElement.lang;
  let copy = messages[language];
  const panel = document.createElement("section");
  panel.className = "guide place-picker";
  panel.lang = language;
  panel.dir = document.documentElement.dir;
  panel.innerHTML = `<div class="location-method"><label for="location-method"></label>
    <select id="location-method"><option value="locate"></option><option value="zone"></option><option value="device"></option><option value="map"></option><option value="city"></option></select></div>
    <div data-method-panel="locate"><button type="button" data-locate></button></div>
    <div data-method-panel="map" hidden><p></p><div data-map dir="ltr"></div><button type="button" data-center disabled></button></div>
    <div data-method-panel="zone" hidden></div><div data-method-panel="device" hidden></div><div data-method-panel="city" hidden></div>
    <p role="status" data-place-status></p><a class="my-zone" data-place-select hidden></a>`;
  const city = document.querySelector("#choose-city");
  const device = document.querySelector("[data-my-zone]");
  const zone = document.querySelector(".zone-picker");
  const zoneTools = zone.parentElement;
  const settings = document.querySelector(".location-settings");
  panel.querySelector('[data-method-panel="city"]').append(city);
  panel.querySelector('[data-method-panel="device"]').append(device);
  panel.querySelector('[data-method-panel="zone"]').append(zone);
  zoneTools.remove();
  const method = panel.querySelector("#location-method");
  const mapPanel = panel.querySelector('[data-method-panel="map"]');
  method.querySelector('[value="device"]').disabled = device.hidden;
  method.querySelector('[value="city"]').disabled = city.hidden;
  const status = panel.querySelector("[data-place-status]");
  const select = panel.querySelector("[data-place-select]");
  const locate = panel.querySelector("[data-locate]");
  const center = panel.querySelector("[data-center]");
  const mapElement = panel.querySelector("[data-map]");
  let statusKey;
  let suggestedCity;
  let suggestedZone;
  let cityIndex;
  let request = 0;
  let map;
  let loadingMap = false;
  let marker;

  function showStatus(key) {
    statusKey = key;
    const label = suggestedCity && ({ fa: suggestedCity[6], ar: suggestedCity[7], ru: referenceCityName(suggestedCity[1], suggestedZone, cityNames.ru), ps: referenceCityName(suggestedCity[1], suggestedZone, cityNames.ps), ur: referenceCityName(suggestedCity[1], suggestedZone, cityNames.ur), ms: referenceCityName(suggestedCity[1], suggestedZone, cityNames.ms), tr: referenceCityName(suggestedCity[1], suggestedZone, cityNames.tr) }[language] || suggestedCity[5]);
    status.textContent = key === "nearest" ? `${copy.nearest} · ${label}` : copy[key] ?? "";
    if (key === "nearest") select.textContent = `${copy.select} · ${label}`;
  }

  function localize() {
    language = document.documentElement.lang;
    copy = messages[language];
    panel.lang = language;
    panel.dir = document.documentElement.dir;
    locate.textContent = copy.locate;
    panel.querySelector('label[for="location-method"]').textContent = copy.method;
    const { zone, myZone, city } = currentLanguage();
    const labels = { locate: copy.geolocation, zone: `${zone} (IANA)`, device: myZone, map: copy.map, city };
    for (const option of method.options) option.textContent = labels[option.value];
    mapPanel.querySelector("p").textContent = copy.hint;
    mapElement.setAttribute("aria-label", copy.map);
    center.textContent = copy.center;
    showStatus(statusKey);
  }
  localize();
  document.addEventListener("owqat-language-change", localize);

  async function suggest(lat, lon, centerMap = false) {
    const current = ++request;
    select.hidden = true;
    showStatus("finding");
    try {
      cityIndex ??= readData("cities/points.json").catch((error) => { cityIndex = undefined; throw error; });
      const place = nearestCity(await cityIndex, lat, lon);
      const cities = await readData(`cities/${place.zone}.json?v=2`);
      const city = cities.find(([id]) => id === place.id);
      if (current !== request) return;
      suggestedCity = city;
      suggestedZone = place.zone;
      showStatus("nearest");
      select.href = new URL(`${place.zone}/?city=${encodeURIComponent(place.id)}`, root);
      select.hidden = false;
      if (map && !mapPanel.hidden) {
        if (centerMap) map.setView([place.lat, place.lon], Math.max(map.getZoom(), 8));
        marker?.remove();
        marker = window.L.circleMarker([place.lat, place.lon], { radius: 9, color: "#352719", fillColor: "#f5c875", fillOpacity: 1 }).addTo(map);
      }
    } catch {
      if (current === request) showStatus("cityError");
    }
  }

  async function openMap() {
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
      map = L.map(mapElement).setView([latitude, longitude], 6);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).on("tileerror", () => { if (!mapPanel.hidden && !statusKey) showStatus("mapError"); }).addTo(map);
      map.on("click", ({ latlng }) => suggest(latlng.lat, latlng.lng));
      center.disabled = false;
      if (statusKey === "mapError") showStatus();
    } catch {
      if (!mapPanel.hidden) showStatus("mapError");
    } finally {
      loadingMap = false;
    }
  }

  function showMethod() {
    request++;
    select.hidden = true;
    marker?.remove();
    showStatus();
    for (const group of panel.querySelectorAll("[data-method-panel]")) group.hidden = group.dataset.methodPanel !== method.value;
    if (method.value === "map") openMap();
  }

  function focusCityLink() {
    if (location.hash !== "#choose-city" || city.hidden) return;
    method.value = "city";
    showMethod();
    city.querySelector("select").focus();
  }

  method.addEventListener("change", showMethod);
  window.addEventListener("hashchange", focusCityLink);
  focusCityLink();

  center.addEventListener("click", () => {
    const point = map.getCenter();
    suggest(point.lat, point.lng);
  });
  locate.addEventListener("click", () => {
    if (!navigator.geolocation) { showStatus("unavailable"); return; }
    const current = ++request;
    select.hidden = true;
    locate.disabled = true;
    showStatus("locating");
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      locate.disabled = false;
      if (current === request) suggest(coords.latitude, coords.longitude, true);
    }, (error) => {
      locate.disabled = false;
      if (current === request) showStatus(error.code === 1 ? "denied" : "unavailable");
    }, { timeout: 12000 });
  });
}
