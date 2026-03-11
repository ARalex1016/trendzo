import express from "express";

// Controller
import {
  createSize,
  updateSize,
  getSize,
  listSizes,
  deleteSize,
} from "../Controllers/size.controller.ts";

// Middeware
import { protect, authorize } from "../Controllers/auth.controller.ts";
import { sizeIdParamHandler } from "../Middleware/param.middleware.ts";

const router = express.Router();

// Public route
router.get("/", listSizes);
router.get("/:sizeId", sizeIdParamHandler, getSize);

// Protected routes (admin & operator)
router.use(protect, authorize("admin", "operator"));

router.post("/", createSize);
router.patch("/:sizeId", sizeIdParamHandler, updateSize);
router.delete("/:sizeId", sizeIdParamHandler, deleteSize);

export default router;
