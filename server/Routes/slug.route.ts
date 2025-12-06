import express from "express";

// Controllers
import { suggestSlug, checkSlug } from "./../Controllers/slug.controller.ts";

const router = express.Router();

router.get("/suggest", suggestSlug);
router.get("/check", checkSlug);

export default router;
