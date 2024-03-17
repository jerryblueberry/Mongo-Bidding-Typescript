import { Router } from "express";
import {
  addProductToStore,
  createStore,
  getAllStore,
  getProductsByStore,
  getStoresByCategory,
  //   getStoresWithinRadius,
} from "../controller/storeController";
import { singleUploadStore, multipleUpload } from "../middleware/uploadMiddleware";
import { verifyAuth } from "../middleware/authentication";
const router = Router();

router.post("/add", singleUploadStore, verifyAuth, createStore);
router.get("/", getAllStore);
// router.get("/nearby", verifyAuth, getStoresWithinRadius);
router.post("/products/add/:_id", multipleUpload, verifyAuth, addProductToStore);
router.get("/:_id", verifyAuth, getProductsByStore);
router.get("/category/:type", verifyAuth, getStoresByCategory);

export default router;
