"use client";

import { useState } from "react";
import { text } from "@/lib/text";

export default function ProductOrderForm({ product, compact = false }) {
  const [status, setStatus] = useState("");
  const productName = text(product.name);

  async function sendOrder(contact = {}, comment = "") {
    setStatus("\u0421\u043e\u0437\u0434\u0430\u0451\u043c \u0437\u0430\u043a\u0430\u0437...");
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ productId: product.id, name: productName, price: product.price, qty: 1 }],
        contact,
        comment,
      }),
    });
    setStatus(response.ok ? "\u0417\u0430\u043a\u0430\u0437 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d" : "\u041e\u0448\u0438\u0431\u043a\u0430 \u043e\u0442\u043f\u0440\u0430\u0432\u043a\u0438");
    return response.ok;
  }

  async function submitOrder(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const ok = await sendOrder({
      telegram: form.get("telegram"),
      name: form.get("name"),
    }, form.get("comment"));
    if (ok) event.currentTarget.reset();
  }

  if (compact) {
    return (
      <div className="product-actions product-detail-actions">
        <button className="button primary product-detail-buy" type="button" data-add-cart onClick={() => sendOrder()}>
          {"\u041a\u0443\u043f\u0438\u0442\u044c"}
        </button>
        {status ? <small>{status}</small> : null}
      </div>
    );
  }

  return (
    <form className="backend-form product-order-form" onSubmit={submitOrder}>
      <input name="name" placeholder="\u0418\u043c\u044f" />
      <input name="telegram" placeholder="Telegram" required />
      <textarea name="comment" placeholder="\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439 \u043a \u0437\u0430\u043a\u0430\u0437\u0443" rows="3" />
      <button className="button primary product-detail-buy" type="submit">{"\u041a\u0443\u043f\u0438\u0442\u044c"}</button>
      {status ? <small>{status}</small> : null}
    </form>
  );
}
