import { text } from "@/lib/text";

export default function PartnerCta({ content = {} }) {
  return (
    <section className="partner-cta">
      <div>
        <p className="eyebrow">{text(content.partnerCtaEyebrow) || "\u041f\u0430\u0440\u0442\u043d\u0435\u0440\u0441\u0442\u0432\u043e"}</p>
        <h2>{text(content.partnerCtaTitle) || "\u0421\u0442\u0430\u0442\u0438 \u043f\u0430\u0440\u0442\u043d\u0435\u0440\u043e\u043c DOUBLE DAMAGE"}</h2>
        <p>{text(content.partnerCtaText) || "\u0417\u0430\u043b\u0438\u0448\u0442\u0435 \u043a\u043e\u043d\u0442\u0430\u043a\u0442 \u0430\u0431\u043e \u043d\u0430\u043f\u0438\u0448\u0456\u0442\u044c \u043d\u0430\u043c \u0443 Telegram."}</p>
      </div>
      <a className="button primary" href={content.telegramUrl || "https://t.me/"} target="_blank" rel="noreferrer">
        {text(content.partnerCtaButton) || "\u0417\u0432'\u044f\u0437\u0430\u0442\u0438\u0441\u044f"}
      </a>
    </section>
  );
}
