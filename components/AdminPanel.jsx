"use client";

import { useEffect, useMemo, useState } from "react";

const emptyDb = { categories: [], products: [], news: [], events: [], orders: [], partnerLeads: [] };

export default function AdminPanel() {
  const [token, setToken] = useState("");
  const [db, setDb] = useState(emptyDb);
  const [jsonText, setJsonText] = useState("");
  const [status, setStatus] = useState("\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430...");

  async function loadDb() {
    const response = await fetch("/api/site", { cache: "no-store" });
    const data = await response.json();
    setDb(data);
    setJsonText(JSON.stringify(data, null, 2));
    setStatus("\u0414\u0430\u043d\u043d\u044b\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043d\u044b");
  }

  async function saveDb() {
    try {
      const parsed = JSON.parse(jsonText);
      setStatus("\u0421\u043e\u0445\u0440\u0430\u043d\u044f\u0435\u043c...");
      const response = await fetch("/api/site", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(parsed),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Save error");
      setDb(data);
      setJsonText(JSON.stringify(data, null, 2));
      setStatus("\u0421\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u043e");
    } catch (error) {
      setStatus(`\u041e\u0448\u0438\u0431\u043a\u0430: ${error.message}`);
    }
  }

  useEffect(() => {
    loadDb();
  }, []);

  const stats = useMemo(() => [
    ["\u041a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u0438", db.categories?.length || 0],
    ["\u0422\u043e\u0432\u0430\u0440\u044b", db.products?.length || 0],
    ["\u041d\u043e\u0432\u043e\u0441\u0442\u0438", (db.news || db.guides)?.length || 0],
    ["\u0421\u043e\u0431\u044b\u0442\u0438\u044f", db.events?.length || 0],
    ["\u0417\u0430\u043a\u0430\u0437\u044b", db.orders?.length || 0],
    ["\u0417\u0430\u044f\u0432\u043a\u0438", db.partnerLeads?.length || 0],
  ], [db]);

  return (
    <main className="backend-admin">
      <section className="backend-admin-head">
        <div>
          <p className="eyebrow">Backend admin</p>
          <h1>DOUBLE DAMAGE CMS</h1>
          <p>{"\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u0436\u0438\u0432\u043e\u0439 \u0431\u0430\u0437\u044b \u0441\u0430\u0439\u0442\u0430: \u043a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u0438 \u043e\u0442\u0434\u0435\u043b\u044c\u043d\u043e, \u0442\u043e\u0432\u0430\u0440\u044b \u043e\u0442\u0434\u0435\u043b\u044c\u043d\u043e, \u043d\u043e\u0432\u043e\u0441\u0442\u0438, \u0441\u043e\u0431\u044b\u0442\u0438\u044f, \u0437\u0430\u043a\u0430\u0437\u044b \u0438 \u0437\u0430\u044f\u0432\u043a\u0438."}</p>
        </div>
        <div className="backend-admin-actions">
          <input value={token} onChange={(event) => setToken(event.target.value)} placeholder="ADMIN_TOKEN" />
          <button className="button ghost" type="button" onClick={loadDb}>{"\u041e\u0431\u043d\u043e\u0432\u0438\u0442\u044c"}</button>
          <button className="button primary" type="button" onClick={saveDb}>{"\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c"}</button>
        </div>
      </section>

      <section className="backend-admin-stats">
        {stats.map(([label, value]) => (
          <article key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>

      <section className="backend-admin-grid">
        <div className="backend-editor">
          <div className="backend-panel-title">
            <h2>{"\u0411\u0430\u0437\u0430 \u0434\u0430\u043d\u043d\u044b\u0445 \u0441\u0430\u0439\u0442\u0430"}</h2>
            <span>{status}</span>
          </div>
          <textarea value={jsonText} onChange={(event) => setJsonText(event.target.value)} spellCheck="false" />
        </div>

        <aside className="backend-sidebar">
          <h2>{"\u0427\u0442\u043e \u0433\u0434\u0435 \u043c\u0435\u043d\u044f\u0442\u044c"}</h2>
          <article><strong>categories</strong><span>{"\u041a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u0438 \u0438 \u043f\u043e\u0434\u043a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u0438 \u043c\u0430\u0433\u0430\u0437\u0438\u043d\u0430"}</span></article>
          <article><strong>products</strong><span>{"\u0422\u043e\u0432\u0430\u0440\u044b, \u0446\u0435\u043d\u044b, \u0444\u043e\u0442\u043e, \u043d\u0430\u043b\u0438\u0447\u0438\u0435 \u0438 \u043e\u043f\u0438\u0441\u0430\u043d\u0438\u044f"}</span></article>
          <article><strong>content</strong><span>{"\u0413\u043b\u0430\u0432\u043d\u0430\u044f, Telegram, \u043f\u0430\u0440\u0442\u043d\u0435\u0440\u0441\u043a\u0438\u0439 \u0431\u043b\u043e\u043a \u0438 \u043e\u0431\u0449\u0438\u0435 \u0442\u0435\u043a\u0441\u0442\u044b"}</span></article>
          <h2>{"\u041d\u043e\u0432\u044b\u0435 \u0437\u0430\u043a\u0430\u0437\u044b"}</h2>
          {(db.orders || []).slice(0, 6).map((order) => (
            <article key={order.id}>
              <strong>{order.contact?.telegram || "\u0411\u0435\u0437 Telegram"}</strong>
              <span>{order.items?.[0]?.name || "\u0417\u0430\u043a\u0430\u0437"}</span>
              <small>{order.createdAt}</small>
            </article>
          ))}
          <h2>{"\u0417\u0430\u044f\u0432\u043a\u0438 \u043f\u0430\u0440\u0442\u043d\u0435\u0440\u043e\u0432"}</h2>
          {(db.partnerLeads || []).slice(0, 6).map((lead) => (
            <article key={lead.id}>
              <strong>{lead.telegram || "\u0411\u0435\u0437 Telegram"}</strong>
              <span>{lead.name || "\u041f\u0430\u0440\u0442\u043d\u0435\u0440"}</span>
              <small>{lead.message}</small>
            </article>
          ))}
        </aside>
      </section>
    </main>
  );
}
