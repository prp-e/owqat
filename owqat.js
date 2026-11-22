const events = [
  ["Fajr", "Fajr", "اذان صبح"],
  ["Sunrise", "Sunrise", "طلوع آفتاب"],
  ["Dhuhr", "Dhuhr", "اذان ظهر"],
  ["Asr", "Asr", "عصر"],
  ["Sunset", "Sunset", "غروب آفتاب"],
  ["Maghrib", "Maghrib", "اذان مغرب"],
  ["Isha", "Isha", "عشاء"],
  ["Midnight", "Religious midnight", "نیمه‌شب شرعی"],
];
const cards = [...document.querySelectorAll(".card")];
const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const faCities = { Tehran: "تهران", Kabul: "کابل", "New York": "نیویورک" };
try {
  const catalog = await fetch(new URL("zones.json", root), { signal: AbortSignal.timeout(10000) });
  if (!catalog.ok) throw new Error("Time-zone catalog unavailable.");
  const zones = await catalog.json();
  if (Object.hasOwn(zones, localZone)) {
    for (const link of document.querySelectorAll("[data-my-zone]")) {
      link.href = new URL(localZone + "/", root);
      link.hidden = false;
    }
  }
  const timeZone = Object.keys(zones).find((zone) => zone.toLowerCase() === requestedZone.toLowerCase());
  if (!timeZone) throw new RangeError("Unsupported time zone");
  const [latitude, longitude, country] = zones[timeZone];
  const city = timeZone.split("/").at(-1).replaceAll("_", " ");
  document.title = `${city} Prayer Times · Owqat`;
  document.querySelector("[data-zone]").textContent = timeZone;
  const now = new Date();
  const options = { timeZone, year: "numeric", month: "2-digit", day: "2-digit" };
  const day = new Intl.DateTimeFormat("en-GB", options).format(now).replaceAll("/", "-");
  const query = new URLSearchParams({ latitude, longitude, timezonestring: timeZone });
  if (country === "IR") {
    query.set("method", "7");
    query.set("midnightMode", "1");
  }
  for (const card of cards) {
    card.querySelector("[data-city]").textContent = card.lang === "fa" ? (faCities[city] ?? city) : city;
    for (const calendar of ["gregory", "persian"]) {
      const formatter = new Intl.DateTimeFormat(card.lang, { timeZone, calendar, dateStyle: "long" });
      const field = calendar === "gregory" ? "gregorian" : calendar;
      card.querySelector(`[data-date="${field}"]`).textContent = formatter.format(now);
    }
  }
  const response = await fetch(`https://api.aladhan.com/v1/timings/${day}?${query}`, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const { data } = await response.json();
  const { timings, date } = data;
  if (date.gregorian.date !== day || events.some(([key]) => !/^\d{2}:\d{2}$/.test(timings[key]))) {
    throw new Error("Prayer times were incomplete or for a different date.");
  }
  for (const card of cards) {
    const fa = card.lang === "fa";
    const method = card.querySelector("[data-method]");
    method.textContent = data.meta.method.id === 7 && fa ? "روش دانشگاه تهران ·" : `${data.meta.method.name} ·`;
    const digits = (text) => fa ? String(text).replace(/[0-9]/g, (digit) => persianDigits[digit]) : text;
    const { day: lunarDay, month, year } = date.hijri;
    const persianMonths = ["محرم", "صفر", "ربیع‌الاول", "ربیع‌الثانی", "جمادی‌الاول", "جمادی‌الثانی", "رجب", "شعبان", "رمضان", "شوال", "ذی‌القعده", "ذی‌الحجه"];
    const lunar = card.querySelector('[data-date="hijri"]');
    lunar.textContent = digits(`${lunarDay} ${fa ? persianMonths[month.number - 1] : month.en} ${year}`);
    lunar.title = fa ? "تاریخ قمری طبق علاءالاذان" : "Lunar date from AlAdhan";
    const tiles = card.querySelector("[data-events]");
    for (const [key, enLabel, faLabel] of events) {
      const tile = document.createElement("div");
      tile.className = key === "Sunrise" || key === "Sunset" ? "tile solar" : "tile";
      const label = document.createElement("dt");
      label.textContent = fa ? faLabel : enLabel;
      const time = document.createElement("dd");
      time.dir = "ltr";
      time.textContent = digits(timings[key]);
      tile.append(label, time);
      tiles.append(tile);
    }
    card.querySelector("[data-status]").hidden = true;
  }
} catch (error) {
  if (error instanceof RangeError) {
    document.title = "Time zone unavailable · Owqat";
    document.querySelector("[data-zone]").textContent = requestedZone;
    for (const card of cards) {
      const fa = card.lang === "fa";
      card.querySelector("[data-city]").textContent = fa ? "منطقهٔ زمانی پیدا نشد" : "Time zone unavailable";
      card.querySelector("[data-status]").textContent = fa ? "یک منطقهٔ دارای موقعیت جغرافیایی را از راهنمای پایین انتخاب کنید." : "Choose a geographic time zone using the guide below.";
    }
  } else {
    for (const card of cards) {
      card.querySelector("[data-status]").textContent = card.lang === "fa"
        ? "دریافت اوقات شرعی ممکن نشد. صفحه را دوباره بارگذاری کنید."
        : "Prayer times are unavailable. Reload the page to try again.";
    }
  }
}
