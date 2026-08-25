import { Router } from "express";
import crypto from "crypto";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { createToken, revokeToken, extractToken, getUserIdFromToken } from "../lib/session";

const router = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "moustashari_salt").digest("hex");
}

// POST /auth/register
router.post("/auth/register", async (req, res) => {
  try {
    const { email, password, name, company, industry } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "email, password, and name are required" });
    }

    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const passwordHash = hashPassword(password);
    const [user] = await db.insert(usersTable).values({
      email,
      passwordHash,
      name,
      company: company || null,
      industry: industry || null,
    }).returning();

    const token = createToken(user.id);
    return res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name, company: user.company, industry: user.industry, createdAt: user.createdAt.toISOString() },
      token,
    });
  } catch (err) {
    req.log.error({ err }, "register error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /auth/login
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!user || user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = createToken(user.id);
    return res.json({
      user: { id: user.id, email: user.email, name: user.name, company: user.company, industry: user.industry, createdAt: user.createdAt.toISOString() },
      token,
    });
  } catch (err) {
    req.log.error({ err }, "login error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /auth/logout
router.post("/auth/logout", (req, res) => {
  const token = extractToken(req.headers.authorization);
  if (token) revokeToken(token);
  return res.json({ message: "Logged out successfully" });
});

// GET /auth/me
router.get("/auth/me", async (req, res) => {
  try {
    const token = extractToken(req.headers.authorization);
    const userId = getUserIdFromToken(token);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (!user) return res.status(401).json({ error: "User not found" });

    return res.json({ id: user.id, email: user.email, name: user.name, company: user.company, industry: user.industry, createdAt: user.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "getMe error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
