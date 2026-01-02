import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { role } from "../middlewares/role.middleware.js";
import { createOrganization, createUser } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/organization", auth, role("ADMIN"), createOrganization);
router.post("/user", auth, role("ADMIN"), createUser);

export default router;
