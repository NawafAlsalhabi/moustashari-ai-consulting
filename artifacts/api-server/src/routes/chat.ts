import { Router } from "express";
import crypto from "crypto";
import { db } from "@workspace/db";
import { chatSessionsTable, chatMessagesTable, servicesTable, categoriesTable, consultantsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getUserIdFromToken, extractToken } from "../lib/session";

const router = Router();

// Simulate AI consulting responses
const AI_RESPONSES: { keywords: string[]; reply: string; tags: string[] }[] = [
  {
    keywords: ["marketing", "brand", "social media", "digital"],
    reply: "Based on your needs, I recommend focusing on a multi-channel digital marketing strategy. For SMEs, the highest ROI typically comes from content marketing combined with targeted social media campaigns. I can connect you with our top marketing consultants who specialize in growth for your stage.",
    tags: ["marketing", "digital"],
  },
  {
    keywords: ["finance", "funding", "investment", "capital", "cash"],
    reply: "Financial planning is critical for sustainable growth. I suggest starting with a comprehensive financial health assessment, followed by identifying the right funding instruments — whether debt, equity, or grants. Our finance consultants can help you build investor-ready financial models.",
    tags: ["finance"],
  },
  {
    keywords: ["legal", "contract", "compliance", "regulatory", "law"],
    reply: "Navigating legal and compliance requirements is essential, especially when scaling. I recommend a legal audit to identify gaps in your current structure. Our legal consultants have helped over 300 SMEs establish compliant frameworks across the region.",
    tags: ["legal"],
  },
  {
    keywords: ["technology", "software", "digital transformation", "automation", "ai", "tech"],
    reply: "Digital transformation can significantly reduce costs and improve efficiency. I recommend starting with a technology audit to identify automation opportunities. Our tech consultants specialize in practical, cost-effective digital solutions for SMEs.",
    tags: ["technology"],
  },
  {
    keywords: ["strategy", "growth", "expansion", "plan", "roadmap"],
    reply: "A clear strategic roadmap is the foundation of sustainable growth. I recommend beginning with a market analysis and competitive positioning exercise. Our strategy consultants will help you identify your unique competitive advantages and prioritize high-impact initiatives.",
    tags: ["strategy"],
  },
  {
    keywords: ["hr", "hiring", "team", "talent", "people", "culture"],
    reply: "Building the right team is one of the most impactful investments you can make. I recommend starting with an organizational design review and talent strategy. Our HR consultants specialize in helping SMEs attract, retain, and develop top talent.",
    tags: ["hr"],
  },
];

function getAIResponse(message: string): { reply: string; suggestedTags: string[] } {
  const lower = message.toLowerCase();
  for (const response of AI_RESPONSES) {
    if (response.keywords.some(kw => lower.includes(kw))) {
      return { reply: response.reply, suggestedTags: response.tags };
    }
  }
  return {
    reply: "Thank you for sharing your business context. To provide the most relevant recommendations, could you tell me more about your primary business challenge? For example, are you focused on growth, operational efficiency, market expansion, or something else? I'm here to connect you with the right expertise.",
    suggestedTags: [],
  };
}

// POST /chat/message
router.post("/chat/message", async (req, res) => {
  try {
    const { message, sessionId: existingSessionId } = req.body;
    if (!message) return res.status(400).json({ error: "message is required" });

    const token = extractToken(req.headers.authorization);
    const userId = getUserIdFromToken(token);

    // Create or reuse session
    let sessionId = existingSessionId;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      const title = message.length > 50 ? message.slice(0, 47) + "..." : message;
      await db.insert(chatSessionsTable).values({ id: sessionId, userId, title });
    }

    // Save user message
    await db.insert(chatMessagesTable).values({ sessionId, role: "user", content: message });

    // Generate AI response
    const { reply, suggestedTags } = getAIResponse(message);

    // Save assistant message
    await db.insert(chatMessagesTable).values({ sessionId, role: "assistant", content: reply });

    // Find suggested services based on tags
    let suggestedServices: any[] = [];
    if (suggestedTags.length > 0) {
      const allServices = await db.select().from(servicesTable).limit(20);
      const matching = allServices.filter(svc =>
        svc.tags.some((tag: string) => suggestedTags.some((st: string) => tag.toLowerCase().includes(st)))
      ).slice(0, 3);

      suggestedServices = await Promise.all(matching.map(async svc => {
        const [cat] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, svc.categoryId)).limit(1);
        const [consultant] = await db.select().from(consultantsTable).where(eq(consultantsTable.id, svc.consultantId)).limit(1);
        return {
          id: svc.id,
          title: svc.title,
          description: svc.description,
          price: svc.price,
          duration: svc.duration,
          categoryId: svc.categoryId,
          categoryName: cat?.name ?? "",
          consultantId: svc.consultantId,
          consultantName: consultant?.name ?? "",
          consultantAvatarUrl: consultant?.avatarUrl ?? null,
          rating: svc.rating,
          reviewCount: svc.reviewCount,
          tags: svc.tags,
          imageUrl: svc.imageUrl,
          featured: svc.featured,
        };
      }));
    }

    return res.json({ reply, sessionId, suggestedServices });
  } catch (err) {
    req.log.error({ err }, "sendChatMessage error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /chat/sessions
router.get("/chat/sessions", async (req, res) => {
  try {
    const token = extractToken(req.headers.authorization);
    const userId = getUserIdFromToken(token);

    let sessions: typeof chatSessionsTable.$inferSelect[] = [];
    if (userId) {
      sessions = await db.select().from(chatSessionsTable).where(eq(chatSessionsTable.userId, userId));
    }

    const withCounts = await Promise.all(sessions.map(async s => {
      const messages = await db.select().from(chatMessagesTable).where(eq(chatMessagesTable.sessionId, s.id));
      return {
        id: s.id,
        title: s.title,
        createdAt: s.createdAt.toISOString(),
        messageCount: messages.length,
      };
    }));

    return res.json(withCounts);
  } catch (err) {
    req.log.error({ err }, "listChatSessions error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /chat/sessions/:sessionId/messages
router.get("/chat/sessions/:sessionId/messages", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const messages = await db.select().from(chatMessagesTable)
      .where(eq(chatMessagesTable.sessionId, sessionId))
      .orderBy(chatMessagesTable.createdAt);

    return res.json(messages.map(m => ({
      id: m.id,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "getChatHistory error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
