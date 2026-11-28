const recordings = [
  { name: "رحیم مؤذن‌زاده اردبیلی", url: "https://dl.namaz.ir/s/c/other/azan/rahim_moazenzadeh.mp3", source: "https://t.me/namaz_ir/1860" },
  { name: "محمد آقاتی", url: "https://dl.musictag.ir/tracks/02/11/the%20call%20to%20prayerr%20-%205%20-%20128.mp3", source: "https://t.me/namaz_ir/1828" },
];

const labels = {
  en: ["Choose an Adhan", "Close", "The recording couldn’t play. Open the recording at its source."],
  fa: ["انتخاب اذان", "بستن", "پخش اذان ممکن نشد. ضبط را در منبع اصلی باز کنید."],
  ar: ["اختر الأذان", "إغلاق", "تعذّر تشغيل التسجيل. افتح التسجيل في مصدره."],
  ps: ["اذان وټاکئ", "وتړئ", "اذان غږول کېدای نه شي. ثبت شوې اذان په اصلي سرچینه کې پرانیزئ."],
  ur: ["اذان منتخب کریں", "بند کریں", "اذان نہیں چل سکی۔ ریکارڈنگ اصل ذریعے پر کھولیں۔"],
  ms: ["Pilih azan", "Tutup", "Rakaman tidak dapat dimainkan. Buka rakaman di sumber asal."],
  ru: ["Выберите азан", "Закрыть", "Не удалось воспроизвести запись. Откройте запись в источнике."],
  tr: ["Ezanı seçin", "Kapat", "Kayıt oynatılamadı. Kaydı kaynağında açın."],
};

export const adhanPrayers = new Set(["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]);

export function setupAdhan(timeZone, day) {
  const dialog = document.createElement("dialog");
  dialog.className = "adhan-dialog";
  dialog.setAttribute("aria-labelledby", "adhan-title");
  dialog.innerHTML = '<h2 id="adhan-title"></h2><div class="adhan-recordings"></div><audio controls hidden></audio><p role="status" hidden><span></span> <a target="_blank" rel="noopener noreferrer" lang="fa" dir="rtl"></a></p><form method="dialog"><button></button></form>';
  const title = dialog.querySelector("h2");
  const choices = dialog.querySelector(".adhan-recordings");
  const audio = dialog.querySelector("audio");
  const status = dialog.querySelector('[role="status"]');
  const sourceLink = status.querySelector("a");
  const close = dialog.querySelector("form button");
  audio.preload = "none";
  let activeRecording;
  function showPlaybackError() {
    if (!dialog.open) return;
    status.querySelector("span").textContent = labels[document.documentElement.lang][2];
    status.hidden = false;
  }
