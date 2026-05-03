import { Router, type IRouter } from "express";
import { db, blessingsTable } from "@workspace/db";
import { CreateBlessingBody } from "@workspace/api-zod";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/blessings", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(blessingsTable)
      .orderBy(desc(blessingsTable.createdAt));
    res.json(
      rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to fetch blessings");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/blessings", async (req, res) => {
  try {
    const body = CreateBlessingBody.parse(req.body);
    const [inserted] = await db
      .insert(blessingsTable)
      .values({ guestName: body.guestName, message: body.message })
      .returning();
    res.status(201).json({
      ...inserted,
      createdAt: inserted.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create blessing");
    res.status(400).json({ error: "Invalid request" });
  }
});

export default router;
