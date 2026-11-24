const languages = {
  en: { name: "English", menu: "Language", zone: "Time zone", zonePrompt: "Choose a time zone", myZone: "Open My Time Zone", city: "Choose a city", reference: "Time-zone reference location", source: "City data", title: "Prayer Times", consent: "Owqat needs your time zone to show local prayer times. Use this device’s time zone?" },
  fa: { name: "فارسی", flag: "iran.svg", menu: "زبان", zone: "منطقهٔ زمانی", zonePrompt: "منطقهٔ زمانی را انتخاب کنید", myZone: "باز کردن منطقهٔ زمانی من", city: "انتخاب شهر", reference: "موقعیت مرجع منطقهٔ زمانی", source: "داده‌های شهرها", title: "اوقات شرعی", consent: "اوقات شرعی محلی به منطقهٔ زمانی شما نیاز دارد. از منطقهٔ زمانی این دستگاه استفاده شود؟" },
  ar: { name: "العربية", flag: "saudi-arabia.svg", menu: "اللغة", zone: "المنطقة الزمنية", zonePrompt: "اختر منطقة زمنية", myZone: "افتح منطقتي الزمنية", city: "اختر مدينة", reference: "الموقع المرجعي للمنطقة الزمنية", source: "بيانات المدن", title: "مواقيت الصلاة", consent: "يحتاج أوقات إلى منطقتك الزمنية لعرض مواقيت الصلاة المحلية. هل تريد استخدام المنطقة الزمنية لهذا الجهاز؟" },
};

const preference = "owqat-language";

export function currentLanguage() {
  return languages[document.documentElement.lang];
}

export function updatePageTitle() {
  const language = document.documentElement.lang;
  const city = document.querySelector(`.card[lang="${language}"] [data-city]`).textContent;
  document.title = language === "en" ? `${city} ${currentLanguage().title} · Owqat` : `${currentLanguage().title} ${city} · Owqat`;
}

export function setupLanguage(root) {
  const header = document.querySelector(".masthead");
  const menu = document.createElement("div");
  menu.className = "language-picker";
  menu.setAttribute("role", "group");
  const buttons = Object.entries(languages).map(([language, { name, flag }]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.lang = language;
    if (flag) {
      const icon = document.createElement("img");
