import express from "express";

// Controllers
import {
  getAllProducts,
  getFeaturedProducts,
  getProduct,
  getAutoSuggestions,
  addProduct,
  updateProduct,
  toggleFeatured,
  deleteProduct,
} from "../Controllers/product.controller.ts";

// Middleware
import {
  productSlugParamHandler,
  productIdParamHandler,
} from "../Middleware/param.middleware.ts";
import { protect, authorize } from "../Controllers/auth.controller.ts";
import { validateRequest } from "../Middleware/validateRequest.middleware.ts";

// Validation Schemas
import { addProductSchema } from "../Validations/product.validator.ts";

const router = express.Router();

// Param Handlers
router.param("productId", productIdParamHandler);
router.param("slug", productSlugParamHandler);

// Public product routes
router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/auto-suggestions", getAutoSuggestions);
router.get("/slug/:slug", getProduct); // getProductBySlug
router.get("/:productId", getProduct); // getProductById

// Admin product management
router.post(
  "/",
  protect,
  authorize("admin"),
  validateRequest(addProductSchema),
  addProduct
);
router.patch("/:productId", protect, authorize("admin"), updateProduct);
router.patch(
  "/:productId/toggle-featured",
  protect,
  authorize("admin"),
  toggleFeatured
);
router.delete("/:productId", protect, authorize("admin"), deleteProduct);

export default router;
