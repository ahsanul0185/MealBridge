import { Router } from "express";
import claimController from "./claim.controller.js";
import checkAuth from "../../middleware/checkAuth.js";
import restrictTo from "../../middleware/restrictTo.js";

const router = Router();

router.get("/my-claims", checkAuth, restrictTo("ngo"), claimController.getMyClaims);
router.put("/:id/status", checkAuth, restrictTo("ngo"), claimController.updateStatus);
router.put("/:id/picked-up", checkAuth, restrictTo("ngo"), claimController.markPickedUp);

export default router;
