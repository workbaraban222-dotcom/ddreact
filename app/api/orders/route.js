import { json, readDb, requireAdmin, writeDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const db = await readDb();
  return json(db.orders || []);
}

export async function POST(request) {
  const body = await request.json();
  const db = await readDb();
  const order = {
    id: `order-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "new",
    items: body.items || [],
    contact: body.contact || {},
    comment: body.comment || "",
  };
  db.orders = [order, ...(db.orders || [])];
  await writeDb(db);
  return json(order, 201);
}
