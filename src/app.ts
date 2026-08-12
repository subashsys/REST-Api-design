import express from "express";
import rateLimit from "express-rate-limit";

import productRoutes from "./product.route";

export const app = express();

app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api/v1", apiLimiter);

app.use("/api/v1/products", productRoutes);


