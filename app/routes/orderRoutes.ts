import { Router } from "express";
import { verifyAuth } from "../middleware/authentication";
import { getOrders, orderProduct } from "../controller/orderController";

const router = Router();

router.post("/", verifyAuth, orderProduct);
router.get("/", verifyAuth, getOrders);

export default router;
