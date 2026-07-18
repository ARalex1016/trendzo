import express from "express";

// Controllers
import {
  getMyProfile,
  addAddress,
  updateAddress,
  changeDefaultAddress,
  removeAddress,
  updateProfile,
  getAllUsers,
  deleteUser,
} from "../Controllers/user.controller.ts";

// Middlewares
import { protect, authorize } from "../Middleware/auth.middleware.ts";
import { userIdParamHandler } from "../Middleware/param.middleware.ts";
import { validateRequest } from "../Middleware/validateRequest.middleware.ts";

// Validations
import {
  addAddressSchema,
  updateAddressSchema,
  addressParamsSchema,
} from "../Validations/address.validation.ts";

const router = express.Router();

// Param Handlers
router.param("userId", userIdParamHandler);

// User profile
router.get("/me", protect, getMyProfile);
router.patch("/update-profile", protect, updateProfile);

// User : Address Manage
router.patch(
  "/add-address",
  protect,
  validateRequest(addAddressSchema),
  addAddress,
);

router.patch(
  "/addresses/:addressId",
  protect,
  validateRequest(addressParamsSchema, "params"),
  validateRequest(updateAddressSchema),
  updateAddress,
);

router.patch(
  "/addresses/:addressId/default",
  protect,
  validateRequest(addressParamsSchema, "params"),
  changeDefaultAddress,
);

router.delete(
  "/addresses/:addressId",
  protect,
  validateRequest(addressParamsSchema, "params"),
  removeAddress,
);

// Admin: Manage users
router.get("/", protect, authorize("admin"), getAllUsers);
router.delete("/:userId", protect, authorize("admin"), deleteUser);

export default router;
