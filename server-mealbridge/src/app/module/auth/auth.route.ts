import { Router } from "express";
import authController from "./auth.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import { authValidation } from "./auth.validation.js";

const router = Router();

router.post(
  "/register",
  validateRequest(authValidation.register),
  authController.register
);

router.post(
  "/login",
  validateRequest(authValidation.login),
  authController.login
);

router.get("/profile", authController.getProfile);

export default router;
