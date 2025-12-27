import express from "express";
import { getTutors } from "../controllers/tutor.controller.js";

const router = express.Router();

router.get("/", getTutors);

export default router;
