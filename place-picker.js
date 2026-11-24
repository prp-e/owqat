const messages = {
  en: { map: "Choose on map", locate: "Use my location", center: "Choose map center", select: "Use this city", hint: "Tap the map or choose its center to find the nearest listed city.", locating: "Finding your location…", denied: "Location access was denied. You can still choose on the map.", unavailable: "Could not find your location. Try again or choose on the map.", mapError: "The map could not load. You can still choose a city from the list.", cityError: "Could not look up a nearby city. Try again or choose from the list.", finding: "Finding the nearest listed city…", nearest: "Nearest listed city" },
  fa: { map: "انتخاب روی نقشه", locate: "استفاده از موقعیت من", center: "انتخاب مرکز نقشه", select: "انتخاب این شهر", hint: "روی نقشه بزنید یا مرکز آن را انتخاب کنید تا نزدیک‌ترین شهر پیدا شود.", locating: "در حال یافتن موقعیت شما…", denied: "دسترسی به موقعیت رد شد. می‌توانید روی نقشه انتخاب کنید.", unavailable: "موقعیت پیدا نشد. دوباره تلاش کنید یا روی نقشه انتخاب کنید.", mapError: "نقشه بارگیری نشد. می‌توانید شهری از فهرست انتخاب کنید.", cityError: "شهر نزدیک پیدا نشد. دوباره تلاش کنید یا از فهرست انتخاب کنید.", finding: "در حال یافتن نزدیک‌ترین شهر فهرست…", nearest: "نزدیک‌ترین شهر فهرست" },
  ar: { map: "اختر على الخريطة", locate: "استخدم موقعي", center: "اختر مركز الخريطة", select: "اختر هذه المدينة", hint: "اضغط على الخريطة أو اختر مركزها للعثور على أقرب مدينة في القائمة.", locating: "جارٍ تحديد موقعك…", denied: "تم رفض الوصول إلى الموقع. يمكنك الاختيار على الخريطة.", unavailable: "تعذّر تحديد موقعك. أعد المحاولة أو اختر على الخريطة.", mapError: "تعذّر تحميل الخريطة. يمكنك اختيار مدينة من القائمة.", cityError: "تعذّر العثور على مدينة قريبة. أعد المحاولة أو اختر من القائمة.", finding: "جارٍ البحث عن أقرب مدينة في القائمة…", nearest: "أقرب مدينة في القائمة" },
};
const language = navigator.language.split("-")[0];
const copy = messages[language] ?? messages.en;

function loadLeafletAsset(element, integrity) {
  return new Promise((resolve, reject) => {
    element.integrity = integrity;
