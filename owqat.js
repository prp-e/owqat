import { currentLanguage, referenceCityName, setupLanguage, updatePageTitle } from "./language.js";
const root = new URL(".", import.meta.url);
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register(new URL("sw.js", root)).catch((error) => console.warn("Owqat offline setup failed:", error));
}
const path = location.pathname.slice(root.pathname.length).replace(/(?:^|\/)index\.html$/, "").replace(/\/+$/, "");
let requestedZone = path;
try { requestedZone = decodeURIComponent(path).replaceAll(" ", "_"); }
catch { /* An invalid URL can still use the time-zone picker. */ }
const events = [
  ["Fajr", "Fajr", "اذان صبح", "الفجر", "Фаджр", "Sabah", "سهار", "فجر", "Subuh"],
  ["Sunrise", "Sunrise", "طلوع آفتاب", "الشروق", "Восход", "Güneş", "لمر خاته", "طلوعِ آفتاب", "Syuruk"],
  ["Dhuhr", "Dhuhr", "اذان ظهر", "الظهر", "Зухр", "Öğle", "غرمه", "ظہر", "Zohor"],
  ["Asr", "Asr", "عصر", "العصر", "Аср", "İkindi", "مازیګر", "عصر", "Asar"],
  ["Sunset", "Sunset", "غروب آفتاب", "الغروب", "Закат", "Gün batımı", "لمر لوېدل", "غروبِ آفتاب", "Matahari terbenam"],
  ["Maghrib", "Maghrib", "اذان مغرب", "المغرب", "Магриб", "Akşam", "ماښام", "مغرب", "Maghrib"],
  ["Isha", "Isha", "عشاء", "العشاء", "Иша", "Yatsı", "ماخوستن", "عشاء", "Isyak"],
  ["Midnight", "Religious midnight", "نیمه‌شب شرعی", "منتصف الليل الشرعي", "Религиозная полночь", "Dinî gece yarısı", "شرعي نیمه شپه", "شرعی نصف شب", "Tengah malam syarie"],
];
setupLanguage(root);
const cards = [...document.querySelectorAll(".card")];
const numerals = { fa: "۰۱۲۳۴۵۶۷۸۹", ps: "۰۱۲۳۴۵۶۷۸۹", ur: "۰۱۲۳۴۵۶۷۸۹", ar: "٠١٢٣٤٥٦٧٨٩" };
const months = {
  ms: ["Muharam", "Safar", "Rabiulawal", "Rabiulakhir", "Jamadilawal", "Jamadilakhir", "Rejab", "Syaaban", "Ramadan", "Syawal", "Zulkaedah", "Zulhijah"],
  ur: ["محرم", "صفر", "ربیع الاول", "ربیع الثانی", "جمادی الاول", "جمادی الثانی", "رجب", "شعبان", "رمضان", "شوال", "ذوالقعدہ", "ذوالحجہ"],
  ps: ["محرم", "صفر", "ربیع الاول", "ربیع الثاني", "جمادي الاول", "جمادي الثاني", "رجب", "شعبان", "رمضان", "شوال", "ذوالقعده", "ذوالحجه"],
  tr: ["Muharrem", "Safer", "Rebîülevvel", "Rebîülâhir", "Cemâziyelevvel", "Cemâziyelâhir", "Recep", "Şaban", "Ramazan", "Şevval", "Zilkade", "Zilhicce"],
  ru: ["мухаррама", "сафара", "раби аль-авваля", "раби ас-сани", "джумада аль-уля", "джумада ас-сания", "раджаба", "шаабана", "рамадана", "шавваля", "зуль-када", "зуль-хиджа"],
  fa: ["محرم", "صفر", "ربیع‌الاول", "ربیع‌الثانی", "جمادی‌الاول", "جمادی‌الثانی", "رجب", "شعبان", "رمضان", "شوال", "ذی‌القعده", "ذی‌الحجه"],
  ar: ["محرم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"],
};
const labels = {
  ms: ["Zon waktu tidak tersedia", "Pilih zon waktu geografi daripada senarai di atas.", "Waktu solat tidak dapat dimuatkan.", "Tarikh Hijrah daripada AlAdhan", "Cuba lagi"],
  ur: ["منطقۂ وقت دستیاب نہیں", "اوپر سے کوئی جغرافیائی منطقۂ وقت منتخب کریں۔", "اوقاتِ نماز لوڈ نہیں ہو سکے۔", "الاذان کے مطابق قمری تاریخ", "دوبارہ کوشش کریں"],
  ps: ["وخت‌سیمه نشته", "له پورته لېست څخه یوه جغرافیایي وخت‌سیمه وټاکئ.", "د لمانځه وختونه ترلاسه نه شول.", "د AlAdhan له مخې قمري نېټه", "بیا هڅه وکړئ"],
  tr: ["Saat dilimi kullanılamıyor", "Yukarıdan bir coğrafi saat dilimi seçin.", "Namaz vakitleri yüklenemedi.", "AlAdhan kaynaklı hicrî tarih", "Tekrar dene"],
  ru: ["Часовой пояс недоступен", "Выберите географический часовой пояс выше.", "Не удалось загрузить время намаза.", "Дата по лунному календарю от AlAdhan", "Повторить"],
  en: ["Time zone unavailable", "Choose a geographic time zone above.", "Prayer times are unavailable.", "Lunar date from AlAdhan", "Try again"],
  fa: ["منطقهٔ زمانی پیدا نشد", "یک منطقهٔ زمانی جغرافیایی از فهرست بالا انتخاب کنید.", "دریافت اوقات شرعی ممکن نشد.", "تاریخ قمری طبق علاءالاذان", "تلاش دوباره"],
  ar: ["المنطقة الزمنية غير متاحة", "اختر منطقة زمنية جغرافية من القائمة أعلاه.", "تعذّر تحميل مواقيت الصلاة.", "التاريخ الهجري من الأذان", "إعادة المحاولة"],
};
const tehranMethod = { ms: "Kaedah Universiti Tehran", ur: "جامعۂ تہران کا طریقہ", ps: "د تهران پوهنتون طریقه", fa: "روش دانشگاه تهران", ar: "طريقة جامعة طهران", ru: "Метод Тегеранского университета", tr: "Tahran Üniversitesi yöntemi" };
const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const picker = document.querySelector("#time-zone");

async function readData(file) {
  const response = await fetch(new URL(file, root), { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`Could not load ${file}.`);
  return response.json();
}

function populatePicker(zones, selected) {
  const groups = new Map();
  picker.options[0].textContent = currentLanguage().zonePrompt;
  for (const zone of Object.keys(zones).sort()) {
    const region = zone.includes("/") ? zone.split("/")[0] : "Aliases";
    if (!groups.has(region)) {
      const group = document.createElement("optgroup");
      group.label = region;
      groups.set(region, group);
      picker.append(group);
    }
    const option = document.createElement("option");
    option.value = zone;
    option.textContent = zone.replaceAll("_", " ");
    groups.get(region).append(option);
  }
  picker.value = selected ?? "";
  picker.disabled = false;
  picker.addEventListener("change", () => {
    if (picker.value) location.assign(new URL(picker.value + "/", root));
  });
}
async function chooseCity(zone, cityNames) {
  const selected = new URLSearchParams(location.search).get("city");
  let cities;
  try {
    const index = await readData("cities/index.json");
    cities = Object.hasOwn(index, zone) ? await readData(`cities/${index[zone]}.json?v=2`) : [];
  } catch {
    if (selected) throw new Error("The selected city catalog is unavailable.");
    return undefined;
  }
  const city = cities.find(([id]) => id === selected);
  const select = document.querySelector("#city");
  if (cities.length) {
    for (const [id, name, , , , label, fa, ar] of cities) {
      const option = document.createElement("option");
      option.value = id;
      option.dataset.en = label;
      option.dataset.fa = fa ?? "";
      option.dataset.ar = ar ?? "";
      option.dataset.ru = referenceCityName(name, zone, cityNames.ru) ?? "";
      option.dataset.ur = referenceCityName(name, zone, cityNames.ur) ?? "";
      option.dataset.ps = referenceCityName(name, zone, cityNames.ps) ?? "";
      option.dataset.tr = referenceCityName(name, zone, cityNames.tr) ?? "";
      option.textContent = option.dataset[document.documentElement.lang] || label;
      select.append(option);
    }
    select.value = city?.[0] ?? "";
    document.querySelector("#choose-city").hidden = false;
    select.addEventListener("change", () => {
      const url = new URL(location.href);
      if (select.value) url.searchParams.set("city", select.value);
      else url.searchParams.delete("city");
      url.hash = "";
      location.assign(url);
    });
  }
  if (selected && !city) {
    for (const card of cards) {
      const status = card.querySelector("[data-status]");
      status.textContent = { en: "This city is unavailable in the selected time zone.", fa: "این شهر در منطقهٔ زمانی انتخاب‌شده در دسترس نیست.", ar: "هذه المدينة غير متاحة في المنطقة الزمنية المحددة.", ru: "Этот город недоступен в выбранном часовом поясе.", ps: "دا ښار په ټاکل شوې وخت‌سیمه کې نشته.", ur: "یہ شہر منتخب منطقۂ وقت میں دستیاب نہیں ہے۔", tr: "Bu şehir seçilen saat diliminde bulunmuyor." }[card.lang];
    }
    return null;
  }
  return city;
}

try {
  const [zones, cityNames] = await Promise.all([readData("zones.json"), readData("city-names.json")]);
  let useDeviceZone = false;
  if (!requestedZone && Object.hasOwn(zones, localZone)) {
    const consentKey = "owqat-device-time-zone";
    let consent;
    try { consent = localStorage.getItem(consentKey); } catch { /* Storage may be unavailable. */ }
    if (consent == null) {
      consent = window.confirm(currentLanguage().consent) ? "yes" : "no";
      try { localStorage.setItem(consentKey, consent); } catch { /* The current choice still applies. */ }
    }
    useDeviceZone = consent === "yes";
  }
  const preferredZone = requestedZone || (useDeviceZone ? localZone : "Asia/Tehran");
  if (Object.hasOwn(zones, localZone)) {
    for (const link of document.querySelectorAll("[data-my-zone]")) {
      const search = localZone === preferredZone ? location.search : "";
      link.href = new URL(localZone + "/" + search + "#choose-city", root);
      link.hidden = false;
    }
  }
  const timeZone = Object.keys(zones).find((zone) => zone.toLowerCase() === preferredZone.toLowerCase());
  populatePicker(zones, timeZone);
  let selectedCity;
  try {
    if (!timeZone) throw new RangeError("Unsupported time zone");
    selectedCity = await chooseCity(timeZone, cityNames);
  } finally {
    const [lat, lon] = selectedCity?.slice(2, 4) ?? zones[timeZone ?? "Asia/Tehran"];
    import("./place-picker.js").then(({ mountPlacePicker }) => mountPlacePicker(root, readData, lat, lon, cityNames)).catch((error) => console.warn("Owqat place picker unavailable:", error));
  }
  if (selectedCity === null) throw new Error("Unknown city", { cause: "city-selection" });
  const [latitude, longitude, country] = selectedCity?.slice(2, 5) ?? zones[timeZone];
  const city = selectedCity?.[1] ?? timeZone.split("/").at(-1).replaceAll("_", " ");
  const now = new Date();
  const options = { timeZone, year: "numeric", month: "2-digit", day: "2-digit" };
  const day = new Intl.DateTimeFormat("en-GB", options).format(now).replaceAll("/", "-");
  const query = new URLSearchParams({ latitude, longitude, timezonestring: timeZone });
  if (country === "IR") {
    query.set("method", "7");
    query.set("midnightMode", "1");
  }
  for (const card of cards) {
    const localizedCity = selectedCity
      ? { fa: selectedCity[6], ar: selectedCity[7], ru: referenceCityName(city, timeZone, cityNames.ru), ps: referenceCityName(city, timeZone, cityNames.ps), ur: referenceCityName(city, timeZone, cityNames.ur), tr: referenceCityName(city, timeZone, cityNames.tr) }[card.lang]
      : cityNames[card.lang]?.[timeZone];
    card.querySelector("[data-city]").textContent = localizedCity ?? city;
    for (const calendar of ["gregory", "persian"]) {
      const formatter = new Intl.DateTimeFormat(card.lang, { timeZone, calendar, dateStyle: "long" });
      const field = calendar === "gregory" ? "gregorian" : calendar;
      card.querySelector(`[data-date="${field}"]`).textContent = formatter.format(now);
    }
  }
  updatePageTitle();
  const response = await fetch(`https://api.aladhan.com/v1/timings/${day}?${query}`, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const { data } = await response.json();
  const { timings, date } = data;
  if (date.gregorian.date !== day || events.some(([key]) => !/^\d{2}:\d{2}$/.test(timings[key]))) {
    throw new Error("Prayer times were incomplete or for a different date.");
  }
  for (const card of cards) {
    const language = card.lang;
    const localizedMethod = data.meta.method.id === 7 ? tehranMethod[language] : undefined;
    card.querySelector("[data-method]").textContent = `${localizedMethod ?? data.meta.method.name} ·`;
    const digits = (text) => String(text).replace(/[0-9]/g, (digit) => numerals[language]?.[digit] ?? digit);
    const { day: lunarDay, month, year } = date.hijri;
    const lunar = card.querySelector('[data-date="hijri"]');
    lunar.textContent = digits(`${lunarDay} ${months[language]?.[month.number - 1] ?? month.en} ${year}`);
    lunar.title = labels[language][3];
    const tiles = card.querySelector("[data-events]");
    for (const [key, enLabel, faLabel, arLabel, ruLabel, trLabel, psLabel, urLabel] of events) {
      const tile = document.createElement("div");
      tile.className = key === "Sunrise" || key === "Sunset" ? "tile solar" : "tile";
      const label = document.createElement("dt");
      label.textContent = { en: enLabel, fa: faLabel, ar: arLabel, ru: ruLabel, tr: trLabel, ps: psLabel, ur: urLabel }[language];
      const time = document.createElement("dd");
      time.dir = "ltr";
      time.textContent = digits(timings[key]);
      tile.append(label, time);
      tiles.append(tile);
    }
    card.querySelector("[data-status]").hidden = true;
  }
} catch (error) {
  if (error.cause !== "city-selection") showError(error);
}

function showError(error) {
  const unsupported = error instanceof RangeError;
  for (const card of cards) {
    const [unavailable, chooseZone, fetchError, , retryLabel] = labels[card.lang];
    const status = card.querySelector("[data-status]");
    if (unsupported) card.querySelector("[data-city]").textContent = unavailable;
    status.textContent = unsupported ? chooseZone : fetchError;
    if (unsupported) continue;
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "retry";
    retry.textContent = retryLabel;
    retry.addEventListener("click", () => location.reload());
    status.after(retry);
  }
  if (unsupported) updatePageTitle();
}
