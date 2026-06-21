"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const cartKey = "double-damage-cart";
const nav = [
  ["\u0413\u043e\u043b\u043e\u0432\u043d\u0430", "/"],
  ["\u041c\u0430\u0433\u0430\u0437\u0438\u043d", "/shop"],
  ["\u041d\u043e\u0432\u0438\u043d\u0438", "/guides"],
  ["\u041f\u043e\u0434\u0456\u0457", "/events"],
  ["\u041f\u0430\u0440\u0442\u043d\u0435\u0440\u0438", "/partners"],
];

function readCart() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(cartKey) || "[]");
  } catch {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(cartKey, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("dd-cart-updated"));
}

export default function Header() {
  const [cart, setCart] = useState([]);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const count = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);

  useEffect(() => {
    function sync(event = {}) {
      setCart(readCart());
      if (event.detail?.openCart) setOpen(true);
    }
    sync();
    window.addEventListener("dd-cart-updated", sync);
    return () => window.removeEventListener("dd-cart-updated", sync);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("doubleDamageThemeV2") === "light" ? "light" : "dark";
    setTheme(stored);
    document.documentElement.dataset.theme = stored;
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("doubleDamageThemeV2", next);
    document.documentElement.dataset.theme = next;
  }

  function changeQty(id, diff) {
    const next = cart
      .map((item) => item.id === id ? { ...item, qty: item.qty + diff } : item)
      .filter((item) => item.qty > 0);
    setCart(next);
    writeCart(next);
  }

  return (
    <>
      <header className="site-header">
        <Link className="brand" href="/">
          <span className="brand-mark">DD</span>
          <span>DOUBLE DAMAGE</span>
        </Link>
        <nav className="main-nav" aria-label="\u0413\u043e\u043b\u043e\u0432\u043d\u0430 \u043d\u0430\u0432\u0456\u0433\u0430\u0446\u0456\u044f">
          {nav.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
        <div className="header-tools">
          <div className="lang-switch" aria-label="Language">
            <button type="button">UA</button>
            <button type="button">ENG</button>
            <button type="button">RU</button>
          </div>
          <a className="telegram-pill" href="https://t.me/" target="_blank" rel="noreferrer">Telegram</a>
          <Link className="profile-pill" href="/replace">\u0417\u0430\u043c\u0456\u043d\u0430 \u0442\u043e\u0432\u0430\u0440\u0430</Link>
          <button className="theme-toggle" type="button" onClick={toggleTheme}>{theme === "light" ? "Dark" : "Light"}</button>
          <button className="cart-button" type="button" onClick={() => setOpen(true)}>
            <span>\u041a\u043e\u0448\u0438\u043a</span>
            <strong>{count}</strong>
          </button>
        </div>
      </header>

      <aside className="cart-panel" aria-hidden={!open}>
        <div className="cart-head">
          <div>
            <p className="eyebrow">\u041a\u043e\u0448\u0438\u043a</p>
            <h2>\u0412\u0430\u0448\u0435 \u0437\u0430\u043c\u043e\u0432\u043b\u0435\u043d\u043d\u044f</h2>
          </div>
          <button className="icon-button" type="button" onClick={() => setOpen(false)}>x</button>
        </div>
        <div className="cart-items">
          {cart.length ? cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <span>${item.price} x {item.qty}</span>
              </div>
              <div className="cart-controls">
                <button type="button" onClick={() => changeQty(item.id, -1)}>-</button>
                <strong>{item.qty}</strong>
                <button type="button" onClick={() => changeQty(item.id, 1)}>+</button>
              </div>
            </div>
          )) : <p className="empty-cart">\u041f\u043e\u043a\u0438 \u043f\u0443\u0441\u0442\u043e. \u0414\u043e\u0434\u0430\u0439\u0442\u0435 \u043f\u043e\u0437\u0438\u0446\u0456\u044e \u0437 \u043a\u0430\u0442\u0430\u043b\u043e\u0433\u0443.</p>}
        </div>
        <div className="cart-total"><span>\u0420\u0430\u0437\u043e\u043c</span><strong>${total}</strong></div>
        <button className="button primary checkout-button" type="button" onClick={() => setOpen(false)}>\u041e\u0444\u043e\u0440\u043c\u0438\u0442\u0438 \u0437\u0430\u043f\u0438\u0442</button>
      </aside>
      {open ? <button className="cart-backdrop" type="button" aria-label="\u0417\u0430\u043a\u0440\u0438\u0442\u0438" onClick={() => setOpen(false)} /> : null}
    </>
  );
}
