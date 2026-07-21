import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dashboardRouter from "./dashboard";
import batteryRouter from "./battery";
import fleetRouter from "./fleet";
import supplyChainRouter from "./supply-chain";
import manufacturingRouter from "./manufacturing";
import carbonRouter from "./carbon";
import aiInsightsRouter from "./ai-insights";
import alertsRouter from "./alerts";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dashboardRouter);
router.use(batteryRouter);
router.use(fleetRouter);
router.use(supplyChainRouter);
router.use(manufacturingRouter);
router.use(carbonRouter);
router.use(aiInsightsRouter);
router.use(alertsRouter);

export default router;
