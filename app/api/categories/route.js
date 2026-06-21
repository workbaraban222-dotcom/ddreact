import { collectionHandlers } from "@/lib/apiCollection";

export const dynamic = "force-dynamic";

export const { GET, POST } = collectionHandlers("categories");
