import { Router } from "express";

import {
  createProductController,
  getProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from "./product.controller";

const router = Router();

router.post("/", createProductController);

router.get("/", getProductsController);

router.get("/:id", getProductByIdController);

router.patch("/:id", updateProductController);

router.delete("/:id", deleteProductController);

export default router;