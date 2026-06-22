const fs = require("fs");
const { TextDecoder } = require("util");

const cp1251 = new TextDecoder("windows-1251");
const reverseCp1251 = new Map();
for (let byte = 0; byte < 256; byte += 1) {
  reverseCp1251.set(cp1251.decode(Uint8Array.of(byte)), byte);
}

function fixMojibake(value) {
  if (typeof value !== "string" || !/[\u0400-\u045f]/.test(value)) return value;
  const bytes = [];
  for (const char of value) {
    if (reverseCp1251.has(char)) {
      bytes.push(reverseCp1251.get(char));
    } else if (char.charCodeAt(0) <= 255) {
      bytes.push(char.charCodeAt(0));
    } else {
      return value;
    }
  }
  const decoded = Buffer.from(bytes).toString("utf8");
  return decoded.includes("\uFFFD") ? value : decoded;
}

function walk(value) {
  if (Array.isArray(value)) return value.map(walk);
  if (value && typeof value === "object") {
    for (const key of Object.keys(value)) value[key] = walk(value[key]);
    return value;
  }
  return fixMojibake(value);
}

const dbPath = "data/db.json";
const data = walk(JSON.parse(fs.readFileSync(dbPath, "utf8").replace(/^\uFEFF/, "")));
fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");

const staticPath = "lib/staticTemplate.js";
let source = fs.readFileSync(staticPath, "utf8");
const initialText = `const initialText = {
  home: "\u0413\u043e\u043b\u043e\u0432\u043d\u0430",
  shop: "\u041c\u0430\u0433\u0430\u0437\u0438\u043d",
  guides: "\u041d\u043e\u0432\u0438\u043d\u0438",
  events: "\u041f\u043e\u0434\u0456\u0457",
  partners: "\u041f\u0430\u0440\u0442\u043d\u0435\u0440\u0438",
  cart: "\u041a\u043e\u0448\u0438\u043a",
  cartOrder: "\u0412\u0430\u0448\u0435 \u0437\u0430\u043c\u043e\u0432\u043b\u0435\u043d\u043d\u044f",
  total: "\u0420\u0430\u0437\u043e\u043c",
  drops: "\u0413\u0430\u0440\u044f\u0447\u0456 \u0434\u0440\u043e\u043f\u0438",
  telegramText: "\u041f\u0456\u0434\u043f\u0438\u0448\u0456\u0442\u044c\u0441\u044f \u0442\u0430 \u043e\u0442\u0440\u0438\u043c\u0443\u0439\u0442\u0435 \u043d\u0430\u0439\u043a\u043e\u0440\u0438\u0441\u043d\u0456\u0448\u0443 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044e",
  subscribe: "\u041f\u0456\u0434\u043f\u0438\u0441\u0430\u0442\u0438\u0441\u044f \u043d\u0430 \u043a\u0430\u043d\u0430\u043b",
  howEyebrow: "\u041f\u0440\u043e\u0446\u0435\u0441 \u0440\u043e\u0431\u043e\u0442\u0438",
  howTitle: "\u042f\u043a \u043c\u0438 \u043f\u0440\u0430\u0446\u044e\u0454\u043c\u043e?",
  howText: "\u041f\u0440\u043e\u0441\u0442\u0438\u0439 \u043f\u0440\u043e\u0446\u0435\u0441 \u0432\u0456\u0434 \u0432\u0438\u0431\u043e\u0440\u0443 \u0434\u043e \u043e\u0442\u0440\u0438\u043c\u0430\u043d\u043d\u044f",
};`;
source = source.replace(/const initialText = \{[\s\S]*?\n\};/, initialText);
source = source.replace(
  /<nav class="main-nav">[\s\S]*?<\/nav>/,
  `<nav class="main-nav">
        <a href="/" data-i18n="home">\u0413\u043e\u043b\u043e\u0432\u043d\u0430</a>
        <a href="/shop" data-i18n="shop">\u041c\u0430\u0433\u0430\u0437\u0438\u043d</a>
        <a href="/events" data-i18n="events">\u041f\u043e\u0434\u0456\u0457</a>
        <a href="/guides" data-i18n="guides">\u041d\u043e\u0432\u0438\u043d\u0438</a>
        <a href="/partners" data-i18n="partners">\u041f\u0430\u0440\u0442\u043d\u0435\u0440\u0438</a>
      </nav>`
);
source = source.replace(/data-replace-link>[\s\S]*?<\/a><button class="theme-toggle"/, 'data-replace-link>\u0417\u0430\u043c\u0456\u043d\u0430 \u0442\u043e\u0432\u0430\u0440\u0443</a><button class="theme-toggle"');
fs.writeFileSync(staticPath, source, "utf8");

