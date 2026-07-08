import { Router } from "express";
import authRoutes from "../module/auth/auth.route.js";
import foodRoutes from "../module/food/food.route.js";
import claimRoutes from "../module/claim/claim.route.js";
import dashboardRoutes from "../module/dashboard/dashboard.route.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/food", foodRoutes);
router.use("/claims", claimRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
