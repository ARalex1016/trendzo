import express from "express";

// Controllers
import {
  getAllProducts,
  getAllAdminProducts,
  getFeaturedProducts,
  getProduct,
  getAutoSuggestions,
  addProduct,
  updateProduct,
  toggleFeatured,
  toggleActive,
  deleteProduct,
} from "../Controllers/product.controller.ts";

// Middleware
import {
  productSlugParamHandler,
  productIdParamHandler,
} from "../Middleware/param.middleware.ts";
import { protect, authorize } from "../Middleware/auth.middleware.ts";
import { validateRequest } from "../Middleware/validateRequest.middleware.ts";

// Middleware
import { upload } from "../Middleware/upload.middleware.ts";

// Validation Schemas
import {
  addProductSchema,
  updateProductSchema,
} from "../Validations/product.validator.ts";

const router = express.Router();

// Param Handlers
router.param("productId", productIdParamHandler);
router.param("slug", productSlugParamHandler);

// Public product routes
router.get("/", getAllProducts);
router.get("/admin", protect, authorize("admin"), getAllAdminProducts);
router.get("/featured", getFeaturedProducts);
router.get("/auto-suggestions", getAutoSuggestions);
router.get("/slug/:slug", getProduct); // getProductBySlug
router.get("/:productId", getProduct); // getProductById

// Admin product management
// Add/Create
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.array("images"),
  validateRequest(addProductSchema, "product"),
  addProduct,
);

// Update
router.patch(
  "/:productId",
  protect,
  authorize("admin"),
  validateRequest(updateProductSchema),
  updateProduct,
);

// Toggle Active
router.patch(
  "/toggle-active/id/:productId",
  protect,
  authorize("admin"),
  toggleActive,
);
router.patch(
  "/toggle-active/slug/:slug",
  protect,
  authorize("admin"),
  toggleActive,
);

// Toggle Feature
router.patch(
  "/toggle-featured/id/:productId",
  protect,
  authorize("admin"),
  toggleFeatured,
);
router.patch(
  "/toggle-featured/slug/:slug",
  protect,
  authorize("admin"),
  toggleFeatured,
);

// Delete
router.delete("/id/:productId", protect, authorize("admin"), deleteProduct);
router.delete("/slug/:slug", protect, authorize("admin"), deleteProduct);

export default router;
