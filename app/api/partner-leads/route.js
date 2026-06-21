import { json, readDb, requireAdmin, writeDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const db = await readDb();
  return json(db.partnerLeads || []);
}

export async function POST(request) {
  const body = await request.json();
  const db = await readDb();
  const lead = {
    id: `lead-${Date.now()}`,
    createdAt: new Date().toISOString(),
    name: body.name || "",
    telegram: body.telegram || "",
    message: body.message || "",
  };
  db.partnerLeads = [lead, ...(db.partnerLeads || [])];
  await writeDb(db);
  return json(lead, 201);
}
