import { prisma } from "./config/prisma";

interface CreateProductData {
  name: string;
  price: number;
  category: string;
}

interface UpdateProductData {
  name?: string;
  price?: number;
  category?: string;
}

interface ProductQuery {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort: "id" | "name" | "price" | "category";
  order: "asc" | "desc";
  page: number;
  limit: number;
  fields?: string;
}

export const createProduct = async (data: CreateProductData) => {
  return prisma.product.create({
    data,
  });
};

export const getProducts = async (query: ProductQuery) => {
  const {
    category,
    minPrice,
    maxPrice,
    sort,
    order,
    page,
    limit,
    fields,
  } = query;

  const where: any = {};

  // Filtering by category
  if (category) {
    where.category = category;
  }

  // Price range filtering
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};

    if (minPrice !== undefined) {
      where.price.gte = minPrice;
    }

    if (maxPrice !== undefined) {
      where.price.lte = maxPrice;
    }
  }

  const skip = (page - 1) * limit;

  // Field selection
  let select: Record<string, boolean> | undefined;

  if (fields) {
    select = {};

    const allowedFields = [
      "id",
      "name",
      "price",
      "category",
    ];

    const requestedFields = fields
      .split(",")
      .map((field) => field.trim());

    for (const field of requestedFields) {
      if (allowedFields.includes(field)) {
        select[field] = true;
      }
    }

    // Always return something useful
    if (Object.keys(select).length === 0) {
      select = {
        id: true,
        name: true,
        price: true,
        category: true,
      };
    }
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: {
        [sort]: order,
      },
      skip,
      take: limit,
      ...(select ? { select } : {}),
    }),

    prisma.product.count({
      where,
    }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    },
  };
};

export const getProductById = async (id: number) => {
  return prisma.product.findUnique({
    where: {
      id,
    },
  });
};

export const updateProduct = async (
  id: number,
  data: UpdateProductData
) => {
  return prisma.product.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteProduct = async (id: number) => {
  return prisma.product.delete({
    where: {
      id,
    },
  });
};