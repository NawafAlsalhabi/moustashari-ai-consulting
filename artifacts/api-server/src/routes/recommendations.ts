import { Router } from "express";
import { db } from "@workspace/db";
import { servicesTable, categoriesTable, consultantsTable } from "@workspace/db";

const router = Router();

const DOMAIN_TAGS: Record<string, string[]> = {
  technology: ["tech", "digital", "software", "automation", "ai"],
  retail: ["marketing", "ecommerce", "brand", "retail"],
  finance: ["finance", "accounting", "investment", "funding"],
  healthcare: ["compliance", "legal", "operations"],
  manufacturing: ["operations", "supply chain", "strategy"],
  education: ["strategy", "marketing", "hr"],
  food: ["marketing", "operations", "franchise"],
  real_estate: ["legal", "finance", "strategy"],
};

const GOAL_TAGS: Record<string, string[]> = {
  growth: ["growth", "strategy", "marketing", "expansion"],
  funding: ["finance", "investment", "pitch", "valuation"],
  operations: ["operations", "efficiency", "process"],
  hiring: ["hr", "talent", "recruitment"],
  marketing: ["marketing", "brand", "digital", "social"],
  compliance: ["legal", "compliance", "regulatory"],
  technology: ["tech", "digital", "automation", "software"],
};

// POST /recommendations
router.post("/recommendations", async (req, res) => {
  try {
    const { businessDescription, industry, goals = [], budget } = req.body;

    // Determine relevant tags from industry and goals
    const relevantTags = new Set<string>();
    if (industry) {
      const key = industry.toLowerCase().replace(/\s+/g, "_");
      (DOMAIN_TAGS[key] || []).forEach(t => relevantTags.add(t));
    }
    goals.forEach((goal: string) => {
      const key = goal.toLowerCase().replace(/\s+/g, "_");
      (GOAL_TAGS[key] || []).forEach(t => relevantTags.add(t));
    });

    // Also extract keywords from description
    const desc = businessDescription?.toLowerCase() || "";
    Object.entries(GOAL_TAGS).forEach(([, tags]) => {
      tags.forEach(tag => {
        if (desc.includes(tag)) relevantTags.add(tag);
      });
    });

    // Fetch all services and score them
    let services = await db.select().from(servicesTable);
    if (budget) {
      services = services.filter(s => s.price <= Number(budget));
    }

    const scored = services.map(svc => {
      const tagOverlap = svc.tags.filter((t: string) => relevantTags.has(t.toLowerCase())).length;
      const featuredBonus = svc.featured ? 2 : 0;
      return { svc, score: tagOverlap + featuredBonus + svc.rating };
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, 6).map(s => s.svc);

    const enriched = await Promise.all(top.map(async svc => {
      const [cat] = await db.select().from(categoriesTable).where(
        (await import("drizzle-orm")).eq(categoriesTable.id, svc.categoryId)
      ).limit(1);
      const [consultant] = await db.select().from(consultantsTable).where(
        (await import("drizzle-orm")).eq(consultantsTable.id, svc.consultantId)
      ).limit(1);
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

    const explanation = relevantTags.size > 0
      ? `Based on your business description and goals, I've identified ${enriched.length} consulting services that best match your needs in areas like ${[...relevantTags].slice(0, 3).join(", ")}. These recommendations are ranked by relevance to your specific situation.`
      : `Here are our most highly-rated consulting services that can help your business grow. Our consultants are ready to provide personalized guidance tailored to your specific needs.`;

    return res.json({ services: enriched, explanation });
  } catch (err) {
    req.log.error({ err }, "getRecommendations error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
