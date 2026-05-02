import { Router, type IRouter } from "express";
import { db, rsvpTable } from "@workspace/db";
import { CreateRsvpBody, ListRsvpsResponse, GetRsvpStatsResponse } from "@workspace/api-zod";
import { eq, count, sum } from "drizzle-orm";

const router: IRouter = Router();

router.get("/rsvp", async (req, res) => {
  try {
    const rsvps = await db.select().from(rsvpTable).orderBy(rsvpTable.createdAt);
    const data = ListRsvpsResponse.parse(
      rsvps.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      }))
    );
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch RSVPs");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/rsvp", async (req, res) => {
  try {
    const body = CreateRsvpBody.parse(req.body);
    const [inserted] = await db
      .insert(rsvpTable)
      .values({
        guestName: body.guestName,
        email: body.email,
        phone: body.phone,
        numberOfGuests: body.numberOfGuests ?? 1,
        attendanceStatus: body.attendanceStatus,
        needsTravelHelp: body.needsTravelHelp ?? false,
        message: body.message,
      })
      .returning();
    res.status(201).json({
      ...inserted,
      createdAt: inserted.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create RSVP");
    res.status(400).json({ error: "Invalid request" });
  }
});

router.get("/rsvp/stats", async (req, res) => {
  try {
    const all = await db.select().from(rsvpTable);
    const attending = all.filter((r) => r.attendanceStatus === "attending").length;
    const notSure = all.filter((r) => r.attendanceStatus === "not_sure").length;
    const notAttending = all.filter((r) => r.attendanceStatus === "not_attending").length;
    const totalGuests = all
      .filter((r) => r.attendanceStatus === "attending")
      .reduce((sum, r) => sum + (r.numberOfGuests ?? 1), 0);

    const data = GetRsvpStatsResponse.parse({
      total: all.length,
      attending,
      notSure,
      notAttending,
      totalGuests,
    });
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch RSVP stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
