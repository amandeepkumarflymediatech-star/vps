import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { role } from "../middlewares/role.middleware.js";
import { getClasses, enrollBatch } from "../controllers/student.controller.js";

const router = express.Router();

router.get("/classes", auth, role("STUDENT"), getClasses);
router.post("/enroll", auth, role("STUDENT"), enrollBatch);

export default router;
