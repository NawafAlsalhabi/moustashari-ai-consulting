import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import categoriesRouter from "./categories";
import servicesRouter from "./services";
import consultantsRouter from "./consultants";
import chatRouter from "./chat";
import cartRouter from "./cart";
import recommendationsRouter from "./recommendations";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(categoriesRouter);
router.use(servicesRouter);
router.use(consultantsRouter);
router.use(chatRouter);
router.use(cartRouter);
router.use(recommendationsRouter);

export default router;
