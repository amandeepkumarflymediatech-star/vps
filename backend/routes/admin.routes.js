import express from "express";
import { auth ,role} from "../middlewares/auth.middleware.js"; 
import { createOrganization, createUser, getUsers } from "../controllers/admin.controller.js";
import { getAllPayments, verifyPayment } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/organization", auth, role("ADMIN"), createOrganization);
router.post("/user", auth, role("ADMIN"), createUser);
router.get("/users", auth, role("ADMIN"), getUsers);

// Payment management routes
router.get("/payments", auth, role("ADMIN"), getAllPayments);
router.put("/payments/:paymentId/verify", auth, role("ADMIN"), verifyPayment);

export default router;
