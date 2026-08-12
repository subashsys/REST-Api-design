import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(100, "Product name must not exceed 100 characters"),

  price: z
    .number()
    .finite("Price must be a valid number")
    .positive("Price must be greater than 0"),

  category: z
    .string()
    .trim()
    .min(1, "Category is required")
    .max(50, "Category must not exceed 50 characters"),
});

export const updateProductSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .optional(),

    price: z
      .number()
      .finite()
      .positive()
      .optional(),

    category: z
      .string()
      .trim()
      .min(1)
      .max(50)
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field is required",
    }
  );

export const productQuerySchema = z.object({
  category: z.string().trim().min(1).optional(),

  minPrice: z.coerce.number().finite().min(0).optional(),

  maxPrice: z.coerce.number().finite().min(0).optional(),

  sort: z
    .enum(["id", "name", "price", "category"])
    .default("id"),

  order: z
    .enum(["asc", "desc"])
    .default("asc"),

  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),

  fields: z.string().optional(),
});