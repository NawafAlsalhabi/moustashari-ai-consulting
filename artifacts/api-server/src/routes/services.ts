import { Router } from "express";
import { db } from "@workspace/db";
import { servicesTable, categoriesTable, consultantsTable, reviewsTable } from "@workspace/db";
import { eq, and, gte, lte, ilike, or } from "drizzle-orm";

const router = Router();

async function buildService(svc: typeof servicesTable.$inferSelect) {
  const [category] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, svc.categoryId)).limit(1);
  const [consultant] = await db.select().from(consultantsTable).where(eq(consultantsTable.id, svc.consultantId)).limit(1);
  return {
    id: svc.id,
    title: svc.title,
    description: svc.description,
    price: svc.price,
    duration: svc.duration,
    categoryId: svc.categoryId,
    categoryName: category?.name ?? "",
    consultantId: svc.consultantId,
    consultantName: consultant?.name ?? "",
    consultantAvatarUrl: consultant?.avatarUrl ?? null,
    rating: svc.rating,
    reviewCount: svc.reviewCount,
    tags: svc.tags,
    imageUrl: svc.imageUrl,
    featured: svc.featured,
  };
}

// GET /services/featured  — must come before /services/:id
router.get("/services/featured", async (req, res) => {
  try {
    const featured = await db.select().from(servicesTable).where(eq(servicesTable.featured, true)).limit(6);
    const result = await Promise.all(featured.map(buildService));
    return res.json(result);
  } catch (err) {
    req.log.error({ err }, "listFeaturedServices error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /services
router.get("/services", async (req, res) => {
  try {
    const { categoryId, search, minPrice, maxPrice } = req.query;
    const conditions = [];

    if (categoryId) conditions.push(eq(servicesTable.categoryId, Number(categoryId)));
    if (minPrice) conditions.push(gte(servicesTable.price, Number(minPrice)));
    if (maxPrice) conditions.push(lte(servicesTable.price, Number(maxPrice)));

    let services;
    if (search && typeof search === "string") {
      const searchCondition = or(
        ilike(servicesTable.title, `%${search}%`),
        ilike(servicesTable.description, `%${search}%`)
      );
      services = await db.select().from(servicesTable).where(
        conditions.length > 0 ? and(...conditions, searchCondition) : searchCondition
      );
    } else {
      services = conditions.length > 0
        ? await db.select().from(servicesTable).where(and(...conditions))
        : await db.select().from(servicesTable);
    }

    const result = await Promise.all(services.map(buildService));
    return res.json(result);
  } catch (err) {
    req.log.error({ err }, "listServices error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /services/:id
router.get("/services/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [svc] = await db.select().from(servicesTable).where(eq(servicesTable.id, id)).limit(1);
    if (!svc) return res.status(404).json({ error: "Service not found" });

    const [category] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, svc.categoryId)).limit(1);
    const [consultant] = await db.select().from(consultantsTable).where(eq(consultantsTable.id, svc.consultantId)).limit(1);
    const reviews = await db.select().from(reviewsTable).where(eq(reviewsTable.serviceId, id));

    const consultantData = consultant ? {
      id: consultant.id,
      name: consultant.name,
      title: consultant.title,
      bio: consultant.bio,
      avatarUrl: consultant.avatarUrl,
      rating: consultant.rating,
      reviewCount: consultant.reviewCount,
      specializations: consultant.specializations,
      yearsExperience: consultant.yearsExperience,
      serviceCount: consultant.serviceCount,
      verified: consultant.verified,
    } : null;

    return res.json({
      id: svc.id,
      title: svc.title,
      description: svc.description,
      longDescription: svc.longDescription,
      price: svc.price,
      duration: svc.duration,
      categoryId: svc.categoryId,
      categoryName: category?.name ?? "",
      consultant: consultantData,
      rating: svc.rating,
      reviewCount: svc.reviewCount,
      tags: svc.tags,
      imageUrl: svc.imageUrl,
      featured: svc.featured,
      deliverables: svc.deliverables,
      faqs: svc.faqs,
      reviews: reviews.map(r => ({
        id: r.id,
        authorName: r.authorName,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    req.log.error({ err }, "getService error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /stats
router.get("/stats", async (req, res) => {
  try {
    const services = await db.select().from(servicesTable);
    const consultants = await db.select().from(consultantsTable);
    const avgRating = services.length > 0
      ? services.reduce((acc, s) => acc + s.rating, 0) / services.length
      : 4.8;
    return res.json({
      totalConsultants: consultants.length,
      totalServices: services.length,
      totalClients: 1247,
      averageRating: Math.round(avgRating * 10) / 10,
    });
  } catch (err) {
    req.log.error({ err }, "getPlatformStats error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
