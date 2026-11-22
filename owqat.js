const timeZone = "Asia/Tehran";
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
const now = new Date();
const options = { timeZone, year: "numeric", month: "2-digit", day: "2-digit" };
const day = new Intl.DateTimeFormat("en-GB", options).format(now).replaceAll("/", "-");
const query = new URLSearchParams({
  latitude: "35.694", longitude: "51.422", method: "7", midnightMode: "1", timezonestring: timeZone,
});
for (const card of cards) {
  for (const calendar of ["gregory", "persian"]) {
    const formatter = new Intl.DateTimeFormat(card.lang, { timeZone, calendar, dateStyle: "long" });
    const field = calendar === "gregory" ? "gregorian" : calendar;
    card.querySelector(`[data-date="${field}"]`).textContent = formatter.format(now);
  }
}
try {
  const response = await fetch(`https://api.aladhan.com/v1/timings/${day}?${query}`, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const { data } = await response.json();
  const { timings, date } = data;
  if (date.gregorian.date !== day || events.some(([key]) => !/^\d{2}:\d{2}$/.test(timings[key]))) {
    throw new Error("Prayer times were incomplete or for a different date.");
  }
  for (const card of cards) {
    const fa = card.lang === "fa";
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
  }
}
