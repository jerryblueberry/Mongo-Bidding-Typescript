import { Router } from "express";
import { Login, SignUp } from "../controller/userController";
import { singleUpload } from "../middleware/uploadMiddleware";
const router = Router();

router.post("/signup", singleUpload, SignUp);
router.post("/login", Login);

export default router;
