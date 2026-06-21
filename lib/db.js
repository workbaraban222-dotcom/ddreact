import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dbPath = path.join(process.cwd(), "data", "db.json");
const kvKey = process.env.SITE_DB_KEY || "double_damage_site_db";

function kvConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

async function kvRequest(command) {
  const config = kvConfig();
  if (!config) return null;
  const response = await fetch(`${config.url}/${command.map(encodeURIComponent).join("/")}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${config.token}` },
  });
  if (!response.ok) throw new Error(`KV request failed: ${response.status}`);
  return response.json();
}

async function readFileDb() {
  const raw = await readFile(dbPath, "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, ""));
}

export async function readDb() {
  const config = kvConfig();
  if (!config) return readFileDb();

  const result = await kvRequest(["get", kvKey]);
  if (result?.result) {
    return typeof result.result === "string" ? JSON.parse(result.result) : result.result;
  }

  const seeded = await readFileDb();
  await kvRequest(["set", kvKey, JSON.stringify(seeded)]);
  return seeded;
}

export async function writeDb(data) {
  if (kvConfig()) {
    await kvRequest(["set", kvKey, JSON.stringify(data)]);
    return data;
  }

  await mkdir(path.dirname(dbPath), { recursive: true });
  await writeFile(dbPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  return data;
}

export function makeId(value = "item") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яёіїєґ]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || `item-${Date.now()}`;
}

export function json(data, status = 200, headers = {}) {
  return Response.json(data, { status, headers });
}

export function requireAdmin(request) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return null;
  const auth = request.headers.get("authorization") || "";
  const provided = auth.replace(/^Bearer\s+/i, "");
  if (provided === token) return null;
  return json({ error: "Unauthorized" }, 401);
}
