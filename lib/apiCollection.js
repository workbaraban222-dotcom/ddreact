import { json, makeId, readDb, requireAdmin, writeDb } from "@/lib/db";

export function collectionHandlers(collectionName, titleField = "title") {
  return {
    async GET() {
      const db = await readDb();
      return json(db[collectionName] || []);
    },
    async POST(request) {
      const denied = requireAdmin(request);
      if (denied) return denied;
      const body = await request.json();
      const db = await readDb();
      const list = db[collectionName] || [];
      const titleValue = body[titleField] || body.name || collectionName;
      const id = body.id || makeId(typeof titleValue === "object" ? titleValue.ua || titleValue.ru || titleValue.en : titleValue);
      if (list.some((item) => item.id === id)) return json({ error: "Item already exists" }, 409);
      const item = { ...body, id };
      db[collectionName] = [...list, item];
      await writeDb(db);
      return json(item, 201);
    },
  };
}

export function itemHandlers(collectionName) {
  return {
    async PUT(request, { params }) {
      const denied = requireAdmin(request);
      if (denied) return denied;
      const { id } = await params;
      const body = await request.json();
      const db = await readDb();
      const list = db[collectionName] || [];
      const index = list.findIndex((item) => item.id === id);
      if (index === -1) return json({ error: "Not found" }, 404);
      list[index] = { ...list[index], ...body, id };
      db[collectionName] = list;
      await writeDb(db);
      return json(list[index]);
    },
    async DELETE(request, { params }) {
      const denied = requireAdmin(request);
      if (denied) return denied;
      const { id } = await params;
      const db = await readDb();
      const list = db[collectionName] || [];
      const next = list.filter((item) => item.id !== id);
      if (next.length === list.length) return json({ error: "Not found" }, 404);
      db[collectionName] = next;
      await writeDb(db);
      return json({ ok: true });
    },
  };
}
