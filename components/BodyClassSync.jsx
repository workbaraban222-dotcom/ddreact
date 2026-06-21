"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function BodyClassSync() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.toggle("admin-body", pathname === "/admin");
    return () => {
      document.body.classList.remove("admin-body");
    };
  }, [pathname]);

  return null;
}
