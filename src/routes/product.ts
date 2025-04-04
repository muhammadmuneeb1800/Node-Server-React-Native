import { Request, Response, Router } from "express";
import prisma from "../utils/prisma";
import { AuthRequest } from "../middlewares/auth";
const router = Router();

router.get("/", async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const products = await prisma.product.findMany({
      where: {
        ownerId: userId,
      },
    });
    res.status(201).json({ message: "Products fetch successfully", products });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

router.post(
  "/add-product",
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { name, desc, image, price, rating, category } = req.body;
      console.log("User DATA from", req.body);
      if (!name || !desc || !image || !price || !rating || !category) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const product = await prisma.product.create({
        data: {
          name,
          description: desc,
          image,
          price,
          ownerId: userId,
          rating,
          category,
        },
      });
      res
        .status(201)
        .json({ message: "Product created successfully", product });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  }
);

router.put(
  "/update-product/:id",
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      if (!id) {
        return res.status(400).json({ error: "Product id is required" });
      }
      const { name, desc, image, price, ownerId, rating, category } = req.body;
      const product = await prisma.product.update({
        where: {
          id: id,
        },
        data: {
          name,
          description: desc,
          image,
          price,
          ownerId,
          rating,
          category,
        },
      });
      res
        .status(200)
        .json({ message: "Product updated successfully", product });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  }
);
router.delete(
  "/delete-product/:id",
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      if (!id) {
        return res.status(400).json({ error: "Product id is required" });
      }
      const product = await prisma.product.delete({
        where: {
          id: id,
        },
      });
      res
        .status(200)
        .json({ message: "Product deleted successfully", product });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  }
);

export default router;
