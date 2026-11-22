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
