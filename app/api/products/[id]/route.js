import { itemHandlers } from "@/lib/apiCollection";

export const dynamic = "force-dynamic";

export const { PUT, DELETE } = itemHandlers("products");
