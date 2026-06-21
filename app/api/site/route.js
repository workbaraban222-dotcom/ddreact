import { json, readDb, writeDb } from "@/lib/db";

export const dynamic = "force-dynamic";

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET() {
  return json(await readDb(), 200, noStoreHeaders);
}

async function saveSite(request) {
  const body = await request.json();
  const db = await readDb();
  const next = {
    ...db,
    ...body,
    orders: db.orders || [],
    partnerLeads: db.partnerLeads || [],
  };
  await writeDb(next);
  return json(next, 200, noStoreHeaders);
}

export async function POST(request) {
  return saveSite(request);
}

export async function PUT(request) {
  return saveSite(request);
}
