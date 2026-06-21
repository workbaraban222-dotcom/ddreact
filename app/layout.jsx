import Script from "next/script";
import { readFileSync } from "node:fs";
import path from "node:path";
import "./globals.css";
import "./admin-extra.css";
import BodyClassSync from "@/components/BodyClassSync";

export const metadata = {
  title: "DOUBLE DAMAGE",
  description: "DOUBLE DAMAGE digital marketplace",
};

function initialStoreScript() {
  try {
    const raw = readFileSync(path.join(process.cwd(), "data", "db.json"), "utf8");
    const data = JSON.parse(raw.replace(/^\uFEFF/, ""));
    return `window.__DD_SERVER_DATA__=${JSON.stringify(data).replace(/</g, "\\u003c")};`;
  } catch {
    return "window.__DD_SERVER_DATA__=null;";
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="uk" className="dd-boot" suppressHydrationWarning>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: "html.dd-boot:not(.dd-ready) body{visibility:hidden!important}html{overflow-y:scroll;scrollbar-gutter:stable both-edges;overflow-x:hidden}",
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: "try{document.documentElement.dataset.theme=localStorage.getItem('doubleDamageThemeV2')==='light'?'light':'dark'}catch(e){}",
          }}
        />
        <script dangerouslySetInnerHTML={{ __html: initialStoreScript() }} />
      </head>
      <body suppressHydrationWarning>
        <BodyClassSync />
        {children}
        <Script src="/store.js?v=13" strategy="beforeInteractive" />
        <Script src="/script.js?v=50" strategy="afterInteractive" />
      </body>
    </html>
  );
}
