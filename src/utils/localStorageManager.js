const STORAGE_KEY = 'mortgage-inputs';

export const saveInputs = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Не удалось сохранить в localStorage (возможно, лимит или блокировка)', e);
  }
};

export const loadInputs = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.warn('Ошибка парсинга localStorage, используем дефолты');
    return null;
  }
};