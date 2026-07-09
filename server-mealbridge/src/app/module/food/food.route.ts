import { Router } from "express";
import foodController from "./food.controller.js";
import checkAuth from "../../middleware/checkAuth.js";
import restrictTo from "../../middleware/restrictTo.js";
import validateRequest from "../../middleware/validateRequest.js";
import { foodValidation } from "./food.validation.js";
import upload from "../../config/multer.config.js";

const router = Router();

// NGO routes
router.get("/available", foodController.getAvailableFood);
router.get(
  "/my-posts",
  checkAuth,
  restrictTo("restaurant"),
  foodController.getMyPosts
);
router.get("/:id", foodController.getFoodById);
router.post(
  "/:id/claim",
  checkAuth,
  restrictTo("ngo"),
  foodController.claimFood
);

// Restaurant routes (protected)
router.post(
  "/",
  checkAuth,
  restrictTo("restaurant"),
  upload.single("image"),
  validateRequest(foodValidation.createFood),
  foodController.createFood
);

router.put(
  "/:id",
  checkAuth,
  restrictTo("restaurant"),
  upload.single("image"),
  foodController.updateFood
);
router.put(
  "/:id/cancel",
  checkAuth,
  restrictTo("restaurant"),
  foodController.cancelFood
);
router.get(
  "/:id/claim-info",
  checkAuth,
  restrictTo("restaurant"),
  foodController.getClaimInfo
);
router.put(
  "/:id/handed-over",
  checkAuth,
  restrictTo("restaurant"),
  foodController.markHandedOver
);

export default router;
