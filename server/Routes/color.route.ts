import express from "express";

import {
  createColor,
  getColors,
  getColor,
  updateColor,
  deleteColor,
} from "../Controllers/color.controller.ts";

// Validation
import { createColorSchema } from "../Validations/color.validation.ts";

// Middleware
import { protect, authorize } from "../Middleware/auth.middleware.ts";
import { colorIdParamHandler } from "../Middleware/param.middleware.ts";
import { validateRequest } from "../Middleware/validateRequest.middleware.ts";

const router = express.Router();

router.param("colorId", colorIdParamHandler);

router.get("/", getColors);
router.get("/:colorId", protect, authorize("admin", "operator"), getColor);

router.post(
  "/",
  protect,
  authorize("admin", "operator"),
  validateRequest(createColorSchema),
  createColor,
);

router.patch("/:colorId", protect, authorize("admin", "operator"), updateColor);

router.delete(
  "/:colorId",
  protect,
  authorize("admin", "operator"),
  deleteColor,
);

export default router;
