const languages = {
  en: { name: "English", flag: "usa.svg", menu: "Language", zone: "Time zone", zonePrompt: "Choose a time zone", myZone: "Open My Time Zone", city: "Choose a city", reference: "Time-zone reference location", source: "City data", title: "Prayer Times", consent: "Owqat needs your time zone to show local prayer times. Use this device’s time zone?" },
  fa: { name: "فارسی", flag: "iran.svg", menu: "زبان", zone: "منطقهٔ زمانی", zonePrompt: "منطقهٔ زمانی را انتخاب کنید", myZone: "باز کردن منطقهٔ زمانی من", city: "انتخاب شهر", reference: "موقعیت مرجع منطقهٔ زمانی", source: "داده‌های شهرها", title: "اوقات شرعی", consent: "اوقات شرعی محلی به منطقهٔ زمانی شما نیاز دارد. از منطقهٔ زمانی این دستگاه استفاده شود؟" },
  ar: { name: "العربية", flag: "saudi-arabia.svg", menu: "اللغة", zone: "المنطقة الزمنية", zonePrompt: "اختر منطقة زمنية", myZone: "افتح منطقتي الزمنية", city: "اختر مدينة", reference: "الموقع المرجعي للمنطقة الزمنية", source: "بيانات المدن", title: "مواقيت الصلاة", consent: "يحتاج أوقات إلى منطقتك الزمنية لعرض مواقيت الصلاة المحلية. هل تريد استخدام المنطقة الزمنية لهذا الجهاز؟" },
  ru: { name: "Русский", flag: "russia.svg", menu: "Язык", zone: "Часовой пояс", zonePrompt: "Выберите часовой пояс", myZone: "Открыть мой часовой пояс", city: "Выберите город", reference: "Опорная точка часового пояса", source: "Данные о городах", title: "Время намаза", consent: "Owqat нужен ваш часовой пояс, чтобы показать местное время намаза. Использовать часовой пояс этого устройства?" },
};

const preference = "owqat-language";

export function currentLanguage() {
  return languages[document.documentElement.lang];
}

export function russianCityName(city, zone, names) {
  const reference = zone.split("/").at(-1).replaceAll("_", " ");
  if ([city, city.replace(/ City$/, "")].some((name) => name.toLowerCase() === reference.toLowerCase())) return names[zone];
}

export function updatePageTitle() {
  const language = document.documentElement.lang;
  const city = document.querySelector(`.card[lang="${language}"] [data-city]`).textContent;
  document.title = language === "en" ? `${city} ${currentLanguage().title} · Owqat` : `${currentLanguage().title} ${city} · Owqat`;
}

function addRussianContent(guide) {
  const english = document.querySelector('.card[lang="en"]');
  const card = english.cloneNode(true);
  card.lang = "ru";
  card.setAttribute("aria-labelledby", "prayer-city-ru");
  card.querySelector(".hero > p").textContent = "Время намаза";
  card.querySelector("[data-city]").id = "prayer-city-ru";
  card.querySelector("[data-city]").textContent = "Тегеран";
  const dateLabels = ["Григорианский календарь", "Солнечная хиджра", "Лунная хиджра"];
  card.querySelectorAll(".dates dt").forEach((label, index) => { label.textContent = dateLabels[index]; });
  card.querySelector("[data-status]").textContent = "Загружаем время намаза на сегодня…";
  card.querySelector("footer").firstChild.textContent = "Местное время · ";
  guide.before(card);
  guide.querySelector(".city-source").insertAdjacentHTML("beforebegin", `<div lang="ru"><h2>О часовых поясах IANA</h2>
    <p><a href="https://www.iana.org/time-zones">База данных IANA</a> хранит правила местного времени для таких зон, как <bdi><code>Europe/Dublin</code></bdi>. Выберите город, чтобы узнать время намаза в нём. По умолчанию используется опорная точка часового пояса.</p></div>`);
}

export function setupLanguage(root) {
  const header = document.querySelector(".masthead");
  const menu = document.createElement("div");
  menu.className = "language-picker";
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
  header.prepend(menu);
  const guide = document.querySelector('[aria-labelledby="guide-en"]');
  guide.classList.add("language-guide");
  addRussianContent(guide);
  const citySource = guide.querySelector(".city-source");
  const zonePicker = header.querySelector("#time-zone");
  const cityPicker = document.querySelector("#city");
  function applyLanguage(language) {
    document.documentElement.lang = language;
    document.documentElement.dir = ["fa", "ar"].includes(language) ? "rtl" : "ltr";
    const copy = currentLanguage();
    options.setAttribute("aria-label", copy.menu);
    summary.lang = language;
    summary.setAttribute("aria-label", `${copy.menu}: ${copy.name}`);
    const selected = buttons.find((button) => button.lang === language);
    summary.replaceChildren(...Array.from(selected.childNodes, (node) => node.cloneNode(true)));
    for (const button of buttons) button.setAttribute("aria-pressed", button.lang === language);
    header.querySelector('[for="time-zone"]').textContent = copy.zone;
    header.querySelector("[data-my-zone]").textContent = copy.myZone;
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
