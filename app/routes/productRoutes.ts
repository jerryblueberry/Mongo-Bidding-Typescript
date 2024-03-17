import { Router } from "express";
import { isAdmin, verifyAuth } from "../middleware/authentication";
import { getProducts, getSpecificProduct, getStock, updateProduct } from "../controller/productController";

const router = Router();

router.get("/", verifyAuth, getProducts);
router.get("/products/stock", verifyAuth, isAdmin, getStock);
router.get("/detail/:productId", verifyAuth, getSpecificProduct);
router.put("/products/update/:_id", verifyAuth, updateProduct);
export default router;
