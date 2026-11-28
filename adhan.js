const recordings = [
  { name: "رحیم مؤذن‌زاده اردبیلی", english: "Rahim Moazzenzadeh Ardabili", file: "rahim-moazzenzadeh-ardabili.mp3", source: "https://t.me/namaz_ir/1860" },
  { name: "محمد آقاتی", english: "Mohammad Aghati", file: "mohammad-aghati.mp3", source: "https://t.me/namaz_ir/1828" },
  { name: "مشاري راشد العفاسي", lang: "ar", english: "Mishary Rashid Alafasy", file: "mishary-rashid-alafasy.mp3", source: "https://cdn.aladhan.com/audio/adhans/a9.mp3" },
  { name: "أحمد النفيس", lang: "ar", english: "Ahmad Al-Nafees", file: "ahmad-al-nafees.mp3", source: "https://cdn.aladhan.com/audio/adhans/a1.mp3" },
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
  dialog.innerHTML = '<h2 id="adhan-title"></h2><div class="adhan-recordings"></div><audio controls hidden></audio><p role="status" hidden><span></span> <a target="_blank" rel="noopener noreferrer"></a></p><form method="dialog"><button></button></form>';
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
  audio.addEventListener("error", showPlaybackError);
  for (const { name, lang = "fa", english, file, source } of recordings) {
    const choice = document.createElement("button");
    choice.type = "button";
    const nativeName = Object.assign(document.createElement("bdi"), { lang, dir: "rtl", textContent: name });
    const englishName = Object.assign(document.createElement("bdi"), { lang: "en", dir: "ltr", textContent: english });
    choice.append(nativeName, " ", englishName);
    choice.setAttribute("aria-pressed", "false");
    choice.addEventListener("click", () => {
      activeRecording?.setAttribute("aria-pressed", "false");
      activeRecording = choice;
      choice.setAttribute("aria-pressed", "true");
      status.hidden = true;
      audio.hidden = false;
      audio.setAttribute("aria-label", `${name} · ${english}`);
      sourceLink.href = source;
      sourceLink.replaceChildren(persianName.cloneNode(true), " ", englishName.cloneNode(true));
      audio.src = new URL(`./audio/${file}`, import.meta.url).href;
      audio.play().catch((error) => { if (error.name !== "AbortError" && dialog.open && activeRecording === choice) showPlaybackError(); });
    });
    choices.append(choice);
  }
  dialog.addEventListener("close", () => {
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    audio.hidden = true;
    status.hidden = true;
    activeRecording?.setAttribute("aria-pressed", "false");
    activeRecording = undefined;
  });
  document.body.append(dialog);

  const date = new Intl.DateTimeFormat("en-GB", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" });
  const clock = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  const prayerButtons = [...document.querySelectorAll("[data-adhan-time]")];
  function minutes(value) {
    const [hour, minute] = value.split(":").map(Number);
    return hour * 60 + minute;
  }
  function refresh() {
    const now = new Date();
    const today = date.format(now).replaceAll("/", "-") === day;
    const currentMinute = minutes(clock.format(now));
    for (const button of prayerButtons) {
      const nearPrayer = today && Math.abs(currentMinute - minutes(button.dataset.adhanTime)) <= 15;
      button.hidden = !nearPrayer;
      button.previousElementSibling.hidden = nearPrayer;
    }
  }
  for (const button of prayerButtons) {
    button.addEventListener("click", () => {
      const [heading, dismiss] = labels[document.documentElement.lang];
      title.textContent = `${button.textContent} · ${heading}`;
      close.textContent = dismiss;
      dialog.showModal();
    });
  }
  refresh();
  setInterval(refresh, 5000);
  document.addEventListener("visibilitychange", refresh);
}
