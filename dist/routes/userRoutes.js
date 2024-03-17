"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const router = (0, express_1.Router)();
router.post("/signup", uploadMiddleware_1.singleUpload, userController_1.SignUp);
router.post("/login", userController_1.Login);
exports.default = router;
