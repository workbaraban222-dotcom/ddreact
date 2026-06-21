import { readStaticTemplate } from "@/lib/staticTemplate";

export default function StaticTemplate({ name }) {
  const template = readStaticTemplate(name);
  return (
    <div
      className={template.className || undefined}
      dangerouslySetInnerHTML={{ __html: template.html }}
      suppressHydrationWarning
    />
  );
}
