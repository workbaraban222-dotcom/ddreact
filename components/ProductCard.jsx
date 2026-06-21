"use client";

import Link from "next/link";
import { text } from "@/lib/text";

export default function ProductCard({ product, categoryTitle }) {
  const name = text(product.name);
  const description = text(product.description || product.text);
  const status = text(product.status) || "\u0412 \u043d\u0430\u044f\u0432\u043d\u043e\u0441\u0442\u0456";
  const stockQty = Number(product.stockQty ?? product.stock ?? product.quantity ?? 10);
  const href = `/product?id=${encodeURIComponent(product.id)}`;

  function addToCart(openCart = false) {
    const stored = JSON.parse(localStorage.getItem(cartKey()) || "[]");
    const existing = stored.find((item) => item.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      stored.push({ id: product.id, name, price: Number(product.price || 0), qty: 1 });
    }
    localStorage.setItem(cartKey(), JSON.stringify(stored));
    window.dispatchEvent(new CustomEvent("dd-cart-updated", { detail: { openCart } }));
  }

  return (
    <article className="product-card" data-category={product.category}>
      <Link className="product-card-overlay" href={href} aria-label={name} />
      <div className="product-media-wrap">
        {product.image ? (
          <div className="product-image filled-media"><img src={product.image} alt={name} /></div>
        ) : (
          <div className="product-image placeholder-media">{product.badge || "DD"}</div>
        )}
      </div>
      <div className="product-info">
        <h3>{name}</h3>
        <p>{description}</p>
        <div className="product-labels">
          <span className="tag acid">{status}</span>
          <span>{categoryTitle || text(product.categoryLabel) || product.category}</span>
          {product.subcategory ? <span>{product.subcategory}</span> : null}
        </div>
      </div>
      <div className="product-price-col">
        <small>\u0426\u0456\u043d\u0430</small>
        <strong>${Number(product.price || 0)}</strong>
      </div>
      <div className="product-stock-col">
        <small>\u041d\u0430\u044f\u0432\u043d\u0456\u0441\u0442\u044c</small>
        <strong>{product.inStock === false || stockQty <= 0 ? "\u041d\u0435\u043c\u0430\u0454" : `${stockQty} \u0448\u0442.`}</strong>
      </div>
      <div className="product-buy-col">
        <div className="product-actions">
          <button type="button" data-add-cart onClick={() => addToCart(true)}>{"\u041a\u0443\u043f\u0438\u0442\u0438"}</button>
          <button className="add-cart-mini" type="button" data-add-cart aria-label="\u0412 \u043a\u043e\u0448\u0438\u043a" title="\u0412 \u043a\u043e\u0448\u0438\u043a" onClick={() => addToCart(false)}>{"\uD83D\uDED2"}</button>
        </div>
      </div>
    </article>
  );
}

function cartKey() {
  return "double-damage-cart";
}
