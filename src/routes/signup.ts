import { Request, Response, Router } from "express";
import prisma from "../utils/prisma";
import bcrypt from "bcrypt";


const router = Router();

router.post("/signup", async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const existUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existUser) {
      return res.status(401).json({ error: "Email already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const userCreate = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashPassword,
      },
    });
    res.status(201).json({ message: "User created successfully", userCreate });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

export default router;
