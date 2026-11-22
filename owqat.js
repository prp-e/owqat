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
