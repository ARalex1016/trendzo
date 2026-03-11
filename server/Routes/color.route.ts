import express from "express";

import {
  createColor,
  getColors,
  getColor,
  updateColor,
  deleteColor,
} from "../Controllers/color.controller.ts";

// Middleware
import { colorIdParamHandler } from "../Middleware/param.middleware.ts";
import { protect, authorize } from "../Controllers/auth.controller.ts";

const router = express.Router();

router.param("colorId", colorIdParamHandler);

router.get("/", getColors);
router.get("/:colorId", protect, authorize("admin", "operator"), getColor);

router.post("/", protect, authorize("admin", "operator"), createColor);

router.patch("/:colorId", protect, authorize("admin", "operator"), updateColor);

router.delete(
  "/:colorId",
  protect,
  authorize("admin", "operator"),
  deleteColor,
);

export default router;
