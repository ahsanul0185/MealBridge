import { Router } from "express";
import dashboardController from "./dashboard.controller.js";
import checkAuth from "../../middleware/checkAuth.js";
import restrictTo from "../../middleware/restrictTo.js";

const router = Router();

router.get(
  "/restaurant",
  checkAuth,
  restrictTo("restaurant"),
  dashboardController.getRestaurantDashboard
);

router.get(
  "/ngo",
  checkAuth,
  restrictTo("ngo"),
  dashboardController.getNgoDashboard
);

export default router;
