"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function BodyClassSync() {
  const pathname = usePathname();

  useEffect(() => {
    const pageClasses = [
      "admin-body",
      "shop-page",
      "product-detail-page",
      "article-page",
      "events-page",
      "guides-page",
      "partners-page",
      "replace-page",
    ];
    const nextClass = {
      "/admin": "admin-body",
      "/shop": "shop-page",
      "/product": "product-detail-page",
      "/article": "article-page",
      "/events": "events-page",
      "/guides": "guides-page",
      "/partners": "partners-page",
      "/replace": "replace-page",
    }[pathname];

    document.body.classList.remove(...pageClasses);
    if (nextClass) document.body.classList.add(nextClass);

    return () => {
      document.body.classList.remove(...pageClasses);
    };
  }, [pathname]);

  return null;
}
