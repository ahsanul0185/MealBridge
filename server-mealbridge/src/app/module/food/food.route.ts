import { Router } from "express";
import foodController from "./food.controller.js";
import checkAuth from "../../middleware/checkAuth.js";
import restrictTo from "../../middleware/restrictTo.js";

const router = Router();

// NGO routes (no auth needed for listing, but auth for claim)
router.get("/available", foodController.getAvailableFood);
router.get("/:id", foodController.getFoodById);
router.post("/:id/claim", checkAuth, restrictTo("ngo"), foodController.claimFood);

// Restaurant routes (protected)
router.post("/", checkAuth, restrictTo("restaurant"), foodController.createFood);
router.get("/my-posts", checkAuth, restrictTo("restaurant"), foodController.getMyPosts);
router.put("/:id", checkAuth, restrictTo("restaurant"), foodController.updateFood);
router.put("/:id/cancel", checkAuth, restrictTo("restaurant"), foodController.cancelFood);
router.get("/:id/claim-info", checkAuth, restrictTo("restaurant"), foodController.getClaimInfo);
router.put("/:id/handed-over", checkAuth, restrictTo("restaurant"), foodController.markHandedOver);

export default router;
