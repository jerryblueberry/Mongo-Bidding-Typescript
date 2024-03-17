import { Router } from "express";
import { verifyAuth } from "../middleware/authentication";
import { addCart, cartIncreament, getCart, cartDecreament, removeProduct } from "../controller/cartController";

const router = Router();

router.post("/add-cart", verifyAuth, addCart);
router.get("/", verifyAuth, getCart);
router.put("/increament", verifyAuth, cartIncreament);
router.put("/decreament", verifyAuth, cartDecreament);
router.delete("/remove", verifyAuth, removeProduct);

export default router;
