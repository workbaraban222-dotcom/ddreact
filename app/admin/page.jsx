import Script from "next/script";
import StaticTemplate from "@/components/StaticTemplate";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "DOUBLE DAMAGE CMS",
};

export default function AdminPage() {
  return (
    <>
      <StaticTemplate name="admin" />
      <Script src="/admin.js?v=31" strategy="afterInteractive" />
    </>
  );
}
