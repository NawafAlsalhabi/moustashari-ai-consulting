import { Router } from "express";
import { db } from "@workspace/db";
import { cartItemsTable, servicesTable, consultantsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { extractToken, getUserIdFromToken } from "../lib/session";

const router = Router();

function getCartSessionId(req: any): string {
  const token = extractToken(req.headers.authorization);
  const userId = getUserIdFromToken(token);
  // Use user-specific session or fallback to header-based anonymous session
  if (userId) return `user_${userId}`;
  const anonSession = req.headers["x-cart-session"] as string;
  return anonSession || "anon_default";
}

async function buildCartResponse(sessionId: string) {
  const items = await db.select().from(cartItemsTable).where(eq(cartItemsTable.sessionId, sessionId));

  const enriched = await Promise.all(items.map(async item => {
    const [svc] = await db.select().from(servicesTable).where(eq(servicesTable.id, item.serviceId)).limit(1);
    const [consultant] = svc ? await db.select().from(consultantsTable).where(eq(consultantsTable.id, svc.consultantId)).limit(1) : [null];
    return {
      id: item.id,
      serviceId: item.serviceId,
      title: svc?.title ?? "Unknown Service",
      price: svc?.price ?? 0,
      duration: svc?.duration ?? "",
      consultantName: consultant?.name ?? "",
      imageUrl: svc?.imageUrl ?? null,
    };
  }));

  const total = enriched.reduce((sum, item) => sum + item.price, 0);
  return { items: enriched, total };
}

// GET /cart
router.get("/cart", async (req, res) => {
  try {
    const sessionId = getCartSessionId(req);
    const cart = await buildCartResponse(sessionId);
    return res.json(cart);
  } catch (err) {
    req.log.error({ err }, "getCart error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /cart/items
router.post("/cart/items", async (req, res) => {
  try {
    const { serviceId } = req.body;
    if (!serviceId) return res.status(400).json({ error: "serviceId is required" });

    const sessionId = getCartSessionId(req);

    // Check if already in cart
    const existing = await db.select().from(cartItemsTable).where(
      and(eq(cartItemsTable.sessionId, sessionId), eq(cartItemsTable.serviceId, Number(serviceId)))
    );
    if (existing.length === 0) {
      await db.insert(cartItemsTable).values({ sessionId, serviceId: Number(serviceId) });
    }

    const cart = await buildCartResponse(sessionId);
    return res.status(201).json(cart);
  } catch (err) {
    req.log.error({ err }, "addToCart error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /cart/items/:itemId
router.delete("/cart/items/:itemId", async (req, res) => {
  try {
    const itemId = Number(req.params.itemId);
    const sessionId = getCartSessionId(req);

    await db.delete(cartItemsTable).where(
      and(eq(cartItemsTable.id, itemId), eq(cartItemsTable.sessionId, sessionId))
    );

    const cart = await buildCartResponse(sessionId);
    return res.json(cart);
  } catch (err) {
    req.log.error({ err }, "removeFromCart error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
