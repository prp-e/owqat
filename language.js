const languages = {
  en: { locationSettings: "Location settings", theme: "Dark mode", name: "English", flag: "usa.svg", menu: "Language", zone: "Time zone", zonePrompt: "Choose a time zone", myZone: "Open My Time Zone", city: "Choose a city", reference: "Time-zone reference location", source: "City data", title: "Prayer Times", consent: "Owqat needs your time zone to show local prayer times. Use this device’s time zone?" },
  fa: { locationSettings: "تنظیمات موقعیت", theme: "حالت تیره", name: "فارسی", flag: "iran.svg", menu: "زبان", zone: "منطقهٔ زمانی", zonePrompt: "منطقهٔ زمانی را انتخاب کنید", myZone: "باز کردن منطقهٔ زمانی من", city: "انتخاب شهر", reference: "موقعیت مرجع منطقهٔ زمانی", source: "داده‌های شهرها", title: "اوقات شرعی", consent: "اوقات شرعی محلی به منطقهٔ زمانی شما نیاز دارد. از منطقهٔ زمانی این دستگاه استفاده شود؟" },
  ar: { locationSettings: "إعدادات الموقع", theme: "الوضع الداكن", name: "العربية", flag: "saudi-arabia.svg", menu: "اللغة", zone: "المنطقة الزمنية", zonePrompt: "اختر منطقة زمنية", myZone: "افتح منطقتي الزمنية", city: "اختر مدينة", reference: "الموقع المرجعي للمنطقة الزمنية", source: "بيانات المدن", title: "مواقيت الصلاة", consent: "يحتاج أوقات إلى منطقتك الزمنية لعرض مواقيت الصلاة المحلية. هل تريد استخدام المنطقة الزمنية لهذا الجهاز؟" },
  ps: { locationSettings: "د ځای امستنې", theme: "تیاره بڼه", name: "پښتو", flag: "afghanistan-emirate.svg", menu: "ژبه", zone: "وخت‌سیمه", zonePrompt: "یوه وخت‌سیمه وټاکئ", myZone: "زما وخت‌سیمه پرانیزئ", city: "ښار وټاکئ", reference: "د وخت‌سیمې مرجع ځای", source: "د ښارونو معلومات", title: "د لمانځه وختونه", consent: "د لمانځه د ځايي وختونو د ښودلو لپاره ستاسو وخت‌سیمې ته اړتیا ده. د دې وسیلې وخت‌سیمه وکاروو؟" },
  ur: { locationSettings: "مقام کی ترتیبات", theme: "گہرا رنگ", name: "اردو", flag: "pakistan.svg", menu: "زبان", zone: "منطقۂ وقت", zonePrompt: "منطقۂ وقت منتخب کریں", myZone: "میرا منطقۂ وقت کھولیں", city: "شہر منتخب کریں", reference: "منطقۂ وقت کا حوالہ جاتی مقام", source: "شہروں کا ڈیٹا", title: "اوقاتِ نماز", consent: "مقامی اوقاتِ نماز دکھانے کے لیے اوقات کو آپ کا منطقۂ وقت درکار ہے۔ کیا اس آلے کا منطقۂ وقت استعمال کریں؟" },
  ms: { locationSettings: "Tetapan lokasi", theme: "Mod gelap", name: "Bahasa Melayu", flag: "malaysia.svg", menu: "Bahasa", zone: "Zon waktu", zonePrompt: "Pilih zon waktu", myZone: "Buka zon waktu saya", city: "Pilih bandar", reference: "Lokasi rujukan zon waktu", source: "Data bandar", title: "Waktu Solat", consent: "Owqat memerlukan zon waktu anda untuk memaparkan waktu solat setempat. Gunakan zon waktu peranti ini?" },
  ru: { locationSettings: "Настройки местоположения", theme: "Тёмная тема", name: "Русский", flag: "russia.svg", menu: "Язык", zone: "Часовой пояс", zonePrompt: "Выберите часовой пояс", myZone: "Открыть мой часовой пояс", city: "Выберите город", reference: "Опорная точка часового пояса", source: "Данные о городах", title: "Время намаза", consent: "Owqat нужен ваш часовой пояс, чтобы показать местное время намаза. Использовать часовой пояс этого устройства?" },
  tr: { locationSettings: "Konum ayarları", theme: "Koyu mod", name: "Türkçe", flag: "turkey.svg", menu: "Dil", zone: "Saat dilimi", zonePrompt: "Bir saat dilimi seçin", myZone: "Saat dilimimi aç", city: "Şehir seçin", reference: "Saat diliminin referans konumu", source: "Şehir verileri", title: "Namaz vakitleri", consent: "Owqat, yerel namaz vakitlerini göstermek için saat diliminize ihtiyaç duyar. Bu cihazın saat dilimi kullanılsın mı?" },
};

const preference = "owqat-language";
const rtlLanguages = new Set(["fa", "ar", "ps", "ur"]);

export function currentLanguage() {
  return languages[document.documentElement.lang];
}

export function referenceCityName(city, zone, names) {
  const reference = zone.split("/").at(-1).replaceAll("_", " ");
  if ([city, city.replace(/ City$/, "")].some((name) => name.toLowerCase() === reference.toLowerCase())) return names?.[zone];
}

export function updatePageTitle() {
  const language = document.documentElement.lang;
  const city = document.querySelector(`.card[lang="${language}"] [data-city]`).textContent;
  document.title = ["en", "tr"].includes(language) ? `${city} ${currentLanguage().title} · Owqat` : `${currentLanguage().title} ${city} · Owqat`;
}

const additionalContent = {
  ps: {
    city: "تهران", dates: ["میلادي نېټه", "هجري لمریزه نېټه", "هجري قمري نېټه"],
    loading: "د نن ورځې د لمانځه وختونه بارېږي…", local: "ځايي وخت", guide: "د IANA وخت‌سیمو په اړه",
    description: '<a href="https://www.iana.org/time-zones">د IANA ډیټابېس</a> د <bdi><code>Europe/Dublin</code></bdi> په څېر د وخت‌سیمو د ځايي وخت اصول ساتي. د یوه ښار د لمانځه وختونو د کتلو لپاره هغه ښار وټاکئ. په تلواله د وخت‌سیمې مرجع ځای کارول کېږي.',
  },
  ur: {
    city: "تہران", dates: ["عیسوی تاریخ", "شمسی ہجری تاریخ", "قمری ہجری تاریخ"],
    loading: "آج کے اوقاتِ نماز لوڈ ہو رہے ہیں…", local: "مقامی وقت", guide: "IANA کے منطقہ ہائے وقت کے بارے میں",
    description: '<a href="https://www.iana.org/time-zones">IANA کا ڈیٹابیس</a> <bdi><code>Europe/Dublin</code></bdi> جیسے منطقہ ہائے وقت کے مقامی وقت کے قواعد محفوظ رکھتا ہے۔ کسی شہر کے اوقاتِ نماز دیکھنے کے لیے وہ شہر منتخب کریں۔ پہلے سے طے شدہ طور پر منطقۂ وقت کا حوالہ جاتی مقام استعمال ہوتا ہے۔',
  },
  ms: {
    city: "Tehran", dates: ["Tarikh Masihi", "Tarikh Hijrah Syamsiah", "Tarikh Hijrah Qamariah"],
    loading: "Waktu solat hari ini sedang dimuatkan…", local: "Waktu setempat", guide: "Perihal zon waktu IANA",
    description: '<a href="https://www.iana.org/time-zones">Pangkalan data IANA</a> menyimpan peraturan waktu setempat bagi zon waktu seperti <bdi><code>Europe/Dublin</code></bdi>. Pilih bandar untuk melihat waktu solatnya. Secara lalai, lokasi rujukan zon waktu digunakan.',
  },
  ru: {
    city: "Тегеран", dates: ["Григорианский календарь", "Солнечная хиджра", "Лунная хиджра"],
    loading: "Загружаем время намаза на сегодня…", local: "Местное время", guide: "О часовых поясах IANA",
    description: '<a href="https://www.iana.org/time-zones">База данных IANA</a> хранит правила местного времени для таких зон, как <bdi><code>Europe/Dublin</code></bdi>. Выберите город, чтобы узнать время намаза в нём. По умолчанию используется опорная точка часового пояса.',
  },
  tr: {
    city: "Tahran", dates: ["Miladi takvim", "Hicrî şemsî takvim", "Hicrî kamerî takvim"],
    loading: "Bugünün namaz vakitleri yükleniyor…", local: "Yerel saat", guide: "IANA saat dilimleri hakkında",
    description: '<a href="https://www.iana.org/time-zones">IANA veritabanı</a>, <bdi><code>Europe/Dublin</code></bdi> gibi saat dilimlerinin yerel saat kurallarını tutar. Bir şehrin namaz vakitlerini görmek için o şehri seçin. Varsayılan olarak saat diliminin referans konumu kullanılır.',
  },
};

function addLocalizedContent(guide) {
  const english = document.querySelector('.card[lang="en"]');
  for (const [language, content] of Object.entries(additionalContent)) {
    const card = english.cloneNode(true);
    const cityId = `prayer-city-${language}`;
    card.lang = language;
    card.dir = rtlLanguages.has(language) ? "rtl" : "ltr";
    card.setAttribute("aria-labelledby", cityId);
    card.querySelector(".hero > p").textContent = languages[language].title;
    card.querySelector("[data-city]").id = cityId;
    card.querySelector("[data-city]").textContent = content.city;
    card.querySelectorAll(".dates dt").forEach((label, index) => { label.textContent = content.dates[index]; });
    card.querySelector("[data-status]").textContent = content.loading;
    card.querySelector("footer").firstChild.textContent = content.local + " · ";
    guide.before(card);
    guide.querySelector(".city-source").insertAdjacentHTML("beforebegin", `<div lang="${language}"><h2>${content.guide}</h2><p>${content.description}</p></div>`);
  }
}

function addThemeSwitch(menu) {
  const key = "owqat-theme";
  const root = document.documentElement;
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "theme-switch";
  button.setAttribute("role", "switch");
  button.innerHTML = `
    <svg class="sun-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"></path>
    </svg>
    <svg class="moon-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.9 13.3A9 9 0 0 1 10.7 3.1a9 9 0 1 0 10.2 10.2Z"></path>
    </svg>`;
  menu.append(button);
  let saved;
  try { saved = localStorage.getItem(key); } catch { /* Use the system preference. */ }
  if (saved === "light" || saved === "dark") root.dataset.theme = saved;

  function sync() {
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : system.matches;
    button.setAttribute("aria-checked", dark);
    document.querySelector('meta[name="theme-color"]').content = getComputedStyle(document.body).backgroundColor;
  }

  button.addEventListener("click", () => {
    root.dataset.theme = button.getAttribute("aria-checked") === "true" ? "light" : "dark";
    try { localStorage.setItem(key, root.dataset.theme); } catch { /* Keep the theme for this page. */ }
    sync();
  });
  system.addEventListener("change", sync);
  sync();
  return button;
}

export function setupLanguage(root) {
  const header = document.querySelector(".masthead");
  const menu = document.createElement("div");
  menu.className = "language-picker";
  const themeSwitch = addThemeSwitch(menu);
  const dropdown = document.createElement("details");
  const summary = document.createElement("summary");
  const options = document.createElement("div");
  options.className = "language-options";
  options.setAttribute("role", "group");
  dropdown.append(summary, options);
  menu.append(dropdown);
  dropdown.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !dropdown.open) return;
    event.preventDefault();
    dropdown.open = false;
    summary.focus();
  });
  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) dropdown.open = false;
  });
  const buttons = Object.entries(languages).map(([language, { name, flag }]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.lang = language;
    if (flag) {
      const icon = document.createElement("img");
      icon.src = new URL(`flags/${flag}`, root);
      icon.alt = "";
      button.append(icon);
    }
    button.append(name);
    button.addEventListener("click", () => {
      try { localStorage.setItem(preference, language); } catch { /* Switch for the current page. */ }
      applyLanguage(language);
      dropdown.open = false;
      summary.focus();
    });
    options.append(button);
    return button;
  });
  header.append(menu);
  const guide = document.querySelector('[aria-labelledby="guide-en"]');
  guide.classList.add("language-guide");
  addLocalizedContent(guide);
  const locationSettings = document.createElement("details");
  locationSettings.className = "location-settings";
  const locationSummary = document.createElement("summary");
  locationSettings.append(locationSummary, guide);
  const citySource = guide.querySelector(".city-source");
  const zonePicker = header.querySelector("#time-zone");
  const cityPicker = document.querySelector("#city");
  function applyLanguage(language) {
    document.documentElement.lang = language;
    document.documentElement.dir = rtlLanguages.has(language) ? "rtl" : "ltr";
    const copy = currentLanguage();
    themeSwitch.setAttribute("aria-label", copy.theme);
    options.setAttribute("aria-label", copy.menu);
    summary.lang = language;
    summary.setAttribute("aria-label", `${copy.menu}: ${copy.name}`);
    const selected = buttons.find((button) => button.lang === language);
    summary.replaceChildren(...Array.from(selected.childNodes, (node) => node.cloneNode(true)));
    for (const button of buttons) button.setAttribute("aria-pressed", button.lang === language);
    zonePicker.labels[0].textContent = copy.zone;
    document.querySelector("[data-my-zone]").textContent = copy.myZone;
    if (!zonePicker.disabled) zonePicker.options[0].textContent = copy.zonePrompt;
    document.querySelector("#city-label").textContent = copy.city;
    cityPicker.dir = document.documentElement.dir;
    cityPicker.options[0].textContent = copy.reference;
    for (const option of cityPicker.querySelectorAll("[data-en]")) option.textContent = option.dataset[language] || option.dataset.en;
    const heading = language === "en" ? guide.querySelector("#guide-en") : guide.querySelector(`[lang="${language}"] h2`);
    heading.id ||= `guide-${language}`;
    guide.setAttribute("aria-labelledby", heading.id);
    citySource.firstChild.textContent = copy.source + " · ";
    updatePageTitle();
    document.dispatchEvent(new Event("owqat-language-change"));
  }

  let saved;
  try { saved = localStorage.getItem(preference); } catch { /* Default to English. */ }
  applyLanguage(Object.hasOwn(languages, saved) ? saved : "en");
}
