import { text } from "@/lib/text";

export default function TelegramBlock({ content = {} }) {
  return (
    <section className="telegram-section">
      <div className="telegram-art">
        <div className="graffiti-badge">{content.brandMark || "DD"}</div>
      </div>
      <div className="telegram-copy">
        <p className="eyebrow">Telegram</p>
        <h2>{text(content.telegramTitle) || "\u041f\u0456\u0434\u043f\u0438\u0448\u0438\u0441\u044c \u0432 Telegram"}</h2>
        <p>{text(content.telegramText) || "\u0411\u0443\u0434\u044c \u0432 \u043a\u0443\u0440\u0441\u0456 \u0432\u0441\u0456\u0445 \u043f\u043e\u0434\u0456\u0439 DOUBLE DAMAGE"}</p>
      </div>
      <a className="button blue-button" href={content.telegramUrl || "https://t.me/"} target="_blank" rel="noreferrer">
        {"\u2197"} {text(content.subscribeButton || content.telegramButton) || "\u041f\u0456\u0434\u043f\u0438\u0441\u0430\u0442\u0438\u0441\u044f \u043d\u0430 \u043a\u0430\u043d\u0430\u043b"}
      </a>
    </section>
  );
}
