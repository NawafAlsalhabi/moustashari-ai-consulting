import { Router } from "express";
import { db } from "@workspace/db";
import { consultantsTable, servicesTable, categoriesTable, reviewsTable } from "@workspace/db";
import { eq, ilike, or } from "drizzle-orm";

const router = Router();

// GET /consultants
router.get("/consultants", async (req, res) => {
  try {
    const { search } = req.query;
    let consultants;
    if (search && typeof search === "string") {
      consultants = await db.select().from(consultantsTable).where(
        or(
          ilike(consultantsTable.name, `%${search}%`),
          ilike(consultantsTable.title, `%${search}%`),
          ilike(consultantsTable.bio, `%${search}%`)
        )
      );
    } else {
      consultants = await db.select().from(consultantsTable);
    }

    return res.json(consultants.map(c => ({
      id: c.id,
      name: c.name,
      title: c.title,
      bio: c.bio,
      avatarUrl: c.avatarUrl,
      rating: c.rating,
      reviewCount: c.reviewCount,
      specializations: c.specializations,
      yearsExperience: c.yearsExperience,
      serviceCount: c.serviceCount,
      verified: c.verified,
    })));
  } catch (err) {
    req.log.error({ err }, "listConsultants error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /consultants/:id
router.get("/consultants/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [consultant] = await db.select().from(consultantsTable).where(eq(consultantsTable.id, id)).limit(1);
    if (!consultant) return res.status(404).json({ error: "Consultant not found" });

    const services = await db.select().from(servicesTable).where(eq(servicesTable.consultantId, id));
    const reviews = await db.select().from(reviewsTable).where(eq(reviewsTable.consultantId, id));

    const servicesWithCategory = await Promise.all(services.map(async svc => {
      const [cat] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, svc.categoryId)).limit(1);
      return {
        id: svc.id,
        title: svc.title,
        description: svc.description,
        price: svc.price,
        duration: svc.duration,
        categoryId: svc.categoryId,
        categoryName: cat?.name ?? "",
        consultantId: id,
        consultantName: consultant.name,
        consultantAvatarUrl: consultant.avatarUrl,
        rating: svc.rating,
        reviewCount: svc.reviewCount,
        tags: svc.tags,
        imageUrl: svc.imageUrl,
        featured: svc.featured,
      };
    }));

    return res.json({
      id: consultant.id,
      name: consultant.name,
      title: consultant.title,
      bio: consultant.bio,
      longBio: consultant.longBio,
      avatarUrl: consultant.avatarUrl,
      rating: consultant.rating,
      reviewCount: consultant.reviewCount,
      specializations: consultant.specializations,
      yearsExperience: consultant.yearsExperience,
      verified: consultant.verified,
      languages: consultant.languages,
      education: consultant.education,
      services: servicesWithCategory,
      reviews: reviews.map(r => ({
        id: r.id,
        authorName: r.authorName,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    req.log.error({ err }, "getConsultant error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
