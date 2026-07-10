import { Router } from "express";
import claimController from "./claim.controller.js";
import checkAuth from "../../middleware/checkAuth.js";
import restrictTo from "../../middleware/restrictTo.js";
import validateRequest from "../../middleware/validateRequest.js";
import { claimValidation } from "./claim.validation.js";

const router = Router();

router.get("/my-claims", checkAuth, restrictTo("ngo"), claimController.getMyClaims);
router.get("/:id", checkAuth, restrictTo("ngo"), claimController.getClaimById);
router.put(
  "/:id/status",
  checkAuth,
  restrictTo("ngo"),
  validateRequest(claimValidation.updateStatus),
  claimController.updateStatus
);
router.put(
  "/:id/picked-up",
  checkAuth,
  restrictTo("ngo"),
  claimController.markPickedUp
);

export default router;
