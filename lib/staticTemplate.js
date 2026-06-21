import { readFileSync } from "node:fs";
import path from "node:path";

const pageMap = {
  index: "/",
  shop: "/shop",
  product: "/product",
  article: "/article",
  events: "/events",
  guides: "/guides",
  partners: "/partners",
  replace: "/replace",
  admin: "/admin",
};

const initialText = {
  home: "Головна",
  shop: "Магазин",
  guides: "Новини",
  events: "Події",
  partners: "Партнери",
  cart: "Кошик",
  cartOrder: "Ваше замовлення",
  total: "Разом",
  drops: "Гарячі дропи",
  telegramText: "Підпишіться та отримуйте найкориснішу інформацію",
  subscribe: "Підписатися на канал",
  howEyebrow: "Процес роботи",
  howTitle: "Як ми працюємо?",
  howText: "Простий процес від вибору до отримання",
};

function replaceElementText(html, key, value) {
  const pattern = new RegExp(`(<([a-z0-9]+)\\b[^>]*data-i18n=["']${key}["'][^>]*>)([\\s\\S]*?)(<\\/\\2>)`, "gi");
  return html.replace(pattern, `$1${value}$4`);
}

function normalizeInitialHtml(html) {
  let next = html;

  for (const [key, value] of Object.entries(initialText)) {
    next = replaceElementText(next, key, value);
  }

  next = next.replace(
    /<nav class=["']main-nav["'][^>]*>[\s\S]*?<\/nav>/gi,
    `<nav class="main-nav">
        <a href="/" data-i18n="home">Головна</a>
        <a href="/shop" data-i18n="shop">Магазин</a>
        <a href="/events" data-i18n="events">Події</a>
        <a href="/guides" data-i18n="guides">Новини</a>
        <a href="/partners" data-i18n="partners">Партнери</a>
      </nav>`
  );

  next = next.replace(
    /<div class=["']lang-switch["'] data-lang-switch><\/div>/gi,
    `<div class="lang-switch" data-lang-switch><button class="active" type="button" data-lang="ua">UA</button><button type="button" data-lang="en">ENG</button><button type="button" data-lang="ru">RU</button></div>`
  );

  next = next.replace(
    /<button class=["']cart-button["'] type=["']button["'] data-cart-open>[\s\S]*?<\/button>/gi,
    `<button class="cart-button" type="button" data-cart-open><span data-i18n="cart">Кошик</span><strong data-cart-count>0</strong></button>`
  );

  next = next.replace(/<a class=["']telegram-pill["'][\s\S]*?<\/a>/gi, "");

  next = next.replace(/(<div class=["']header-tools["'][^>]*>)([\s\S]*?)(<button class=["']cart-button["'][\s\S]*?<\/button>)/gi, (match, open, middle, cartButton) => {
    if (match.includes("data-replace-link") || match.includes("data-theme-toggle")) return match;
    return `${open}${middle}<a class="replace-pill" href="/replace" data-replace-link>Заміна товару</a><button class="theme-toggle" type="button" data-theme-toggle>Light</button>${cartButton}`;
  });

  return next;
}

export function readStaticTemplate(name) {
  const file = path.join(process.cwd(), "templates", `${name}.php`);
  const raw = readFileSync(file, "utf8");
  const bodyMatch = raw.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  const attrs = bodyMatch?.[1] || "";
  let html = bodyMatch?.[2] || raw;
  const classMatch = attrs.match(/class=["']([^"']+)["']/i);

  html = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi, "");

  for (const [page, route] of Object.entries(pageMap)) {
    html = html
      .replaceAll(`${page}.php#`, `${route === "/" ? "" : route}#`)
      .replaceAll(`${page}.html#`, `${route === "/" ? "" : route}#`)
      .replaceAll(`${page}.php?`, `${route}?`)
      .replaceAll(`${page}.html?`, `${route}?`)
      .replaceAll(`${page}.php`, route)
      .replaceAll(`${page}.html`, route);
  }

  html = html.replaceAll('href="#contact"', 'href="/#contact"');
  html = normalizeInitialHtml(html);

  return {
    className: classMatch?.[1] || "",
    html,
  };
}
