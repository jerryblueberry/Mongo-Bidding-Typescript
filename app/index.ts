import express, { Express } from "express";
import User from "./routes/userRoutes";
import Store from "./routes/storeRoutes";
import Product from "./routes/productRoutes";
import Cart from "./routes/cartRoutes";
import Order from "./routes/orderRoutes";
import { connectDb } from "./db/database";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import path from "path";
const PORT = 8000;

const app: Express = express();
// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "MXIUuw6u5Ty0Ecih3XCjZ1+0575N2OTu0x9gsOl6pBc=",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure to true if using HTTPS
  }),
);

app.use("/files", express.static(path.join(__dirname, "../files")));
// routes
app.use("/", User);
app.use("/stores", Store);
app.use("/", Product);
app.use("/carts", Cart);
app.use("/orders", Order);

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
  connectDb();
});
