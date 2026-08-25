import crypto from "crypto";
import { db } from "@workspace/db";
import { sessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function createToken(userId: number): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(sessionsTable).values({ token, userId, expiresAt });
  return token;
}

export async function getUserIdFromToken(token: string | undefined): Promise<number | null> {
  if (!token) return null;
  try {
    const [session] = await db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.token, token))
      .limit(1);
    if (!session) return null;
    if (session.expiresAt < new Date()) {
      await db.delete(sessionsTable).where(eq(sessionsTable.token, token));
      return null;
    }
    return session.userId;
  } catch {
    return null;
  }
}

export async function revokeToken(token: string): Promise<void> {
  try {
    await db.delete(sessionsTable).where(eq(sessionsTable.token, token));
  } catch {
    // ignore errors on revoke
  }
}

export function extractToken(authHeader: string | undefined): string | undefined {
  if (!authHeader) return undefined;
  if (authHeader.startsWith("Bearer ")) return authHeader.slice(7);
  return authHeader;
}
