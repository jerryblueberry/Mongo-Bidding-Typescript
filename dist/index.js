"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const storeRoutes_1 = __importDefault(require("./routes/storeRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const database_1 = require("./db/database");
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const PORT = 8000;
const app = (0, express_1.default)();
// app.use(express.json());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: "MXIUuw6u5Ty0Ecih3XCjZ1+0575N2OTu0x9gsOl6pBc=",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure to true if using HTTPS
}));
app.use("/files", express_1.default.static(path_1.default.join(__dirname, "../files")));
// routes
app.use("/", userRoutes_1.default);
app.use("/stores", storeRoutes_1.default);
app.use("/", productRoutes_1.default);
app.use("/carts", cartRoutes_1.default);
app.use("/orders", orderRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
    (0, database_1.connectDb)();
});
