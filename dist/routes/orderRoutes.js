"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../middleware/authentication");
const orderController_1 = require("../controller/orderController");
const router = (0, express_1.Router)();
router.post("/", authentication_1.verifyAuth, orderController_1.orderProduct);
router.get("/", authentication_1.verifyAuth, orderController_1.getOrders);
exports.default = router;
