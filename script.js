// script.js
const LANG_DIR = 'lang/';
const CACHE_KEY = 'app_prefs';

async function loadLang(lang) {
  try {
    const res = await fetch(`${LANG_DIR}${lang}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Translation load failed:', err);
    return null;
  }
}

function applyTranslations(data) {
  if (!data) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const [ns, key] = el.dataset.i18n.split('.');
    if (data[ns]?.[key]) el.textContent = data[ns][key];
  });
}

function setLang(lang) {
  loadLang(lang).then(data => {
    if (data) {
      applyTranslations(data);
      document.documentElement.lang = lang;
      // Авто-RTL для арабского
      const isRTL = lang === 'ar';
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      updateControls('lang', lang);
      savePref('lang', lang);
    }
  });
}

function setDir(dir) {
  document.documentElement.dir = dir;
  updateControls('dir', dir);
  savePref('dir', dir);
}

function updateControls(type, value) {
  document.querySelectorAll(`.ctrl[data-${type}]`).forEach(btn => {
    btn.classList.toggle('active', btn.dataset[type] === value);
  });
}

function savePref(key, value) {
  const prefs = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  prefs[key] = value;
  localStorage.setItem(CACHE_KEY, JSON.stringify(prefs));
}

function loadPrefs() {
  const prefs = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  setLang(prefs.lang || 'ru');
  setDir(prefs.dir || 'ltr');
}

// Init
document.addEventListener('DOMContentLoaded', loadPrefs);
