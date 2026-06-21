export const LANG = "ua";

export function text(value, lang = LANG) {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  return value[lang] || value.ua || value.ru || value.en || "";
}

export function visible(items = []) {
  return items.filter((item) => item && item.visible !== false);
}
