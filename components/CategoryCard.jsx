import Link from "next/link";
import { text } from "@/lib/text";

export default function CategoryCard({ category, count = 0 }) {
  return (
    <Link href={`/shop?category=${category.id}`} className="shop-category-card home-category-card">
      <span className="shop-category-icon">{category.icon || "#"}</span>
      <span className="shop-category-copy">
        <strong>{text(category.title)}</strong>
        <small>{count} {"\u0442\u043e\u0432\u0430\u0440\u0456\u0432"}</small>
      </span>
      <em aria-label="\u0412\u0456\u0434\u043a\u0440\u0438\u0442\u0438 \u0440\u043e\u0437\u0434\u0456\u043b">+</em>
    </Link>
  );
}
