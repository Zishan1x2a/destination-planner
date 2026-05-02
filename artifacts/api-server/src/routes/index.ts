import { Router, type IRouter } from "express";
import healthRouter from "./health";
import rsvpRouter from "./rsvp";
import configRouter from "./config";

const router: IRouter = Router();

router.use(healthRouter);
router.use(rsvpRouter);
router.use(configRouter);

export default router;
