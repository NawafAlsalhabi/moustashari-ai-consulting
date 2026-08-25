import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable } from "@workspace/db";

const router = Router();

// GET /categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await db.select().from(categoriesTable);
    return res.json(categories);
  } catch (err) {
    req.log.error({ err }, "listCategories error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
