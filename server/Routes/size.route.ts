import express from "express";

// Controller
import {
  createSize,
  updateSize,
  getSize,
  listSizes,
  deleteSize,
} from "../Controllers/size.controller.ts";

// Validations
import { createSizeSchema } from "../Validations/size.validation.ts";

// Middeware
import { protect, authorize } from "../Middleware/auth.middleware.ts";
import { sizeIdParamHandler } from "../Middleware/param.middleware.ts";
import { validateRequest } from "../Middleware/validateRequest.middleware.ts";

const router = express.Router();

// Public route
router.get("/", listSizes);
router.get("/:sizeId", sizeIdParamHandler, getSize);

// Protected routes (admin & operator)
router.use(protect, authorize("admin", "operator"));

router.post("/", validateRequest(createSizeSchema), createSize);
router.patch("/:sizeId", sizeIdParamHandler, updateSize);
router.delete("/:sizeId", sizeIdParamHandler, deleteSize);

export default router;
