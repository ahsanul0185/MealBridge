import { Router } from "express";
import authController from "./auth.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import { authValidation } from "./auth.validation.js";
import checkAuth from "../../middleware/checkAuth.js";

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

router.post("/logout", authController.logout);

router.get("/profile", checkAuth, authController.getProfile);

router.post(
  "/forgot-password",
  validateRequest(authValidation.forgotPassword),
  authController.forgotPassword
);

router.post(
  "/reset-password/:token",
  validateRequest(authValidation.resetPassword),
  authController.resetPassword
);

export default router;
