import express from "express";

const router = express();

// Controller
import { getAttributes } from "../Controllers/attributes.controller.ts";

router.get("/", getAttributes);

export default router;
