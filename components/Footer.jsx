import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <Link className="brand" href="/">
          <span className="brand-mark">DD</span>
          <span>DOUBLE DAMAGE</span>
        </Link>
        <p>Digital marketplace {"\u0434\u043b\u044f \u0430\u0440\u0431\u0438\u0442\u0440\u0430\u0436\u043d\u0438\u043a\u043e\u0432, \u043c\u0435\u0434\u0438\u0430\u0431\u0430\u0435\u0440\u043e\u0432, SMM \u0438 Telegram-\u043a\u043e\u043c\u0430\u043d\u0434."}</p>
      </div>
      <div className="footer-col">
        <strong>{"\u041d\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044f"}</strong>
        <Link href="/">{"\u0413\u043b\u0430\u0432\u043d\u0430\u044f"}</Link>
        <Link href="/shop">{"\u041c\u0430\u0433\u0430\u0437\u0438\u043d"}</Link>
        <Link href="/guides">{"\u041d\u043e\u0432\u043e\u0441\u0442\u0438"}</Link>
        <Link href="/events">{"\u0421\u043e\u0431\u044b\u0442\u0438\u044f"}</Link>
        <Link href="/partners">{"\u041f\u0430\u0440\u0442\u043d\u0435\u0440\u044b"}</Link>
      </div>
    </footer>
  );
}
