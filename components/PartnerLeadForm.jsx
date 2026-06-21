"use client";

import { useState } from "react";

export default function PartnerLeadForm() {
  const [status, setStatus] = useState("");

  async function submitLead(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("\u041e\u0442\u043f\u0440\u0430\u0432\u043b\u044f\u0435\u043c...");
    const response = await fetch("/api/partner-leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        telegram: form.get("telegram"),
        message: form.get("message"),
      }),
    });
    setStatus(response.ok ? "\u0417\u0430\u044f\u0432\u043a\u0430 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0430" : "\u041e\u0448\u0438\u0431\u043a\u0430 \u043e\u0442\u043f\u0440\u0430\u0432\u043a\u0438");
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <form className="backend-form" onSubmit={submitLead}>
      <input name="name" placeholder="\u0418\u043c\u044f" />
      <input name="telegram" placeholder="Telegram" required />
      <textarea name="message" placeholder="\u0427\u0442\u043e \u043e\u0431\u0441\u0443\u0434\u0438\u0442\u044c?" rows="3" />
      <button className="button primary" type="submit">{"\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c"}</button>
      {status ? <small>{status}</small> : null}
    </form>
  );
}
